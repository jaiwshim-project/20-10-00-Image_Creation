const { createClient } = require('@supabase/supabase-js');

async function createDemoImages() {
    const supabase = createClient(
        'https://ekvnwbumkkolthhvjfmk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdm53YnVta2tvbHRoaHZqZm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDcxNTYsImV4cCI6MjA5NDQ4MzE1Nn0.6zzMYhM-ezbji-rXo7SEy-JwEn6IKLCOoPMB4YB1QtI'
    );

    try {
        console.log('📌 데모 이미지 생성 중...\n');

        // 1. 에바셀 템플릿 데이터
        const { data: ebaselGen } = await supabase
            .from('generations')
            .insert([{
                subject: '🎨 에바셀 2026 신상품 출시',
                industry: 'ebasel',
                template: 'template1',
                contact: 'ebasel.com | 02-1234-5678',
                forbidden_words: '저질,가짜,사기',
                material_preview: 'images/ebasel.png',
                logo_preview: 'ebasel-logo.png'
            }])
            .select();

        if (ebaselGen && ebaselGen[0]) {
            const ebaselId = ebaselGen[0].id;
            const colors = [
                { name: '에바셀 기본색', hex: '#2563eb' },
                { name: '에바셀 진한색', hex: '#1d4ed8' },
                { name: '에바셀 밝은색', hex: '#60a5fa' },
                { name: '에바셀 파스텔', hex: '#93c5fd' },
                { name: '에바셀 그레이', hex: '#6b7280' }
            ];

            await supabase.from('images').insert(
                colors.map(c => ({
                    generation_id: ebaselId,
                    color_name: c.name,
                    color_hex: c.hex
                }))
            );

            console.log('✅ 에바셀 템플릿: 5가지 색상 생성됨');
        }

        // 2. 선거 템플릿 데이터
        const { data: sungoGen } = await supabase
            .from('generations')
            .insert([{
                subject: '🗳️ 2026년 선거 캠페인',
                industry: 'sungo',
                template: 'template2',
                contact: 'vote.kr | 1566-0000',
                forbidden_words: '투표방해,거짓선전',
                material_preview: 'images/sungo.png',
                logo_preview: 'sungo-logo.png'
            }])
            .select();

        if (sungoGen && sungoGen[0]) {
            const sungoId = sungoGen[0].id;
            const colors = [
                { name: '선거 기본색', hex: '#dc2626' },
                { name: '선거 진한색', hex: '#991b1b' },
                { name: '선거 밝은색', hex: '#fca5a5' },
                { name: '선거 파스텔', hex: '#fecaca' },
                { name: '선거 그레이', hex: '#6b7280' }
            ];

            await supabase.from('images').insert(
                colors.map(c => ({
                    generation_id: sungoId,
                    color_name: c.name,
                    color_hex: c.hex
                }))
            );

            console.log('✅ 선거 템플릿: 5가지 색상 생성됨');
        }

        // 3. GEO 템플릿 데이터
        const { data: geoGen } = await supabase
            .from('generations')
            .insert([{
                subject: '🗺️ GEO Score AI 진단',
                industry: 'geo',
                template: 'template3',
                contact: 'geo-score.ai | support@geo.ai',
                forbidden_words: '부정확,오류데이터',
                material_preview: 'images/geo.png',
                logo_preview: 'geo-logo.png'
            }])
            .select();

        if (geoGen && geoGen[0]) {
            const geoId = geoGen[0].id;
            const colors = [
                { name: 'GEO 기본색', hex: '#0891b2' },
                { name: 'GEO 진한색', hex: '#0e7490' },
                { name: 'GEO 밝은색', hex: '#67e8f9' },
                { name: 'GEO 파스텔', hex: '#a5f3fc' },
                { name: 'GEO 그레이', hex: '#6b7280' }
            ];

            await supabase.from('images').insert(
                colors.map(c => ({
                    generation_id: geoId,
                    color_name: c.name,
                    color_hex: c.hex
                }))
            );

            console.log('✅ GEO 템플릿: 5가지 색상 생성됨');
        }

        // 4. MedVo 템플릿 데이터
        const { data: medvoGen } = await supabase
            .from('generations')
            .insert([{
                subject: '🏥 MedVo 의료 솔루션',
                industry: 'medvo',
                template: 'template4',
                contact: 'medvo.health | 1599-9999',
                forbidden_words: '의료광고,부작용미표기',
                material_preview: 'images/medvo.png',
                logo_preview: 'medvo-logo.png'
            }])
            .select();

        if (medvoGen && medvoGen[0]) {
            const medvoId = medvoGen[0].id;
            const colors = [
                { name: 'MedVo 기본색', hex: '#06b6d4' },
                { name: 'MedVo 진한색', hex: '#0891b2' },
                { name: 'MedVo 밝은색', hex: '#22d3ee' },
                { name: 'MedVo 파스텔', hex: '#a5f3fc' },
                { name: 'MedVo 그레이', hex: '#6b7280' }
            ];

            await supabase.from('images').insert(
                colors.map(c => ({
                    generation_id: medvoId,
                    color_name: c.name,
                    color_hex: c.hex
                }))
            );

            console.log('✅ MedVo 템플릿: 5가지 색상 생성됨');
        }

        // 5. GEO-MedVo 템플릿 데이터
        const { data: geomedvoGen } = await supabase
            .from('generations')
            .insert([{
                subject: '🔗 GEO-MedVo 통합 플랫폼',
                industry: 'geo-medvo',
                template: 'template5',
                contact: 'geo-medvo.platform | contact@platform.ai',
                forbidden_words: '부정확,오류',
                material_preview: 'images/geo-medvo.png',
                logo_preview: 'geo-medvo-logo.png'
            }])
            .select();

        if (geomedvoGen && geomedvoGen[0]) {
            const geomedvoId = geomedvoGen[0].id;
            const colors = [
                { name: 'GEO-MedVo 기본색', hex: '#7c3aed' },
                { name: 'GEO-MedVo 진한색', hex: '#6d28d9' },
                { name: 'GEO-MedVo 밝은색', hex: '#c4b5fd' },
                { name: 'GEO-MedVo 파스텔', hex: '#ddd6fe' },
                { name: 'GEO-MedVo 그레이', hex: '#6b7280' }
            ];

            await supabase.from('images').insert(
                colors.map(c => ({
                    generation_id: geomedvoId,
                    color_name: c.name,
                    color_hex: c.hex
                }))
            );

            console.log('✅ GEO-MedVo 템플릿: 5가지 색상 생성됨');
        }

        console.log('\n═══════════════════════════════════════');
        console.log('🎉 5개 템플릿 × 5가지 색상 = 25개 이미지 생성 완료!');
        console.log('═══════════════════════════════════════');
        console.log('\n🔗 확인 URL:');
        console.log('http://localhost:3000/gallery.html');
        console.log('https://jaiwshim-project.github.io/20-10-00-Image_Creation/gallery.html');

    } catch (error) {
        console.error('❌ 오류:', error.message);
    }
}

createDemoImages();
