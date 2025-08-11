#!/bin/bash

# Development environment cleanup script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🧹 Cleaning Development Environment${NC}"
echo ""
echo -e "${YELLOW}⚠️  This will:${NC}"
echo -e "   • Stop all containers"
echo -e "   • Remove all containers"
echo -e "   • Remove all volumes (database data will be lost)"
echo -e "   • Remove all networks"
echo -e "   • Remove all unused Docker images"
echo ""

# Ask for confirmation
read -p "Are you sure you want to clean everything? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚫 Cleanup cancelled${NC}"
    exit 0
fi

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

echo ""
echo -e "${YELLOW}🛑 Stopping all services...${NC}"
docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans || true

echo -e "${YELLOW}🗑️  Removing unused Docker images...${NC}"
docker image prune -f

echo -e "${YELLOW}🧽 Cleaning Docker system...${NC}"
docker system prune -f

echo ""
echo -e "${GREEN}✅ Development environment cleaned successfully!${NC}"
echo ""
echo -e "${BLUE}💡 To start fresh: make dev-start${NC}" 