"use client";

import { Bot, Circle, MoreHorizontal, Plus } from "lucide-react";
import { mockAgents } from "@/lib/mock-data";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">에이전트 관리</h1>
          <p className="text-gray-400">모든 AI 에이전트와 상태를 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          새 에이전트
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.description}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Circle
                className={`w-3 h-3 ${
                  agent.status === "active"
                    ? "text-green-500 fill-green-500"
                    : agent.status === "idle"
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-500 fill-gray-500"
                }`}
              />
              <span className="text-sm text-gray-300">
                {agent.status === "active"
                  ? "활성"
                  : agent.status === "idle"
                  ? "대기"
                  : "오프라인"}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">{agent.lastActive}</span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">스킬</p>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">토큰 사용량</span>
                <span className="text-white font-medium">
                  {agent.tokenUsage.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Agent Card */}
        <button className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-gray-500 hover:bg-gray-900 transition-all min-h-[240px]">
          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">새 에이전트 추가</p>
            <p className="text-sm text-gray-400">서브에이전트 생성하기</p>
          </div>
        </button>
      </div>
    </div>
  );
}
