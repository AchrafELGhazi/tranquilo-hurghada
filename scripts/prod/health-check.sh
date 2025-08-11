#!/bin/bash

# Production health check script
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🏥 Production Health Check${NC}"
echo ""

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local timeout=${3:-10}
    
    echo -n "Checking $service_name... "
    
    if curl -f --max-time $timeout "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy${NC}"
        return 1
    fi
}

# Check backend API
check_service "Backend API" "http://localhost:5000/health" 10
BACKEND_STATUS=$?

# Check frontend
check_service "Frontend" "http://localhost:8080" 5  
FRONTEND_STATUS=$?

# Check database connection (through API)
check_service "Database (via API)" "http://localhost:5000/api/v1/health/db" 10
DATABASE_STATUS=$?

echo ""

# Overall status
if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ] && [ $DATABASE_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some services are unhealthy. Check the logs:${NC}"
    echo -e "${YELLOW}  docker-compose logs${NC}"
    exit 1
fi