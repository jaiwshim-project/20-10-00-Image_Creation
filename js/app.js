/**
 * 메인 애플리케이션 로직
 * 초기화, 세션 관리, 상태 관리
 */

class App {
    constructor() {
        this.config = CONFIG;
        this.api = window.api;
        this.ui = window.ui;
        this.sessionKey = `${this.config.STORAGE.LOCAL_STORAGE_PREFIX}session`;
        this.init();
    }

    /**
     * 애플리케이션 초기화
     */
    init() {
        console.log(`🚀 ${this.config.APP.NAME} v${this.config.APP.VERSION} 초기화 중...`);

        // 실행 환경 표시
        if (this.config.IS_LOCAL_FILE) {
            console.log('📁 file:// 프로토콜에서 실행 중 (로컬 파일)');
        } else {
            console.log(`🌐 ${location.protocol}//${location.host} 에서 실행 중`);
        }

        // 세션 확인
        this.checkSession();

        // 환경 변수 확인
        this.checkEnvironment();

        // 서비스 워커 등록 (PWA) - HTTPS/로컬호스트만 지원, file://은 제외
        const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        const isHttps = location.protocol === 'https:';
        if ('serviceWorker' in navigator && (isHttps || isLocalhost) && !this.config.IS_LOCAL_FILE) {
            navigator.serviceWorker.register('sw.js').catch((error) => {
                console.warn('⚠️ Service Worker 등록 실패:', error);
            });
        } else if (this.config.IS_LOCAL_FILE) {
            console.log('ℹ️ file:// 프로토콜: Service Worker 미지원 (정상)');
        }

        // 온라인/오프라인 이벤트
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        console.log('✅ 애플리케이션 초기화 완료!');
    }

    /**
     * 세션 확인
     */
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) {
            this.createSession();
        } else {
            const sessionData = JSON.parse(session);
            if (this.isSessionExpired(sessionData)) {
                this.createSession();
            }
        }
    }

    /**
     * 새 세션 생성
     */
    createSession() {
        const sessionData = {
            id: `sess_${Date.now()}`,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.config.STORAGE.SESSION_TIMEOUT,
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    /**
     * 세션 만료 확인
     * @param {object} sessionData - 세션 데이터
     * @returns {boolean} - 만료 여부
     */
    isSessionExpired(sessionData) {
        return Date.now() > sessionData.expiresAt;
    }

    /**
     * 환경 변수 확인
     */
    checkEnvironment() {
        const warnings = [];

        if (!this.config.API.OPENAI_API_KEY || this.config.API.OPENAI_API_KEY.startsWith('sk-xxx')) {
            warnings.push('⚠️ OpenAI API 키가 설정되지 않았습니다.');
        }

        if (!this.config.DATABASE.SUPABASE_URL || this.config.DATABASE.SUPABASE_URL.includes('your-project')) {
            warnings.push('⚠️ Supabase URL이 설정되지 않았습니다.');
        }

        if (warnings.length > 0) {
            console.warn('환경 설정 경고:');
            warnings.forEach((warning) => console.warn(warning));
        }
    }

    /**
     * 온라인 상태 처리
     */
    handleOnline() {
        console.log('🌐 온라인 상태 복구됨');
        document.body.style.opacity = '1';
    }

    /**
     * 오프라인 상태 처리
     */
    handleOffline() {
        console.log('📵 오프라인 상태 감지됨');
        document.body.style.opacity = '0.7';
    }

    /**
     * 앱 종료
     */
    destroy() {
        console.log('🛑 애플리케이션 종료 중...');
        window.removeEventListener('online', () => this.handleOnline());
        window.removeEventListener('offline', () => this.handleOffline());
    }
}

// 페이지 로드 시 앱 초기화
const initializeApp = () => {
    console.log('🚀 DOMContentLoaded 이벤트 발생');

    // DOM이 준비되었는지 확인
    const themeContainer = document.getElementById('theme-selection');
    const cards = document.querySelectorAll('.theme-selection-card');
    console.log(`📋 DOM 확인: 컨테이너=${!!themeContainer}, 카드=${cards.length}개`);

    console.log('🏗️ APIClient 생성 중...');
    window.api = new APIClient(CONFIG);
    console.log('✅ APIClient 생성 완료');

    console.log('🎨 UIManager 생성 중...');
    window.ui = new UIManager(CONFIG);
    console.log('✅ UIManager 생성 완료');

    console.log('⚙️ App 초기화 중...');
    window.app = new App();
    console.log('✅ 앱 초기화 완료!');
};

// DOMContentLoaded이 이미 발생했거나 진행 중인지 확인
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
    console.log('⏳ DOMContentLoaded 대기 중...');
} else {
    // DOM이 이미 준비됨
    console.log('⚡ DOM 이미 준비됨 - 바로 초기화');
    initializeApp();
}

// 페이지 언로드 시 앱 정리
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});

/**
 * 전역 에러 핸들러
 */
window.addEventListener('error', (event) => {
    console.error('❌ 전역 에러:', event.error);
    if (window.ui) {
        window.ui.showError('애플리케이션 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }
});

/**
 * Promise 거부 핸들러
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ 처리되지 않은 Promise 거부:', event.reason);
    if (window.ui) {
        window.ui.showError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
});
