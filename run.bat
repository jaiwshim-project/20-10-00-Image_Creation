@echo off
REM AI Visual Theme Studio - Windows 실행 스크립트

echo.
echo ===================================
echo  AI Visual Theme Studio 시작 중...
echo ===================================
echo.

REM 현재 디렉토리로 이동
cd /d "%~dp0"

REM Python 확인
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Python 웹 서버 시작 (포트 8888)
    echo 📝 http://localhost:8888 에서 열립니다...
    echo.
    start http://localhost:8888
    timeout /t 1 /nobreak
    python -m http.server 8888
) else (
    echo ❌ Python이 설치되지 않았습니다.
    echo.
    echo 다음 중 하나를 선택하세요:
    echo 1. Python 설치: https://www.python.org/downloads/
    echo 2. Node.js 설치: https://nodejs.org/
    echo 3. 로컬 파일로 직접 열기:
    echo    - index.html을 브라우저로 드래그앤드롭
    echo.
    pause
)
