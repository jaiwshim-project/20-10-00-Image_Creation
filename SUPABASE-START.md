# 🚀 Supabase 연결 완벽 가이드 (5분)

## 📋 현재 상태

✅ **완료된 작업:**
- Supabase SDK 통합 (index.html, themes.html)
- API 엔드포인트 추가 (server.js)
- 데이터 저장 함수 작성
- 환경 변수 설정 구조 완성

❌ **필요한 단계:**
1. Supabase 프로젝트 생성
2. API 키 설정
3. 테이블 생성
4. .env 파일 수정
5. 서버 재시작

---

## 🎯 Step 1: Supabase 프로젝트 생성 (2분)

### 1-1. 계정 가입
```
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 또는 이메일로 가입
```

### 1-2. 새 프로젝트 생성
```
프로젝트명: ai-visual-studio
비밀번호: [안전한 비밀번호 입력]
지역: Asia-Seoul
→ "Create new project" 클릭 (1분 대기)
```

### 1-3. API 키 확인
```
1. 프로젝트 대시보드 → Settings (좌측)
2. API 탭 클릭
3. 다음 두 가지 복사:
   
   ✅ Project URL
   예: https://abc123def456.supabase.co
   
   ✅ anon public key
   예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Step 2: .env 파일 수정 (1분)

파일: `C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼\.env`

**수정 전:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**수정 후 (예시):**
```env
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjI0OTk5OTk5LCJleHAiOjE5ODA2Nzk5OTl9...
```

> ⚠️ 중요: 따옴표를 제거하고 값만 입력하세요!

---

## 📊 Step 3: 데이터베이스 테이블 생성 (1분)

### 3-1. SQL Editor 열기
```
Supabase 대시보드 → SQL Editor (좌측) → "+ New Query"
```

### 3-2. SQL 실행
**다음 SQL을 복사해서 실행:**

```sql
-- 생성 기록 테이블
CREATE TABLE IF NOT EXISTS generations (
  id BIGSERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  industry TEXT NOT NULL,
  template TEXT NOT NULL,
  contact TEXT NOT NULL,
  forbidden_words TEXT,
  material_preview TEXT,
  logo_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 생성된 이미지 테이블
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  generation_id BIGINT REFERENCES generations(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커스텀 테마 테이블
CREATE TABLE IF NOT EXISTS custom_themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 방법:**
```
1. SQL 전체 복사
2. SQL Editor에 붙여넣기
3. "RUN" 버튼 클릭
4. 성공 메시지 확인
```

---

## 🚀 Step 4: 서버 시작 (1분)

**PowerShell 실행:**

```powershell
cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
node server.js
```

**성공 메시지:**
```
🚀 AI Visual Theme Studio 서버 시작됨
📍 주소: http://localhost:3000
```

---

## ✅ Step 5: 테스트 (1분)

### 5-1. 브라우저 접속
```
http://localhost:3000
```

### 5-2. 콘솔 확인
```
F12 → Console 탭 → 다음 메시지 확인:
✅ Supabase 초기화 완료
✅ Supabase 연결 테스트 성공
```

### 5-3. 이미지 생성 & 저장 테스트
```
1. Step 1-6 모든 항목 입력
2. "✨ 프로모션 이미지 생성" 클릭
3. Console에서 "✅ Supabase에 저장됨 (ID: xxx)" 확인
```

### 5-4. Supabase 데이터 확인
```
Supabase 대시보드 → Table Editor
→ generations 테이블 → 데이터 확인
```

---

## 📊 저장되는 데이터

### generations 테이블
| 항목 | 저장 내용 |
|------|---------|
| subject | "2026년 봄 신상품 출시" |
| industry | "tech" |
| template | "template1" |
| contact | "contact@company.com" |
| forbidden_words | "전단, 스팸" |
| material_preview | "에바셀2.png" |
| logo_preview | "logo.png" |

### custom_themes 테이블 (themes.html)
| 항목 | 저장 내용 |
|------|---------|
| name | "시원한 파란색" |
| description | "밝고 신뢰감 있는 테마" |
| color | "#2563eb" |

---

## 🎯 각 페이지의 Supabase 기능

### 📄 index.html (이미지 생성)
```
✅ 이미지 생성 완료 시 자동 저장
✅ 생성 기록 저장 (subject, industry 등)
✅ 이미지 정보 저장
```

### 🎨 themes.html (테마 관리)
```
✅ 커스텀 테마 Supabase 저장
✅ 저장된 테마 자동 로드
✅ 테마 추가 시 Supabase 동기화
```

### 📖 guide.html
```
💬 정보 제공만 (데이터 저장 없음)
```

---

## ⚠️ 트러블슈팅

### Q: "Supabase 미연결" 메시지
**A:** .env 파일 확인
```
1. .env 파일이 올바르게 수정되었는지 확인
2. SUPABASE_URL과 SUPABASE_ANON_KEY가 실제 값인지 확인
3. 따옴표 제거했는지 확인
4. 서버 재시작: Ctrl + C → node server.js
```

### Q: "table generations does not exist" 오류
**A:** SQL이 실행되지 않았습니다
```
1. Supabase SQL Editor 다시 접속
2. SQL 전체 복사하기
3. 실행 버튼 클릭
4. 에러 메시지 확인
```

### Q: 데이터가 저장되지 않는다
**A:** 다음을 확인하세요
```
1. F12 Console 탭에서 에러 메시지 확인
2. Supabase 테이블이 생성되었는지 확인
3. API 키가 올바른지 확인
4. 네트워크 요청이 성공했는지 확인 (Network 탭)
```

### Q: "node: command not found"
**A:** Node.js를 설치하세요
```
1. https://nodejs.org → LTS 버전 설치
2. PowerShell 재시작
3. node --version 확인
```

---

## 📝 완성 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] Project URL 복사
- [ ] anon public key 복사
- [ ] .env 파일 수정
- [ ] SQL 테이블 생성
- [ ] 서버 실행 (node server.js)
- [ ] http://localhost:3000 접속
- [ ] 콘솔에서 "Supabase 초기화 완료" 확인
- [ ] 이미지 생성 후 "Supabase에 저장됨" 확인
- [ ] Supabase 테이블에서 데이터 확인

---

## 🎉 완료!

**축하합니다! 이제 모든 데이터가 Supabase 클라우드에 저장됩니다!**

### 지금 할 수 있는 것:
✅ 여러 이미지 생성하고 저장하기
✅ 커스텀 테마 추가하고 Supabase에 저장하기
✅ Supabase 대시보드에서 모든 데이터 조회하기
✅ 다른 기기에서도 같은 데이터 접근하기 (향후 기능)

---

## 🔗 다음 단계 (선택사항)

1. **사용자 인증 추가** - 개인 데이터 보호
2. **Supabase Storage** - 이미지 파일 저장
3. **API 호출 로깅** - 사용 통계 추적
4. **백업 기능** - 정기적 데이터 백업

---

**이제 완전한 클라우드 기반 플랫폼입니다!** ☁️✨
