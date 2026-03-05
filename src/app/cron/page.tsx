"use client";

import { useState, useEffect } from "react";
import { Clock, Play, Pause, MoreHorizontal, Plus, X, Check } from "lucide-react";
import { getFromStorage, setToStorage } from "@/lib/data";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused" | "error";
  runCount: number;
}

const defaultCronJobs: CronJob[] = [
  {
    id: "1",
    name: "모닝 브리프",
    schedule: "0 8 * * *",
    lastRun: "오늘 08:00",
    nextRun: "내일 08:00",
    status: "active",
    runCount: 45,
  },
  {
    id: "2",
    name: "하트비트 체크",
    schedule: "*/30 * * * *",
    lastRun: "10분 전",
    nextRun: "20분 후",
    status: "active",
    runCount: 892,
  },
  {
    id: "3",
    name: "백업 작업",
    schedule: "0 2 * * *",
    lastRun: "어제 02:00",
    nextRun: "내일 02:00",
    status: "active",
    runCount: 30,
  },
];

const STORAGE_KEY = "mc_cron_jobs";

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    name: "",
    schedule: "0 8 * * *",
  });

  useEffect(() => {
    const stored = getFromStorage(STORAGE_KEY, defaultCronJobs);
    setJobs(stored);
  }, []);

  const toggleStatus = (jobId: string) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        const newStatus: CronJob["status"] = j.status === "active" ? "paused" : "active";
        return { ...j, status: newStatus };
      }
      return j;
    });
    setJobs(updated);
    setToStorage(STORAGE_KEY, updated);
  };

  const handleAddJob = () => {
    if (!newJob.name.trim()) return;
    const job: CronJob = {
      id: Date.now().toString(),
      name: newJob.name,
      schedule: newJob.schedule,
      lastRun: "-",
      nextRun: "대기 중",
      status: "active",
      runCount: 0,
    };
    const updated = [...jobs, job];
    setJobs(updated);
    setToStorage(STORAGE_KEY, updated);
    setIsAddModalOpen(false);
    setNewJob({ name: "", schedule: "0 8 * * *" });
  };

  const runJob = (jobId: string) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          lastRun: "방금",
          runCount: j.runCount + 1,
        };
      }
      return j;
    });
    setJobs(updated);
    setToStorage(STORAGE_KEY, updated);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">예약 작업</h1>
          <p className="text-sm text-gray-400">정기적으로 실행되는 자동화 작업을 관리하세요</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 예약 작업
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400">
          <div className="col-span-3">작업명</div>
          <div className="col-span-2">스케줄</div>
          <div className="col-span-2">마지막 실행</div>
          <div className="col-span-2">다음 실행</div>
          <div className="col-span-1">상태</div>
          <div className="col-span-2">실행 횟수</div>
        </div>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
          >
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{job.name}</div>
                    <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                      {job.schedule}
                    </code>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      job.status === "active" ? "bg-green-400" : "bg-amber-400"
                    }`}
                  />
                  {job.status === "active" ? "활성" : "일시정지"}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">마지막: {job.lastRun}</div>
                <div className="text-gray-400">{job.runCount}회 실행</div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(job.id)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  {job.status === "active" ? "일시정지" : "활성화"}
                </button>
                <button
                  onClick={() => runJob(job.id)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white transition-colors"
                >
                  지금 실행
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
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
                <button
                  onClick={() => toggleStatus(job.id)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    job.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      job.status === "active" ? "bg-green-400" : "bg-amber-400"
                    }`}
                  />
                  {job.status === "active" ? "활성" : "일시정지"}
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-between">
                <span className="text-sm text-gray-300">{job.runCount}회</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => runJob(job.id)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    title="지금 실행"
                  >
                    <Play className="w-4 h-4 text-green-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5">
          <h3 className="font-semibold text-white mb-2">스케줄 문법</h3>
          <p className="text-sm text-gray-400 mb-3">Cron 표현식으로 실행 시간을 설정합니다.</p>
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

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5">
          <h3 className="font-semibold text-white mb-2">빠른 템플릿</h3>
          <div className="space-y-2">
            {["모닝 브리프", "하트비트 체크", "주간 보고서"].map((template) => (
              <button
                key={template}
                onClick={() => {
                  setNewJob({ name: template, schedule: "0 8 * * *" });
                  setIsAddModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                + {template}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5">
          <h3 className="font-semibold text-white mb-2">통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">총 작업</span>
              <span className="text-white">{jobs.length}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">활성</span>
              <span className="text-green-400">{jobs.filter((j) => j.status === "active").length}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">총 실행 횟수</span>
              <span className="text-white">{jobs.reduce((sum, j) => sum + j.runCount, 0)}회</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">새 예약 작업</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">작업명 *</label>
                <input
                  type="text"
                  value={newJob.name}
                  onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="예: 모닝 브리프"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">스케줄 (Cron 표현식)</label>
                <input
                  type="text"
                  value={newJob.schedule}
                  onChange={(e) => setNewJob({ ...newJob, schedule: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono"
                  placeholder="0 8 * * *"
                />
                <p className="text-xs text-gray-500 mt-1">예: 0 8 * * * (매일 08:00)</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleAddJob}
                disabled={!newJob.name.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
