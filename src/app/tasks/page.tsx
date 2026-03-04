"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, Calendar, Flag, User } from "lucide-react";
import { mockTasks, Task } from "@/lib/mock-data";

const columns = [
  { id: "backlog", title: "백로그", color: "bg-gray-500" },
  { id: "in-progress", title: "진행 중", color: "bg-blue-500" },
  { id: "review", title: "검토 중", color: "bg-amber-500" },
  { id: "done", title: "완료", color: "bg-green-500" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Same column - reorder (not implemented for simplicity)
      return;
    }

    // Move between columns
    const newStatus = destination.droppableId as Task["status"];
    const taskId = result.draggableId;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10";
      case "medium":
        return "text-amber-400 bg-amber-400/10";
      case "low":
        return "text-green-400 bg-green-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">작업 관리</h1>
          <p className="text-gray-400">Kanban 보드로 작업을 추적하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          새 작업
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="font-semibold text-white">{column.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[200px]"
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white text-sm">
                                {task.title}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                              {task.description}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                <Flag className="w-3 h-3 inline mr-1" />
                                {getPriorityLabel(task.priority)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {task.assignee || "미지정"}
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {task.dueDate}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
