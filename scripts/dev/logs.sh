#!/bin/bash

# Development logs script
set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}📋 Viewing All Development Logs${NC}"
echo -e "${GREEN}💡 Press Ctrl+C to stop viewing logs${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

COMPOSE_FILE="docker/dev/docker-compose.yml"

# Follow logs from all services
docker-compose -f "$COMPOSE_FILE" logs -f