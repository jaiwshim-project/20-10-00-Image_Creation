const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 데이터베이스 초기화 시작...\n');

// SQL 파일 읽기
const sqlFile = path.join(__dirname, 'CREATE-TABLES.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// CREATE-TABLES.sql의 내용 출력 (사용자가 수동 실행하도록)
console.log('📋 다음 SQL을 Supabase SQL Editor에서 실행하세요:\n');
console.log('=' .repeat(60));
console.log(sqlContent);
console.log('=' .repeat(60));

console.log('\n📍 실행 방법:');
console.log('1. https://supabase.com/dashboard 접속');
console.log('2. 프로젝트 선택');
console.log('3. 좌측 "SQL Editor" → "+ New Query"');
console.log('4. 위의 SQL 전체 복사 후 붙여넣기');
console.log('5. "RUN" 버튼 클릭');
console.log('\n✅ 테이블 생성 후 다시 서버를 시작하세요!');
