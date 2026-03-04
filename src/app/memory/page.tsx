"use client";

import { useState } from "react";
import { Moon, Sun, Bell, Database, Key, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">설정</h1>
        <p className="text-gray-400">시스템 및 개인 설정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appearance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">데이터 관리</h3>
              <p className="text-sm text-gray-400">메모리 및 로그 관리</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors">
              <div className="text-sm text-white">메모리 백업</div>
              <div className="text-xs text-gray-500">모든 설정 파일 백업</div>
            </button>

            <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors">
              <div className="text-sm text-white">로그 날짜별 정리</div>
              <div className="text-xs text-gray-500">오래된 로그 아카이브</div>
            </button>

            <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-left transition-colors">
              <div className="text-sm text-red-400">데이터 초기화</div>
              <div className="text-xs text-red-400/70">모든 데이터 삭제 (주의!)</div>
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">API 설정</h3>
              <p className="text-sm text-gray-400">외부 서비스 연동</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm font-medium text-white mb-2">OpenClaw Gateway</div>
              <input
                type="text"
                value="http://localhost:8080"
                readOnly
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-400"
              />
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm font-medium text-white mb-2">API 키</div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="sk-xxxxxxxxxxxxxxxx"
                  readOnly
                  className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-400"
                />
                <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
              <div className="text-sm text-white">2단계 인증</div>
              <span className="text-xs text-green-400">활성화됨</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-white">접근 로그</div>
              <button className="text-xs text-indigo-400">보기</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-white">세션 관리</div>
              <button className="text-xs text-red-400">모두 종료</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
