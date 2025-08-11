@echo off
REM Script to run production Docker Compose from project root
echo Starting Tranquilo production environment...

REM Check if docker-compose file exists
if not exist "docker\prod\docker-compose.yml" (
    echo Error: docker\prod\docker-compose.yml not found
    exit /b 1
)

REM Run docker-compose with production configuration
docker-compose -f docker/prod/docker-compose.yml %*