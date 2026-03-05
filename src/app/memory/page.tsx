"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, X } from "lucide-react";
import { getMemoryFiles, saveMemoryFiles, MemoryFile } from "@/lib/data";

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);
  const [newFile, setNewFile] = useState({
    title: "",
    type: "note" as MemoryFile["type"],
    content: "",
  });

  useEffect(() => {
    setFiles(getMemoryFiles());
  }, []);

  const handleAdd = () => {
    if (!newFile.title.trim()) return;
    const file: MemoryFile = {
      ...newFile,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
      size: `${(newFile.content.length / 1024).toFixed(1)} KB`,
    };
    const updated = [...files, file];
    setFiles(updated);
    saveMemoryFiles(updated);
    setIsAddModalOpen(false);
    setNewFile({ title: "", type: "note", content: "" });
  };

  const handleDelete = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    saveMemoryFiles(updated);
    if (selectedFile?.id === id) setSelectedFile(null);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">메모리</h1>
          <p className="text-sm text-gray-400">메모리 파일과 문서를 관리하세요</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 문서
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {files.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-gray-400 text-sm">문서가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedFile?.id === file.id
                      ? "bg-indigo-600/20 border border-indigo-600/30"
                      : "bg-gray-900 border border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    file.type === "config"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : file.type === "daily"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{file.title}</div>
                    <div className="text-xs text-gray-500">{file.size} • {new Date(file.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">{selectedFile.title}</h2>
                <span className="text-xs text-gray-500">{selectedFile.size}</span>
              </div>
              <pre className="bg-gray-950 rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-96">
                {selectedFile.content || "내용 없음"}
              </pre>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-400">왼쪽에서 문서를 선택하세요</p>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">새 문서</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">제목 *</label>
                <input
                  type="text"
                  value={newFile.title}
                  onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="문서 제목"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">타입</label>
                <select
                  value={newFile.type}
                  onChange={(e) => setNewFile({ ...newFile, type: e.target.value as MemoryFile["type"] })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="config">설정</option>
                  <option value="daily">일일</option>
                  <option value="note">노트</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">내용</label>
                <textarea
                  value={newFile.content}
                  onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={5}
                  placeholder="내용을 입력하세요"
                />
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
                onClick={handleAdd}
                disabled={!newFile.title.trim()}
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
