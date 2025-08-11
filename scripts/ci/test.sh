#!/bin/bash

# CI/CD test script
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🧪 Running All Tests${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Track test results
TESTS_PASSED=0
TOTAL_TESTS=0

# Function to run tests
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${BLUE}📋 Running $test_name...${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ $test_name failed${NC}"
    fi
    echo ""
}

# Server tests
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo -e "${BLUE}🖥️  Server Tests${NC}"
    cd server
    
    # Check if test script exists
    if npm run | grep -q "test"; then
        run_test "Server Unit Tests" "npm test"
    else
        echo -e "${YELLOW}⚠️  No test script found in server/package.json${NC}"
    fi
    
    cd ..
fi

# Web tests
if [ -d "web" ] && [ -f "web/package.json" ]; then
    echo -e "${BLUE}🌐 Web Tests${NC}"
    cd web
    
    # Check if test script exists
    if npm run | grep -q "test"; then
        run_test "Web Unit Tests" "npm test"
    else
        echo -e "${YELLOW}⚠️  No test script found in web/package.json${NC}"
    fi
    
    cd ..
fi

# Integration tests (if they exist)
if [ -f "tests/integration.test.js" ] || [ -d "tests" ]; then
    echo -e "${BLUE}🔗 Integration Tests${NC}"
    run_test "Integration Tests" "npm run test:integration"
fi

# Summary
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}/$TOTAL_TESTS"

if [ $TESTS_PASSED -eq $TOTAL_TESTS ] && [ $TOTAL_TESTS -gt 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
elif [ $TOTAL_TESTS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No tests found to run${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi