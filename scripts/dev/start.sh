#!/bin/bash

# Development environment startup script (simplified)
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Tranquilo Hurghada Development Environment${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Use the docker-compose file at project root
COMPOSE_FILE="docker-compose.dev.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Docker compose file not found: $COMPOSE_FILE${NC}"
    echo -e "${YELLOW}💡 Make sure docker-compose.dev.yml is in your project root${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo -e "${GREEN}✓ Docker compose file found${NC}"
echo ""

echo -e "${PURPLE}🔧 Starting services...${NC}"
echo ""

# Start the development environment
docker-compose -f "$COMPOSE_FILE" up --build

echo ""
echo -e "${GREEN}🎉 Development environment started successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Available Services:${NC}"
echo -e "  ${GREEN}Frontend (React):${NC}     http://localhost:3000"
echo -e "  ${GREEN}Backend API:${NC}          http://localhost:5000"
echo -e "  ${GREEN}Database (PostgreSQL):${NC} localhost:5432"
echo ""
echo -e "${BLUE}🛠️  Useful Commands:${NC}"
echo -e "  ${PURPLE}make dev-logs${NC}         View all logs"
echo -e "  ${PURPLE}make dev-seed${NC}         Seed database"
echo -e "  ${PURPLE}make dev-stop${NC}         Stop environment"
echo -e "  ${PURPLE}make help${NC}             Show all commands"