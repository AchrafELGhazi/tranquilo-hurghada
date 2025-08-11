#!/bin/bash

# Development server shell access script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🐚 Accessing Server Container Shell${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

echo -e "${GREEN}💡 You'll be inside the server container. Type 'exit' to leave.${NC}"
echo -e "${YELLOW}📁 Working directory: /app${NC}"
echo ""

# Access server container shell
docker-compose -f "$COMPOSE_FILE" exec server sh