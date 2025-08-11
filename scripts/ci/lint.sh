#!/bin/bash

# CI/CD linting script
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Running Code Quality Checks${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Track lint results
LINTS_PASSED=0
TOTAL_LINTS=0

# Function to run lint
run_lint() {
    local lint_name=$1
    local lint_command=$2
    
    echo -e "${BLUE}📋 Running $lint_name...${NC}"
    TOTAL_LINTS=$((TOTAL_LINTS + 1))
    
    if eval "$lint_command"; then
        echo -e "${GREEN}✅ $lint_name passed${NC}"
        LINTS_PASSED=$((LINTS_PASSED + 1))
    else
        echo -e "${RED}❌ $lint_name failed${NC}"
    fi
    echo ""
}

# Server linting
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo -e "${BLUE}🖥️  Server Code Quality${NC}"
    cd server
    
    # Check if lint script exists
    if npm run | grep -q "lint"; then
        run_lint "Server ESLint" "npm run lint"
    else
        echo -e "${YELLOW}⚠️  No lint script found in server/package.json${NC}"
    fi
    
    # TypeScript check if applicable
    if [ -f "tsconfig.json" ]; then
        run_lint "Server TypeScript Check" "npx tsc --noEmit"
    fi
    
    cd ..
fi

# Web linting
if [ -d "web" ] && [ -f "web/package.json" ]; then
    echo -e "${BLUE}🌐 Web Code Quality${NC}"
    cd web
    
    # Check if lint script exists
    if npm run | grep -q "lint"; then
        run_lint "Web ESLint" "npm run lint"
    else
        echo -e "${YELLOW}⚠️  No lint script found in web/package.json${NC}"
    fi
    
    # TypeScript check if applicable
    if [ -f "tsconfig.json" ]; then
        run_lint "Web TypeScript Check" "npx tsc --noEmit"
    fi
    
    cd ..
fi

# Docker linting
if command -v hadolint &> /dev/null; then
    echo -e "${BLUE}🐳 Docker Linting${NC}"
    
    # Lint Dockerfiles
    for dockerfile in $(find . -name "Dockerfile*" -type f); do
        run_lint "Docker: $dockerfile" "hadolint $dockerfile"
    done
else
    echo -e "${YELLOW}⚠️  hadolint not installed - skipping Docker linting${NC}"
fi

# Summary
echo -e "${BLUE}📊 Code Quality Summary${NC}"
echo -e "Checks passed: ${GREEN}$LINTS_PASSED${NC}/$TOTAL_LINTS"

if [ $LINTS_PASSED -eq $TOTAL_LINTS ] && [ $TOTAL_LINTS -gt 0 ]; then
    echo -e "${GREEN}🎉 All code quality checks passed!${NC}"
    exit 0
elif [ $TOTAL_LINTS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No linting tools found${NC}"
    exit 0
else
    echo -e "${RED}❌ Some code quality checks failed${NC}"
    exit 1
fi