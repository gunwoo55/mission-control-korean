# OpenClaw 외부 접속 설정 가이드

## 방법 1: ngrok 사용 (추천 - 물론)

### 1. ngrok 설치

```bash
# macOS
brew install ngrok

# Linux
sudo snap install ngrok

# 또는 공식 사이트에서 다운로드
# https://ngrok.com/download
```

### 2. ngrok 계정 생성 및 토큰 설정

1. https://ngrok.com 에서 가입
2. Dashboard에서 Authtoken 복사
3. 터미널에서 실행:

```bash
ngrok config add-authtoken YOUR_TOKEN
```

### 3. OpenClaw 게이트웨이 터널링

```bash
# 1. OpenClaw 게이트웨이가 실행 중인지 확인
openclaw gateway status

# 2. ngrok으로 터널 생성 (포트 18789)
ngrok http 18789

# 3. 출력된 HTTPS URL 복사 (예: https://abc123.ngrok.io)
```

### 4. Mission Control에 설정

1. 대시보드 접속: https://gunwoo55.github.io/mission-control-korean/
2. 설정 페이지로 이동
3. OpenClaw 게이트웨이 연결 섹션에 입력:
   - **URL**: `wss://abc123.ngrok.io` (ngrok에서 받은 URL, `https`를 `wss`로 변경)
   - **토큰**: `~/.openclaw/openclaw.json` 파일에서 `gateway.token` 값 확인
4. "연결 저장 & 테스트" 클릭

### 5. 주의사항

- **ngrok 물론 계정**: URL이 변경됨 (매번 새로 입력 필요)
- **ngrok 유료 계정**: 고정 subdomain 사용 가능
- **터널 유지**: ngrok 터미널을 닫으면 연결 끊김

---

## 방법 2: Tailscale 사용 (가장 안전)

### 1. Tailscale 설치

```bash
# macOS
brew install tailscale

# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh
```

### 2. Tailscale 로그인

```bash
sudo tailscale up
```

브라우저에서 인증 완료

### 3. OpenClaw 게이트웨이에 Tailscale IP 바인딩

```bash
# Tailscale IP 확인
tailscale ip -4

# OpenClaw 설정 수정
# ~/.openclaw/openclaw.json 에서 gateway.bind를 0.0.0.0 또는 Tailscale IP로 변경
```

### 4. Mission Control 설정

- URL: `ws://YOUR_TAILSCALE_IP:18789`
- 토큰: 기존과 동일

---

## 방법 3: 클라우드 VPS 배포 (가장 안정적)

### 1. VPS 준비 (AWS, GCP, Azure, DigitalOcean 등)

### 2. OpenClaw 설치

```bash
npm install -g openclaw
openclaw gateway start
```

### 3. 방화벽 설정

포트 18789 오픈

### 4. Mission Control 설정

- URL: `ws://YOUR_VPS_IP:18789`
- 토큰: 설정한 토큰 값

---

## 문제 해결

### CORS 오류 발생 시

OpenClaw 게이트웨이의 CORS 설정 필요:

```json
// ~/.openclaw/openclaw.json
{
  "gateway": {
    "cors": {
      "origin": ["https://gunwoo55.github.io"],
      "credentials": true
    }
  }
}
```

### 연결 테스트 실패

```bash
# 게이트웨이 상태 확인
openclaw gateway status

# 포트 확인
lsof -i :18789

# ngrok 로그 확인
ngrok http 18789 --log=stdout
```

---

## 요약

| 방법 | 난이도 | 비용 | 안정성 |
|------|--------|------|--------|
| ngrok 물론 | 쉬움 | 물론 | 낮음 (URL 변경) |
| ngrok 유료 | 쉬움 | $5/월 | 높음 |
| Tailscale | 중간 | 물론 | 높음 |
| VPS | 어려움 | $5+/월 | 매우 높음 |

**추천**: 테스트용 → ngrok 물론, 장기 사용 → Tailscale 또는 VPS
