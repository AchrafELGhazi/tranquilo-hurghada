#!/bin/bash

# Production deployment script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🚀 Deploying Tranquilo Hurghada to Production${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Confirmation
echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION${NC}"
echo -e "${YELLOW}⚠️  Make sure you have:${NC}"
echo -e "   • Tested all changes in development"
echo -e "   • Updated environment variables"
echo -e "   • Database migrations are ready"
echo ""

read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚫 Deployment cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔍 Pre-deployment checks...${NC}"

# Check if production docker-compose exists
PROD_COMPOSE_FILE="docker-compose.yml"
if [ ! -f "$PROD_COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Production docker-compose.yml not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Production docker-compose.yml found${NC}"

# Check if production environment files exist
if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ server/.env not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Server environment file found${NC}"

echo ""
echo -e "${BLUE}🛑 Stopping current production services...${NC}"
docker-compose -f "$PROD_COMPOSE_FILE" down

echo -e "${BLUE}📥 Pulling latest images...${NC}"
docker-compose -f "$PROD_COMPOSE_FILE" pull

echo -e "${BLUE}🔧 Building and starting services...${NC}"
docker-compose -f "$PROD_COMPOSE_FILE" up -d --build

echo -e "${BLUE}🏥 Waiting for services to be healthy...${NC}"
sleep 10

# Health check
echo -e "${BLUE}🔍 Running health checks...${NC}"
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed - check logs${NC}"
fi

if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check failed - check logs${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Production URLs:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:8080${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "  ${PURPLE}make prod-health${NC}  - Check production health"
echo -e "  ${PURPLE}docker-compose logs -f${NC} - View production logs"    