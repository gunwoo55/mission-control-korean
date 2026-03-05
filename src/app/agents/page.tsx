"use client";

import { useState, useEffect } from "react";
import { Bot, Circle, MoreHorizontal, Plus, X, Check } from "lucide-react";
import { getAgents, saveAgents, Agent } from "@/lib/data";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    skills: "",
  });

  useEffect(() => {
    setAgents(getAgents());
  }, []);

  const handleAddAgent = () => {
    if (!newAgent.name.trim()) return;
    
    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      skills: newAgent.skills.split(",").map((s) => s.trim()).filter(Boolean),
      status: "idle",
      lastActive: "방금",
      tokenUsage: 0,
    };
    
    const updated = [...agents, agent];
    saveAgents(updated);
    setAgents(updated);
    setIsModalOpen(false);
    setNewAgent({ name: "", description: "", skills: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updated = agents.filter((a) => a.id !== id);
      saveAgents(updated);
      setAgents(updated);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">에이전트 관리</h1>
          <p className="text-sm text-gray-400">모든 AI 에이전트와 상태를 관리하세요</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 에이전트
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">등록된 에이전트가 없습니다</h3>
          <p className="text-gray-400 mb-4">새로운 AI 에이전트를 추가핳세요.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            첫 에이전트 추가
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onDelete={handleDelete} />
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-gray-500 hover:bg-gray-900 transition-all min-h-[200px]"
          >
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">새 에이전트 추가</p>
              <p className="text-sm text-gray-400">서브에이전트 생성하기</p>
            </div>
          </button>
        </div>
      )}

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">새 에이전트 추가</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">이름 *</label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="예: 리서처"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">설명</label>
                <textarea
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                  placeholder="에이전트 역할 설명"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">스킬 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={newAgent.skills}
                  onChange={(e) => setNewAgent({ ...newAgent, skills: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="코딩, 리서치, 분석"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleAddAgent}
                disabled={!newAgent.name.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent, onDelete }: { agent: Agent; onDelete: (id: string) => void }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm lg:text-base">{agent.name}</h3>
            <p className="text-xs text-gray-400">{agent.description || "설명 없음"}</p>
          </div>
        </div>
        <button onClick={() => onDelete(agent.id)} className="text-gray-400 hover:text-red-400">
          <X className="w-5 h-5" />
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
          {agent.status === "active" ? "활성" : agent.status === "idle" ? "대기" : "오프라인"}
        </span>
        <span className="text-gray-600">•</span>
        <span className="text-sm text-gray-400">{agent.lastActive}</span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">스킬</p>
        <div className="flex flex-wrap gap-2">
          {agent.skills.length > 0 ? (
            agent.skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">스킬 없음</span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">토큰 사용량</span>
          <span className="text-white font-medium">{agent.tokenUsage.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
