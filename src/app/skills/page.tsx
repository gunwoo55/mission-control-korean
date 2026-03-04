"use client";

import { Wrench, Check, Download, ExternalLink } from "lucide-react";
import { mockSkills } from "@/lib/mock-data";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">스킬 관리</h1>
          <p className="text-gray-400">에이전트가 사용하는 스킬을 관리하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSkills.map((skill) => (
          <div
            key={skill.id}
            className={`bg-gray-900 border rounded-xl p-5 transition-colors ${
              skill.installed
                ? "border-gray-800"
                : "border-gray-800/50 opacity-75"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    skill.installed
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">{skill.category}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">v{skill.version}</span>
                  </div>
                </div>
              </div>
              {skill.installed && (
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-4">{skill.description}</p>

            <div className="flex items-center gap-2">
              {skill.installed ? (
                <>
                  <button className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors">
                    설정
                  </button>
                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  설치
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Categories */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">스킬 카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["리서치", "개발", "메시징", "유틸리티", "데이터", "자동화"].map(
            (category) => (
              <button
                key={category}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">
                  {category === "리서치" && "🔍"}
                  {category === "개발" && "💻"}
                  {category === "메시징" && "💬"}
                  {category === "유틸리티" && "🛠️"}
                  {category === "데이터" && "📊"}
                  {category === "자동화" && "⚡"}
                </div>
                <div className="text-sm font-medium text-white">{category}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {category === "리서치" && "3개 설치됨"}
                  {category === "개발" && "5개 설치됨"}
                  {category === "메시징" && "1개 설치됨"}
                  {category === "유틸리티" && "2개 설치됨"}
                  {category === "데이터" && "0개 설치됨"}
                  {category === "자동화" && "2개 설치됨"}
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
