"use client";

import { useState } from "react";
import { Wifi, Loader2, Info, ExternalLink } from "lucide-react";

interface ConnectionPanelProps {
  onConnect: (url: string, token: string) => void;
  connecting: boolean;
}

export function ConnectionPanel({ onConnect, connecting }: ConnectionPanelProps) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !token.trim()) return;
    
    // Ensure https/wss protocol
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http") && !finalUrl.startsWith("ws")) {
      finalUrl = "https://" + finalUrl;
    }
    
    onConnect(finalUrl, token.trim());
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wifi className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">OpenClaw 게이트웨이 연결</h2>
        <p className="text-gray-400">실시간 모니터링을 위해 OpenClaw 게이트웨이에 연결하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">게이트웨이 URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://xxx.ngrok.io 또는 http://localhost:18789"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            로컬: {" "}
            <code className="bg-gray-950 px-2 py-0.5 rounded">http://localhost:18789</code>
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">게이트웨이 토큰</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="gateway.token 값"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {"~/.openclaw/openclaw.json"} 파일에서 {" "}
            <code className="bg-gray-950 px-2 py-0.5 rounded">gateway.token</code> 값 확인
          </p>
        </div>

        <button
          type="submit"
          disabled={!url.trim() || !token.trim() || connecting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2"
        >
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              연결 중...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              연결하기
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <Info className="w-4 h-4" />
          {showHelp ? "도움말 닫기" : "연결 방법 보기"}
        </button>

        {showHelp && (
          <div className="mt-4 space-y-4 text-sm text-gray-400">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">1. 로컬에서 OpenClaw 실행</h4>
              <code className="block bg-gray-950 p-2 rounded text-indigo-400">openclaw gateway start</code>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">2. 외부 접속용 ngrok 실행 (선택)</h4>
              <code className="block bg-gray-950 p-2 rounded text-indigo-400">ngrok http 18789</code>
              <p className="mt-2">출력된 HTTPS URL을 위에 입력하세요.</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">3. 토큰 확인</h4>
              <code className="block bg-gray-950 p-2 rounded text-indigo-400">cat ~/.openclaw/openclaw.json | grep token</code>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400">
                ⚠️ CORS 설정 필요: OpenClaw 게이트웨이의 {" "}
                <code className="bg-gray-950 px-1">openclaw.json</code>에 {" "}
                <code className="bg-gray-950 px-1">gateway.cors.origin</code>에 {" "}
                <code className="bg-gray-950 px-1">https://gunwoo55.github.io</code>를
                추가해야 합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
