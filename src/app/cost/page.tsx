"use client";

import { DollarSign, TrendingUp, PieChart, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

const dailyData = [
  { date: "3/1", tokens: 45000, cost: 1.2 },
  { date: "3/2", tokens: 52000, cost: 1.4 },
  { date: "3/3", tokens: 38000, cost: 1.0 },
  { date: "3/4", tokens: 61000, cost: 1.6 },
  { date: "3/5", tokens: 45000, cost: 1.2 },
  { date: "3/6", tokens: 58000, cost: 1.5 },
  { date: "3/7", tokens: 42000, cost: 1.1 },
];

const modelData = [
  { name: "Claude 3.5 Sonnet", value: 65, color: "#6366F1" },
  { name: "GPT-4", value: 25, color: "#10B981" },
  { name: "기타", value: 10, color: "#F59E0B" },
];

const agentData = [
  { name: "루루", tokens: 125000, cost: 3.2 },
  { name: "리서처", tokens: 45000, cost: 1.1 },
  { name: "코더", tokens: 89000, cost: 2.3 },
];

export default function CostTrackerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">비용 추적</h1>
        <p className="text-gray-400">AI 사용량과 비용을 모니터링하세요</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            이번 달 총비용
          </div>
          <div className="text-2xl font-bold text-white">$15.4</div>
          <div className="text-xs text-green-400 mt-1">+12% 전월 대비</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            총 토큰 사용량
          </div>
          <div className="text-2xl font-bold text-white">486K</div>
          <div className="text-xs text-gray-500 mt-1">입력 + 출력</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            일일 평균
          </div>
          <div className="text-2xl font-bold text-white">$2.2</div>
          <div className="text-xs text-gray-500 mt-1">최근 7일</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <PieChart className="w-4 h-4" />
            예상 월간
          </div>
          <div className="text-2xl font-bold text-white">$48.2</div>
          <div className="text-xs text-gray-500 mt-1">현재 추세 기준</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">일별 사용량</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ fill: "#6366F1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">모델별 분포</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {modelData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-400">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">에이전트별 사용량</h2>
        <div className="space-y-4">
          {agentData.map((agent) => (
            <div key={agent.name} className="flex items-center gap-4">
              <div className="w-24 text-sm text-white">{agent.name}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(agent.tokens / 125000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-24 text-sm text-gray-400 text-right">
                {agent.tokens.toLocaleString()} 토큰
              </div>
              <div className="w-20 text-sm text-white text-right">
                ${agent.cost}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
