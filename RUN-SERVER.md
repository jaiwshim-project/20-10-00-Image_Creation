# 🚀 로컬 웹 서버 실행 가이드

## ⚠️ 배경 이미지 로드 실패 원인

file:// 프로토콜 사용 시 **CORS 보안 정책**으로 인해 Image 객체가 data URL을 로드할 수 없습니다.

```
❌ Unsafe attempt to load URL
'file:' URLs are treated as unique security origins.
```

## ✅ 해결책: 로컬 웹 서버 사용

### 방법 1️⃣ : Node.js 서버 (권장)

**필수 요구사항:**
- Node.js 설치 ([nodejs.org](https://nodejs.org))

**실행 단계:**

1️⃣ **PowerShell 열기**
   - Windows 검색에서 "PowerShell" 검색
   - 또는 Windows + X → PowerShell 클릭

2️⃣ **프로젝트 폴더로 이동**
   ```powershell
   cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
   ```

3️⃣ **서버 시작**
   ```powershell
   node server.js
   ```

4️⃣ **결과**
   ```
   🚀 AI Visual Theme Studio 서버 시작됨
   📍 주소: http://localhost:3000
   ```

5️⃣ **브라우저 열기**
   - 주소창에 `http://localhost:3000` 입력
   - 또는 Ctrl를 누르고 PowerShell 메시지의 링크 클릭

---

### 방법 2️⃣ : Python 간단 서버 (Node.js 없을 때)

**필수 요구사항:**
- Python 3 설치 ([python.org](https://www.python.org))

**실행:**
```powershell
cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
python -m http.server 3000
```

또는 Python 2:
```powershell
python -m SimpleHTTPServer 3000
```

---

### 방법 3️⃣ : VS Code 내장 서버

**필수 요구사항:**
- VS Code 설치
- "Live Server" 확장 설치

**실행:**
1. VS Code에서 폴더 열기
2. index.html 우클릭 → "Open with Live Server"
3. 자동으로 `http://localhost:5500` 열림

---

## 🔧 트러블슈팅

### Q: "node: command not found" 오류
**A:** Node.js가 설치되지 않았습니다.
```powershell
# Node.js 설치 확인
node --version

# 설치 안 되어 있으면 다운로드
# https://nodejs.org → LTS 버전 설치 → PowerShell 재시작
```

### Q: "포트 3000이 이미 사용 중" 오류
**A:** 다른 프로그램이 포트 3000을 사용 중입니다.

**해결책 1: 다른 포트 사용**
```powershell
# server.js 편집
# const PORT = 3000; → const PORT = 3001;

node server.js  # http://localhost:3001로 접속
```

**해결책 2: 기존 프로세스 종료**
```powershell
# 포트 3000 사용 중인 프로세스 찾기
netstat -ano | findstr :3000

# PID를 이용해 프로세스 종료
# taskkill /PID [PID] /F
```

### Q: "Cannot find module 'http'" 오류
**A:** Node.js 설치 경로 문제입니다. Node.js를 재설치하세요.

### Q: 접속했는데 이미지가 여전히 안 보인다
**A:** 브라우저 캐시 문제입니다.
```
1. Ctrl + Shift + Delete → 캐시 삭제
2. 또는 Ctrl + F5 강력 새로고침
```

---

## 📊 서버 상태 확인

### 서버가 정상 실행 중인지 확인
```
http://localhost:3000 접속
→ index.html 페이지 로드되면 ✅ 성공
```

### 콘솔 로그 확인
```powershell
# PowerShell에서 다음과 같이 표시되면 정상:
# 🚀 AI Visual Theme Studio 서버 시작됨
# 📍 주소: http://localhost:3000
```

---

## 🎯 이제 바로 테스트하기

1. **서버 실행**
   ```powershell
   cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
   node server.js
   ```

2. **브라우저에서 접속**
   ```
   http://localhost:3000
   ```

3. **이미지 생성 테스트**
   - Step 1-6 입력
   - "✨ 프로모션 이미지 생성" 클릭
   - F12 Console에서 진행 상황 확인
   - 5가지 컬러 이미지 자동 생성 확인

---

## 🔗 추가 정보

| 항목 | 설명 |
|------|------|
| **포트** | 기본값 3000 (필요시 변경 가능) |
| **주소** | http://localhost:3000 |
| **중단** | PowerShell에서 Ctrl + C |
| **캐시 무효화** | 브라우저 Ctrl + F5 |
| **개발자 도구** | F12 또는 Ctrl + Shift + I |

---

## 💡 최고의 설정

```
포트: 3000 (기본)
주소: http://localhost:3000
서버: Node.js (server.js)
브라우저: Chrome, Firefox, Edge (모두 지원)
```

---

**🎉 이제 배경 이미지 로드 문제가 완전히 해결됩니다!**

서버를 실행한 후 다시 테스트해보세요. 모든 기능이 정상 작동할 것입니다.
