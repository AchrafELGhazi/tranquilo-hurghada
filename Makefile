
CLIENT_DIR = web
SERVER_DIR = server
DB_NAME = tranquilo-hurghada
DB_USER = postgres
DB_HOST = localhost
DB_PORT = 5432

GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m

.PHONY: help install dev build start test clean db-setup db-reset db-migrate db-seed docker-up docker-down lint format check-deps

help:
	@echo "$(GREEN)PERN Stack Development Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@echo "Installing server dependencies..."
	cd $(SERVER_DIR) && npm install
	@echo "Installing client dependencies..."
	cd $(CLIENT_DIR) && npm install
	@echo "$(GREEN)✓ All dependencies installed$(NC)"

install-client:
	@echo "$(GREEN)Installing client dependencies...$(NC)"
	cd $(CLIENT_DIR) && npm install

install-server:
	@echo "$(GREEN)Installing server dependencies...$(NC)"
	cd $(SERVER_DIR) && npm install

dev:
	@echo "$(GREEN)Starting development servers...$(NC)"
	@trap 'kill 0' SIGINT; \
	(cd $(SERVER_DIR) && npm run dev) & \
	(cd $(CLIENT_DIR) && npm run dev) & \
	wait

dev-client:
	@echo "$(GREEN)Starting client development server...$(NC)"
	cd $(CLIENT_DIR) && npm run dev

dev-server: 
	@echo "$(GREEN)Starting server development server...$(NC)"
	cd $(SERVER_DIR) && npm run dev

# Build commands
build: ## Build both client and server for production
	@echo "$(GREEN)Building application...$(NC)"
	@echo "Building client..."
	cd $(CLIENT_DIR) && npm run build
	@echo "Building server..."
	cd $(SERVER_DIR) && npm run build
	@echo "$(GREEN)✓ Build completed$(NC)"

build-client: ## Build client for production
	@echo "$(GREEN)Building client...$(NC)"
	cd $(CLIENT_DIR) && npm run build

build-server: ## Build server for production
	@echo "$(GREEN)Building server...$(NC)"
	cd $(SERVER_DIR) && npm run build

# Production commands
start: ## Start production servers
	@echo "$(GREEN)Starting production servers...$(NC)"
	@trap 'kill 0' SIGINT; \
	(cd $(SERVER_DIR) && npm start) & \
	(cd $(CLIENT_DIR) && npm run preview) & \
	wait

start-server: ## Start production server only
	@echo "$(GREEN)Starting production server...$(NC)"
	cd $(SERVER_DIR) && npm start

# Testing commands
test: ## Run tests for both client and server
	@echo "$(GREEN)Running tests...$(NC)"
	@echo "Running server tests..."
	cd $(SERVER_DIR) && npm test
	@echo "Running client tests..."
	cd $(CLIENT_DIR) && npm test

test-client: ## Run client tests
	@echo "$(GREEN)Running client tests...$(NC)"
	cd $(CLIENT_DIR) && npm test

test-server: ## Run server tests
	@echo "$(GREEN)Running server tests...$(NC)"
	cd $(SERVER_DIR) && npm test

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	@trap 'kill 0' SIGINT; \
	(cd $(SERVER_DIR) && npm run test:watch) & \
	(cd $(CLIENT_DIR) && npm run test:watch) & \
	wait

# Database commands
db-setup: ## Setup PostgreSQL database
	@echo "$(GREEN)Setting up database...$(NC)"
	createdb $(DB_NAME) || echo "Database may already exist"
	@echo "$(GREEN)✓ Database setup completed$(NC)"

db-reset: ## Reset database (drop and recreate)
	@echo "$(YELLOW)Resetting database...$(NC)"
	dropdb --if-exists $(DB_NAME)
	createdb $(DB_NAME)
	@echo "$(GREEN)✓ Database reset completed$(NC)"

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	cd $(SERVER_DIR) && npm run migrate
	@echo "$(GREEN)✓ Migrations completed$(NC)"

db-seed: ## Seed database with sample data
	@echo "$(GREEN)Seeding database...$(NC)"
	cd $(SERVER_DIR) && npm run seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

db-status: ## Check database connection and status
	@echo "$(GREEN)Checking database status...$(NC)"
	psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -d $(DB_NAME) -c "SELECT version();" || echo "$(RED)Database connection failed$(NC)"

# Docker commands
docker-up: ## Start Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Docker containers started$(NC)"

docker-down: ## Stop Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Docker containers stopped$(NC)"

docker-build: ## Build Docker containers
	@echo "$(GREEN)Building Docker containers...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Docker containers built$(NC)"

docker-logs: ## View Docker container logs
	docker-compose logs -f

# Code quality commands
lint: ## Run linting for both client and server
	@echo "$(GREEN)Running linters...$(NC)"
	@echo "Linting server..."
	cd $(SERVER_DIR) && npm run lint
	@echo "Linting client..."
	cd $(CLIENT_DIR) && npm run lint
	@echo "$(GREEN)✓ Linting completed$(NC)"

lint-fix: ## Fix linting issues automatically
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	cd $(SERVER_DIR) && npm run lint:fix
	cd $(CLIENT_DIR) && npm run lint:fix
	@echo "$(GREEN)✓ Linting fixes applied$(NC)"

format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	cd $(SERVER_DIR) && npm run format
	cd $(CLIENT_DIR) && npm run format
	@echo "$(GREEN)✓ Code formatted$(NC)"

# Utility commands
clean: ## Clean node_modules and build artifacts
	@echo "$(YELLOW)Cleaning project...$(NC)"
	rm -rf $(CLIENT_DIR)/node_modules
	rm -rf $(SERVER_DIR)/node_modules
	rm -rf $(CLIENT_DIR)/dist
	rm -rf $(SERVER_DIR)/dist
	rm -rf $(CLIENT_DIR)/.next
	@echo "$(GREEN)✓ Project cleaned$(NC)"

clean-cache: ## Clear npm cache
	@echo "$(YELLOW)Clearing npm cache...$(NC)"
	npm cache clean --force
	@echo "$(GREEN)✓ Cache cleared$(NC)"

check-deps: ## Check for outdated dependencies
	@echo "$(GREEN)Checking dependencies...$(NC)"
	@echo "Server dependencies:"
	cd $(SERVER_DIR) && npm outdated
	@echo "Client dependencies:"
	cd $(CLIENT_DIR) && npm outdated

update-deps: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	cd $(SERVER_DIR) && npm update
	cd $(CLIENT_DIR) && npm update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

# Health check
health: ## Check application health
	@echo "$(GREEN)Checking application health...$(NC)"
	@curl -f http://localhost:5000/health || echo "$(RED)Server health check failed$(NC)"
	@curl -f http://localhost:3000 || echo "$(RED)Client health check failed$(NC)"

# Environment setup
setup: ## Initial project setup
	@echo "$(GREEN)Setting up PERN stack project...$(NC)"
	@make install
	@make db-setup
	@make db-migrate
	@make db-seed
	@echo "$(GREEN)✓ Project setup completed$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start development servers$(NC)"

# Deployment
deploy-staging: ## Deploy to staging environment
	@echo "$(GREEN)Deploying to staging...$(NC)"
	@make build
	@echo "$(GREEN)✓ Staging deployment completed$(NC)"

deploy-prod: ## Deploy to production environment
	@echo "$(GREEN)Deploying to production...$(NC)"
	@make build
	@make test
	@echo "$(GREEN)✓ Production deployment completed$(NC)"