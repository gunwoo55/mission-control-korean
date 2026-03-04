"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Kanban,
  Clock,
  Wrench,
  Brain,
  Settings,
  Briefcase,
  MessageSquare,
  Search,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "에이전트", href: "/agents", icon: Bot },
  { name: "작업 관리", href: "/tasks", icon: Kanban },
  { name: "예약 작업", href: "/cron", icon: Clock },
  { name: "대화", href: "/conversations", icon: MessageSquare },
  { name: "오피스", href: "/office", icon: Briefcase },
  { name: "스카우트", href: "/scout", icon: Search },
  { name: "스킬", href: "/skills", icon: Wrench },
  { name: "메모리", href: "/memory", icon: Brain },
  { name: "비용", href: "/cost", icon: DollarSign },
  { name: "설정", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">미션 컨트롤</h1>
            <p className="text-xs text-gray-400">OpenClaw 대시보드</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">시스템 상태</span>
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <div className="text-sm font-medium text-white">정상 작동 중</div>
          <div className="text-xs text-gray-500 mt-1">게이트웨이 연결됨</div>
        </div>
      </div>
    </div>
  );
}
