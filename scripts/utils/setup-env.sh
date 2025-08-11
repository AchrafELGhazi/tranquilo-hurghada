#!/bin/bash

# Project setup script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}⚙️  Setting up Tranquilo Hurghada project...${NC}"
echo ""

# Get script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Check if required tools are installed
echo -e "${BLUE}🔍 Checking required tools...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. It's recommended for local development.${NC}"
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js is installed (${NODE_VERSION})${NC}"
fi

# Check if Make is available
if ! command -v make &> /dev/null; then
    echo -e "${YELLOW}⚠️  Make is not installed. You can still use npm scripts.${NC}"
else
    echo -e "${GREEN}✓ Make is available${NC}"
fi

echo ""

# Create necessary directories
echo -e "${BLUE}📁 Creating project structure...${NC}"
mkdir -p {docs,logs}
mkdir -p docker/{dev,prod}
mkdir -p scripts/{dev,prod,ci,utils}

echo -e "${GREEN}✓ Directory structure created${NC}"

# Make all scripts executable
echo -e "${BLUE}🔧 Making scripts executable...${NC}"
find scripts -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true
echo -e "${GREEN}✓ Scripts are now executable${NC}"

# Set up environment files
echo -e "${BLUE}🔐 Setting up environment files...${NC}"

# Server environment
if [ -d "server" ]; then
    if [ ! -f "server/.env" ] && [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
        echo -e "${GREEN}✓ Created server/.env from example${NC}"
        echo -e "${YELLOW}📝 Please update server/.env with your configuration${NC}"
    elif [ ! -f "server/.env" ]; then
        echo -e "${YELLOW}⚠️  No server/.env.example found. You may need to create server/.env manually${NC}"
    else
        echo -e "${GREEN}✓ server/.env already exists${NC}"
    fi
fi

# Web environment
if [ -d "web" ]; then
    if [ ! -f "web/.env" ] && [ -f "web/.env.example" ]; then
        cp web/.env.example web/.env
        echo -e "${GREEN}✓ Created web/.env from example${NC}"
        echo -e "${YELLOW}📝 Please update web/.env with your configuration${NC}"
    elif [ ! -f "web/.env" ]; then
        echo -e "${YELLOW}⚠️  No web/.env.example found. You may need to create web/.env manually${NC}"
    else
        echo -e "${GREEN}✓ web/.env already exists${NC}"
    fi
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo -e "${BLUE}📦 Installing root dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Root dependencies installed${NC}"
fi

# Install server dependencies
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo -e "${BLUE}🖥️  Installing server dependencies...${NC}"
    cd server && npm install && cd ..
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
fi

# Install web dependencies
if [ -d "web" ] && [ -f "web/package.json" ]; then
    echo -e "${BLUE}🌐 Installing web dependencies...${NC}"
    cd web && npm install && cd ..
    echo -e "${GREEN}✓ Web dependencies installed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Project setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "  1. ${YELLOW}Update environment files with your configuration${NC}"
echo -e "  2. ${GREEN}make dev-start${NC} or ${GREEN}npm run dev${NC} to start development"
echo -e "  3. ${GREEN}make help${NC} to see all available commands"
echo ""
echo -e "${BLUE}🌐 Once started, your app will be available at:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"