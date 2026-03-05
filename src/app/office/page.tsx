"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, Zap, Clock, TrendingUp, Bot } from "lucide-react";
import { getAgents, getTasks } from "@/lib/data";

export default function OfficePage() {
  const [stats, setStats] = useState({
    agents: 0,
    working: 0,
    idle: 0,
    tasks: 0,
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    const agents = getAgents();
    const tasks = getTasks();

    setStats({
      agents: agents.length,
      working: agents.filter((a) => a.status === "active").length,
      idle: agents.filter((a) => a.status === "idle").length,
      tasks: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">오피스</h1>
          <p className="text-gray-400">AI 에이전트들이 일하는 공간</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="총 에이전트" value={stats.agents} color="indigo" />
        <StatCard icon={Zap} label="작업 중" value={stats.working} color="green" />
        <StatCard icon={Clock} label="대기 중" value={stats.idle} color="amber" />
        <StatCard icon={Briefcase} label="전체 작업" value={stats.tasks} color="blue" />
        <StatCard icon={TrendingUp} label="진행 중 작업" value={stats.inProgress} color="purple" />
        <StatCard icon={Bot} label="완료된 작업" value={stats.completed} color="emerald" />
      </div>

      {/* Agent Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">에이전트 상태</h2>
        <div className="space-y-3">
          {getAgents().map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.description}</div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  agent.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : agent.status === "idle"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {agent.status === "active" ? "작업 중" : agent.status === "idle" ? "대기" : "오프라인"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-800 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">💡 2D 오피스 게임</h3>
        <p className="text-sm text-gray-300">
          에이전트들이 실시간으로 움직이는 2D 오피스 게임 기능은 향후 업데이트에서 추가될 예정입니다.
          현재는 에이전트와 작업의 통계 정보를 확인할 수 있습니다.
        </p>
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
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
