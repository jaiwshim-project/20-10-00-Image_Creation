/**
 * API 호출 로직
 * OpenAI, Supabase, 기타 외부 API와의 통신 관리
 */

class APIClient {
    constructor(config) {
        this.config = config;
        this.timeout = this.config.IMAGE_GENERATION.TIMEOUT;
    }

    /**
     * 로컬에서 이미지 생성 (또는 테스트 모드)
     * @param {string} prompt - 이미지 생성 프롬프트
     * @param {object} options - 추가 옵션
     * @returns {Promise<string>} - 생성된 이미지 URL
     */
    async generateImage(prompt, options = {}) {
        const {
            size = this.config.IMAGE_GENERATION.DEFAULT_SIZE,
            quality = this.config.IMAGE_GENERATION.QUALITY,
            style = this.config.IMAGE_GENERATION.STYLE,
        } = options;

        if (!prompt || prompt.trim().length === 0) {
            throw new Error(this.config.MESSAGES.ERROR.EMPTY_PROMPT);
        }

        if (prompt.length > this.config.IMAGE_GENERATION.MAX_PROMPT_LENGTH) {
            throw new Error(`프롬프트는 ${this.config.IMAGE_GENERATION.MAX_PROMPT_LENGTH}자 이하여야 합니다.`);
        }

        // 로컬 모드: 샘플 이미지 생성 (서버 필요 없음)
        console.log('🎨 로컬 모드: 샘플 이미지 생성');
        return new Promise((resolve) => {
            setTimeout(() => {
                // 프롬프트 기반 색상 생성
                const colors = this.generateColorsFromPrompt(prompt);
                const svgImage = this.generateSampleSVG(prompt, colors);
                resolve(svgImage);
            }, 1500);
        });
    }

    /**
     * 프롬프트에서 색상 추출
     */
    generateColorsFromPrompt(prompt) {
        const colorKeywords = {
            '파랑': '#2563eb',
            '빨강': '#dc2626',
            '초록': '#16a34a',
            '노랑': '#fbbf24',
            '보라': '#7c3aed',
            '분홍': '#ec4899',
            '하늘': '#0ea5e9',
            '검정': '#1f2937',
            '흰색': '#ffffff',
        };

        let color1 = '#2563eb';
        let color2 = '#7c3aed';

        for (const [keyword, color] of Object.entries(colorKeywords)) {
            if (prompt.includes(keyword)) {
                color1 = color;
                break;
            }
        }

        return { color1, color2 };
    }

    /**
     * 프롬프트 기반 샘플 SVG 생성
     */
    generateSampleSVG(prompt, colors) {
        const { color1, color2 } = colors;
        const encodedPrompt = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');

        const svg = `
            <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <gradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                    </gradient>
                    <filter id="shadow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    </filter>
                </defs>
                <rect width="1024" height="1024" fill="url(#grad)"/>
                <circle cx="512" cy="350" r="150" fill="rgba(255,255,255,0.3)" filter="url(#shadow)"/>
                <circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.2)"/>
                <circle cx="850" cy="800" r="100" fill="rgba(255,255,255,0.2)"/>
                <text x="512" y="480" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">
                    AI Generated
                </text>
                <text x="512" y="560" font-size="20" fill="rgba(255,255,255,0.9)" text-anchor="middle">
                    ${encodedPrompt}
                </text>
                <text x="512" y="650" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="middle">
                    로컬 샘플 이미지
                </text>
            </svg>
        `;

        const base64 = btoa(svg);
        return `data:image/svg+xml;base64,${base64}`;
    }

