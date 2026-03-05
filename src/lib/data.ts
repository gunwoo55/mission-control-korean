// Local storage helpers for persistent data
const STORAGE_KEYS = {
  TASKS: "mc_tasks",
  AGENTS: "mc_agents",
  CONVERSATIONS: "mc_conversations",
  SETTINGS: "mc_settings",
  COST_DATA: "mc_cost_data",
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  createdAt: string;
  dueDate?: string;
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  skills: string[];
  lastActive: string;
  tokenUsage: number;
  description: string;
}

// Conversation types
export interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  agent: string;
  messages: Message[];
  lastMessage: string;
  timestamp: string;
  unread: number;
}

// Default data
export const defaultAgents: Agent[] = [
  {
    id: "1",
    name: "루루",
    status: "active",
    skills: ["코딩", "리서치", "메모리 관리"],
    lastActive: "방금",
    tokenUsage: 125000,
    description: "메인 AI 어시스턴트",
  },
  {
    id: "2",
    name: "리서처",
    status: "idle",
    skills: ["웹 검색", "데이터 분석"],
    lastActive: "5분 전",
    tokenUsage: 45000,
    description: "정보 수집 전문 에이전트",
  },
  {
    id: "3",
    name: "코더",
    status: "active",
    skills: ["프론트엔드", "백엔드", "디버깅"],
    lastActive: "방금",
    tokenUsage: 89000,
    description: "개발 작업 전문 에이전트",
  },
];

export const defaultTasks: Task[] = [
  {
    id: "1",
    title: "미션 컨트롤 대시보드 개발",
    description: "OpenClaw용 한국어 대시보드 구현",
    status: "in-progress",
    priority: "high",
    assignee: "루루",
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "매경 서포터즈 지원서 작성",
    description: "17기 지원서 초안 작성",
    status: "backlog",
    priority: "high",
    assignee: "건우",
    createdAt: new Date().toISOString(),
  },
];

export const defaultConversations: Conversation[] = [
  {
    id: "1",
    title: "미션 컨트롤 개발",
    agent: "루루",
    messages: [
      {
        id: "1",
        content: "미션 컨트롤 대시보드 개발 시작할게! Next.js로 기본 구조부터 잡을게.",
        sender: "agent",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        content: "응, 다크 모드 기본으로 해주고 사이드바는 왼쪽에 배치해줘.",
        sender: "user",
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      },
    ],
    lastMessage: "한국어 대시보드 UI 구현 완료했어!",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unread: 0,
  },
];

// Data management functions
export function getTasks(): Task[] {
  return getFromStorage(STORAGE_KEYS.TASKS, defaultTasks);
}

export function saveTasks(tasks: Task[]): void {
  setToStorage(STORAGE_KEYS.TASKS, tasks);
}

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveTasks([...tasks, newTask]);
  return newTask;
}

export function updateTaskStatus(taskId: string, status: Task["status"]): void {
  const tasks = getTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
  saveTasks(updated);
}

export function deleteTask(taskId: string): void {
  const tasks = getTasks();
  saveTasks(tasks.filter((t) => t.id !== taskId));
}

export function getAgents(): Agent[] {
  return getFromStorage(STORAGE_KEYS.AGENTS, defaultAgents);
}

export function getConversations(): Conversation[] {
  return getFromStorage(STORAGE_KEYS.CONVERSATIONS, defaultConversations);
}

export function addMessage(conversationId: string, content: string, sender: "user" | "agent"): void {
  const conversations = getConversations();
  const updated = conversations.map((c) => {
    if (c.id === conversationId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender,
        timestamp: new Date().toISOString(),
      };
      return {
        ...c,
        messages: [...c.messages, newMessage],
        lastMessage: content,
        timestamp: new Date().toISOString(),
        unread: sender === "agent" ? c.unread + 1 : c.unread,
      };
    }
    return c;
  });
  setToStorage(STORAGE_KEYS.CONVERSATIONS, updated);
}

export function markConversationAsRead(conversationId: string): void {
  const conversations = getConversations();
  const updated = conversations.map((c) =>
    c.id === conversationId ? { ...c, unread: 0 } : c
  );
  setToStorage(STORAGE_KEYS.CONVERSATIONS, updated);
}

// Cost tracking
export function recordTokenUsage(agentId: string, tokens: number): void {
  const agents = getAgents();
  const updated = agents.map((a) =>
    a.id === agentId ? { ...a, tokenUsage: a.tokenUsage + tokens } : a
  );
  setToStorage(STORAGE_KEYS.AGENTS, updated);
  
  // Also record in cost data
  const today = new Date().toISOString().split("T")[0];
  const costData = getFromStorage(STORAGE_KEYS.COST_DATA, {});
  if (!costData[today]) {
    costData[today] = { tokens: 0, cost: 0 };
  }
  costData[today].tokens += tokens;
  costData[today].cost += tokens * 0.00003; // Approximate cost per token
  setToStorage(STORAGE_KEYS.COST_DATA, costData);
}

export function getCostData(): Record<string, { tokens: number; cost: number }> {
  return getFromStorage(STORAGE_KEYS.COST_DATA, {});
}

// System stats (calculated from real data)
export function getSystemStats() {
  const agents = getAgents();
  const tasks = getTasks();
  const costData = getCostData();
  
  const totalTokens = Object.values(costData).reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = Object.values(costData).reduce((sum, d) => sum + d.cost, 0);
  
  return {
    cpu: Math.floor(Math.random() * 30) + 10, // Simulated
    memory: Math.floor(Math.random() * 40) + 20, // Simulated
    disk: Math.floor(Math.random() * 20) + 50, // Simulated
    uptime: "15일 7시간",
    activeAgents: agents.filter((a) => a.status === "active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    totalTokens,
    totalCost,
  };
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "방금";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
}
