"use client";

import { Search, ExternalLink, Star, TrendingUp, DollarSign, Briefcase } from "lucide-react";

const opportunities = [
  {
    id: "1",
    title: "매일경제 대학생 서포터즈 17기",
    type: "program",
    source: "매경 공식",
    relevance: 95,
    deadline: "3월 15일",
    description: "데이터 분석 및 콘텐츠 제작 역량을 활용할 수 있는 기회",
  },
  {
    id: "2",
    title: "AI 스타트업 인턴십",
    type: "job",
    source: "LinkedIn",
    relevance: 88,
    deadline: "상시",
    description: "OpenClaw 기반 에이전트 개발 지원",
  },
  {
    id: "3",
    title: "해커톤: AI 비즈니스 해커톤",
    type: "event",
    source: "Devpost",
    relevance: 82,
    deadline: "3월 20일",
    description: "AI 도구를 활용한 비즈니스 솔루션 개발",
  },
  {
    id: "4",
    title: "벤처캐피털 리서치 보조",
    type: "freelance",
    source: "크몽",
    relevance: 75,
    deadline: "즉시 시작",
    description: "스타트업 투자 유치 리서치 및 데이터 정리",
  },
];

export default function ScoutPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">스카우트</h1>
          <p className="text-gray-400">AI가 발굴한 기회와 추천을 확인하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
          <Search className="w-4 h-4" />
          새로 검색
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Search className="w-4 h-4" />
            오늘 발굴
          </div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Star className="w-4 h-4" />
            높은 관련성
          </div>
          <div className="text-2xl font-bold text-white">4</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            트렌딩
          </div>
          <div className="text-2xl font-bold text-white">AI 에이전트</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            예상 가치
          </div>
          <div className="text-2xl font-bold text-white">₩2.5M+</div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  opp.type === "program"
                    ? "bg-blue-500/20 text-blue-400"
                    : opp.type === "job"
                    ? "bg-green-500/20 text-green-400"
                    : opp.type === "event"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
                >
                  {opp.type === "program" && <Briefcase className="w-5 h-5" />}
                  {opp.type === "job" && <DollarSign className="w-5 h-5" />}
                  {opp.type === "event" && <Star className="w-5 h-5" />}
                  {opp.type === "freelance" && <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{opp.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{opp.source}</span>
                    <span className="text-gray-600">•</span>
                    <span className={`
                      ${opp.type === "program" && "text-blue-400"}
                      ${opp.type === "job" && "text-green-400"}
                      ${opp.type === "event" && "text-purple-400"}
                      ${opp.type === "freelance" && "text-amber-400"}
                    `}>
                      {opp.type === "program" && "프로그램"}
                      {opp.type === "job" && "채용"}
                      {opp.type === "event" && "이벤트"}
                      {opp.type === "freelance" && "프리랜스"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">관련성 {opp.relevance}%</div>
                  <div className="text-xs text-gray-500">마감: {opp.deadline}</div>
                </div>
                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">{opp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
