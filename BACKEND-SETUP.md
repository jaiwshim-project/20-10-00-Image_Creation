# 🚀 백엔드 서버 설정 및 실행 가이드

## 📋 현재 상태

- ✅ OpenAI API 키: 설정됨 (.env 파일)
- ✅ 백엔드 서버: Express (Node.js)
- ✅ 포트: 3001
- ✅ 프론트엔드: 로컬 파일 (file://)

---

## 🚀 빠른 시작 (권장)

### Windows 사용자

**방법 1️⃣: run-server.bat 더블클릭**
```
C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼\run-server.bat
→ 더블클릭
```

**방법 2️⃣: PowerShell에서 실행**
```powershell
cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
npm start
```

**방법 3️⃣: Command Prompt에서 실행**
```cmd
cd C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼
npm start
```

---

## 🧪 테스트 순서

### 1️⃣ 서버 시작
```
npm start
```
✅ 다음 메시지가 나타나면 성공:
```
✅ 서버 실행 중: http://localhost:3001
```

### 2️⃣ 프론트엔드 열기
```
C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼\index.html
→ 더블클릭 (또는 브라우저로 드래그)
```

### 3️⃣ 이미지 생성 테스트

#### 단계별:

1. **테마 선택**
   - 15개 카드 중 하나 선택 (예: 💻 기술/IT)

2. **로고 업로드**
   - Step 2에서 로고 이미지 선택 (JPG, PNG, WebP)
   - 미리보기 확인

3. **프롬프트 입력**
   - Step 3에서 이미지 설명 입력
   - 예: `"클라우드 기술을 표현하는 현대적인 비즈니스 이미지"`
   - 최대 2000자

4. **이미지 생성**
   - `✨ 이미지 생성` 클릭
   - ⏳ 30초~1분 대기 (DALL-E 3 생성 시간)
   - 이미지가 생성되면 자동으로 표시

5. **다운로드 또는 공유**
   - `⬇️ 다운로드`: 이미지 파일로 저장
   - `🔗 URL 복사`: 생성된 이미지 URL 복사

---

## 🔧 API 엔드포인트

### 이미지 생성
```
POST http://localhost:3001/api/generate-image

요청:
{
  "prompt": "이미지 설명",
  "size": "1024x1024",
  "quality": "hd",
  "style": "natural"
}

응답:
{
  "success": true,
  "imageUrl": "https://..."
}
```

### 로고 오버레이
```
POST http://localhost:3001/api/add-logo

요청:
{
  "imageUrl": "https://...",
  "logoBase64": "data:image/png;base64,..."
}

응답:
{
  "success": true,
  "imageData": "data:image/png;base64,..."
}
```

### 히스토리 저장
```
POST http://localhost:3001/api/save-history

요청:
{
  "theme": "기술/IT",
  "prompt": "프롬프트",
  "imageUrl": "https://..."
}

응답:
{
  "success": true,
  "id": "img_1234567890"
}
```

### 히스토리 조회
```
GET http://localhost:3001/api/history

응답:
[
  {
    "id": "img_1234567890",
    "theme": "기술/IT",
    "prompt": "프롬프트",
    "imageUrl": "https://...",
    "createdAt": "2026-05-16T..."
  },
  ...
]
```

### 헬스 체크
```
GET http://localhost:3001/api/health

응답:
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2026-05-16T..."
}
```

---

## ⚠️ 문제 해결

### 문제: "포트 3001이 이미 사용 중입니다"
```
Error: listen EADDRINUSE: address already in use :::3001
```

**해결:**
```powershell
# 포트 3001 사용 프로세스 종료
Get-Process | Where-Object {$_.Name -eq "node"} | Stop-Process -Force

# 서버 다시 시작
npm start
```

### 문제: "npm을 찾을 수 없습니다"
```
'npm' is not recognized as an internal or external command
```

**해결:**
1. Node.js 설치 확인: https://nodejs.org/
2. PowerShell 재시작
3. `npm -v` 확인

### 문제: "OpenAI API 키가 설정되지 않았습니다"
```
❌ OpenAI API 키가 설정되지 않았습니다!
```

**해결:**
1. `.env` 파일 확인
2. `OPENAI_API_KEY=sk-proj-...` 확인
3. 서버 재시작

### 문제: 이미지가 생성되지 않음
**확인 사항:**
- [ ] 서버가 포트 3001에서 실행 중인가? (`npm start` 확인)
- [ ] 프롬프트가 비어있지는 않은가?
- [ ] API 키가 유효한가?
- [ ] 로고 이미지가 선택되었는가? (선택사항)

---

## 🔐 보안 주의

⚠️ **중요: API 키 관리**
- `.env` 파일은 **Git에 커밋하지 마세요**
- `.gitignore`에 이미 포함되어 있습니다
- 배포 전에 API 키를 안전한 환경 변수로 변경하세요

---

## 📝 로그 확인

서버 실행 시 다음과 같은 로그가 나타나야 합니다:

```
🚀 AI Visual Theme Studio 백엔드 서버 시작...
   포트: 3001
   API 키: ✅ 설정됨

═══════════════════════════════════════════════════════
🎨 AI Visual Theme Studio Backend Server
═══════════════════════════════════════════════════════
✅ 서버 실행 중: http://localhost:3001
📝 API 문서:
   - POST /api/generate-image     (이미지 생성)
   - POST /api/add-logo           (로고 오버레이)
   - POST /api/save-history       (히스토리 저장)
   - GET  /api/history            (히스토리 조회)
   - GET  /api/health             (헬스 체크)
═══════════════════════════════════════════════════════
```

---

## 📞 다음 단계

- [ ] 로컬 이미지 생성 테스트 완료
- [ ] Supabase 연동 (선택사항)
- [ ] 사용자 인증 추가 (선택사항)
- [ ] 배포 준비 (Vercel/AWS)

---

**축하합니다! 🎉 이제 로컬에서 실제 DALL-E 3 이미지를 생성할 수 있습니다!**
