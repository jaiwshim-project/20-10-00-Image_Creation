const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

console.log('\n🎯 전체 플로우 검증 시작\n');
console.log('═'.repeat(70));

async function testFullFlow() {
    const testCases = [
        {
            name: 'Test 1: 에바셀 템플릿',
            templatePath: './images/ebasel.png',
            subject: '2026년 봄 신상품 출시',
            contact: 'contact@example.com',
            forbiddenWords: '스팸'
        },
        {
            name: 'Test 2: GEO 템플릿',
            templatePath: './images/geo.png',
            subject: 'AI 의료 솔루션',
            contact: 'medical@geo.com',
            forbiddenWords: '위험'
        },
        {
            name: 'Test 3: MedVo 템플릿',
            templatePath: './images/medvo.png',
            subject: '외국인 환자 진료',
            contact: 'medvo@hosp.com',
            forbiddenWords: '불법'
        },
        {
            name: 'Test 4: GEO-MedVo 템플릿',
            templatePath: './images/geo-medvo.png',
            subject: '글로벌 의료 서비스',
            contact: 'global@medvo.com',
            forbiddenWords: '금지'
        },
        {
            name: 'Test 5: 선거 템플릿',
            templatePath: './images/sungo.png',
            subject: '2026 선거 캠페인',
            contact: 'campaign@sungo.com',
            forbiddenWords: '거짓'
        }
    ];

    const colorVariants = ['#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd', '#6b7280'];
    const colorNames = ['기본색', '어두운색', '밝은색', '파스텔색', '그레이스케일'];

    let successCount = 0;
    let totalTests = testCases.length * colorVariants.length;
    let passCount = 0;

    const outputDir = './test-full-output';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const testCase of testCases) {
        console.log(`\n${testCase.name}`);
        console.log(`  주제: ${testCase.subject}`);
        console.log(`  연락처: ${testCase.contact}`);
        console.log(`  금기어: ${testCase.forbiddenWords}`);

        let templateImg;
        try {
            templateImg = await loadImage(testCase.templatePath);
            console.log(`  ✅ 템플릿 로드: ${templateImg.width}x${templateImg.height}px`);
            successCount++;
        } catch (error) {
            console.log(`  ❌ 템플릿 로드 실패: ${error.message}`);
            continue;
        }

        let colorSuccess = 0;
        for (let i = 0; i < colorVariants.length; i++) {
            const color = colorVariants[i];
            const colorName = colorNames[i];

            try {
                const canvas = createCanvas(1024, 1024);
                const ctx = canvas.getContext('2d');

                // 1. 템플릿 이미지
                ctx.drawImage(templateImg, 0, 0, 1024, 1024);

                // 2. 그래디언트
                const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
                gradient.addColorStop(0, color + '40');
                gradient.addColorStop(1, color + '80');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1024, 1024);

                // 3. 주제 텍스트
                ctx.fillStyle = 'white';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.shadowColor = color;
                ctx.shadowBlur = 15;
                ctx.fillText(testCase.subject, 512, 400);
                ctx.fillText(testCase.subject.substring(0, 8), 512, 460);

                // 4. 연락처
                ctx.font = '20px Arial';
                ctx.shadowBlur = 8;
                ctx.fillText(testCase.contact, 512, 900);

                // 5. 금기어
                ctx.font = 'bold 18px Arial';
                ctx.fillStyle = '#FF6B6B';
                ctx.shadowColor = '#000';
                ctx.textAlign = 'right';
                ctx.fillText(`⛔ ${testCase.forbiddenWords}`, 980, 970);

                // 파일 저장
                const fileName = `${testCase.name.match(/Test \d/)[0]}_${i + 1}.png`;
                const filePath = path.join(outputDir, fileName);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(filePath, buffer);

                const sizeKb = (buffer.length / 1024).toFixed(1);
                console.log(`    ${colorName}: ✅ (${sizeKb}KB)`);
                colorSuccess++;
                passCount++;
            } catch (error) {
                console.log(`    ${colorName}: ❌ ${error.message}`);
            }
        }

        if (colorSuccess === colorVariants.length) {
            console.log(`  → 5/5 색상 완료! ✅`);
        }
    }

    console.log('\n' + '═'.repeat(70));
    console.log(`\n📊 최종 결과\n`);
    console.log(`  전체 테스트: ${totalTests}개`);
    console.log(`  성공: ${passCount}개 ✅`);
    console.log(`  실패: ${totalTests - passCount}개 ${totalTests === passCount ? '🎉' : '❌'}`);
    console.log(`  성공률: ${((passCount / totalTests) * 100).toFixed(1)}%\n`);

    if (passCount === totalTests) {
        console.log('🏆 모든 테스트 통과!\n');
        console.log('✨ 생성된 이미지:\n');
        const files = fs.readdirSync(outputDir).sort();
        files.forEach((f, idx) => {
            const stat = fs.statSync(path.join(outputDir, f));
            const sizeKb = (stat.size / 1024).toFixed(1);
            console.log(`   ${idx + 1}. ${f} (${sizeKb}KB)`);
        });
        console.log(`\n   저장 위치: ${outputDir}/\n`);
    } else {
        console.log('⚠️ 일부 테스트 실패\n');
    }

    console.log('═'.repeat(70));
    console.log('\n💡 다음 단계:\n');
    console.log('1. 로컬 테스트 (localhost:3000/index.html):');
    console.log('   - Step 1~6까지 입력하고 "생성" 클릭');
    console.log('   - 브라우저 콘솔에서 로깅 확인');
    console.log('   - 5가지 색상 이미지 생성 확인\n');
    console.log('2. GitHub Pages 테스트:');
    console.log('   - https://jaiwshim-project.github.io/20-10-00-Image_Creation/');
    console.log('   - Ctrl+Shift+Delete로 캐시 완전히 삭제');
    console.log('   - 동일한 테스트 진행\n');
    console.log('3. 진단 페이지:');
    console.log('   - http://localhost:3000/test-canvas.html');
    console.log('   - 또는 GitHub Pages 버전에서도 접근 가능\n');
}

testFullFlow().catch(e => console.error('❌ 오류:', e));
