# 🎨 AI Visual Theme Studio

**이미지 테마 기반 자동 생성 플랫폼**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## 📋 개요

AI Visual Theme Studio는 미리 정의된 이미지 테마를 기반으로 고품질의 마케팅 이미지를 자동으로 생성하는 플랫폼입니다.

**핵심 기능:**
- 🎯 테마 기반 이미지 생성 (GPT Image2)
- 🏷️ 로고 자동 삽입 (왼쪽 상단)
- 🎨 무제한 테마 추가 가능
- 📊 생성 이력 관리
- 📱 완전 반응형 디자인

## 🚀 빠른 시작

### 방법 1️⃣: 간단 실행 (권장)

**Windows:**
```bash
# run.bat 파일 더블클릭 또는
run.bat
```

**Mac/Linux:**
```bash
chmod +x run.sh
./run.sh
```

### 방법 2️⃣: 직접 파일로 열기

```bash
# Windows: index.html을 더블클릭
# Mac: index.html을 브라우저로 드래그앤드롭
```

> ✅ **테스트 모드 활성화**: 로컬에서 API 키 없이도 작동합니다!

### 방법 3️⃣: 수동 서버 실행

```bash
# Python 웹 서버 (권장)
python -m http.server 8888

# 또는 Node.js
npx http-server -p 8888
```

브라우저에서 `http://localhost:8888` 열기

### 4. 실제 API 사용 (선택사항)

실제 이미지 생성을 위해 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

`.env` 파일 수정:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

그 후 `js/config.js`에서 `TEST_MODE: false`로 변경

## 📖 사용 방법

### 5단계 이미지 생성

1. **테마 선택** - 드롭다운에서 원하는 스타일 선택
2. **로고 업로드** - 브랜드 로고 이미지 선택 (JPG, PNG 지원)
3. **프롬프트 입력** - 생성할 이미지 상세 설명 (최대 2,000자)
4. **이미지 생성** - "✨ 이미지 생성" 버튼 클릭
5. **다운로드** - 생성된 이미지 다운로드 또는 URL 복사

### 테마 추가

1. "🎨 테마 관리" 탭 선택
2. 테마 이름, 설명, 템플릿 이미지 입력
3. "➕ 테마 추가" 버튼 클릭
4. 추가된 테마는 즉시 드롭다운에 반영

## 🛠️ 기술 스택

| 구성 | 기술 |
|------|------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Image AI** | OpenAI GPT Image2 (DALL-E 3) |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |
| **Design** | Premium White Theme, Responsive |

## 📦 파일 구조

```
40-10-00 홍보 이미지 제작 플랫폼/
├── index.html           # 메인 페이지
├── manual.html          # 사용자 매뉴얼
├── copyright.html       # 저작권 등록 자료
├── patent.html          # 특허명세서
├── css/
│   ├── style.css        # 메인 스타일
│   └── responsive.css   # 반응형 스타일
├── js/
│   ├── config.js        # 설정 및 상수
│   ├── api.js           # API 호출 로직
│   ├── ui.js            # UI 상호작용
│   └── app.js           # 앱 초기화
├── .env.example         # 환경 변수 템플릿
├── .gitignore           # Git 무시 파일
└── README.md            # 이 파일
```

## 🔧 API 설정

### OpenAI API

1. [OpenAI 대시보드](https://platform.openai.com) 접속
2. API 키 발급
3. `.env`에 추가:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
   ```

### Supabase 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. 테이블 생성:
   ```sql
   -- image_themes 테이블
   CREATE TABLE image_themes (
     id VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     description TEXT,
     image_url TEXT,
     structure VARCHAR,
     colors JSON,
     created_at TIMESTAMP
   );

   -- generated_images 테이블
   CREATE TABLE generated_images (
     id SERIAL PRIMARY KEY,
     theme_id VARCHAR,
     prompt TEXT,
     image_url TEXT,
     created_at TIMESTAMP
   );
   ```

## 📊 주요 기능 상세

### 이미지 생성 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| **Size** | 이미지 해상도 | 1024×1024 |
| **Quality** | 이미지 품질 | hd |
| **Style** | 생성 스타일 | natural |

### 지원 이미지 크기

- 256×256 (아이콘, 썸네일)
- 512×512 (SNS 프로필)
- 1024×1024 (표준, 기본)
- 1792×1024 (가로형 배너)
- 1024×1792 (세로형 포스터)

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary** - #2563eb (Blue)
- **Secondary** - #7c3aed (Purple)
- **Accent** - #0d9488 (Teal)
- **Danger** - #dc2626 (Red)
- **Success** - #16a34a (Green)

### Typography

- **Font** - System Font Stack (-apple-system, BlinkMacSystemFont, etc.)
- **Body** - 16px, Line height 1.6
- **Headings** - Bold, Text Gray 900

## 🔐 보안 고려사항

- ✅ API 키는 `.env`에 저장 (git 무시)
- ✅ CORS 설정으로 API 보호
- ✅ 입력값 검증 (파일 크기, 형식)
- ✅ HTTPS 배포 (Vercel)

## 📱 브라우저 지원

| 브라우저 | 지원 |
|---------|------|
| Chrome | ✅ 최신 |
| Firefox | ✅ 최신 |
| Safari | ✅ 최신 |
| Edge | ✅ 최신 |

## 📚 문서

- [사용자 매뉴얼](manual.html) - 상세한 사용 가이드
- [저작권 정보](copyright.html) - 저작권 등록 자료
- [특허명세서](patent.html) - 기술 명세서

## 🤝 기여 방법

```bash
# 1. Fork 후 Clone
git clone https://github.com/yourusername/avts.git

# 2. Feature 브랜치 생성
git checkout -b feature/your-feature

# 3. 변경사항 커밋
git commit -am 'Add new feature'

# 4. 브랜치에 Push
git push origin feature/your-feature

# 5. Pull Request 생성
```

## 📋 라이선스

MIT License © 2026 심재우

## 📧 지원

문제가 발생하거나 제안사항이 있다면:

- 📧 **이메일** - support@example.com
- 🐛 **Issues** - [GitHub Issues](https://github.com/issues)
- 💬 **Discussions** - [GitHub Discussions](https://github.com/discussions)

## 🙏 감사의 말

- OpenAI - GPT Image2 (DALL-E 3) API
- Supabase - PostgreSQL 데이터베이스
- Vercel - 배포 플랫폼

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-16  
**Status:** Production Ready ✅
