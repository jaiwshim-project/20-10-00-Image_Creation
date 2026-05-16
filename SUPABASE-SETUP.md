# 🗄️ Supabase 연결 가이드

## 📋 Step 1: Supabase 프로젝트 생성

### 1-1. Supabase 계정 가입
1. [supabase.com](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub 또는 이메일로 가입

### 1-2. 새 프로젝트 생성
1. 대시보드에서 "New Project" 클릭
2. **프로젝트 정보 입력:**
   - Project Name: `ai-visual-studio`
   - Database Password: **안전한 비밀번호 입력** (기억해야 함)
   - Region: `Asia-Seoul` (또는 가장 가까운 지역)
3. "Create new project" 클릭 (약 1분 소요)

### 1-3. API 키 확인
1. 프로젝트 대시보드 접속
2. 좌측 메뉴 → "Settings" → "API"
3. 다음 정보 복사:
   - **Project URL** (예: `https://xxxxxxxxxx.supabase.co`)
   - **anon public** (예: `eyJhbG...`)

---

## 📝 Step 2: 환경 변수 설정

`.env` 파일 수정:

```env
# AI Visual Theme Studio 환경 변수

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbG...

# 앱 설정
NODE_ENV=production
DEBUG=false
```

**실제 예시:**
```env
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗂️ Step 3: 데이터베이스 테이블 생성

### 3-1. Supabase SQL Editor 접속
1. 프로젝트 대시보드 → "SQL Editor" (좌측)
2. "+ New Query" 클릭

### 3-2. 테이블 생성 SQL 실행

다음 SQL을 복사해서 실행:

```sql
-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 생성 기록 테이블
CREATE TABLE IF NOT EXISTS generations (
  id BIGSERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  industry TEXT NOT NULL,
  template TEXT NOT NULL,
  contact TEXT NOT NULL,
  forbidden_words TEXT,
  material_preview TEXT,
  logo_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 생성된 이미지 테이블
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  generation_id BIGINT REFERENCES generations(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  image_data BYTEA,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 커스텀 테마 테이블
CREATE TABLE IF NOT EXISTS custom_themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_generation_id ON images(generation_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_created_at ON custom_themes(created_at DESC);
```

**실행 방법:**
1. 위 SQL 전체 복사
2. SQL Editor에 붙여넣기
3. "RUN" 버튼 클릭
4. 모든 테이블 생성됨 확인

---

## 🔐 Step 4: RLS (Row Level Security) 설정

### 보안을 위한 RLS 정책 (선택사항)

테이블별로 RLS를 활성화하려면:

1. Supabase 대시보드 → "Tables Editor"
2. 각 테이블의 "..." 메뉴 → "Edit RLS"
3. "Enable RLS" 클릭

**권장 정책:**
- `public` 스키마의 모든 테이블 → RLS 비활성화 (익명 사용자 허용)
- 또는 선택적 RLS 활성화

> **참고:** 이 프로젝트는 익명 사용자 기반이므로 RLS 비활성화 권장

---

## 💻 Step 5: 코드 통합 확인

### 5-1. Supabase JS SDK 로드

`index.html`에 다음 추가 (이미 구현됨):

```html
<!-- Supabase 라이브러리 -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 5-2. 환경 변수 로드

Node.js 서버(`server.js`)가 `.env` 파일을 로드해서 클라이언트에 전달합니다.

---

## 🧪 Step 6: 테스트

### 6-1. 로컬 서버 실행

```powershell
cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
node server.js
```

### 6-2. 브라우저에서 테스트

```
http://localhost:3000
```

### 6-3. 이미지 생성 후 확인

1. Step 1-6 모두 입력
2. "✨ 프로모션 이미지 생성" 클릭
3. F12 → Console 탭 → "Supabase 저장 완료" 메시지 확인
4. Supabase 대시보드 → Table Editor → `generations` 테이블에서 데이터 확인

---

## 📊 데이터베이스 스키마

### generations 테이블
```
id           BIGINT PRIMARY KEY
subject      TEXT (주제)
industry     TEXT (산업분야)
template     TEXT (템플릿 선택)
contact      TEXT (연락처)
forbidden_words TEXT (금기어)
material_preview TEXT (배경 이미지 정보)
logo_preview TEXT (로고 정보)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### images 테이블
```
id           BIGINT PRIMARY KEY
generation_id BIGINT (generations.id 참조)
color_name   TEXT (기본 색, 어두운 색 등)
color_hex    TEXT (#2563eb)
image_data   BYTEA (이미지 바이너리)
image_url    TEXT (저장된 URL)
created_at   TIMESTAMP
```

### custom_themes 테이블
```
id           BIGINT PRIMARY KEY
name         TEXT (테마명)
description  TEXT (설명)
color        TEXT (#2563eb)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

---

## 🚀 빠른 시작 (3단계)

1️⃣ **Supabase 프로젝트 생성**
   - [supabase.com](https://supabase.com) → New Project
   - Region: Asia-Seoul
   - 완료 후 API 키 복사

2️⃣ **.env 파일 수정**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3️⃣ **SQL 실행 & 서버 시작**
   ```powershell
   # SQL Editor에서 테이블 생성 SQL 실행
   # 그 다음:
   cd "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
   node server.js
   # http://localhost:3000 접속
   ```

---

## ✅ 확인 체크리스트

- [ ] Supabase 프로젝트 생성됨
- [ ] SUPABASE_URL과 SUPABASE_ANON_KEY 복사됨
- [ ] .env 파일 수정됨
- [ ] SQL Editor에서 테이블 생성 SQL 실행됨
- [ ] Table Editor에서 모든 테이블 확인됨
- [ ] 로컬 서버 실행 중
- [ ] http://localhost:3000 접속 가능
- [ ] 이미지 생성 후 Supabase에 데이터 저장됨 확인

---

## 🎯 다음 단계

1. Supabase 프로젝트 설정 완료 후
2. 본 가이드의 Step 3 SQL 실행
3. .env 파일에 API 키 입력
4. 서버 재시작
5. 이미지 생성 테스트

**모든 데이터가 Supabase에 자동 저장됩니다!** ✨

---

## 📞 트러블슈팅

### Q: "SUPABASE_URL is undefined" 오류
**A:** .env 파일이 로드되지 않았습니다.
1. server.js 재시작
2. 또는 Node.js 환경 변수 설정

### Q: "table generations does not exist" 오류
**A:** SQL이 실행되지 않았습니다.
1. Supabase SQL Editor 다시 접속
2. SQL 전체 복사 → 실행
3. 테이블 생성 완료 확인

### Q: 이미지가 Supabase에 저장되지 않음
**A:** 
1. F12 Console에서 에러 메시지 확인
2. API 키가 올바른지 확인
3. 테이블이 생성되었는지 확인

---

**이제 모든 데이터가 Supabase 클라우드 데이터베이스에 안전하게 저장됩니다!** 🗄️✨
