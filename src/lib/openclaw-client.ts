// OpenClaw Gateway HTTP Client - Real Implementation
// Based on actual OpenClaw API structure

export interface GatewayConfig {
  url: string;
  token: string;
}

export interface SessionInfo {
  sessionKey: string;
  agentId?: string;
  label?: string;
  model: string;
  createdAt: string;
  lastActivityAt: string;
  active: boolean;
  tokenUsage?: {
    total: number;
    prompt: number;
    completion: number;
  };
  costUSD?: number;
}

// Debug logger
function log(type: "info" | "error" | "warn", message: string, data?: any) {
  console.log(`[OpenClaw:${type.toUpperCase()}] ${message}`, data || "");
}

class OpenClawClient {
  private config: GatewayConfig | null = null;
  private baseUrl: string = "";

  setConfig(config: GatewayConfig) {
    this.config = config;
    this.baseUrl = config.url.replace(/\/$/, "");
    if (this.baseUrl.startsWith("ws")) {
      this.baseUrl = this.baseUrl.replace(/^ws/, "http");
    }
    localStorage.setItem("openclaw_config", JSON.stringify(config));
    log("info", "Config set", { url: this.baseUrl });
  }

  loadConfig(): GatewayConfig | null {
    const saved = localStorage.getItem("openclaw_config");
    if (saved) {
      const config = JSON.parse(saved);
      this.setConfig(config);
      return config;
    }
    return null;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config) {
      throw new Error("OpenClaw not configured. Connect in Live tab first.");
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add auth header if we have a token
    if (this.config.token) {
      headers["Authorization"] = `Bearer ${this.config.token}`;
    }

    log("info", `Request: ${options.method || "GET"} ${endpoint}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: "cors",
      });

      if (!response.ok) {
        const errorText = await response.text();
        log("error", `HTTP ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      log("info", `Response: ${endpoint}`, data);
      return data;
    } catch (err: any) {
      log("error", `Request failed: ${endpoint}`, err.message);
      throw err;
    }
  }

  // Test connection to gateway
  async testConnection(): Promise<{ version: string; status: string }> {
    return this.request("/status");
  }

  // Get all sessions from OpenClaw
  async getSessions(options?: {
    activeMinutes?: number;
    limit?: number;
  }): Promise<SessionInfo[]> {
    try {
      // Try the actual OpenClaw API endpoint
      const params = new URLSearchParams();
      if (options?.activeMinutes) params.set("activeMinutes", String(options.activeMinutes));
      if (options?.limit) params.set("limit", String(options.limit));

      const query = params.toString() ? `?${params.toString()}` : "";
      const result = await this.request(`/api/sessions${query}`);

      // Map OpenClaw response format
      const sessions = result.sessions || result || [];

      return sessions.map((s: any) => ({
        sessionKey: s.sessionKey || s.id,
        agentId: s.agentId,
        label: s.label,
        model: s.model || "unknown",
        createdAt: s.createdAt,
        lastActivityAt: s.lastActivityAt || s.updatedAt,
        active: s.active || false,
        tokenUsage: s.tokenUsage || { total: 0, prompt: 0, completion: 0 },
        costUSD: s.costUSD || s.cost || 0,
      }));
    } catch (err) {
      log("error", "Failed to get sessions", err);
      return [];
    }
  }

  // Get session status with detailed info
  async getSessionStatus(sessionKey?: string): Promise<any> {
    const key = sessionKey || "current";
    return this.request(`/api/sessions/${key}/status`);
  }

  // Send message to a session
  async sendMessage(sessionKey: string, message: string): Promise<any> {
    log("info", `Sending message to ${sessionKey}`, { message: message.slice(0, 50) });

    return this.request(`/api/sessions/${sessionKey}/send`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Alternative: Use the spawn/send approach
  async sendToSession(sessionKey: string, message: string): Promise<any> {
    // Try different API patterns
    const endpoints = [
      `/api/sessions/${sessionKey}/send`,
      `/api/sessions/send`,
      `/sessions/${sessionKey}/send`,
    ];

    let lastError: any;

    for (const endpoint of endpoints) {
      try {
        log("info", `Trying endpoint: ${endpoint}`);
        const result = await this.request(endpoint, {
          method: "POST",
          body: JSON.stringify({ sessionKey, message }),
        });
        return result;
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error("All endpoints failed");
  }

  // Spawn a sub-agent
  async spawnAgent(task: string, agentId?: string): Promise<{ sessionKey: string }> {
    return this.request("/api/spawn", {
      method: "POST",
      body: JSON.stringify({ task, agentId, cleanup: "keep" }),
    });
  }

  // Get cron jobs
  async getCronJobs(): Promise<any[]> {
    try {
      const result = await this.request("/api/cron");
      return result.jobs || [];
    } catch {
      return [];
    }
  }

  // Run cron job
  async runCronJob(jobId: string): Promise<void> {
    await this.request(`/api/cron/${jobId}/run`, { method: "POST" });
  }

  isConfigured(): boolean {
    return !!this.config;
  }
}

export const openClawClient = new OpenClawClient();

// React hook with better error handling
import { useState, useEffect, useCallback } from "react";

export function useOpenClaw() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const connect = useCallback(async (url: string, token: string) => {
    setConnecting(true);
    setError(null);

    try {
      openClawClient.setConfig({ url, token });
      const status = await openClawClient.testConnection();
      log("info", "Connected to gateway", status);
      setConnected(true);

      // Load sessions immediately
      const sessionsData = await openClawClient.getSessions({ limit: 50 });
      setSessions(sessionsData);
      setRawResponse(sessionsData);
    } catch (err: any) {
      log("error", "Connection failed", err);
      setError(err.message || "Connection failed");
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setSessions([]);
    localStorage.removeItem("openclaw_config");
  }, []);

  const refreshSessions = useCallback(async () => {
    if (!connected) return;
    try {
      const data = await openClawClient.getSessions({ limit: 50 });
      setSessions(data);
    } catch (e: any) {
      console.error("Failed to refresh:", e);
    }
  }, [connected]);

  const sendMessage = useCallback(async (sessionKey: string, message: string) => {
    if (!connected) throw new Error("Not connected");
    log("info", `Sending message via hook: ${sessionKey}`);
    return openClawClient.sendToSession(sessionKey, message);
  }, [connected]);

  // Auto-refresh
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(refreshSessions, 5000);
    return () => clearInterval(interval);
  }, [connected, refreshSessions]);

  return {
    connected,
    connecting,
    error,
    sessions,
    rawResponse,
    connect,
    disconnect,
    refreshSessions,
    sendMessage,
  };
}
