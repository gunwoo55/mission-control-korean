"use client";

import { useState, useEffect } from "react";
import { Activity, Bot, CheckCircle, Cpu, DollarSign, HardDrive, MemoryStick, TrendingUp, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAgents, getTasks, getCostData, getSystemStats, formatRelativeTime, initializeStorage, Task } from "@/lib/data";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeAgents: 0,
    totalAgents: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalTokens: 0,
    totalCost: 0,
    cpu: 0,
    memory: 0,
    disk: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    initializeStorage();
    
    const agents = getAgents();
    const tasksData = getTasks();
    const systemStats = getSystemStats();
    
    setStats({
      activeAgents: systemStats.activeAgents,
      totalAgents: systemStats.totalAgents,
      totalTasks: systemStats.totalTasks,
      completedTasks: systemStats.completedTasks,
      totalTokens: systemStats.totalTokens,
      totalCost: systemStats.totalCost,
      cpu: systemStats.cpu,
      memory: systemStats.memory,
      disk: systemStats.disk,
    });
    
    setTasks(tasksData.slice(0, 5));
    setHasData(agents.length > 0 || tasksData.length > 0);
  }, []);

  const costData = getCostData();
  const chartData = Object.keys(costData).length > 0
    ? Object.entries(costData).slice(-7).map(([date, data]) => ({
        date: date.slice(5),
        tokens: data.tokens,
      }))
    : [];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">대시보드</h1>
          <p className="text-sm text-gray-400">OpenClaw 에이전트 시스템 개요</p>
        </div>
        {!hasData && (
          <Link
            href="/agents"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 에이전트 추가
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={Bot} label="활성 에이전트" value={stats.activeAgents} color="indigo" />
        <StatCard icon={CheckCircle} label="완료된 작업" value={stats.completedTasks} color="green" />
        <StatCard icon={DollarSign} label="누적 비용" value={`$${stats.totalCost.toFixed(2)}`} color="amber" />
        <StatCard icon={TrendingUp} label="총 토큰" value={`${(stats.totalTokens / 1000).toFixed(0)}K`} color="purple" />
      </div>

      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              시스템 리소스
            </h2>
            <ResourceBar icon={Cpu} label="CPU" value={stats.cpu} color="bg-blue-500" />
            <ResourceBar icon={MemoryStick} label="메모리" value={stats.memory} color="bg-purple-500" />
            <ResourceBar icon={HardDrive} label="디스크" value={stats.disk} color="bg-amber-500" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              토큰 사용량
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                  <Bar dataKey="tokens" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">아직 데이터가 없습니다</h3>
          <p className="text-gray-400 mb-4">에이전트와 작업을 추가하면 통계가 표시됩니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/agents" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              에이전트 추가
            </Link>
            <Link href="/tasks" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
              작업 추가
            </Link>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          최근 작업
        </h2>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Link
                key={task.id}
                href="/tasks"
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div>
                    <div className="text-sm text-white">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.assignee || "미지정"} • {formatRelativeTime(task.createdAt)}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === "done" ? "bg-green-500/10 text-green-400" :
                  task.status === "in-progress" ? "bg-blue-500/10 text-blue-400" :
                  "bg-gray-500/10 text-gray-400"
                }`}>
                  {task.status === "done" ? "완료" : task.status === "in-progress" ? "진행 중" : "대기"}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              작업이 없습니다. <Link href="/tasks" className="text-indigo-400 hover:underline">작업 추가하기</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function ResourceBar({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center gap-2 w-20">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
        </div>
      </div>
      <div className="w-10 text-right text-sm text-gray-400">{value}%</div>
    </div>
  );
}
