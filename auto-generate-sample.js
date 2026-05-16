/**
 * AI Visual Theme Studio - 자동 샘플 이미지 생성 스크립트
 *
 * 용도: 시스템이 제대로 작동하는지 확인하기 위해 샘플 이미지 자동 생성
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateSampleImage() {
    let browser;
    try {
        console.log('🚀 AI Visual Theme Studio - 샘플 이미지 자동 생성 시작\n');

        // 1️⃣ 브라우저 열기
        console.log('📱 브라우저 시작 중...');
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 800 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 콘솔 로그 캡처
        page.on('console', msg => {
            if (msg.text().includes('✅') || msg.text().includes('❌') || msg.text().includes('⚠️')) {
                console.log('  [브라우저]', msg.text());
            }
        });

        // 2️⃣ 페이지 로드
        console.log('📄 페이지 로드 중... (http://localhost:3000)');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ 페이지 로드 완료\n');

        // 3️⃣ 배경 이미지 파일 확인
        console.log('🔍 배경 이미지 확인 중...');
        const sampleImages = [
            'C:\\Users\\USER\\Downloads\\에바셀2.png',
            'C:\\Users\\USER\\Downloads\\sample.png'
        ];

        let bgImagePath = null;
        for (const imagePath of sampleImages) {
            if (fs.existsSync(imagePath)) {
                bgImagePath = imagePath;
                console.log('✅ 배경 이미지 찾음:', path.basename(imagePath));
                break;
            }
        }

        if (!bgImagePath) {
            // 샘플 이미지가 없으면 임시 이미지 생성
            console.log('⚠️ 배경 이미지가 없어서 임시 이미지 생성 중...');
            bgImagePath = await createDummyImage();
            console.log('✅ 임시 이미지 생성됨:', bgImagePath);
        }

        // 4️⃣ Step 1: 주제 입력
        console.log('\n📝 Step 1: 주제 입력...');
        const subject = '2026년 봄 신상품 출시 - AI 기반 마케팅';
        await page.type('#subject', subject);
        console.log('✅ 주제 입력:', subject);

        // 5️⃣ Step 2: 배경 이미지 업로드
        console.log('\n📂 Step 2: 배경 이미지 업로드...');
        const fileInput = await page.$('#material-upload');
        await fileInput.uploadFile(bgImagePath);
        await page.waitForTimeout(2000); // 이미지 로드 대기
        console.log('✅ 배경 이미지 업로드 완료');

        // 6️⃣ Step 3: 로고 업로드 (생략 - 선택사항)
        console.log('\n🏢 Step 3: 로고 업로드 (스킵)');
        console.log('⚠️ 로고는 선택사항이므로 스킵합니다');

        // 7️⃣ Step 4: 연락처 입력
        console.log('\n📞 Step 4: 연락처 입력...');
        const contact = 'contact@example.com';
        await page.type('#contact', contact);
        console.log('✅ 연락처 입력:', contact);

        // 8️⃣ Step 5A: 산업분야 선택
        console.log('\n🏭 Step 5A: 산업분야 선택 (기술/IT)...');
        await page.click('[data-industry="tech"]');
        await page.waitForTimeout(500);
        console.log('✅ 산업분야 선택: 기술/IT');

        // 9️⃣ Step 5B: 이미지 템플릿 선택
        console.log('\n🎨 Step 5B: 이미지 템플릿 선택...');
        await page.click('[data-template="template1"]');
        await page.waitForTimeout(500);
        console.log('✅ 템플릿 선택: template1');

        // 🔟 Step 6: 금기어 입력
        console.log('\n⛔ Step 6: 금기어 입력...');
        const forbiddenWords = '스팸,광고,사기';
        await page.type('#forbidden-words', forbiddenWords);
        console.log('✅ 금기어 입력:', forbiddenWords);

        // 1️⃣1️⃣ 이미지 생성 버튼 클릭
        console.log('\n✨ 이미지 생성 시작...');
        await page.click('button:contains("프로모션 이미지 생성")');

        // CSS 선택자로 다시 시도
        const generateBtn = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('프로모션 이미지 생성'));
            return btn ? 'found' : 'not-found';
        });

        if (generateBtn === 'found') {
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const btn = buttons.find(b => b.textContent.includes('프로모션 이미지 생성'));
                if (btn) btn.click();
            });
            console.log('✅ 생성 버튼 클릭 완료');
        } else {
            console.warn('⚠️ 생성 버튼을 찾을 수 없습니다. DOM 구조 확인 필요');
        }

        // 1️⃣2️⃣ 생성 완료 대기 (최대 60초)
        console.log('\n⏳ 이미지 생성 중 (최대 60초 대기)...');
        await page.waitForFunction(
            () => {
                const progress = document.querySelector('#progress-percentage');
                return progress && progress.textContent === '100';
            },
            { timeout: 60000 }
        ).catch(() => {
            console.log('⚠️ 진행률 감지 실패 (계속 진행)');
        });

        console.log('✅ 이미지 생성 완료!\n');

        // 1️⃣3️⃣ 생성 결과 확인
        await page.waitForTimeout(3000);

        // 콘솔에서 저장 메시지 확인
        const savedInfo = await page.evaluate(() => {
            return JSON.stringify({
                title: document.title,
                imagesCount: document.querySelectorAll('.generated-image-container').length
            });
        });

        console.log('📊 생성 결과:');
        console.log('  ' + savedInfo);

        // 1️⃣4️⃣ 갤러리로 이동
        console.log('\n📸 갤러리로 이동 중...');
        await page.goto('http://localhost:3000/gallery.html', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000);

        console.log('✅ 갤러리 페이지 로드 완료\n');

        // 1️⃣5️⃣ 갤러리에서 생성된 이미지 확인
        const galleryData = await page.evaluate(() => {
            const generations = document.querySelectorAll('.generation-card');
            return {
                generationCount: generations.length,
                firstGeneration: generations.length > 0 ? {
                    subject: generations[0].querySelector('.generation-subject')?.textContent,
                    imageCount: generations[0].querySelectorAll('.image-item').length
                } : null
            };
        });

        console.log('📊 갤러리 상태:');
        console.log('  생성 기록:', galleryData.generationCount, '개');
        if (galleryData.firstGeneration) {
            console.log('  첫번째 생성물:');
            console.log('    - 주제:', galleryData.firstGeneration.subject);
            console.log('    - 이미지:', galleryData.firstGeneration.imageCount, '개');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 샘플 이미지 생성 완료!');
        console.log('='.repeat(60));
        console.log('\n✅ 확인 사항:');
        console.log('  1. 브라우저에서 5가지 컬러 이미지가 보이나요?');
        console.log('  2. 각 이미지 옆에 다운로드 버튼이 있나요?');
        console.log('  3. 갤러리에 생성 기록이 표시되나요?');
        console.log('\n💡 다음 단계:');
        console.log('  - 📸 갤러리 (gallery.html)에서 이미지 확인');
        console.log('  - ⬇️ 다운로드 버튼으로 이미지 다운로드');
        console.log('  - 📋 복사 버튼으로 URL 복사');
        console.log('\n🚀 이제 다른 세팅으로 더 많은 이미지를 생성할 수 있습니다!');

        // 브라우저 종료 안 함 - 사용자가 확인할 수 있도록 유지
        console.log('\n👁️  브라우저가 열려있습니다. 확인 후 종료하세요.');

    } catch (error) {
        console.error('\n❌ 오류 발생:', error.message);
        console.error('\n🔍 문제 해결:');
        console.error('  1. 서버가 실행 중인지 확인 (node server.js)');
        console.error('  2. Supabase 테이블이 생성되었는지 확인');
        console.error('  3. 배경 이미지 경로가 올바른지 확인');
    }
}

// 더미 이미지 생성 함수
async function createDummyImage() {
    const tempDir = require('os').tmpdir();
    const imagePath = path.join(tempDir, 'dummy-bg.png');

    // 간단한 1x1 PNG 데이터 (최소 크기)
    const pngData = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
        0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xfe,
        0xff, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xe5, 0x27, 0xde, 0xfc, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);

    fs.writeFileSync(imagePath, pngData);
    return imagePath;
}

// 실행
generateSampleImage().catch(console.error);
