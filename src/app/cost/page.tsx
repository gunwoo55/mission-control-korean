"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, PieChart, Loader2 } from "lucide-react";
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
import { openClawClient, SessionInfo } from "@/lib/openclaw-client";

interface CostData {
  date: string;
  tokens: number;
  cost: number;
}

interface ModelData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function CostTrackerPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 10000); // 10초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      // localStorage에서 설정 가져오기
      const config = localStorage.getItem("openclaw_config");
      if (!config) {
        setError("OpenClaw 게이트웨이가 설정되지 않았습니다. 실시간 탭에서 연결하세요.");
        setLoading(false);
        return;
      }

      const { url, token } = JSON.parse(config);
      openClawClient.setConfig({ url, token });
      
      const data = await openClawClient.getSessions({ limit: 100 });
      setSessions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalCost = sessions.reduce((sum, s) => sum + (s.costUSD || 0), 0);
  const totalTokens = sessions.reduce((sum, s) => sum + (s.tokenUsage?.total || 0), 0);
  const activeSessions = sessions.filter((s) => s.active).length;

  // Generate daily data from sessions (last 7 days)
  const dailyData: CostData[] = (() => {
    const days: CostData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      // Find sessions from this date
      const daySessions = sessions.filter((s) => {
        const sDate = new Date(s.createdAt);
        return sDate.toDateString() === date.toDateString();
      });
      
      const dayTokens = daySessions.reduce((sum, s) => sum + (s.tokenUsage?.total || 0), 0);
      const dayCost = daySessions.reduce((sum, s) => sum + (s.costUSD || 0), 0);
      
      days.push({ date: dateStr, tokens: dayTokens, cost: parseFloat(dayCost.toFixed(2)) });
    }
    return days;
  })();

  // Generate model distribution
  const modelData: ModelData[] = (() => {
    const modelCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      const model = s.model || "Unknown";
      modelCounts[model] = (modelCounts[model] || 0) + (s.tokenUsage?.total || 0);
    });
    
    return Object.entries(modelCounts)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })();

  // Agent breakdown
  const agentData = sessions
    .map((s) => ({
      name: s.agentId || s.label || "Unknown",
      tokens: s.tokenUsage?.total || 0,
      cost: s.costUSD || 0,
    }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-white mb-2">데이터를 불러올 수 없습니다</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">비용 추적</h1>
          <p className="text-gray-400">AI 사용량과 비용을 실시간으로 모니터링하세요</p>
        </div>
        <div className="text-sm text-gray-500">10초마다 갱신</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            총 비용
          </div>
          <div className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">{sessions.length}개 세션</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            총 토큰
          </div>
          <div className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{activeSessions}개 활성</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <PieChart className="w-4 h-4" />
            평균 비용/세션
          </div>
          <div className="text-2xl font-bold text-white">
            ${sessions.length > 0 ? (totalCost / sessions.length).toFixed(3) : "0"}
          </div>
          <div className="text-xs text-gray-500 mt-1">세션당 평균</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            1000토큰당
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalTokens > 0 ? ((totalCost / totalTokens) * 1000).toFixed(4) : "0"}
          </div>
          <div className="text-xs text-gray-500 mt-1">평균 단가</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">일별 사용량</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Line type="monotone" dataKey="cost" stroke="#6366F1" strokeWidth={2} name="비용 ($)" />
                <Line type="monotone" dataKey="tokens" stroke="#10B981" strokeWidth={2} name="토큰" yAxisId={1} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">모델별 분포</h3>
          <div className="h-64">
            {modelData.length > 0 ? (
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
                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-20">데이터가 없습니다</p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {modelData.map((model) => (
              <div key={model.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                <span className="text-sm text-gray-400">{model.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">에이전트별 사용량</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                <th className="pb-3">에이전트</th>
                <th className="pb-3">토큰</th>
                <th className="pb-3">비용</th>
                <th className="pb-3">비중</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {agentData.length > 0 ? (
                agentData.map((agent) => (
                  <tr key={agent.name} className="border-b border-gray-800/50">
                    <td className="py-3 text-white">{agent.name}</td>
                    <td className="py-3 text-gray-400">{agent.tokens.toLocaleString()}</td>
                    <td className="py-3 text-gray-400">${agent.cost.toFixed(4)}</td>
                    <td className="py-3">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{
                            width: `${totalTokens > 0 ? (agent.tokens / totalTokens) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