    /**
     * 로고 이미지에 로고 오버레이 추가
     * @param {string} imageUrl - 생성된 이미지 URL
     * @param {string} logoBase64 - Base64 인코딩된 로고 이미지
     * @returns {Promise<Blob>} - 로고가 추가된 이미지 Blob
     */
    async addLogoToImage(imageUrl, logoBase64) {
        try {
            // 생성된 이미지 다운로드
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();
            const imageCanvas = await this.blobToCanvas(imageBlob);

            // 로고 이미지 생성
            const logoCanvas = await this.base64ToCanvas(logoBase64);

            // 메인 캔버스에 로고 오버레이
            const ctx = imageCanvas.getContext('2d');
            const padding = 20;
            const logoWidth = 100;
            const logoHeight = (logoCanvas.height / logoCanvas.width) * logoWidth;

            ctx.drawImage(logoCanvas, padding, padding, logoWidth, logoHeight);

            // 결과 Blob 반환
            return new Promise((resolve) => {
                imageCanvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
            });
        } catch (error) {
            console.error('Logo overlay error:', error);
            throw error;
        }
    }

    /**
     * Blob 이미지를 Canvas로 변환
     * @param {Blob} blob - 이미지 Blob
     * @returns {Promise<HTMLCanvasElement>} - Canvas 엘리먼트
     */
    blobToCanvas(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    /**
     * Base64 이미지를 Canvas로 변환
     * @param {string} base64 - Base64 인코딩된 이미지
     * @returns {Promise<HTMLCanvasElement>} - Canvas 엘리먼트
     */
    base64ToCanvas(base64) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            img.onerror = reject;
            img.src = base64;
        });
    }

    /**
     * 테마 목록 조회 (Supabase)
     * @returns {Promise<Array>} - 테마 배열
     */
    async getThemes() {
        try {
            // 로컬에서 기본 테마 반환 (실제로는 Supabase에서 조회)
            return this.config.DEFAULT_THEMES;
        } catch (error) {
            console.error('Get themes error:', error);
            throw error;
        }
    }

    /**
     * 새로운 테마 추가 (Supabase)
     * @param {object} themeData - 테마 데이터
     * @returns {Promise<object>} - 추가된 테마
     */
    async addTheme(themeData) {
        try {
            // Supabase에 데이터 추가
            const response = await fetch(`${this.config.DATABASE.SUPABASE_URL}/rest/v1/${this.config.DATABASE.TABLES.THEMES}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.config.DATABASE.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.config.DATABASE.SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(themeData),
            });

            if (!response.ok) {
                throw new Error(`Failed to add theme: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Add theme error:', error);
            throw error;
        }
    }

    /**
     * 이미지 생성 이력 저장 (Supabase 또는 로컬)
     * @param {object} imageData - 이미지 데이터
     * @returns {Promise<object>} - 저장된 데이터
     */
    async saveImageHistory(imageData) {
        // 테스트 모드: 로컬 저장소에 저장
        if (this.config.TEST_MODE) {
            const history = JSON.parse(localStorage.getItem('image_history') || '[]');
            const record = {
                id: `img_${Date.now()}`,
                ...imageData,
            };
            history.push(record);
            localStorage.setItem('image_history', JSON.stringify(history));
            console.log('📝 이미지 이력 로컬 저장됨');
            return record;
        }

        // 실제 Supabase 저장
        try {
            const response = await fetch(`${this.config.DATABASE.SUPABASE_URL}/rest/v1/${this.config.DATABASE.TABLES.IMAGES}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.config.DATABASE.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.config.DATABASE.SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(imageData),
            });

            if (!response.ok) {
                console.warn('Failed to save image history:', response.statusText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('Save image history error:', error);
            return null;
        }
    }

    /**
     * Vercel 배포 상태 확인
     * @returns {Promise<object>} - 배포 상태
     */
    async getDeploymentStatus() {
        if (!this.config.API.VERCEL_API_TOKEN || !this.config.API.VERCEL_PROJECT_ID) {
            return null;
        }

        try {
            const response = await fetch(
                `https://api.vercel.com/v6/deployments?projectId=${this.config.API.VERCEL_PROJECT_ID}&limit=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.API.VERCEL_API_TOKEN}`,
                    },
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.deployments?.[0] || null;
        } catch (error) {
            console.warn('Deployment status check error:', error);
            return null;
        }
    }
}

// 글로벌 인스턴스 (DOM 로드 후 생성)
let api = null;

// Export (Node.js/Webpack)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient };
}
