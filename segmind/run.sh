#!/bin/bash

case "$1" in
  "backend")
    echo "Starting FastAPI backend..."
    cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ;;
  "frontend")
    echo "Starting Next.js frontend..."
    cd frontend && npm run dev
    ;;
  "full")
    echo "Starting both backend and frontend..."
    (cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
    (cd frontend && npm run dev) &
    wait
    ;;
  *)
    echo "Usage: ./run.sh [backend|frontend|full]"
    exit 1
    ;;
esac