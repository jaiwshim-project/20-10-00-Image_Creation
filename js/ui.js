/**
 * UI 상호작용 관리
 * DOM 이벤트, 상태 업데이트, 모달, 토스트 등
 */

class UIManager {
    constructor(config) {
        this.config = config;
        this.currentSection = 'create';
        this.currentThemeId = null;
        this.currentLogo = null;
        this.currentLogoBase64 = null;
        this.init();
    }

    init() {
        console.log('🎨 UIManager 초기화 시작...');

        // DOM 상태 진단
        const container = document.getElementById('theme-selection');
        const staticCards = document.querySelectorAll('.theme-selection-card');
        console.log(`📊 DOM 진단:`, {
            컨테이너: !!container,
            정적카드: staticCards.length,
            파일프로토콜: location.protocol === 'file:'
        });

        this.setupEventListeners();
        console.log('✅ 이벤트 리스너 설정 완료');

        this.loadThemes();
        console.log('✅ 테마 로드 완료');

        console.log('🎯 카드 클릭 준비 완료!');
        console.log('💡 아래 카드를 클릭해보세요:');
    }

    setupEventListeners() {
        // 테마 선택 컨테이너 - 이벤트 델리게이션 (버블 단계)
        const themeContainer = document.getElementById('theme-selection');
        console.log('🔧 theme-selection 컨테이너:', themeContainer ? '✅ 찾음' : '❌ 없음');

        if (themeContainer) {
            const delegationHandler = (e) => {
                const card = e.target.closest('.theme-selection-card');
                if (card) {
                    e.stopPropagation();
                    const themeId = card.getAttribute('data-theme-id');
                    const themeName = card.getAttribute('data-theme-name');
                    console.log(`✅ 카드 클릭 감지: ${themeName} (ID: ${themeId})`);
                    this.selectThemeCard(themeId, themeName, card);
                }
            };

            themeContainer.addEventListener('click', delegationHandler);
            console.log('✅ 이벤트 델리게이션 설정 완료 (click)');

            // 터치 기기용 추가
            themeContainer.addEventListener('touchend', delegationHandler);
            console.log('✅ 터치 이벤트 델리게이션 설정 완료 (touchend)');
        }

        // 네비게이션
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // 이미지 생성 섹션 (안전하게 처리)
        const btnGenerate = document.getElementById('btn-generate');
        if (btnGenerate) btnGenerate.addEventListener('click', () => this.handleGenerateImage());

        const btnReset = document.getElementById('btn-reset');
        if (btnReset) btnReset.addEventListener('click', () => this.resetForm());

        const btnDownload = document.getElementById('btn-download');
        if (btnDownload) btnDownload.addEventListener('click', () => this.downloadImage());

        const btnCopyUrl = document.getElementById('btn-copy-url');
        if (btnCopyUrl) btnCopyUrl.addEventListener('click', () => this.copyImageURL());

        const btnRefreshThemes = document.getElementById('btn-refresh-themes');
        if (btnRefreshThemes) btnRefreshThemes.addEventListener('click', () => this.loadThemes());

        // 로고 업로드
        const logoUpload = document.getElementById('logo-upload');
        if (logoUpload) logoUpload.addEventListener('change', (e) => this.handleLogoUpload(e));

        // 테마 관리 섹션
        const btnAddTheme = document.getElementById('btn-add-theme');
        if (btnAddTheme) btnAddTheme.addEventListener('click', () => this.handleAddTheme());

        const themeImageUpload = document.getElementById('theme-image-upload');
        if (themeImageUpload) themeImageUpload.addEventListener('change', (e) => this.handleThemeImageUpload(e));

        // 프롬프트 글자 수 제한
        const promptInput = document.getElementById('prompt');
        if (promptInput) {
            promptInput.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const maxCount = this.config.IMAGE_GENERATION.MAX_PROMPT_LENGTH;
                document.getElementById('char-count').textContent = count;

                if (count > maxCount) {
                    e.target.value = e.target.value.substring(0, maxCount);
                    document.getElementById('char-count').textContent = maxCount;
                }
            });
        }

        // 모달 닫기
        const btnModalClose = document.getElementById('btn-modal-close');
        if (btnModalClose) btnModalClose.addEventListener('click', () => this.closeModal());
    }

    /**
     * 섹션 전환
     * @param {string} section - 섹션 ID
     */
    switchSection(section) {
        document.querySelectorAll('.section').forEach((el) => {
            el.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
        this.currentSection = section;

        if (section === 'themes') {
            this.loadThemes();
        }
    }

    /**
     * 로고 업로드 처리
     * @param {Event} e - 파일 입력 이벤트
     */
    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!this.config.APP.SUPPORTED_FORMATS.includes(file.type)) {
            this.showError(this.config.MESSAGES.ERROR.INVALID_FILE_FORMAT);
            return;
        }

        if (file.size > this.config.APP.MAX_FILE_SIZE) {
            this.showError(this.config.MESSAGES.ERROR.FILE_TOO_LARGE);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            this.currentLogoBase64 = event.target.result;
            this.currentLogo = file;

            // 미리보기 표시
            const preview = document.getElementById('logo-preview');
            const img = document.getElementById('logo-image');
            img.src = event.target.result;
            preview.classList.add('active');

            // 파일명 표시
            document.querySelector('.file-name').textContent = file.name;
        };
        reader.readAsDataURL(file);
    }

    /**
     * 테마 이미지 업로드 처리
     * @param {Event} e - 파일 입력 이벤트
     */
    handleThemeImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!this.config.APP.SUPPORTED_FORMATS.includes(file.type)) {
            this.showError(this.config.MESSAGES.ERROR.INVALID_FILE_FORMAT);
            return;
        }

        if (file.size > this.config.APP.MAX_FILE_SIZE) {
            this.showError(this.config.MESSAGES.ERROR.FILE_TOO_LARGE);
            return;
        }

        document.querySelector('[for="theme-image-upload"] ~ .file-name').textContent = file.name;

        // Base64로 변환하여 저장
        const reader = new FileReader();
        reader.onload = (event) => {
            this.themeImageBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    /**
     * 이미지 생성 처리
     */
    async handleGenerateImage() {
        const themeId = this.currentThemeId;
        const prompt = document.getElementById('prompt').value;

        if (!themeId) {
            this.showError(this.config.MESSAGES.ERROR.THEME_NOT_SELECTED);
            return;
        }

        if (!prompt || prompt.trim().length === 0) {
            this.showError(this.config.MESSAGES.ERROR.EMPTY_PROMPT);
            return;
        }

        if (!this.currentLogoBase64) {
            this.showError(this.config.MESSAGES.ERROR.LOGO_NOT_UPLOADED);
            return;
        }

        try {
            this.showProgress(true);
            this.updateProgressText(this.config.MESSAGES.INFO.GENERATING);

            // 이미지 생성
            const imageUrl = await api.generateImage(prompt);
            this.updateProgressBar(50);
            this.updateProgressText('로고를 적용하는 중...');

            // 로고 오버레이
            const finalImageBlob = await api.addLogoToImage(imageUrl, this.currentLogoBase64);
            const finalImageUrl = URL.createObjectURL(finalImageBlob);

            this.updateProgressBar(100);
            this.updateProgressText(this.config.MESSAGES.SUCCESS.IMAGE_GENERATED);

            // 결과 표시
            this.showResult(finalImageUrl, finalImageBlob);

            // 생성 이력 저장
            await api.saveImageHistory({
                theme_id: themeId,
                prompt: prompt,
                image_url: finalImageUrl,
                created_at: new Date().toISOString(),
            });

            setTimeout(() => this.showProgress(false), 1000);
        } catch (error) {
            console.error('Generate image error:', error);
            this.showError(error.message || this.config.MESSAGES.ERROR.API_ERROR);
            this.showProgress(false);
        }
    }

    /**
     * 이미지 다운로드
     */
    downloadImage() {
        const img = document.getElementById('result-image');
        if (!img.src) return;

        const link = document.createElement('a');
        link.href = img.src;
        link.download = `image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSuccess(this.config.MESSAGES.SUCCESS.DOWNLOADED);
    }

    /**
     * 이미지 URL 복사
     */
    copyImageURL() {
        const img = document.getElementById('result-image');
        if (!img.src) return;

        navigator.clipboard.writeText(img.src).then(() => {
            this.showSuccess(this.config.MESSAGES.SUCCESS.COPIED);
        }).catch((error) => {
            console.error('Copy URL error:', error);
            this.showError('URL 복사에 실패했습니다.');
        });
    }

    /**
     * 테마 목록 로드
     */
    async loadThemes() {
        try {
            console.log('📥 테마 로드 시작...');
            const themes = await api.getThemes();
            console.log('✅ 테마 로드 완료:', themes.length, '개');

            // 카드 그리드에 표시 (선택 화면)
            this.renderThemeSelectionCards(themes);
            console.log('✅ 테마 카드 렌더링 완료');

            // 관리 페이지용 그리드도 표시
            if (this.currentSection === 'themes') {
                this.renderThemesGrid(themes);
            }
        } catch (error) {
            console.error('❌ 테마 로드 에러:', error);
            this.showError(this.config.MESSAGES.ERROR.API_ERROR);
        }
    }

    /**
     * 테마 선택 카드 렌더링 (메인 페이지)
     * @param {Array} themes - 테마 배열
     */
    renderThemeSelectionCards(themes) {
        const container = document.getElementById('theme-selection');
        console.log('🎨 테마 카드 렌더링...');
        console.log('🔍 컨테이너 찾음:', !!container);

        if (!container) {
            console.error('❌ theme-selection 컨테이너를 찾을 수 없습니다!');
            return;
        }

        // 이미 렌더링된 정적 카드가 있으면 동적 추가는 하지 않음
        const existingCards = container.querySelectorAll('.theme-selection-card');
        if (existingCards.length > 0) {
            console.log('✅ 정적 테마 카드 발견:', existingCards.length, '개');
            console.log('💡 이벤트 델리게이션을 사용하므로 추가 이벤트 바인딩 불필요');
            return;
        }

        // 동적으로 카드 추가 (로컬 모드 아님, 동적 로드 시)
        container.innerHTML = themes
            .map(
                (theme) => `
            <div class="theme-selection-card" data-theme-id="${theme.id}" data-theme-name="${theme.name}" style="cursor: pointer;">
                <div class="emoji">${theme.emoji}</div>
                <div class="name">${theme.name}</div>
                <div class="description">${theme.description}</div>
            </div>
        `
            )
            .join('');
        console.log('✅ 카드 HTML 렌더링 완료:', themes.length, '개');
        console.log('💡 이벤트 델리게이션을 사용하므로 개별 이벤트 바인딩 불필요');
    }

    /**
     * 테마 그리드 렌더링
     * @param {Array} themes - 테마 배열
     */
    renderThemesGrid(themes) {
        const grid = document.getElementById('themes-grid');
        grid.innerHTML = themes
            .map(
                (theme) => `
            <div class="theme-card">
                <img src="${theme.image_url}" alt="${theme.name}">
                <div class="theme-card-content">
                    <h4>${theme.name}</h4>
                    <p>${theme.description}</p>
                    <button class="btn btn-primary" onclick="ui.selectTheme('${theme.id}')">
                        🎨 선택
                    </button>
                </div>
            </div>
        `
            )
            .join('');
    }

    /**
     * 테마 카드 선택 (메인 페이지)
     * @param {string} themeId - 테마 ID
     * @param {string} themeName - 테마 이름
     * @param {HTMLElement} cardElement - 카드 엘리먼트
     */
    selectThemeCard(themeId, themeName, cardElement) {
        // 이전 선택 제거
        document.querySelectorAll('.theme-selection-card').forEach((card) => {
            card.classList.remove('selected');
        });

        // 현재 카드 선택 표시
        cardElement.classList.add('selected');

        // 테마 ID 저장
        this.currentThemeId = themeId;

        // 선택된 테마명 표시
        document.getElementById('selected-theme-name').textContent = `✅ "${themeName}" 테마 선택됨`;

        // 프롬프트 입력 영역 표시
        document.getElementById('prompt-container').style.display = 'block';

        // 스크롤
        setTimeout(() => {
            document.getElementById('prompt-container').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }

    /**
     * 테마 선택 (관리 페이지)
     * @param {string} themeId - 테마 ID
     */
    selectTheme(themeId) {
        document.getElementById('theme-select').value = themeId;
        this.switchSection('create');
        document.getElementById('theme-select').focus();
    }

    /**
     * 테마 추가 처리
     */
    async handleAddTheme() {
        const themeName = document.getElementById('theme-name').value;
        const themeDescription = document.getElementById('theme-description').value;

        if (!themeName || !themeDescription || !this.themeImageBase64) {
            this.showError('모든 필드를 입력해주세요.');
            return;
        }

        try {
            this.showProgress(true);
            this.updateProgressText('테마를 추가하는 중...');

            const themeData = {
                id: `theme_${Date.now()}`,
                name: themeName,
                description: themeDescription,
                image_url: this.themeImageBase64,
                structure: 'custom',
                colors: [],
                created_at: new Date().toISOString(),
            };

            await api.addTheme(themeData);
            this.updateProgressBar(100);
            this.updateProgressText(this.config.MESSAGES.SUCCESS.THEME_ADDED);

            // 폼 초기화 및 테마 목록 새로고침
            setTimeout(() => {
                this.resetThemeForm();
                this.loadThemes();
                this.showProgress(false);
                this.showSuccess(this.config.MESSAGES.SUCCESS.THEME_ADDED);
            }, 500);
        } catch (error) {
            console.error('Add theme error:', error);
            this.showError(this.config.MESSAGES.ERROR.API_ERROR);
            this.showProgress(false);
        }
    }

    /**
     * 폼 리셋
     */
    resetForm() {
        // 테마 카드 선택 초기화
        document.querySelectorAll('.theme-selection-card').forEach((card) => {
            card.classList.remove('selected');
        });
        this.currentThemeId = null;
        document.getElementById('prompt-container').style.display = 'none';

        // 폼 초기화
        document.getElementById('prompt').value = '';
        document.getElementById('char-count').textContent = '0';
        document.getElementById('logo-upload').value = '';
        document.getElementById('logo-preview').classList.remove('active');
        document.querySelector('.file-name').textContent = '파일을 선택해주세요';

        // 상태 초기화
        this.currentLogo = null;
        this.currentLogoBase64 = null;
        this.showResult(null);

        // 맨 위로 스크롤
        setTimeout(() => {
            document.getElementById('theme-selection').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    /**
     * 테마 폼 리셋
     */
    resetThemeForm() {
        document.getElementById('theme-name').value = '';
        document.getElementById('theme-description').value = '';
        document.getElementById('theme-image-upload').value = '';
        document.querySelector('[for="theme-image-upload"] ~ .file-name').textContent = '파일을 선택해주세요';
        this.themeImageBase64 = null;
    }

    /**
     * 결과 표시
     * @param {string} imageUrl - 이미지 URL
     * @param {Blob} imageBlob - 이미지 Blob
     */
    showResult(imageUrl, imageBlob = null) {
        const resultContainer = document.getElementById('result-container');
        if (!imageUrl) {
            resultContainer.classList.remove('active');
            return;
        }

        document.getElementById('result-image').src = imageUrl;
        this.currentImageBlob = imageBlob;
        resultContainer.classList.add('active');
    }

    /**
     * 진행 상황 표시 토글
     * @param {boolean} show - 표시 여부
     */
    showProgress(show) {
        const container = document.getElementById('progress-container');
        if (show) {
            container.classList.add('active');
            this.updateProgressBar(0);
        } else {
            container.classList.remove('active');
        }
    }

    /**
     * 진행률 업데이트
     * @param {number} percentage - 퍼센트
     */
    updateProgressBar(percentage) {
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    /**
     * 진행 텍스트 업데이트
     * @param {string} text - 텍스트
     */
    updateProgressText(text) {
        document.getElementById('progress-text').textContent = text;
    }

    /**
     * 성공 메시지 표시
     * @param {string} message - 메시지
     */
    showSuccess(message) {
        this.showModal(message, 'success');
    }

    /**
     * 오류 메시지 표시
     * @param {string} message - 메시지
     */
    showError(message) {
        this.showModal(message, 'error');
    }

    /**
     * 모달 표시
     * @param {string} message - 메시지
     * @param {string} type - 메시지 유형 (success, error, info)
     */
    showModal(message, type = 'info') {
        const modal = document.getElementById('modal');
        const messageEl = document.getElementById('modal-message');

        messageEl.textContent = message;
        messageEl.className = type;

        modal.classList.add('active');
    }

    /**
     * 모달 닫기
     */
    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }
}

// 글로벌 인스턴스 (DOM 로드 후 생성)
let ui = null;

// Export (Node.js/Webpack)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager };
}
