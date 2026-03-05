"use client";

import { MessageSquare, Clock, Bot } from "lucide-react";

const conversations = [
  {
    id: "1",
    title: "미션 컨트롤 개발",
    agent: "루루",
    lastMessage: "한국어 대시보드 UI 구현 완료했어",
    timestamp: "10분 전",
    unread: 2,
  },
  {
    id: "2",
    title: "매경 서포터즈 준비",
    agent: "리서처",
    lastMessage: "지난 기수 선발 기준 분석 완료",
    timestamp: "1시간 전",
    unread: 0,
  },
  {
    id: "3",
    title: "INDEX 플랫폼 개선",
    agent: "코더",
    lastMessage: "API 엔드포인트 최적화 진행 중",
    timestamp: "3시간 전",
    unread: 1,
  },
  {
    id: "4",
    title: "경제 데이터 분석",
    agent: "루루",
    lastMessage: "2월 물가상승률 리포트 작성 완료",
    timestamp: "어제",
    unread: 0,
  },
];

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">대화 기록</h1>
        <p className="text-gray-400">에이전트와 나눈 모든 대화를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <input
              type="text"
              placeholder="대화 검색..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="divide-y divide-gray-800">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full p-4 hover:bg-gray-800/50 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{conv.title}</div>
                      <div className="text-xs text-gray-500">{conv.agent}</div>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 truncate">{conv.lastMessage}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {conv.timestamp}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">미션 컨트롤 개발</div>
                <div className="text-xs text-gray-500">루루 • 온라인</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-200">
                  미션 컨트롤 대시보드 개발 시작할게! Next.js로 기본 구조부터 잡을게.
                </p>
                <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-indigo-600 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-white">
                  응, 다크 모드 기본으로 해주고 사이드바는 왼쪽에 배치해줘.
                </p>
                <div className="text-xs text-indigo-200 mt-1">10:32 AM</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-200">
                  한국어 대시보드 UI 구현 완료했어! 사이드바에 에이전트, 작업 관리, 예약 작업 메뉴 다 넣었고,
                  토큰 사용량 차트도 Recharts로 만들었어.
                </p>
                <div className="text-xs text-gray-500 mt-1">10:45 AM</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
