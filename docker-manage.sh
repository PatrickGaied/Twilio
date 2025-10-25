#!/bin/bash

# Docker management script for Twilio Segment project

case "$1" in
    "build")
        echo "Building Docker image..."
        docker-compose build
        ;;
    "up")
        echo "Starting containers..."
        docker-compose up -d
        ;;
    "run")
        echo "Running the application..."
        docker-compose up app
        ;;
    "shell")
        echo "Opening shell in container..."
        docker-compose exec app bash
        ;;
    "logs")
        echo "Showing application logs..."
        docker-compose logs -f app
        ;;
    "down")
        echo "Stopping containers..."
        docker-compose down
        ;;
    "clean")
        echo "Cleaning up containers and volumes..."
        docker-compose down -v
        docker system prune -f
        ;;
    "query")
        echo "Running Supabase query script..."
        docker-compose exec app python query_supabase.py
        ;;
    "chroma")
        echo "Running Chroma script..."
        docker-compose exec app python chroma.py
        ;;
    *)
        echo "Usage: $0 {build|up|run|shell|logs|down|clean|query|chroma}"
        echo ""
        echo "Commands:"
        echo "  build  - Build the Docker image"
        echo "  up     - Start containers in detached mode"
        echo "  run    - Run the application in foreground"
        echo "  shell  - Open a shell in the app container"
        echo "  logs   - Show application logs"
        echo "  down   - Stop containers"
        echo "  clean  - Stop containers and clean up volumes"
        echo "  query  - Run the Supabase query script"
        echo "  chroma - Run the Chroma script"
        exit 1
        ;;
esac