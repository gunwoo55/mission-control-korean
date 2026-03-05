"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Bell, Database, Key, Shield, Wifi, WifiOff } from "lucide-react";
import { loadGatewayConfig, saveGatewayConfig, isGatewayConfigured, fetchRealStats } from "@/lib/openclaw-api";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: false,
  });
  const [gatewayUrl, setGatewayUrl] = useState("");
  const [gatewayToken, setGatewayToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const config = loadGatewayConfig();
    setGatewayUrl(config.url);
    setGatewayToken(config.token);
    setIsConnected(isGatewayConfigured());
  }, []);

  const handleSaveGateway = async () => {
    saveGatewayConfig({ url: gatewayUrl, token: gatewayToken });
    
    setIsTesting(true);
    try {
      const stats = await fetchRealStats();
      if (stats) {
        setIsConnected(true);
        alert("게이트웨이 연결 성공!");
      }
    } catch (error) {
      setIsConnected(false);
      alert("연결 실패: " + (error as Error).message);
    }
    setIsTesting(false);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">설정</h1>
        <p className="text-sm text-gray-400">시스템 및 개인 설정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Gateway Connection */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isConnected ? "bg-green-500/20" : "bg-red-500/20"
            }`}>
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">OpenClaw 게이트웨이 연결</h3>
              <p className="text-sm text-gray-400">
                {isConnected ? "연결됨" : "연결되지 않음"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">게이트웨이 URL</label>
              <input
                type="text"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                placeholder="ws://localhost:18789"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                예: ws://localhost:18789 또는 wss://your-server.com
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">토큰</label>
              <input
                type="password"
                value={gatewayToken}
                onChange={(e) => setGatewayToken(e.target.value)}
                placeholder="게이트웨이 토큰을 입력하세요"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleSaveGateway}
              disabled={isTesting || !gatewayUrl || !gatewayToken}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isTesting ? "연결 테스트 중..." : "연결 저장 & 테스트"}
            </button>

            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">💡 로컬에서 실행 중인 경우:</p>
              <code className="text-xs text-green-400 mt-1 block">
                openclaw gateway status
              </code>
              <p className="text-xs text-gray-500 mt-1">
                위 명령어로 게이트웨이 URL을 확인하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              {darkMode ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">테마</h3>
              <p className="text-sm text-gray-400">화면 모드 설정</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setDarkMode(true)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                darkMode
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">다크 모드</span>
              </div>
              {darkMode && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
            </button>

            <button
              onClick={() => setDarkMode(false)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                !darkMode
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">라이트 모드</span>
              </div>
              {!darkMode && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">알림</h3>
              <p className="text-sm text-gray-400">알림 수신 설정</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: "email", label: "이메일 알림", desc: "작업 완료 및 중요 업데이트" },
              { key: "push", label: "푸시 알림", desc: "실시간 작업 상태" },
              { key: "slack", label: "Slack 연동", desc: "Slack으로 알림 수신" },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-white">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifications],
                    }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-indigo-600"
                      : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      notifications[item.key as keyof typeof notifications]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">데이터 관리</h3>
              <p className="text-sm text-gray-400">로컬 저장소 관리</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const data = JSON.stringify(localStorage, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `mission-control-backup-${new Date().toISOString().split("T")[0]}.json`;
                a.click();
              }}
              className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
            >
              <div className="text-sm text-white">데이터 백업</div>
              <div className="text-xs text-gray-500">모든 설정 파일 백업</div>
            </button>

            <button
              onClick={() => {
                if (confirm("모든 로컬 데이터를 삭제하시겠습니까?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-left transition-colors"
            >
              <div className="text-sm text-red-400">데이터 초기화</div>
              <div className="text-xs text-red-400/70">모든 데이터 삭제 (주의!)</div>
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">보안</h3>
              <p className="text-sm text-gray-400">접근 권한 관리</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-white">로컬 저장 암호화</div>
              <span className="text-xs text-green-400">활성화됨 (browser)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
