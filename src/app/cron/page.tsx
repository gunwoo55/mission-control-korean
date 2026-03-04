"use client";

import { Clock, Play, Pause, MoreHorizontal, Plus } from "lucide-react";
import { mockCronJobs } from "@/lib/mock-data";

export default function CronPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">예약 작업</h1>
          <p className="text-gray-400">정기적으로 실행되는 자동화 작업을 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          새 예약 작업
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400">
          <div className="col-span-3">작업명</div>
          <div className="col-span-2">스케줄</div>
          <div className="col-span-2">마지막 실행</div>
          <div className="col-span-2">다음 실행</div>
          <div className="col-span-1">상태</div>
          <div className="col-span-2">실행 횟수</div>
        </div>

        {mockCronJobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors items-center"
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-white">{job.name}</div>
                <div className="text-xs text-gray-500">ID: {job.id}</div>
              </div>
            </div>

            <div className="col-span-2">
              <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                {job.schedule}
              </code>
            </div>

            <div className="col-span-2 text-sm text-gray-300">{job.lastRun}</div>

            <div className="col-span-2 text-sm text-gray-300">{job.nextRun}</div>

            <div className="col-span-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : job.status === "paused"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    job.status === "active"
                      ? "bg-green-400"
                      : job.status === "paused"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                {job.status === "active"
                  ? "활성"
                  : job.status === "paused"
                  ? "일시정지"
                  : "오류"}
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-between">
              <span className="text-sm text-gray-300">{job.runCount}회</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                  {job.status === "active" ? (
                    <Pause className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Play className="w-4 h-4 text-green-400" />
                  )}
                </button>
                <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-2">스케줄 문법</h3>
          <p className="text-sm text-gray-400 mb-3">
            Cron 표현식으로 실행 시간을 설정합니다.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">0 8 * * *</code>
              <span className="text-gray-500">매일 08:00</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">*/30 * * * *</code>
              <span className="text-gray-500">30분마다</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">0 0 * * 0</code>
              <span className="text-gray-500">매주 일요일</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-2">빠른 템플릿</h3>
          <div className="space-y-2">
            {["모닝 브리프", "하트비트 체크", "주간 보고서"].map((template) => (
              <button
                key={template}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                + {template}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-2">실행 로그</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">하트비트 체크</span>
              <span className="text-green-400 text-xs">성공</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">모닝 브리프</span>
              <span className="text-green-400 text-xs">성공</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">백업 작업</span>
              <span className="text-green-400 text-xs">성공</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
