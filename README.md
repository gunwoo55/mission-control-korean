# 미션 컨트롤 (Mission Control) - OpenClaw 한국어 대시보드

Alex Finn의 Mission Control을 한국어로 재구현한 Next.js 기반 OpenClaw 관리 대시보드입니다.

## 기능

| 페이지 | 설명 |
|--------|------|
| 대시보드 | 시스템 상태, 토큰 사용량 차트, 활동 피드 |
| 에이전트 | 에이전트 목록 및 관리 |
| 작업 관리 | 드래그앤드롭 칸반 보드 |
| 예약 작업 | 크론 작업 모니터링 |
| 대화 | 에이전트 대화 기록 및 실시간 채팅 |
| 오피스 | 프로젝트 워크스페이스 관리 |
| 스카우트 | AI 기반 기회 발굴 |
| 스킬 | 스킬 관리 |
| 메모리 | MEMORY.md 파일 브라우저 |
| 비용 | 상세 비용 추적 및 분석 |
| 설정 | 테마, 알림, API 설정 |

## 기술 스택

- Next.js 14 + TypeScript
- Tailwind CSS
- React DnD (칸반 드래그앤드롭)
- Recharts (차트)
- Lucide React (아이콘)

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 접속
http://localhost:3000
```

## 파일 구조

```
src/
├── app/
│   ├── page.tsx              # 대시보드
│   ├── agents/page.tsx       # 에이전트 관리
│   ├── tasks/page.tsx        # 작업 관리 (Kanban)
│   ├── cron/page.tsx         # 예약 작업
│   ├── conversations/page.tsx # 대화 기록
│   ├── office/page.tsx       # 오피스/워크스페이스
│   ├── scout/page.tsx        # 스카우트/기회 발굴
│   ├── skills/page.tsx       # 스킬 관리
│   ├── memory/page.tsx       # 메모리 파일
│   ├── cost/page.tsx         # 비용 추적
│   ├── settings/page.tsx     # 설정
│   └── layout.tsx            # 루트 레이아웃
├── components/
│   ├── sidebar.tsx           # 사이드바 네비게이션
│   └── header.tsx            # 상단 헤더
└── lib/
    └── mock-data.ts          # 목업 데이터
```

## 참고

원본 영상: Alex Finn - "OpenClaw is 100x better with this tool (Mission Control)"
