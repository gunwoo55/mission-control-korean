"use client";

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
import {
  mockAgents,
  mockTasks,
  tokenUsageData,
  systemStats,
  recentActivities,
} from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-gray-400">OpenClaw 에이전트 시스템 개요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Bot}
          label="활성 에이전트"
          value={systemStats.activeAgents.toString()}
          subtext={`총 ${mockAgents.length}개 에이전트`}
          color="indigo"
        />
        <StatCard
          icon={CheckCircle}
          label="완료된 작업"
          value={`${systemStats.completedTasks}/${systemStats.totalTasks}`}
          subtext="이번 주 진행 상황"
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="예상 비용"
          value="$5.4"
          subtext="이번 달 누적"
          color="amber"
        />
        <StatCard
          icon={Clock}
          label="시스템 가동"
          value={systemStats.uptime}
          subtext="무중단 운영"
          color="purple"
        />
      </div>

      {/* System Resources & Token Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            시스템 리소스
          </h2>
          <div className="space-y-4">
            <ResourceBar
              icon={Cpu}
              label="CPU"
              value={systemStats.cpu}
              color="bg-blue-500"
            />
            <ResourceBar
              icon={MemoryStick}
              label="메모리"
              value={systemStats.memory}
              color="bg-purple-500"
            />
            <ResourceBar
              icon={HardDrive}
              label="디스크"
              value={systemStats.disk}
              color="bg-amber-500"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            토큰 사용량
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenUsageData}>
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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          최근 활동
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div>
                  <div className="text-sm text-white">
                    <span className="font-medium">{activity.action}</span>
                    {" "}→ {activity.target}
                  </div>
                  <div className="text-xs text-gray-500">{activity.agent}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{subtext}</div>
      </div>
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-24">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <div className="w-12 text-right text-sm text-gray-400">{value}%</div>
    </div>
  );
}
