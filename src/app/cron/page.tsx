"use client";

import { useState, useEffect } from "react";
import { Clock, Play, Plus, X } from "lucide-react";
import { getCronJobs, saveCronJobs, addCronJob, CronJob } from "@/lib/data";

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    name: "",
    schedule: "0 8 * * *",
  });

  useEffect(() => {
    setJobs(getCronJobs());
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
    saveCronJobs(updated);
  };

  const runJob = (jobId: string) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        return { ...j, lastRun: "방금", runCount: j.runCount + 1 };
      }
      return j;
    });
    setJobs(updated);
    saveCronJobs(updated);
  };

  const handleAddJob = () => {
    if (!newJob.name.trim()) return;
    addCronJob({
      name: newJob.name,
      schedule: newJob.schedule,
      nextRun: "대기 중",
      status: "active",
    });
    setJobs(getCronJobs());
    setIsAddModalOpen(false);
    setNewJob({ name: "", schedule: "0 8 * * *" });
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

      {jobs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-lg font-semibold text-white mb-2">등록된 예약 작업이 없습니다</h3>
          <p className="text-gray-400 mb-4">자동화할 작업을 예약하세요.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            첫 작업 예약
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400 hidden lg:grid">
            <div className="col-span-3">작업명</div>
            <div className="col-span-2">스케줄</div>
            <div className="col-span-2">마지막 실행</div>
            <div className="col-span-1">상태</div>
            <div className="col-span-2">실행 횟수</div>
          </div>

          {jobs.map((job) => (
            <div key={job.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <div className="lg:hidden space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{job.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === "active" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {job.status === "active" ? "활성" : "일시정지"}
                  </span>
                </div>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{job.schedule}</code>
              </div>

              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-medium text-white">{job.name}</span>
                </div>

                <div className="col-span-2">
                  <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{job.schedule}</code>
                </div>

                <div className="col-span-2 text-sm text-gray-300">{job.lastRun}</div>

                <div className="col-span-1">
                  <button
                    onClick={() => toggleStatus(job.id)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      job.status === "active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {job.status === "active" ? "활성" : "일시정지"}
                  </button>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-sm text-gray-300">{job.runCount}회</span>
                  <button
                    onClick={() => runJob(job.id)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg"
                  >
                    <Play className="w-4 h-4 text-green-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <label className="block text-sm text-gray-400 mb-1">스케줄 (Cron)</label>
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
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
