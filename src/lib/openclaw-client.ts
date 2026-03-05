// OpenClaw Gateway HTTP Client
// Connects to OpenClaw gateway via HTTP API

const API_BASE = "/api"; // Proxy through Next.js

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

export interface SessionStatus {
  sessionKey: string;
  model: string;
  agentId?: string;
  runtime: {
    host: string;
    shell: string;
    channel?: string;
  };
  usage: {
    tokens: {
      total: number;
      prompt: number;
      completion: number;
    };
    costUSD: number;
  };
  time: {
    elapsedMs: number;
    thinkingMs?: number;
  };
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

class OpenClawClient {
  private config: GatewayConfig | null = null;
  private baseUrl: string = "";

  setConfig(config: GatewayConfig) {
    this.config = config;
    // Remove trailing slash and ensure https
    this.baseUrl = config.url.replace(/\/$/, "");
    if (this.baseUrl.startsWith("ws")) {
      this.baseUrl = this.baseUrl.replace(/^ws/, "http");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config) throw new Error("Not configured");

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Gateway-Token": this.config.token,
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Test connection
  async testConnection(): Promise<{ version: string; status: string }> {
    return this.request("/status");
  }

  // Get all sessions
  async getSessions(options?: { 
    activeMinutes?: number; 
    kinds?: string[];
    limit?: number;
  }): Promise<SessionInfo[]> {
    const params = new URLSearchParams();
    if (options?.activeMinutes) params.set("activeMinutes", String(options.activeMinutes));
    if (options?.limit) params.set("limit", String(options.limit));
    
    const query = params.toString() ? `?${params.toString()}` : "";
    const result = await this.request(`/sessions${query}`);
    return result.sessions || [];
  }

  // Get specific session status (includes token usage)
  async getSessionStatus(sessionKey?: string): Promise<SessionStatus> {
    const key = sessionKey || "current";
    return this.request(`/sessions/${key}/status`);
  }

  // Send message to session
  async sendMessage(sessionKey: string, message: string): Promise<void> {
    await this.request(`/sessions/${sessionKey}/send`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Spawn sub-agent
  async spawnAgent(task: string, agentId?: string): Promise<{ sessionKey: string }> {
    return this.request("/spawn", {
      method: "POST",
      body: JSON.stringify({
        task,
        agentId,
        cleanup: "keep",
      }),
    });
  }

  // Get cron jobs
  async getCronJobs(): Promise<CronJob[]> {
    const result = await this.request("/cron");
    return result.jobs || [];
  }

  // Run cron job immediately
  async runCronJob(jobId: string): Promise<void> {
    await this.request(`/cron/${jobId}/run`, {
      method: "POST",
    });
  }

  // Get sub-agents for a session
  async getSubAgents(sessionKey: string): Promise<SessionInfo[]> {
    const result = await this.request(`/sessions/${sessionKey}/subagents`);
    return result.subagents || [];
  }

  isConfigured(): boolean {
    return !!this.config;
  }
}

export const openClawClient = new OpenClawClient();

// React hook
import { useState, useEffect, useCallback } from "react";

export function useOpenClaw() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [currentStatus, setCurrentStatus] = useState<SessionStatus | null>(null);

  const connect = useCallback(async (url: string, token: string) => {
    setConnecting(true);
    setError(null);
    
    try {
      openClawClient.setConfig({ url, token });
      const status = await openClawClient.testConnection();
      console.log("[OpenClaw] Connected:", status);
      setConnected(true);
      
      // Load initial data
      const sessionsData = await openClawClient.getSessions({ limit: 50 });
      setSessions(sessionsData);
      
      try {
        const current = await openClawClient.getSessionStatus();
        setCurrentStatus(current);
      } catch (e) {
        // current session might not exist
      }
    } catch (err: any) {
      console.error("[OpenClaw] Connection failed:", err);
      setError(err.message || "Connection failed");
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setSessions([]);
    setCurrentStatus(null);
  }, []);

  const refreshSessions = useCallback(async () => {
    if (!connected) return;
    try {
      const data = await openClawClient.getSessions({ limit: 50 });
      setSessions(data);
    } catch (e) {
      console.error("Failed to refresh sessions:", e);
    }
  }, [connected]);

  const sendMessage = useCallback(async (sessionKey: string, message: string) => {
    if (!connected) throw new Error("Not connected");
    await openClawClient.sendMessage(sessionKey, message);
  }, [connected]);

  const spawnAgent = useCallback(async (task: string, agentId?: string) => {
    if (!connected) throw new Error("Not connected");
    return openClawClient.spawnAgent(task, agentId);
  }, [connected]);

  // Auto-refresh sessions every 5 seconds when connected
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
    currentStatus,
    connect,
    disconnect,
    refreshSessions,
    sendMessage,
    spawnAgent,
  };
}
