@echo off
echo ===============================================
echo   Segmind MVP - Docker Edition
echo ===============================================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed!
    echo Please install Docker from https://docker.com
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo SUPABASE_URL=https://your-project.supabase.co
        echo SUPABASE_ANON_KEY=your-anon-key-here
        echo DATABASE_URL=postgresql://user:password@localhost:5432/segmind
        echo REDIS_URL=redis://localhost:6379
        echo SECRET_KEY=your-secret-key-here
        echo INSIGHTS_API_KEY=devkey
        echo CHROMA_PATH=./.chroma
        echo CHROMA_COLLECTION=events_vectors
    ) > .env
)

echo Building and starting containers...
docker-compose up --build