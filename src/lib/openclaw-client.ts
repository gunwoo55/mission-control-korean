// Real-time OpenClaw Gateway Client
// This connects to actual OpenClaw gateway for live data

export interface GatewayConnection {
  url: string;
  token: string;
  connected: boolean;
}

export interface LiveSession {
  sessionKey: string;
  agentId: string;
  status: "active" | "idle" | "offline";
  tokenUsage: {
    total: number;
    prompt: number;
    completion: number;
  };
  lastActivity: string;
  currentTask?: string;
}

export interface LiveStats {
  totalSessions: number;
  activeSessions: number;
  totalTokens: number;
  uptime: string;
  version: string;
}

class OpenClawClient {
  private ws: WebSocket | null = null;
  private url: string = "";
  private token: string = "";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private listeners: Map<string, Function[]> = new Map();
  private messageId: number = 0;
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map();

  // Connect to gateway
  connect(url: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.url = url;
      this.token = token;

      try {
        // Convert http/https to ws/wss
        const wsUrl = url.replace(/^http/, "ws");
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log("[OpenClaw] Connected to gateway");
          this.reconnectAttempts = 0;
          this.authenticate();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          console.error("[OpenClaw] WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("[OpenClaw] Disconnected");
          this.emit("disconnected");
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Authenticate with token
  private authenticate() {
    this.sendRequest("auth", { token: this.token })
      .then(() => {
        console.log("[OpenClaw] Authenticated");
        this.emit("connected");
        this.startPolling();
      })
      .catch((err) => {
        console.error("[OpenClaw] Auth failed:", err);
        this.emit("auth_failed", err);
      });
  }

  // Send JSON-RPC request
  private sendRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("Not connected"));
        return;
      }

      const id = ++this.messageId;
      const message = {
        jsonrpc: "2.0",
        method,
        params,
        id,
      };

      this.pendingRequests.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(message));

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error("Request timeout"));
        }
      }, 10000);
    });
  }

  // Handle incoming messages
  private handleMessage(data: any) {
    // Handle response
    if (data.id !== undefined && this.pendingRequests.has(data.id)) {
      const { resolve, reject } = this.pendingRequests.get(data.id)!;
      this.pendingRequests.delete(data.id);

      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
      return;
    }

    // Handle notifications/pushes
    if (data.method) {
      this.emit(data.method, data.params);
    }
  }

  // Reconnect logic
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[OpenClaw] Max reconnect attempts reached");
      this.emit("reconnect_failed");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`[OpenClaw] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.url, this.token).catch(() => {
        // Reconnect failed, will try again
      });
    }, delay);
  }

  // Start polling for live data
  private startPolling() {
    // Poll sessions every 5 seconds
    const pollSessions = () => {
      this.getSessions().then((sessions) => {
        this.emit("sessions_updated", sessions);
      });
    };

    pollSessions();
    setInterval(pollSessions, 5000);

    // Poll stats every 10 seconds
    const pollStats = () => {
      this.getStats().then((stats) => {
        this.emit("stats_updated", stats);
      });
    };

    pollStats();
    setInterval(pollStats, 10000);
  }

  // Event emitter
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  // Public API methods
  async getSessions(): Promise<LiveSession[]> {
    const result = await this.sendRequest("sessions_list", { activeMinutes: 60 });
    return result.sessions?.map((s: any) => ({
      sessionKey: s.sessionKey,
      agentId: s.agentId || "unknown",
      status: s.active ? "active" : "idle",
      tokenUsage: s.tokenUsage || { total: 0, prompt: 0, completion: 0 },
      lastActivity: s.lastActivityAt,
    })) || [];
  }

  async getStats(): Promise<LiveStats> {
    const result = await this.sendRequest("gateway_status");
    return {
      totalSessions: result.sessions?.length || 0,
      activeSessions: result.sessions?.filter((s: any) => s.active).length || 0,
      totalTokens: result.sessions?.reduce((sum: number, s: any) => sum + (s.tokenUsage?.total || 0), 0) || 0,
      uptime: result.uptime || "unknown",
      version: result.version || "unknown",
    };
  }

  async executeCommand(sessionKey: string, command: string): Promise<any> {
    return this.sendRequest("sessions_send", {
      sessionKey,
      message: command,
    });
  }

  async spawnSubAgent(task: string, options?: any): Promise<any> {
    return this.sendRequest("sessions_spawn", {
      task,
      ...options,
    });
  }

  async getCronJobs(): Promise<any[]> {
    return this.sendRequest("cron_list");
  }

  async runCronJob(jobId: string): Promise<any> {
    return this.sendRequest("cron_run", { jobId });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const openClawClient = new OpenClawClient();

// React hook for using OpenClaw
export function useOpenClawConnection() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    const handleConnected = () => {
      setConnected(true);
      setConnecting(false);
      setError(null);
    };

    const handleDisconnected = () => {
      setConnected(false);
    };

    const handleAuthFailed = (err: any) => {
      setError("Authentication failed: " + err.message);
      setConnecting(false);
    };

    const handleSessions = (data: LiveSession[]) => {
      setSessions(data);
    };

    const handleStats = (data: LiveStats) => {
      setStats(data);
    };

    openClawClient.on("connected", handleConnected);
    openClawClient.on("disconnected", handleDisconnected);
    openClawClient.on("auth_failed", handleAuthFailed);
    openClawClient.on("sessions_updated", handleSessions);
    openClawClient.on("stats_updated", handleStats);

    return () => {
      openClawClient.off("connected", handleConnected);
      openClawClient.off("disconnected", handleDisconnected);
      openClawClient.off("auth_failed", handleAuthFailed);
      openClawClient.off("sessions_updated", handleSessions);
      openClawClient.off("stats_updated", handleStats);
    };
  }, []);

  const connect = async (url: string, token: string) => {
    setConnecting(true);
    setError(null);
    try {
      await openClawClient.connect(url, token);
    } catch (err: any) {
      setError(err.message);
      setConnecting(false);
    }
  };

  const disconnect = () => {
    openClawClient.disconnect();
    setConnected(false);
  };

  return {
    connected,
    connecting,
    error,
    sessions,
    stats,
    connect,
    disconnect,
    client: openClawClient,
  };
}

import { useState, useEffect } from "react";
