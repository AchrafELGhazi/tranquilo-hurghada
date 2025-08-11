#!/bin/bash

# Development database seeding script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🌱 Seeding Development Database${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

# Check if containers are running
if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  Development environment is not running.${NC}"
    echo -e "${BLUE}💡 Starting environment first...${NC}"
    ./scripts/dev/start.sh
fi

echo -e "${GREEN}🔧 Running database seed...${NC}"
docker-compose -f "$COMPOSE_FILE" exec server npm run seed

echo ""
echo -e "${GREEN}✅ Database seeded successfully!${NC}"
echo -e "${BLUE}💡 You can now access your application with test data${NC}"