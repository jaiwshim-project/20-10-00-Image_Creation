@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo 🚀 AI Visual Theme Studio - Backend Server
echo ═══════════════════════════════════════════════════════
echo.
echo 📦 의존성 설치 확인 중...
if not exist "node_modules" (
    echo npm install 실행 중...
    call npm install
)
echo ✅ 준비 완료!
echo.
echo 🔄 서버 시작...
echo.
call npm start
pause
