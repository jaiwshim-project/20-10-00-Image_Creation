#!/bin/bash

# AI Visual Theme Studio - Mac/Linux 실행 스크립트

echo ""
echo "==================================="
echo " AI Visual Theme Studio 시작 중..."
echo "==================================="
echo ""

# 현재 디렉토리로 이동
cd "$(dirname "$0")"

# Python 확인
if command -v python3 &> /dev/null; then
    echo "✅ Python 웹 서버 시작 (포트 8888)"
    echo "📝 http://localhost:8888 에서 열립니다..."
    echo ""

    # macOS에서 자동으로 브라우저 열기
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8888 2>/dev/null || true
    fi

    python3 -m http.server 8888

elif command -v python &> /dev/null; then
    echo "✅ Python 웹 서버 시작 (포트 8888)"
    echo "📝 http://localhost:8888 에서 열립니다..."
    echo ""

    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8888 2>/dev/null || true
    fi

    python -m http.server 8888

elif command -v node &> /dev/null; then
    echo "✅ Node.js HTTP 서버 시작 (포트 8888)"
    echo "📝 http://localhost:8888 에서 열립니다..."
    echo ""

    npx http-server -p 8888 -o

else
    echo "❌ Python이나 Node.js가 설치되지 않았습니다."
    echo ""
    echo "다음 중 하나를 선택하세요:"
    echo "1. Python 설치: https://www.python.org/downloads/"
    echo "2. Node.js 설치: https://nodejs.org/"
    echo "3. 로컬 파일로 직접 열기:"
    echo "   - index.html을 브라우저로 드래그앤드롭"
    echo ""
fi
