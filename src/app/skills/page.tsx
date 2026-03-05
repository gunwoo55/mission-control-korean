"use client";

import { useState, useEffect } from "react";
import { Wrench, Check, Download, Plus, X } from "lucide-react";
import { getSkills, saveSkills, addSkill, Skill } from "@/lib/data";

const CATEGORIES = ["리서치", "개발", "메시징", "유틸리티", "데이터", "자동화"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    description: "",
    category: "개발",
    version: "1.0.0",
  });

  useEffect(() => {
    setSkills(getSkills());
  }, []);

  const toggleSkill = (skillId: string) => {
    const updated = skills.map((s) =>
      s.id === skillId ? { ...s, installed: !s.installed } : s
    );
    setSkills(updated);
    saveSkills(updated);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    addSkill({ ...newSkill, installed: false });
    setSkills(getSkills());
    setIsAddModalOpen(false);
    setNewSkill({ name: "", description: "", category: "개발", version: "1.0.0" });
  };

  const getCategoryCount = (category: string) => {
    return skills.filter((s) => s.category === category && s.installed).length;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">스킬 관리</h1>
          <p className="text-sm text-gray-400">에이전트가 사용하는 스킬을 관리하세요</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          스킬 추가
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">등록된 스킬이 없습니다</h3>
          <p className="text-gray-400 mb-4">새로운 스킬을 추가하세요.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            첫 스킬 추가
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`bg-gray-900 border rounded-xl p-4 lg:p-5 transition-colors ${
                  skill.installed ? "border-gray-800" : "border-gray-800/50 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      skill.installed ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-800 text-gray-500"
                    }`}>
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm lg:text-base">{skill.name}</h3>
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

                <p className="text-sm text-gray-400 mb-4">{skill.description || "설명 없음"}</p>

                <button
                  onClick={() => toggleSkill(skill.id)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    skill.installed
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {skill.installed ? (
                    "설치됨"
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      설치
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-4">스킬 카테고리</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="p-3 lg:p-4 bg-gray-800 rounded-lg text-center"
                >
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">
                    {category === "리서치" && "🔍"}
                    {category === "개발" && "💻"}
                    {category === "메시징" && "💬"}
                    {category === "유틸리티" && "🛠️"}
                    {category === "데이터" && "📊"}
                    {category === "자동화" && "⚡"}
                  </div>
                  <div className="text-sm font-medium text-white">{category}</div>
                  <div className="text-xs text-gray-500 mt-1">{getCategoryCount(category)}개 설치됨</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">새 스킬 추가</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">이름 *</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="스킬 이름"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">설명</label>
                <textarea
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                  placeholder="스킬 설명"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">카테고리</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">버전</label>
                  <input
                    type="text"
                    value={newSkill.version}
                    onChange={(e) => setNewSkill({ ...newSkill, version: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="1.0.0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.name.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
