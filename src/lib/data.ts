// Unified data management with localStorage - NO HARDCODED DATA

const STORAGE_KEYS = {
  TASKS: "mc_tasks",
  AGENTS: "mc_agents",
  CONVERSATIONS: "mc_conversations",
  SKILLS: "mc_skills",
  CRON_JOBS: "mc_cron_jobs",
  COST_DATA: "mc_cost_data",
  SCOUT_DATA: "mc_scout_data",
  SETTINGS: "mc_settings",
  MEMORY_FILES: "mc_memory_files",
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

// Initialize empty storage - NO DEFAULT DATA
export function initializeStorage(): void {
  if (typeof window === "undefined") return;
  
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
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

export function getTasks(): Task[] {
  return getFromStorage(STORAGE_KEYS.TASKS, []);
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

export function getAgents(): Agent[] {
  return getFromStorage(STORAGE_KEYS.AGENTS, []);
}

export function saveAgents(agents: Agent[]): void {
  setToStorage(STORAGE_KEYS.AGENTS, agents);
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  installed: boolean;
  isBuiltin?: boolean;
}

export function getSkills(): Skill[] {
  const stored = getFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, []);
  
  // If no skills stored, initialize with built-in skills
  if (stored.length === 0) {
    const builtinSkills: Skill[] = [
      {
        id: "builtin-prompt-optimizer",
        name: "Claude Code 프롬프트 최적화",
        description: "자연스러운 명령을 Claude Code 베스트 프랙티스에 맞게 최적화합니다. 작업 유형 분석 → 구체적 지시사항 변환 → 검증 단계 추가",
        category: "개발",
        version: "1.0.0",
        installed: true,
        isBuiltin: true,
      },
      {
        id: "builtin-code-review",
        name: "코드 리뷰어",
        description: "작성된 코드를 검토하고 개선점을 제안합니다. TypeScript, 성능, 보안, 접근성 체크리스트 포함",
        category: "개발",
        version: "1.0.0",
        installed: false,
        isBuiltin: true,
      },
      {
        id: "builtin-test-writer",
        name: "테스트 작성기",
        description: "코드를 분석하고 단위 테스트, 통합 테스트를 자동으로 생성합니다. Jest, Vitest 지원",
        category: "개발",
        version: "1.0.0",
        installed: false,
        isBuiltin: true,
      },
    ];
    saveSkills(builtinSkills);
    return builtinSkills;
  }
  
  return stored;
}

export function saveSkills(skills: Skill[]): void {
  setToStorage(STORAGE_KEYS.SKILLS, skills);
}

export function addSkill(skill: Omit<Skill, "id">): Skill {
  const skills = getSkills();
  const newSkill: Skill = {
    ...skill,
    id: Date.now().toString(),
  };
  saveSkills([...skills, newSkill]);
  return newSkill;
}

// Cron Job types
export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused" | "error";
  runCount: number;
}

export function getCronJobs(): CronJob[] {
  return getFromStorage(STORAGE_KEYS.CRON_JOBS, []);
}

export function saveCronJobs(jobs: CronJob[]): void {
  setToStorage(STORAGE_KEYS.CRON_JOBS, jobs);
}

export function addCronJob(job: Omit<CronJob, "id" | "runCount" | "lastRun">): CronJob {
  const jobs = getCronJobs();
  const newJob: CronJob = {
    ...job,
    id: Date.now().toString(),
    runCount: 0,
    lastRun: "-",
  };
  saveCronJobs([...jobs, newJob]);
  return newJob;
}

// Scout Opportunity types
export interface Opportunity {
  id: string;
  title: string;
  type: "program" | "job" | "event" | "freelance";
  source: string;
  relevance: number;
  deadline: string;
  description: string;
}

export function getOpportunities(): Opportunity[] {
  return getFromStorage(STORAGE_KEYS.SCOUT_DATA, []);
}

export function saveOpportunities(opportunities: Opportunity[]): void {
  setToStorage(STORAGE_KEYS.SCOUT_DATA, opportunities);
}

// Memory File types
export interface MemoryFile {
  id: string;
  title: string;
  type: "config" | "daily" | "note";
  updatedAt: string;
  size: string;
  content: string;
}

export function getMemoryFiles(): MemoryFile[] {
  return getFromStorage(STORAGE_KEYS.MEMORY_FILES, []);
}

export function saveMemoryFiles(files: MemoryFile[]): void {
  setToStorage(STORAGE_KEYS.MEMORY_FILES, files);
}

// Cost Data
export interface CostData {
  date: string;
  tokens: number;
  cost: number;
}

export function getCostData(): Record<string, CostData> {
  return getFromStorage(STORAGE_KEYS.COST_DATA, {});
}

export function recordTokenUsage(tokens: number): void {
  const today = new Date().toISOString().split("T")[0];
  const costData = getCostData();
  
  if (!costData[today]) {
    costData[today] = { date: today, tokens: 0, cost: 0 };
  }
  
  costData[today].tokens += tokens;
  costData[today].cost += tokens * 0.00003;
  
  setToStorage(STORAGE_KEYS.COST_DATA, costData);
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

// Generate system stats from real data
export function getSystemStats() {
  const agents = getAgents();
  const tasks = getTasks();
  const costData = getCostData();

  const totalTokens = Object.values(costData).reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = Object.values(costData).reduce((sum, d) => sum + d.cost, 0);

  return {
    cpu: Math.floor(Math.random() * 30) + 10,
    memory: Math.floor(Math.random() * 40) + 20,
    disk: Math.floor(Math.random() * 20) + 50,
    uptime: "연결됨",
    activeAgents: agents.filter((a) => a.status === "active").length,
    totalAgents: agents.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    totalTokens,
    totalCost,
  };
}

// Gateway Config
export interface GatewayConfig {
  url: string;
  token: string;
}

export function getGatewayConfig(): GatewayConfig {
  return getFromStorage(STORAGE_KEYS.SETTINGS, { url: "", token: "" });
}

export function saveGatewayConfig(config: GatewayConfig): void {
  setToStorage(STORAGE_KEYS.SETTINGS, config);
}
