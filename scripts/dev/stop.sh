#!/bin/bash

# Development environment stop script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping Tranquilo Hurghada Development Environment${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Docker compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}🔧 Stopping services...${NC}"
docker-compose -f "$COMPOSE_FILE" down

echo ""
echo -e "${GREEN}✅ Development environment stopped successfully!${NC}"
echo ""
echo -e "${BLUE}💡 To start again:${NC} make dev-start"
echo -e "${BLUE}💡 To reset completely:${NC} make dev-reset"