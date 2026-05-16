const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = 3000;
const HOST = 'localhost';

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
    // API 엔드포인트
    if (req.url === '/api/config' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            SUPABASE_URL: process.env.SUPABASE_URL || '',
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
        }));
        return;
    }

    // 샘플 데이터 생성 엔드포인트
    if (req.url === '/api/generate-sample' && req.method === 'POST') {
        const { createClient } = require('@supabase/supabase-js');

        const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_ANON_KEY || ''
        );

        (async () => {
            try {
                // 생성 기록 삽입
                const { data: genData, error: genError } = await supabase
                    .from('generations')
                    .insert([{
                        subject: '2026년 봄 신상품 출시 - AI 기반 마케팅',
                        industry: 'tech',
                        template: 'template1',
                        contact: 'contact@example.com',
                        forbidden_words: '스팸,광고,사기',
                        material_preview: 'sample.png',
                        logo_preview: 'logo.png'
                    }])
                    .select();

                if (genError) throw genError;

                const genId = genData[0].id;

                // 5가지 이미지 색상 데이터 삽입
                const colors = [
                    { name: '기본색', hex: '#2563eb' },
                    { name: '어두운색', hex: '#1d4ed8' },
                    { name: '밝은색', hex: '#60a5fa' },
                    { name: '파스텔색', hex: '#93c5fd' },
                    { name: '그레이스케일', hex: '#6b7280' }
                ];

                const { data: imgData, error: imgError } = await supabase
                    .from('images')
                    .insert(colors.map(c => ({
                        generation_id: genId,
                        color_name: c.name,
                        color_hex: c.hex
                    })))
                    .select();

                if (imgError) throw imgError;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    generationId: genId,
                    imageCount: imgData.length,
                    message: '샘플 데이터 생성 완료'
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: error.message
                }));
            }
        })();
        return;
    }

    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const realPath = path.resolve(filePath);
    if (!realPath.startsWith(path.resolve(__dirname))) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('❌ 접근이 거부되었습니다.');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<html><head><meta charset="UTF-8"><title>404</title></head><body style="text-align:center;padding:50px;"><h1>404 - 파일을 찾을 수 없습니다</h1><p><a href="/">홈</a></p></body></html>`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        res.end(data);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 AI Visual Theme Studio 서버 시작됨                   ║
║                                                          ║
║   📍 주소: http://${HOST}:${PORT}                          ║
║                                                          ║
║   💡 팁: 위 주소를 브라우저에서 열기                      ║
║   ⛔ 중단: Ctrl + C                                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
        process.exit(1);
    }
});
