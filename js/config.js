/**
 * 설정 파일
 * API 키, URL, 상수값 등을 관리
 */

const CONFIG = {
    // 테스트 모드 (로컬 실행) - file:// 프로토콜에서 완벽하게 작동
    TEST_MODE: true,
    IS_LOCAL_FILE: location.protocol === 'file:',

    // API 설정
    API: {
        // 백엔드 서버 (로컬: localhost:3000, npm start 또는 start-server.bat 사용)
        BACKEND_URL: 'http://localhost:3000',

        // OpenAI GPT Image2
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-xxxxxxxxxxxxxxxxxxxxx',
        OPENAI_BASE_URL: 'https://api.openai.com/v1',
        IMAGE_MODEL: 'dall-e-3',

        // Vercel API (배포 상태 확인용)
        VERCEL_API_TOKEN: process.env.VERCEL_TOKEN || '',
        VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || '',
    },

    // 앱 설정
    APP: {
        VERSION: '1.0.0',
        NAME: 'AI Visual Theme Studio',
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },

    // 이미지 생성 설정
    IMAGE_GENERATION: {
        MAX_PROMPT_LENGTH: 2000,
        TIMEOUT: 60000, // 60초
        DEFAULT_SIZE: '1024x1024',
        SIZES: ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'],
        QUALITY: 'hd',
        STYLE: 'natural',
    },

    // DB 설정 (Supabase)
    DATABASE: {
        SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
        TABLES: {
            THEMES: 'image_themes',
            IMAGES: 'generated_images',
            LOGOS: 'uploaded_logos',
        },
    },

    // 저장소 설정
    STORAGE: {
        LOCAL_STORAGE_PREFIX: 'avts_',
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24시간
    },

    // 메시지
    MESSAGES: {
        SUCCESS: {
            IMAGE_GENERATED: '✨ 이미지가 성공적으로 생성되었습니다!',
            THEME_ADDED: '✅ 테마가 추가되었습니다!',
            COPIED: '🔗 URL이 복사되었습니다!',
            DOWNLOADED: '⬇️ 이미지가 다운로드 시작되었습니다!',
        },
        ERROR: {
            API_ERROR: '❌ API 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            FILE_TOO_LARGE: '파일이 5MB를 초과합니다.',
            INVALID_FILE_FORMAT: '지원하지 않는 파일 형식입니다.',
            EMPTY_PROMPT: '프롬프트를 입력해주세요.',
            THEME_NOT_SELECTED: '테마를 선택해주세요.',
            LOGO_NOT_UPLOADED: '로고를 업로드해주세요.',
            NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
            UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
        },
        INFO: {
            LOADING: '로딩 중...',
            GENERATING: '이미지를 생성하고 있습니다...',
            PROCESSING: '처리 중...',
            PREPARING: '준비 중...',
        },
    },

    // UI 설정
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        MODAL_DURATION: 200,
    },

    // 산업분야별 테마 (15가지)
    DEFAULT_THEMES: [
        {
            id: 'theme_tech_innovation',
            emoji: '💻',
            name: '기술/IT',
            description: '디지털 혁신과 기술 솔루션',
            structure: 'tech',
            colors: ['#2563eb', '#1e40af', '#93c5fd'],
        },
        {
            id: 'theme_finance_banking',
            emoji: '💰',
            name: '금융/뱅킹',
            description: '신뢰와 안정의 금융 서비스',
            structure: 'finance',
            colors: ['#7c3aed', '#6d28d9', '#ddd6fe'],
        },
        {
            id: 'theme_healthcare_medical',
            emoji: '🏥',
            name: '의료/헬스',
            description: '건강과 웰빙 솔루션',
            structure: 'medical',
            colors: ['#dc2626', '#991b1b', '#fecaca'],
        },
        {
            id: 'theme_education_learning',
            emoji: '📚',
            name: '교육/학습',
            description: '혁신적인 교육 플랫폼',
            structure: 'education',
            colors: ['#16a34a', '#15803d', '#86efac'],
        },
        {
            id: 'theme_realestate_property',
            emoji: '🏠',
            name: '부동산',
            description: '프리미엄 부동산 솔루션',
            structure: 'realestate',
            colors: ['#ea580c', '#c2410c', '#fed7aa'],
        },
        {
            id: 'theme_food_beverage',
            emoji: '🍽️',
            name: '음식/음료',
            description: '맛과 즐거움의 경험',
            structure: 'food',
            colors: ['#f43f5e', '#d1324f', '#fbcfe8'],
        },
        {
            id: 'theme_fashion_retail',
            emoji: '👗',
            name: '패션/소매',
            description: '스타일과 트렌드의 중심',
            structure: 'fashion',
            colors: ['#9333ea', '#7e22ce', '#e9d5ff'],
        },
        {
            id: 'theme_travel_tourism',
            emoji: '✈️',
            name: '여행/관광',
            description: '세계 여행의 모든 것',
            structure: 'travel',
            colors: ['#0891b2', '#0e7490', '#a5f3fc'],
        },
        {
            id: 'theme_automotive',
            emoji: '🚗',
            name: '자동차',
            description: '혁신적인 자동차 기술',
            structure: 'automotive',
            colors: ['#1f2937', '#374151', '#d1d5db'],
        },
        {
            id: 'theme_energy_sustainability',
            emoji: '⚡',
            name: '에너지/환경',
            description: '지속가능한 미래 에너지',
            structure: 'energy',
            colors: ['#65a30d', '#4b5320', '#d4fc79'],
        },
        {
            id: 'theme_manufacturing_industry',
            emoji: '🏭',
            name: '제조/산업',
            description: '산업용 솔루션과 기계',
            structure: 'manufacturing',
            colors: ['#475569', '#64748b', '#cbd5e1'],
        },
        {
            id: 'theme_ecommerce_shopping',
            emoji: '🛍️',
            name: '전자상거래',
            description: '온라인 쇼핑의 새로운 경험',
            structure: 'ecommerce',
            colors: ['#ec4899', '#be185d', '#fbcfe8'],
        },
        {
            id: 'theme_consulting_business',
            emoji: '💼',
            name: '컨설팅',
            description: '전문적인 비즈니스 솔루션',
            structure: 'consulting',
            colors: ['#0d9488', '#0f766e', '#ccfbf1'],
        },
        {
            id: 'theme_entertainment_media',
            emoji: '🎬',
            name: '엔터테인먼트',
            description: '창의적인 미디어 콘텐츠',
            structure: 'entertainment',
            colors: ['#8b5cf6', '#7c3aed', '#ede9fe'],
        },
        {
            id: 'theme_sustainability_green',
            emoji: '🌱',
            name: '지속가능성',
            description: '녹색 미래를 위한 혁신',
            structure: 'sustainability',
            colors: ['#059669', '#047857', '#a7f3d0'],
        },
    ],
};

// 환경 변수 로드
function loadEnvVars() {
    if (typeof process !== 'undefined' && process.env) {
        CONFIG.API.OPENAI_API_KEY = process.env.OPENAI_API_KEY || CONFIG.API.OPENAI_API_KEY;
        CONFIG.API.VERCEL_API_TOKEN = process.env.VERCEL_TOKEN || CONFIG.API.VERCEL_API_TOKEN;
        CONFIG.DATABASE.SUPABASE_URL = process.env.SUPABASE_URL || CONFIG.DATABASE.SUPABASE_URL;
        CONFIG.DATABASE.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || CONFIG.DATABASE.SUPABASE_ANON_KEY;
    }
}

// 초기화
loadEnvVars();

// Export (Node.js/Webpack)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
