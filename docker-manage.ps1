# Docker management script for Twilio Segment project (PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "up", "run", "shell", "logs", "down", "clean", "query", "chroma")]
    [string]$Command
)

switch ($Command) {
    "build" {
        Write-Host "Building Docker image..." -ForegroundColor Green
        docker-compose build
    }
    "up" {
        Write-Host "Starting containers..." -ForegroundColor Green
        docker-compose up -d
    }
    "run" {
        Write-Host "Running the application..." -ForegroundColor Green
        docker-compose up app
    }
    "shell" {
        Write-Host "Opening shell in container..." -ForegroundColor Green
        docker-compose exec app bash
    }
    "logs" {
        Write-Host "Showing application logs..." -ForegroundColor Green
        docker-compose logs -f app
    }
    "down" {
        Write-Host "Stopping containers..." -ForegroundColor Green
        docker-compose down
    }
    "clean" {
        Write-Host "Cleaning up containers and volumes..." -ForegroundColor Green
        docker-compose down -v
        docker system prune -f
    }
    "query" {
        Write-Host "Running Supabase query script..." -ForegroundColor Green
        docker-compose exec app python query_supabase.py
    }
    "chroma" {
        Write-Host "Running Chroma script..." -ForegroundColor Green
        docker-compose exec app python chroma.py
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Command failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}