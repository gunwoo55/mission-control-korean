"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Bot,
  CheckCircle,
  Clock,
  Cpu,
  DollarSign,
  HardDrive,
  MemoryStick,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getAgents, getTasks, getCostData, getSystemStats, formatRelativeTime } from "@/lib/data";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeAgents: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalTokens: 0,
    totalCost: 0,
    cpu: 0,
    memory: 0,
    disk: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const agents = getAgents();
    const tasks = getTasks();
    const costData = getCostData();
    const systemStats = getSystemStats();
    
    setStats({
      activeAgents: agents.filter((a) => a.status === "active").length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "done").length,
      totalTokens: systemStats.totalTokens,
      totalCost: systemStats.totalCost,
      cpu: systemStats.cpu,
      memory: systemStats.memory,
      disk: systemStats.disk,
    });

    // Generate activities from real data
    const activities = [
      ...tasks.slice(0, 3).map((t) => ({
        id: t.id,
        action: t.status === "done" ? "작업 완료" : "작업 업데이트",
        target: t.title,
        time: formatRelativeTime(t.createdAt),
        agent: t.assignee || "미지정",
      })),
    ];
    setRecentActivities(activities);
  }, []);

  const tokenUsageData = Object.entries(getCostData())
    .slice(-7)
    .map(([date, data]: [string, any]) => ({
      date: date.slice(5),
      tokens: data.tokens,
      cost: data.cost,
    }));

  // Fallback data if no real data
  const chartData = tokenUsageData.length > 0 
      ? tokenUsageData 
      : [
        { date: "3/1", tokens: 45000, cost: 1.2 },
        { date: "3/2", tokens: 52000, cost: 1.4 },
        { date: "3/3", tokens: 38000, cost: 1.0 },
        { date: "3/4", tokens: 61000, cost: 1.6 },
        { date: "3/5", tokens: 45000, cost: 1.2 },
      ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm text-gray-400">OpenClaw 에이전트 시스템 개요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={Bot}
          label="활성 에이전트"
          value={stats.activeAgents.toString()}
          color="indigo"
        />
        <StatCard
          icon={CheckCircle}
          label="완료된 작업"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="누적 비용"
          value={`$${stats.totalCost.toFixed(2)}`}
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="총 토큰"
          value={`${(stats.totalTokens / 1000).toFixed(0)}K`}
          color="purple"
        />
      </div>

      {/* System Resources & Token Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            시스템 리소스
          </h2>
          <div className="space-y-4">
            <ResourceBar icon={Cpu} label="CPU" value={stats.cpu} color="bg-blue-500" />
            <ResourceBar icon={MemoryStick} label="메모리" value={stats.memory} color="bg-purple-500" />
            <ResourceBar icon={HardDrive} label="디스크" value={stats.disk} color="bg-amber-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            토큰 사용량
          </h2>
          <div className="h-48 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                <Bar dataKey="tokens" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          최근 활동
        </h2>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">
                      <span className="font-medium">{activity.action}</span>
                      {" "}→ {activity.target}
                    </div>
                    <div className="text-xs text-gray-500">{activity.agent}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{activity.time}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">최근 활동이 없습니다</p>
          )}
        㰯div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      <div className="text-xl lg:text-2xl font-bold text-white">{value}</div>
      <div className="text-xs lg:text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ResourceBar({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <div className="flex items-center gap-2 w-20 lg:w-24">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
        </div>
      </div>
      <div className="w-10 lg:w-12 text-right text-sm text-gray-400">{value}%</div>
    </div>
  );
}
