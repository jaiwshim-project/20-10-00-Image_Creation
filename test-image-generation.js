const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function testImageGeneration() {
    console.log('🎨 테스트 이미지 생성 시작...\n');

    const testCases = [
        {
            templateName: '에바셀',
            templatePath: './images/ebasel.png',
            subject: '2026년 봄 신상품 출시',
            contact: 'contact@example.com',
            forbiddenWords: '스팸,광고'
        },
        {
            templateName: 'GEO',
            templatePath: './images/geo.png',
            subject: 'AI 의료 기술 혁신',
            contact: 'info@geo.com',
            forbiddenWords: '위험,금지'
        }
    ];

    const colorVariants = ['#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd', '#6b7280'];
    const colorNames = ['기본 색', '어두운 색', '밝은 색', '파스텔 색', '그레이스케일'];

    for (const testCase of testCases) {
        console.log(`\n📋 테스트: ${testCase.templateName}`);

        let templateImg;
        try {
            templateImg = await loadImage(testCase.templatePath);
            console.log(`   ✅ 템플릿 로드 성공: ${templateImg.width}x${templateImg.height}px`);
        } catch (error) {
            console.error(`   ❌ 템플릿 로드 실패: ${error.message}`);
            continue;
        }

        for (let colorIdx = 0; colorIdx < colorVariants.length; colorIdx++) {
            const color = colorVariants[colorIdx];
            const colorName = colorNames[colorIdx];

            try {
                const canvas = createCanvas(1024, 1024);
                const ctx = canvas.getContext('2d');

                ctx.drawImage(templateImg, 0, 0, 1024, 1024);

                const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
                gradient.addColorStop(0, color + '40');
                gradient.addColorStop(1, color + '80');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1024, 1024);

                ctx.fillStyle = 'white';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.shadowColor = color;
                ctx.shadowBlur = 15;
                const lines = testCase.subject.split('\n');
                let y = 400;
                lines.forEach(line => {
                    ctx.fillText(line, 512, y);
                    y += 60;
                });

                ctx.font = '20px Arial';
                ctx.shadowBlur = 8;
                ctx.fillText(testCase.contact, 512, 900);

                if (testCase.forbiddenWords) {
                    ctx.font = 'bold 18px Arial';
                    ctx.fillStyle = '#FF6B6B';
                    ctx.shadowColor = '#000';
                    ctx.shadowBlur = 12;
                    ctx.textAlign = 'right';
                    ctx.fillText(`⛔ 금기어: ${testCase.forbiddenWords}`, 980, 970);
                }

                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 4;
                ctx.textAlign = 'left';
                ctx.fillText(colorName, 40, 160);

                const outputDir = './test-output';
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                const fileName = `${testCase.templateName}_${colorIdx + 1}.png`;
                const filePath = path.join(outputDir, fileName);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(filePath, buffer);

                console.log(`   ✅ ${colorName}: ${filePath}`);
            } catch (error) {
                console.error(`   ❌ ${colorName}: ${error.message}`);
            }
        }
    }

    console.log('\n✅ 완료! 결과: ./test-output/');
}

testImageGeneration().catch(e => console.error('❌', e));
