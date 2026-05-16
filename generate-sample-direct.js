/**
 * 샘플 이미지 생성 및 저장
 * RLS 정책을 우회하여 클라이언트 측에서 실행
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function generateSampleData() {
    console.log('🎨 샘플 이미지 생성 데이터 준비 중...\n');

    const supabaseUrl = 'https://ekvnwbumkkolthhvjfmk.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdm53YnVta2tvbHRoaHZqZm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDcxNTYsImV4cCI6MjA5NDQ4MzE1Nn0.6zzMYhM-ezbji-rXo7SEy-JwEn6IKLCOoPMB4YB1QtI';

    try {
        // Supabase 클라이언트 초기화
        const supabase = createClient(supabaseUrl, anonKey);

        console.log('📌 샘플 데이터 준비:');
        console.log('  - 주제: 2026년 봄 신상품 출시');
        console.log('  - 산업분야: 기술/IT');
        console.log('  - 템플릿: template1');
        console.log('  - 이미지: 5가지 컬러\n');

        // 1️⃣ generations 테이블에 데이터 삽입
        console.log('1️⃣ Supabase에 생성 기록 저장 중...');

        const { data: generationData, error: genError } = await supabase
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

        if (genError) {
            console.error('❌ 생성 기록 저장 실패:', genError.message);

            // RLS 오류일 경우
            if (genError.code === '42501') {
                console.log('\n⚠️ RLS 정책 제한');
                console.log('해결 방법:');
                console.log('  1. Supabase 대시보시 열기');
                console.log('  2. SQL Editor → New Query');
                console.log('  3. 다음 SQL 실행:');
                console.log('     ALTER TABLE generations ENABLE ROW LEVEL SECURITY;');
                console.log('     CREATE POLICY "Enable insert" ON "generations"');
                console.log('       AS PERMISSIVE FOR INSERT');
                console.log('       TO authenticated, anon');
                console.log('       USING (true) WITH CHECK (true);');
                return;
            }
            return;
        }

        const generationId = generationData[0].id;
        console.log('✅ 생성 기록 저장 완료 (ID:', generationId, ')\n');

        // 2️⃣ images 테이블에 5가지 색상 데이터 삽입
        console.log('2️⃣ 5가지 컬러 이미지 정보 저장 중...');

        const colors = [
            { name: '기본색', hex: '#2563eb' },
            { name: '어두운색', hex: '#1d4ed8' },
            { name: '밝은색', hex: '#60a5fa' },
            { name: '파스텔색', hex: '#93c5fd' },
            { name: '그레이스케일', hex: '#6b7280' }
        ];

        const imageRows = colors.map(color => ({
            generation_id: generationId,
            color_name: color.name,
            color_hex: color.hex
        }));

        const { data: imageData, error: imgError } = await supabase
            .from('images')
            .insert(imageRows)
            .select();

        if (imgError) {
            console.error('❌ 이미지 정보 저장 실패:', imgError.message);
            return;
        }

        console.log('✅ 이미지 정보 저장 완료:', imageData.length, '개\n');

        // 결과 출력
        console.log('═'.repeat(60));
        console.log('🎉 샘플 이미지 생성 데이터 저장 완료!');
        console.log('═'.repeat(60));
        console.log('\n📊 저장된 정보:');
        console.log('┌─ 생성 기록');
        console.log('│  • ID:', generationId);
        console.log('│  • 주제:', generationData[0].subject);
        console.log('│  • 산업:', generationData[0].industry);
        console.log('│  • 생성일:', generationData[0].created_at);
        console.log('│');
        console.log('├─ 저장된 이미지 (5가지 컬러)');
        imageData.forEach((img, idx) => {
            console.log(`│  ${idx + 1}. ${img.color_name} (${img.color_hex})`);
        });
        console.log('└');
        console.log('\n🔗 확인 방법:');
        console.log('  1. 📸 갤러리 열기:');
        console.log('     http://localhost:3000/gallery.html');
        console.log('\n  2. 다운로드 테스트:');
        console.log('     • 개별 다운로드: "⬇️ 다운로드" 클릭');
        console.log('     • 일괄 다운로드: "📦 모두 다운로드 (5개)" 클릭');
        console.log('\n  3. 갤러리 기능 테스트:');
        console.log('     • 주제로 검색 (2026년)');
        console.log('     • 산업분야 필터 (기술/IT)');
        console.log('     • 삭제 기능');
        console.log('\n✨ 샘플 데이터로 전체 플로우를 확인할 수 있습니다!');

    } catch (error) {
        console.error('❌ 오류:', error.message);
    }
}

// 실행
generateSampleData();
