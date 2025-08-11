#!/bin/bash

# Development Prisma Studio script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🎨 Opening Prisma Studio${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

echo -e "${BLUE}🔧 Starting Prisma Studio...${NC}"
echo -e "${GREEN}📱 Prisma Studio will be available at: http://localhost:5555${NC}"
echo -e "${GREEN}💡 Press Ctrl+C to stop Prisma Studio${NC}"
echo ""

# Run Prisma Studio in the server container
docker-compose -f "$COMPOSE_FILE" exec server npx prisma studio