@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════════════
echo 🚀 AI Visual Theme Studio - 로컬 서버
echo ═══════════════════════════════════════════════════════
echo.

REM Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js가 설치되지 않았습니다!
    echo.
    echo 해결 방법:
    echo 1. https://nodejs.org/ 에서 LTS 버전 설치
    echo 2. 설치 후 이 파일을 다시 실행
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 확인 완료
echo.
echo 📝 서버 시작 중...
echo.

REM 서버 실행
node server.js

pause
