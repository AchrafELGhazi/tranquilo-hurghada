# Tranquilo Hurghada - Development Commands (Simplified)
.PHONY: help dev-start dev-stop dev-reset dev-logs dev-build dev-seed

# Default target
help: ## Show this help message
	@echo "🏖️  Tranquilo Hurghada Development Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🚀 Quick start: make dev-start"

# === Development Environment ===
dev-start: ## Start development environment
	@./scripts/dev/start.sh

dev-stop: ## Stop development environment
	@./scripts/dev/stop.sh

dev-reset: ## Reset development environment with fresh database
	@./scripts/dev/reset.sh

dev-logs: ## View all development logs
	@./scripts/dev/logs.sh

dev-logs-server: ## View server logs only
	@./scripts/dev/logs-server.sh

dev-logs-web: ## View web logs only
	@./scripts/dev/logs-web.sh

# === Database Operations ===
dev-seed: ## Seed development database
	@./scripts/dev/seed.sh

dev-db-studio: ## Open Prisma Studio
	@./scripts/dev/db-studio.sh

dev-db-shell: ## Access PostgreSQL shell
	@./scripts/dev/db-shell.sh

# === Build Operations ===
dev-build: ## Rebuild all services
	@./scripts/dev/build.sh all

dev-build-server: ## Rebuild server only
	@./scripts/dev/build.sh server

dev-build-web: ## Rebuild web only
	@./scripts/dev/build.sh web

# === Shell Access ===
dev-shell-server: ## Access server container shell
	@./scripts/dev/shell-server.sh

dev-shell-web: ## Access web container shell
	@./scripts/dev/shell-web.sh

# === Utilities ===
dev-clean: ## Clean development environment
	@./scripts/dev/clean.sh

setup: ## Initial project setup
	@./scripts/utils/setup.sh

# === Production Commands ===
prod-deploy: ## Deploy to production
	@./scripts/prod/deploy.sh

# === Quick aliases ===
start: dev-start ## Alias for dev-start
stop: dev-stop ## Alias for dev-stop
logs: dev-logs ## Alias for dev-logs