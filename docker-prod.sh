#!/bin/bash

# Script to run production Docker Compose from project root
echo "Starting Tranquilo production environment..."

# Check if docker-compose file exists
if [ ! -f "docker/prod/docker-compose.yml" ]; then
    echo "Error: docker/prod/docker-compose.yml not found"
    exit 1
fi

# Run docker-compose with production configuration
docker-compose -f docker/prod/docker-compose.yml "$@"