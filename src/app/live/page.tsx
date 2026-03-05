"use client";

import { useEffect, useState } from "react";
import { Activity, Bot, Zap, Send, Loader2 } from "lucide-react";
import { useOpenClaw, SessionInfo } from "@/lib/openclaw-client";
import { ConnectionPanel } from "@/components/connection-panel";

interface LogEntry {
  time: string;
  text: string;
  type: "info" | "error" | "sent";
}

export default function LiveDashboard() {
  const {
    connected,
    connecting,
    error,
    sessions,
    connect,
    disconnect,
    sendMessage,
  } = useOpenClaw();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);

  const addLog = (text: string, type: "info" | "error" | "sent" = "info") => {
    setLogs((prev) => [...prev.slice(-99), { time: new Date().toLocaleTimeString(), text, type }]);
  };

  useEffect(() => {
    if (connected) {
      addLog("Connected to OpenClaw gateway", "info");
    }
  }, [connected]);

  useEffect(() => {
    if (error) {
      addLog(`Error: ${error}`, "error");
    }
  }, [error]);

  const handleSendCommand = async () => {
    if (!selectedSession || !command.trim() || sending) return;
    
    setSending(true);
    addLog(`[${selectedSession.agentId || selectedSession.sessionKey.slice(0, 8)}] ${command}`, "sent");
    
    try {
      await sendMessage(selectedSession.sessionKey, command);
      addLog("Message sent successfully", "info");
    } catch (err: any) {
      addLog(`Failed: ${err.message}`, "error");
    } finally {
      setSending(false);
      setCommand("");
    }
  };

  const activeSessions = sessions.filter((s) => s.active).length;
  const totalTokens = sessions.reduce((sum, s) => sum + (s.tokenUsage?.total || 0), 0);
  const totalCost = sessions.reduce((sum, s) => sum + (s.costUSD || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">실시간 대시보드</h1>
          <p className="text-gray-400">OpenClaw 게이트웨이 실시간 모니터링</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            connected ? "bg-green-500 animate-pulse" : connecting ? "bg-amber-500" : "bg-red-500"
          }`}></div>
          <span className="text-sm text-gray-300">
            {connected ? "연결됨" : connecting ? "연결 중..." : "연결 안됨"}
          </span>
          {connected && (
            <button
              onClick={disconnect}
              className="ml-2 text-xs text-gray-500 hover:text-red-400"
            >
              연결 끊기
            </button>
          )}
        </div>
      </div>

      {!connected ? (
        <ConnectionPanel onConnect={connect} connecting={connecting} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bot} label="총 세션" value={sessions.length} color="blue" />
            <StatCard icon={Zap} label="활성 세션" value={activeSessions} color="green" />
            <StatCard
              icon={Activity}
              label="총 토큰"
              value={totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens}
              color="amber"
            />
            <StatCard icon={Activity} label="예상 비용" value={`$${totalCost.toFixed(4)}`} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">세션 목록</h2>
                <span className="text-xs text-gray-500">5초마다 갱신</span>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">활성 세션이 없습니다</p>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.sessionKey}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedSession?.sessionKey === session.sessionKey
                          ? "bg-indigo-600/20 border border-indigo-600/30"
                          : "bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${session.active ? "bg-green-500" : "bg-gray-500"}`}></div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {session.agentId || session.label || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.model} • {session.sessionKey.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">
                            {(session.tokenUsage?.total || 0).toLocaleString()} 토큰
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(session.lastActivityAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">터미널</h2>
                {selectedSession && (
                  <span className="text-xs text-indigo-400">
                    {selectedSession.agentId || selectedSession.sessionKey.slice(0, 8)} 선택됨
                  </span>
                )}
              </div>
              
              <div className="bg-gray-950 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-600">로그가 없습니다... 세션을 선택하고 명령을 별내세요.</p>
                ) : (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className={`mb-1 ${
                        log.type === "error" ? "text-red-400" : log.type === "sent" ? "text-indigo-400" : "text-gray-300"
                      }`}
                    >
                      <span className="text-gray-600">[{log.time}]</span> {log.text}
                    </div>
                  ))
                )}
              </div>

              {selectedSession ? (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendCommand()}
                    placeholder={`${selectedSession.agentId || "세션"}에게 메시지...`}
                    disabled={sending}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendCommand}
                    disabled={!command.trim() || sending}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded text-sm flex items-center gap-2"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    전송
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500 text-center">왼쪽에서 세션을 선택하세요</p>
              )}
            </div>
          </div>
        </>
      )}
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
