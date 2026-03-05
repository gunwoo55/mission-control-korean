"use client";

import { useState, useEffect } from "react";
import { Wrench, Check, Download, Plus, X, Play, Sparkles } from "lucide-react";
import { getSkills, saveSkills, addSkill, Skill } from "@/lib/data";

const CATEGORIES = ["리서치", "개발", "메시징", "유틸리티", "데이터", "자동화"];

// Prompt optimization logic
function optimizePrompt(userInput: string): string {
  const input = userInput.toLowerCase();
  
  let taskType = "구현";
  if (input.includes("버그") || input.includes("오류") || input.includes("고쳐")) taskType = "수정";
  if (input.includes("리팩토링") || input.includes("정리") || input.includes("개선")) taskType = "리팩토링";
  if (input.includes("검토") || input.includes("리뷰") || input.includes("확인")) taskType = "검토";
  if (input.includes("분석") || input.includes("파악")) taskType = "분석";
  
  let optimized = `[${taskType} 작업]\n\n`;
  
  if (taskType === "구현" || taskType === "리팩토링") {
    optimized += `1. 계획 및 분석:\n`;
    optimized += `   - 관련 파일 탐색: @src/ 디렉토리 구조 확인\n`;
    optimized += `   - 기존 코드 패턴 파악\n`;
    optimized += `   - 구현 방식 2-3가지 제안 및 장단점 비교\n\n`;
    optimized += `2. 구현:\n`;
  } else {
    optimized += `작업 내용:\n`;
  }
  
  optimized += `   - ${userInput}\n\n`;
  optimized += `3. 검증 (필수):\n`;
  optimized += `   - TypeScript 컴파일 체크\n`;
  optimized += `   - ESLint 검사\n`;
  if (taskType === "구현" || taskType === "수정") {
    optimized += `   - 관련 테스트 실행\n`;
    optimized += `   - 에지 케이스 테스트\n`;
  }
  optimized += `\n`;
  optimized += `제약사항:\n`;
  optimized += `   - 기존 코드와의 하위 호환성 유지\n`;
  optimized += `   - 성능 저하 없도록 주의\n`;
  optimized += `   - 문제 발생 시 즉시 롤백\n`;
  
  return optimized;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
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

  const handleOptimize = () => {
    if (!userInput.trim()) return;
    const optimized = optimizePrompt(userInput);
    setOptimizedPrompt(optimized);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    alert("최적화된 프롬프트가 복사되었습니다!");
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

      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Claude Code 프롬프트 최적화</h3>
              <p className="text-sm text-gray-400 mt-1">자연스러운 명령을 Claude Code 베스트 프랙티스에 맞게 최적화합니다</p>
            </div>
          </div>
          <button
            onClick={() => setIsOptimizeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            <Play className="w-4 h-4" />
            실행
          </button>
        </div>
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
                        {skill.isBuiltin && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-indigo-400">내장</span>
                          </>
                        )}
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

                {skill.id === "builtin-prompt-optimizer" && skill.installed ? (
                  <button
                    onClick={() => setIsOptimizeModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    실행
                  </button>
                ) : (
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
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-4">스킬 카테고리</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="p-3 lg:p-4 bg-gray-800 rounded-lg text-center">
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

      {/* Prompt Optimizer Modal */}
      {isOptimizeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Claude Code 프롬프트 최적화</h2>
              </div>
              <button onClick={() => {
                setIsOptimizeModalOpen(false);
                setUserInput("");
                setOptimizedPrompt("");
              }} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">원하는 작업을 자연스럽게 설명해주세요</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm resize-none"
                  rows={4}
                  placeholder="예: 로그인 페이지 만들어, 이 버그 고쳐줘, API 성능 개선해줘..."
                />
              </div>
              
              <button
                onClick={handleOptimize}
                disabled={!userInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium"
              >
                <Sparkles className="w-4 h-4" />
                프롬프트 최적화
              </button>
              
              {optimizedPrompt && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">최적화된 프롬프트</label>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      복사
                    </button>
                  </div>
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-64">
                    {optimizedPrompt}
                  </pre>
                  <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
                    <p className="text-sm text-indigo-300">
                      <strong>💡 사용 방법:</strong><br />
                      1. 위 프롬프트를 복사하세요<br />
                      2. Claude Code (터미널/VS Code)에 붙여넣기<br />
                      3. 또는 OpenClaw 대시보드의 "대화" 탭에서 전송
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}