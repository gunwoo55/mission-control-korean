// OpenClaw Gateway API Client

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY || "";
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_TOKEN || "";

interface GatewayConfig {
  url: string;
  token: string;
}

let config: GatewayConfig = {
  url: "",
  token: "",
};

// Load config from localStorage on client side
export function loadGatewayConfig(): GatewayConfig {
  if (typeof window === "undefined") return config;
  
  const saved = localStorage.getItem("openclaw_gateway_config");
  if (saved) {
    config = JSON.parse(saved);
  }
  return config;
}

export function saveGatewayConfig(newConfig: GatewayConfig): void {
  config = newConfig;
  if (typeof window !== "undefined") {
    localStorage.setItem("openclaw_gateway_config", JSON.stringify(config));
  }
}

export function isGatewayConfigured(): boolean {
  return !!config.url && !!config.token;
}

// API Calls
async function apiCall(method: string, params?: any): Promise<any> {
  if (!isGatewayConfigured()) {
    throw new Error("Gateway not configured");
  }

  try {
    const ws = new WebSocket(config.url);
    
    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            method,
            params,
            id: Date.now(),
          })
        );
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        ws.close();
        
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      };

      ws.onerror = (error) => {
        reject(error);
      };

      // Timeout
      setTimeout(() => {
        ws.close();
        reject(new Error("Connection timeout"));
      }, 10000);
    });
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Real data fetching functions
export async function fetchRealAgents() {
  try {
    const sessions = await apiCall("sessions_list");
    return sessions.map((s: any) => ({
      id: s.sessionKey,
      name: s.agentId || "Unknown",
      status: s.active ? "active" : "idle",
      lastActive: new Date(s.lastActivityAt).toLocaleString(),
      tokenUsage: s.tokenUsage?.total || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return null;
  }
}

export async function fetchRealStats() {
  try {
    const [sessions, gatewayStatus] = await Promise.all([
      apiCall("sessions_list"),
      apiCall("gateway_status"),
    ]);

    const totalTokens = sessions.reduce((sum: number, s: any) => {
      return sum + (s.tokenUsage?.total || 0);
    }, 0);

    return {
      activeAgents: sessions.filter((s: any) => s.active).length,
      totalSessions: sessions.length,
      totalTokens,
      uptime: gatewayStatus.uptime || "unknown",
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
}

// For static export, we'll use a hybrid approach
export function useRealData() {
  const [connected, setConnected] = useState(false);
  const [realData, setRealData] = useState<any>(null);

  useEffect(() => {
    loadGatewayConfig();
    
    if (isGatewayConfigured()) {
      // Try to fetch real data
      fetchRealStats().then((data) => {
        if (data) {
          setConnected(true);
          setRealData(data);
        }
      });
    }
  }, []);

  return { connected, realData, config };
}

import { useState, useEffect } from "react";
