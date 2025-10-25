#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Segmind MVP - Docker Edition${NC}"
echo -e "${BLUE}===============================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker from https://docker.com${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed!${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/segmind
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
INSIGHTS_API_KEY=devkey
CHROMA_PATH=./.chroma
CHROMA_COLLECTION=events_vectors
EOF
fi

echo -e "${BLUE}Building and starting containers...${NC}"

# Use docker-compose or docker compose depending on what's available
if command -v docker-compose &> /dev/null; then
    docker-compose up --build
else
    docker compose up --build
fi