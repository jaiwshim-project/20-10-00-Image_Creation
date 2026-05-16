# AI Visual Theme Studio - 완전 자동화 스크립트

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 AI Visual Theme Studio 자동 시작 스크립트      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 프로젝트 폴더
$projectPath = "C:\01 클로드코드\40-10-00 홍보 이미지 제작 플랫폼"
Set-Location $projectPath

# Step 1: Supabase 대시보드 자동 열기
Write-Host "📊 Step 1: Supabase 대시보드 열기..." -ForegroundColor Yellow
$dashboardUrl = "https://supabase.com/dashboard/project/ekvnwbumkkolthhvjfmk/sql/new"
Start-Process $dashboardUrl

Write-Host "✅ Supabase 대시보드가 브라우저에서 열렸습니다" -ForegroundColor Green
Write-Host "   다음 SQL을 실행해주세요 (CREATE-TABLES.sql 참고)" -ForegroundColor Gray
Write-Host ""

# Step 2: 로컬 서버 시작 (백그라운드)
Write-Host "🚀 Step 2: 로컬 서버 시작 중..." -ForegroundColor Yellow

# 기존 프로세스 종료
$existingProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -like "*Visual Theme*" -or $_.CommandLine -like "*server.js*" }
if ($existingProcess) {
    Write-Host "⏹️  기존 서버 프로세스 중단 중..." -ForegroundColor Gray
    Stop-Process -InputObject $existingProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 서버 시작
Write-Host "   서버를 시작하는 중... (약 2초 소요)" -ForegroundColor Gray
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; node server.js" -WindowStyle Normal

Write-Host "✅ 서버가 시작되었습니다" -ForegroundColor Green
Start-Sleep -Seconds 3

# Step 3: 브라우저에서 플랫폼 열기
Write-Host "`n🌐 Step 3: AI Visual Theme Studio 열기..." -ForegroundColor Yellow
$appUrl = "http://localhost:3000"
Start-Process $appUrl

Write-Host "✅ 애플리케이션이 열렸습니다: $appUrl" -ForegroundColor Green
Write-Host ""

# 지시사항
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📋 다음 단계:                                     ║" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  1. Supabase 대시보드에서:                         ║" -ForegroundColor Cyan
Write-Host "║     - CREATE-TABLES.sql 내용 복사                  ║" -ForegroundColor Cyan
Write-Host "║     - SQL Editor에서 실행                          ║" -ForegroundColor Cyan
Write-Host "║     - ✅ 'Tables created successfully!' 확인       ║" -ForegroundColor Cyan
Write-Host "║                                                   ║" -ForegroundColor Cyan
Write-Host "║  2. 브라우저 창에서:                               ║" -ForegroundColor Cyan
Write-Host "║     - Step 1-6 모두 입력                           ║" -ForegroundColor Cyan
Write-Host "║     - '✨ 프로모션 이미지 생성' 클릭               ║" -ForegroundColor Cyan
Write-Host "║     - 5가지 컬러 이미지 자동 생성                  ║" -ForegroundColor Cyan
Write-Host "║                                                   ║" -ForegroundColor Cyan
Write-Host "║  3. F12 Console 확인:                             ║" -ForegroundColor Cyan
Write-Host "║     ✅ Supabase 초기화 완료                        ║" -ForegroundColor Cyan
Write-Host "║     ✅ Supabase에 저장됨                           ║" -ForegroundColor Cyan
Write-Host "║                                                   ║" -ForegroundColor Cyan
Write-Host "║  4. Supabase 대시보드 확인:                        ║" -ForegroundColor Cyan
Write-Host "║     - Table Editor에서 데이터 확인                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "💡 팁: 이 창은 열린 상태로 두세요 (서버가 실행 중입니다)" -ForegroundColor Gray
Write-Host ""
