#!/bin/bash

# Development environment reset script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🔄 Resetting Tranquilo Hurghada Development Environment${NC}"
echo ""
echo -e "${YELLOW}⚠️  This will:${NC}"
echo -e "   • Stop all containers"
echo -e "   • Remove all volumes (database data will be lost)"
echo -e "   • Remove all containers"
echo -e "   • Rebuild everything from scratch"
echo ""

# Ask for confirmation
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚫 Reset cancelled${NC}"
    exit 0
fi

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Docker compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🗑️  Stopping and removing containers, volumes, and networks...${NC}"
docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans

echo -e "${YELLOW}🧹 Cleaning up unused Docker resources...${NC}"
docker system prune -f

echo -e "${PURPLE}🔧 Starting fresh environment...${NC}"
docker-compose -f "$COMPOSE_FILE" up --build

echo ""
echo -e "${GREEN}🎉 Development environment reset and started successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Available Services:${NC}"
echo -e "  ${GREEN}Frontend (React):${NC}     http://localhost:3000"
echo -e "  ${GREEN}Backend API:${NC}          http://localhost:5000"
echo -e "  ${GREEN}Database (PostgreSQL):${NC} localhost:5432"
echo ""
echo -e "${YELLOW}💡 Don't forget to seed your database: make dev-seed${NC}"