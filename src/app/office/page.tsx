"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Users, Zap } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: "working" | "idle" | "moving";
  task?: string;
  color: string;
  avatar: string;
}

interface TaskParticle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: "code" | "doc" | "coffee";
}

const OFFICE_WIDTH = 800;
const OFFICE_HEIGHT = 600;

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [agents, setAgents] = useState<Agent[]>([
    { id: "1", name: "루루", x: 100, y: 100, targetX: 100, targetY: 100, status: "working", task: "코딩 중", color: "#6366F1", avatar: "👩‍💻" },
    { id: "2", name: "리서처", x: 300, y: 150, targetX: 300, targetY: 150, status: "idle", color: "#10B981", avatar: "🔍" },
    { id: "3", name: "코더", x: 500, y: 200, targetX: 500, targetY: 200, status: "working", task: "디버깅", color: "#F59E0B", avatar: "💻" },
  ]);
  const [particles, setParticles] = useState<TaskParticle[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const animationRef = useRef<number | null>(null);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = OFFICE_WIDTH;
    canvas.height = OFFICE_HEIGHT;

    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw office grid
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw desks
      drawDesk(ctx, 80, 80, "#374151");
      drawDesk(ctx, 280, 130, "#374151");
      drawDesk(ctx, 480, 180, "#374151");
      drawDesk(ctx, 150, 350, "#374151");
      drawDesk(ctx, 400, 400, "#374151");

      // Draw coffee machine
      drawCoffeeMachine(ctx, 650, 100);

      // Update and draw agents
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          const newAgent = { ...agent };

          // Move towards target
          const dx = newAgent.targetX - newAgent.x;
          const dy = newAgent.targetY - newAgent.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 2) {
            newAgent.x += (dx / distance) * 2;
            newAgent.y += (dy / distance) * 2;
            newAgent.status = "moving";
          } else {
            newAgent.status = Math.random() > 0.3 ? "working" : "idle";
          }

          // Random movement
          if (Math.random() < 0.005 && newAgent.status !== "moving") {
            newAgent.targetX = 50 + Math.random() * 700;
            newAgent.targetY = 50 + Math.random() * 500;
          }

          return newAgent;
        })
      );

      // Draw agents
      agents.forEach((agent) => {
        drawAgent(ctx, agent);
      });

      // Update and draw particles
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
              return {
                ...p,
                x: p.x + (dx / distance) * 3,
                y: p.y + (dy / distance) * 3,
              };
            }
            return null;
          })
          .filter(Boolean) as TaskParticle[]
      );

      particles.forEach((p) => {
        if (p) drawParticle(ctx, p);
      });

      // Spawn new particles randomly
      if (Math.random() < 0.02) {
        const fromAgent = agents[Math.floor(Math.random() * agents.length)];
        const toAgent = agents[Math.floor(Math.random() * agents.length)];
        if (fromAgent.id !== toAgent.id) {
          setParticles((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              x: fromAgent.x,
              y: fromAgent.y,
              targetX: toAgent.x,
              targetY: toAgent.y,
              type: ["code", "doc", "coffee"][Math.floor(Math.random() * 3)] as TaskParticle["type"],
            },
          ]);
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [agents, particles]);

  const drawDesk = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 80, 60);
    ctx.strokeStyle = "#4B5563";
    ctx.strokeRect(x, y, 80, 60);

    // Computer
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(x + 30, y - 15, 20, 15);
    ctx.fillStyle = "#60A5FA";
    ctx.fillRect(x + 32, y - 13, 16, 10);

    // Chair
    ctx.fillStyle = "#4B5563";
    ctx.beginPath();
    ctx.arc(x + 40, y + 80, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCoffeeMachine = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#374151";
    ctx.fillRect(x, y, 60, 80);
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(x + 10, y + 10, 40, 30);
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(x + 30, y + 25, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawAgent = (ctx: CanvasRenderingContext2D, agent: Agent) => {
    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(agent.x, agent.y + 25, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = agent.color;
    ctx.beginPath();
    ctx.arc(agent.x, agent.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Avatar
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(agent.avatar, agent.x, agent.y);

    // Name tag
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(agent.x - 30, agent.y - 45, 60, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.fillText(agent.name, agent.x, agent.y - 35);

    // Status indicator
    const statusColor = agent.status === "working" ? "#10B981" : agent.status === "idle" ? "#F59E0B" : "#3B82F6";
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(agent.x + 15, agent.y - 15, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Task bubble
    if (agent.task && agent.status === "working") {
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(agent.x + 25, agent.y - 25, 80, 20);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "10px Arial";
      ctx.textAlign = "left";
      ctx.fillText(agent.task, agent.x + 30, agent.y - 15);
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, p: TaskParticle) => {
    const emoji = p.type === "code" ? "💻" : p.type === "doc" ? "📄" : "☕";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(emoji, p.x, p.y);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicked on agent
    const clickedAgent = agents.find((agent) => {
      const dx = agent.x - x;
      const dy = agent.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });

    if (clickedAgent) {
      setSelectedAgent(clickedAgent);
    } else {
      // Move all agents to clicked position (for fun)
      setAgents((prev) =
        prev.map((agent, i) => ({
          ...agent,
          targetX: x + (i - 1) * 50,
          targetY: y + (i - 1) * 30,
        }))
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">오피스</h1>
          <p className="text-sm text-gray-400">AI 에이전트들이 일하는 공간</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{agents.length}명 근무 중</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Zap className="w-4 h-4" />
            <span>{agents.filter((a) => a.status === "working").length}명 작업 중</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="relative w-full overflow-auto">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full max-w-full cursor-pointer"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            💡 캔버스를 클릭하면 에이전트들이 그 위치로 이동합니다. 에이전트를 클릭하면 상세 정보를 볼 수 있습니다.
          </p>
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedAgent.avatar}</div>
              <div>
                <h3 className="font-semibold text-white">{selectedAgent.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${
                      selectedAgent.status === "working"
                        ? "bg-green-500/10 text-green-400"
                        : selectedAgent.status === "idle"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {selectedAgent.status === "working" && "작업 중"}
                    {selectedAgent.status === "idle" && "대기 중"}
                    {selectedAgent.status === "moving" && "이동 중"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {selectedAgent.task && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">현재 작업</p>
              <p className="text-white">{selectedAgent.task}</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setAgents((prev) =
                  prev.map((a) =
                    a.id === selectedAgent.id
                      ? { ...a, targetX: 650, targetY: 200 }
                      : a
                  )
                );
              }}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
            >
              ☕ 커피 마시러 복귀
            </button>
            <button
              onClick={() => {
                setAgents((prev) =
                  prev.map((a) =
                    a.id === selectedAgent.id
                      ? { ...a, targetX: 100 + Math.random() * 500, targetY: 100 + Math.random() * 300 }
                      : a
                  )
                );
              }}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
            >
              📍 랜덤 이동
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { color: "#6366F1", label: "루루", task: "코딩" },
          { color: "#10B981", label: "리서처", task: "정보 수집" },
          { color: "#F59E0B", label: "코더", task: "개발" },
          { color: "#EC4899", label: "신규", task: "대기" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
            <div className="text-sm">
              <div className="text-white">{item.label}</div>
              <div className="text-gray-500 text-xs">{item.task}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
