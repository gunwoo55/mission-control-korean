export interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  skills: string[];
  lastActive: string;
  tokenUsage: number;
  description: string;
}

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

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused" | "error";
  runCount: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  installed: boolean;
}

export const mockAgents: Agent[] = [
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

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "미션 컨트롤 대시보드 개발",
    description: "OpenClaw용 한국어 대시보드 구현",
    status: "in-progress",
    priority: "high",
    assignee: "루루",
    createdAt: "2025-03-04",
    dueDate: "2025-03-06",
  },
  {
    id: "2",
    title: "매경 서포터즈 지원서 작성",
    description: "17기 지원서 초안 작성",
    status: "backlog",
    priority: "high",
    assignee: "건우",
    createdAt: "2025-03-05",
  },
  {
    id: "3",
    title: "월간 보고서 분석",
    description: "2월 경제 데이터 정리",
    status: "review",
    priority: "medium",
    assignee: "리서처",
    createdAt: "2025-03-01",
    dueDate: "2025-03-07",
  },
  {
    id: "4",
    title: "스킬 업데이트",
    description: "새로운 스킬 설치 및 테스트",
    status: "done",
    priority: "low",
    assignee: "코더",
    createdAt: "2025-03-03",
    dueDate: "2025-03-04",
  },
];

export const mockCronJobs: CronJob[] = [
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

export const mockSkills: Skill[] = [
  {
    id: "1",
    name: "web-search",
    description: "웹 검색 및 정보 수집",
    category: "리서치",
    version: "1.2.0",
    installed: true,
  },
  {
    id: "2",
    name: "coding-agent",
    description: "코드 생성 및 리뷰",
    category: "개발",
    version: "2.1.0",
    installed: true,
  },
  {
    id: "3",
    name: "weather",
    description: "날씨 정보 조회",
    category: "유틸리티",
    version: "1.0.0",
    installed: true,
  },
  {
    id: "4",
    name: "discord",
    description: "Discord 메시지 전송",
    category: "메시징",
    version: "1.3.0",
    installed: false,
  },
];

export const tokenUsageData = [
  { date: "3/1", tokens: 45000, cost: 1.2 },
  { date: "3/2", tokens: 52000, cost: 1.4 },
  { date: "3/3", tokens: 38000, cost: 1.0 },
  { date: "3/4", tokens: 61000, cost: 1.6 },
  { date: "3/5", tokens: 45000, cost: 1.2 },
];

export const systemStats = {
  cpu: 23,
  memory: 45,
  disk: 62,
  uptime: "15일 7시간",
  activeAgents: 2,
  totalTasks: 12,
  completedTasks: 8,
};

export const recentActivities = [
  { id: "1", action: "작업 완료", target: "스킬 업데이트", time: "10분 전", agent: "코더" },
  { id: "2", action: "새 작업 생성", target: "미션 컨트롤 개발", time: "1시간 전", agent: "건우" },
  { id: "3", action: "크론 작업 실행", target: "하트비트 체크", time: "30분 전", agent: "시스템" },
  { id: "4", action: "메모리 업데이트", target: "SOUL.md 수정", time: "2시간 전", agent: "루루" },
];
