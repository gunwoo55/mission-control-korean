"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink, Star, TrendingUp, DollarSign, Briefcase, Plus, X } from "lucide-react";
import { getOpportunities, saveOpportunities, Opportunity } from "@/lib/data";

const OPPORTUNITY_TYPES = [
  { id: "program", label: "프로그램", color: "bg-blue-500/20 text-blue-400", icon: "💼" },
  { id: "job", label: "채용", color: "bg-green-500/20 text-green-400", icon: "💼" },
  { id: "event", label: "이벤트", color: "bg-purple-500/20 text-purple-400", icon: "🎉" },
  { id: "freelance", label: "프리랜스", color: "bg-amber-500/20 text-amber-400", icon: "💼" },
];

export default function ScoutPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    type: "program" as Opportunity["type"],
    source: "",
    deadline: "",
    description: "",
    relevance: 80,
  });

  useEffect(() => {
    setOpportunities(getOpportunities());
  }, []);

  const handleAdd = () => {
    if (!newOpportunity.title.trim()) return;
    const opp: Opportunity = {
      ...newOpportunity,
      id: Date.now().toString(),
    };
    const updated = [...opportunities, opp];
    setOpportunities(updated);
    saveOpportunities(updated);
    setIsAddModalOpen(false);
    setNewOpportunity({
      title: "",
      type: "program",
      source: "",
      deadline: "",
      description: "",
      relevance: 80,
    });
  };

  const handleDelete = (id: string) => {
    const updated = opportunities.filter((o) => o.id !== id);
    setOpportunities(updated);
    saveOpportunities(updated);
  };

  const stats = {
    total: opportunities.length,
    highRelevance: opportunities.filter((o) => o.relevance >= 80).length,
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">스카우트</h1>
          <p className="text-sm text-gray-400">기회와 추천을 관리하세요</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          기회 추가
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Search className="w-4 h-4" />
            전체 기회
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Star className="w-4 h-4" />
            높은 관련성
          </div>
          <div className="text-2xl font-bold text-white">{stats.highRelevance}</div>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">등록된 기회가 없습니다</h3>
          <p className="text-gray-400 mb-4">새로운 기회를 추가하세요.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            첫 기회 추가
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    OPPORTUNITY_TYPES.find((t) => t.id === opp.type)?.color || "bg-gray-500/20 text-gray-400"
                  }`}>
                    {OPPORTUNITY_TYPES.find((t) => t.id === opp.type)?.icon || "📋"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{opp.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{opp.source || "출처 없음"}</span>
                      <span className="text-gray-600">•</span>
                      <span>{opp.deadline || "마감일 미정"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{opp.relevance}%</span>
                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mt-3">{opp.description || "설명 없음"}</p>
            </div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">새 기회 추가</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">제목 *</label>
                <input
                  type="text"
                  value={newOpportunity.title}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="기회 제목"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">유형</label>
                <select
                  value={newOpportunity.type}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, type: e.target.value as Opportunity["type"] })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {OPPORTUNITY_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">설명</label>
                <textarea
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                  placeholder="기회 설명"
                />
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
                onClick={handleAdd}
                disabled={!newOpportunity.title.trim()}
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
