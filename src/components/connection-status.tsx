"use client";

import { useState } from "react";
import { Wifi, WifiOff, Loader2, Settings } from "lucide-react";
import { useOpenClawConnection } from "@/lib/openclaw-client";

export function ConnectionStatus() {
  const { connected, connecting, error, connect, disconnect, stats } = useOpenClawConnection();
  const [showConfig, setShowConfig] = useState(false);
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");

  const handleConnect = () => {
    if (!url || !token) return;
    // Convert https to wss
    const wsUrl = url.replace(/^http/, "ws");
    connect(wsUrl, token);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowConfig(!showConfig)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${
          connected
            ? "bg-green-600 hover:bg-green-700 text-white"
            : error
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
      >
        {connecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">연결 중...</span>
          </>
        ) : connected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm">연결됨</span>
            {stats && (
              <span className="text-xs ml-2 opacity-75">
                {stats.activeSessions}/{stats.totalSessions} 세션
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">연결 안됨</span>
          </>
        )}
      </button>

      {showConfig && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">OpenClaw 연결</h3>
            <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">게이트웨이 URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="wss://your-gateway.com"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">토큰</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="게이트웨이 토큰"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
            </div>

            <div className="flex gap-2">
              {connected ? (
                <button
                  onClick={disconnect}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  연결 끊기
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={!url || !token || connecting}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded text-sm"
                >
                  {connecting ? "연결 중..." : "연결"}
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                💡 ngrok 사용 시: {" "}
                <code className="text-indigo-400">ngrok http 18789</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
