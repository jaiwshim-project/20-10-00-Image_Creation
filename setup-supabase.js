const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupSupabase() {
    console.log('🔧 Supabase 테이블 설정 시작...\n');

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ .env 파일에서 Supabase 정보를 찾을 수 없습니다');
        process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
        // 1. generations 테이블 확인/생성
        console.log('📊 1. generations 테이블 확인 중...');
        let { data: generationsData, error: genError } = await supabase
            .from('generations')
            .select('count', { count: 'exact' })
            .limit(0);

        if (genError) {
            console.log('   ⚠️  테이블 없음, 생성 필요');
        } else {
            console.log('   ✅ generations 테이블 이미 존재');
        }

        // 2. images 테이블 확인/생성
        console.log('📊 2. images 테이블 확인 중...');
        let { data: imagesData, error: imgError } = await supabase
            .from('images')
            .select('count', { count: 'exact' })
            .limit(0);

        if (imgError) {
            console.log('   ⚠️  테이블 없음, 생성 필요');
        } else {
            console.log('   ✅ images 테이블 이미 존재');
        }

        // 3. custom_themes 테이블 확인/생성
        console.log('📊 3. custom_themes 테이블 확인 중...');
        let { data: themesData, error: themeError } = await supabase
            .from('custom_themes')
            .select('count', { count: 'exact' })
            .limit(0);

        if (themeError) {
            console.log('   ⚠️  테이블 없음, 생성 필요');
        } else {
            console.log('   ✅ custom_themes 테이블 이미 존재');
        }

        console.log('\n✅ Supabase 설정 완료!\n');
        console.log('📋 테이블 상태:');
        console.log('   - generations:', genError ? '❌ 생성 필요' : '✅ 준비됨');
        console.log('   - images:', imgError ? '❌ 생성 필요' : '✅ 준비됨');
        console.log('   - custom_themes:', themeError ? '❌ 생성 필요' : '✅ 준비됨');
        console.log('\n📌 참고: 테이블을 수동으로 생성하려면');
        console.log('   CREATE-TABLES.sql 파일의 내용을');
        console.log('   Supabase SQL Editor에서 실행하세요.\n');

    } catch (error) {
        console.error('❌ 오류:', error.message);
        process.exit(1);
    }
}

setupSupabase();
