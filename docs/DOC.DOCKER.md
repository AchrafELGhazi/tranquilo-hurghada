# Stop everything
docker-compose down

# Clean up all Docker resources
docker system prune -a -f

# Remove any remaining containers
docker container prune -f

# Remove any remaining images
docker image prune -a -f

# Now try starting fresh
docker-compose up -d --build