"use client";

import { Briefcase, Folder, FileText, Image, Code, Plus, MoreHorizontal } from "lucide-react";

const workspaces = [
  {
    id: "1",
    name: "매경 서포터즈",
    type: "project",
    files: 12,
    lastActive: "2시간 전",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "INDEX 플랫폼",
    type: "project",
    files: 45,
    lastActive: "어제",
    color: "bg-green-500",
  },
  {
    id: "3",
    name: "리멤버풀",
    type: "project",
    files: 28,
    lastActive: "3일 전",
    color: "bg-purple-500",
  },
  {
    id: "4",
    name: "Fine U",
    type: "project",
    files: 34,
    lastActive: "1주일 전",
    color: "bg-amber-500",
  },
];

const recentFiles = [
  { name: "미션 컨트롤 개발 계획.md", type: "doc", size: "2.4 KB", updated: "10분 전" },
  { name: "API 문서.md", type: "doc", size: "5.1 KB", updated: "1시간 전" },
  { name: "로고 디자인.png", type: "image", size: "1.2 MB", updated: "어제" },
  { name: "main.tsx", type: "code", size: "3.2 KB", updated: "2시간 전" },
];

export default function OfficePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">오피스</h1>
          <p className="text-gray-400">프로젝트와 파일을 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          새 프로젝트
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Workspaces -->
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">워크스페이스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${ws.color} rounded-xl flex items-center justify-center`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-semibold text-white mb-1">{ws.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Folder className="w-4 h-4" />
                  {ws.files}개 파일
                  <span className="text-gray-600">•</span>
                  {ws.lastActive}
                </div>
              </div>
            ))}

            <button className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-gray-500 transition-all min-h-[160px]">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-gray-400 font-medium">새 워크스페이스</span>
            </button>
          </div>
        </div>

        <!-- Recent Files -->
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">최근 파일</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {recentFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  file.type === "doc"
                    ? "bg-blue-500/20 text-blue-400"
                    : file.type === "image"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {file.type === "doc" && <FileText className="w-5 h-5" />}
                  {file.type === "image" && <Image className="w-5 h-5" />}
                  {file.type === "code" && <Code className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {file.size} • {file.updated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
