"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { openClawClient, SessionInfo } from "@/lib/openclaw-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ConversationsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSessions = async () => {
    try {
      const config = localStorage.getItem("openclaw_config");
      if (!config) {
        setError("OpenClaw 게이트웨이가 설정되지 않았습니다. 실시간 탭에서 연결하세요.");
        setLoading(false);
        return;
      }

      const { url, token } = JSON.parse(config);
      openClawClient.setConfig({ url, token });

      const data = await openClawClient.getSessions({ limit: 50 });
      setSessions(data);

      // Keep selected session updated
      if (selectedSession) {
        const updated = data.find((s) => s.sessionKey === selectedSession.sessionKey);
        if (updated) setSelectedSession(updated);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (session: SessionInfo) => {
    setSelectedSession(session);
    // Load conversation history (mock for now - would need API endpoint)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `${session.agentId || "에이전트"} 세션에 연결되었습니다.`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!selectedSession || !inputMessage.trim() || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSending(true);

    try {
      // Use the client method that tries multiple endpoints
      const result = await openClawClient.sendToSession(selectedSession.sessionKey, userMsg.content);

      // Add acknowledgment with response
      const ackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `메시지 전송됨. 응답: ${JSON.stringify(result).slice(0, 200)}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, ackMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ 오류: ${err.message}\n\n브라우저 콘솔(F12)에서 자세한 내용을 확인하세요.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
        <p className="text-gray-400 mb-4">실시간 탭에서 OpenClaw 게이트웨이에 연결하세요.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Session List */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">세션 목록</h2>
            <p className="text-sm text-gray-500">{sessions.length}개 세션 • 5초마다 갱신</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                활성 세션이 없습니다
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {sessions.map((session) => (
                  <button
                    key={session.sessionKey}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedSession?.sessionKey === session.sessionKey
                        ? "bg-indigo-600/20 border-l-4 border-indigo-500"
                        : "hover:bg-gray-800/50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${session.active ? "bg-green-500" : "bg-gray-500"}`}></div>
                        <div>
                          <div className="font-medium text-white">
                            {session.agentId || session.label || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.model}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {(session.tokenUsage?.total || 0).toLocaleString()} 토큰 • {" "}
                      {new Date(session.lastActivityAt).toLocaleTimeString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedSession.agentId || selectedSession.label || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedSession.model}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedSession.tokenUsage?.total?.toLocaleString() || 0} 토큰 사용
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="메시지를 입력하세요..."
                    disabled={sending}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || sending}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    전송
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">왼쪽에서 세션을 선택하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
