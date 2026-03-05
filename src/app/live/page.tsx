"use client";

import { useEffect, useState } from "react";
import { Activity, Bot, Cpu, Zap, Terminal, Play, Pause } from "lucide-react";
import { useOpenClawConnection, LiveSession, LiveStats } from "@/lib/openclaw-client";
import { ConnectionStatus } from "@/components/connection-status";

export default function LiveDashboard() {
  const { connected, sessions, stats } = useOpenClawConnection();
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [command, setCommand] = useState("");

  useEffect(() => {
    // Add log when connection changes
    if (connected) {
      addLog("✅ OpenClaw 게이트웨이에 연결됨");
    }
  }, [connected]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleSendCommand = async () => {
    if (!selectedSession || !command.trim()) return;
    // This would send to actual OpenClaw
    addLog(`📤 ${selectedSession.agentId}: ${command}`);
    setCommand("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">실시간 대시보드</h1>
          <p className="text-gray-400">OpenClaw 게이트웨이 실시간 모니터링</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-300">{connected ? "실시간 연결 중" : "연결 안됨"}</span>
        </div>
      </div>

      {!connected ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold text-white mb-2">OpenClaw에 연결되지 않음</h3>
          <p className="text-gray-400 mb-4">우측 하단 연결 버튼을 클릭하여 게이트웨이에 연결하세요.</p>
          <div className="text-sm text-gray-500">
            <p>1. 로컬에서 OpenClaw 실행: {" "}<code className="bg-gray-800 px-2 py-1 rounded">openclaw gateway start</code></p>
            <p className="mt-2">2. ngrok 실행: {" "}<code className="bg-gray-800 px-2 py-1 rounded">ngrok http 18789</code></p>
            <p className="mt-2">3. URL과 토큰을 입력하여 연결</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Bot}
              label="총 세션"
              value={stats?.totalSessions || 0}
              color="blue"
            />
            <StatCard
              icon={Zap}
              label="활성 세션"
              value={stats?.activeSessions || 0}
              color="green"
            />
            <StatCard
              icon={Activity}
              label="총 토큰"
              value={((stats?.totalTokens || 0) / 1000).toFixed(1) + "K"}
              color="amber"
            />
            <StatCard
              icon={Cpu}
              label="업타임"
              value={stats?.uptime || "-"}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-4">활성 세션</h2>
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">활성 세션이 없습니다</p>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.sessionKey}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedSession?.sessionKey === session.sessionKey
                          ? "bg-indigo-600/20 border border-indigo-600/30"
                          : "bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          session.status === "active" ? "bg-green-500" : "bg-amber-500"
                        }`}></div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{session.agentId}</div>
                          <div className="text-xs text-gray-500">
                            토큰: {session.tokenUsage.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(session.lastActivity).toLocaleTimeString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Terminal */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-4">터미널</h2>
              <div className="bg-gray-950 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm"
003e
                {logs.length === 0 ? (
                  <p className="text-gray-600">로그가 없습니다...</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="text-gray-300 mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>

              {selectedSession && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendCommand()}
                    placeholder={`${selectedSession.agentId}에게 명령 보내기...`}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={handleSendCommand}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
                  >
                    전송
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <ConnectionStatus />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
