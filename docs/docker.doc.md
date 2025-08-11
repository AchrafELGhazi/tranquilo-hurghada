# Docker Commands - Tranquilo Production - All these commands run from root of app

## Basic Operations

### Start Services
```bash
docker-compose -f docker/prod/docker-compose.yml up --build
```

### Start Services (Background)
```bash
docker-compose -f docker/prod/docker-compose.yml up -d --build
```

### Stop Services
```bash
docker-compose -f docker/prod/docker-compose.yml down
```

### View Logs
```bash
docker-compose -f docker/prod/docker-compose.yml logs -f
```

## Cleanup Commands

### Full Reset & Clean Build
```bash
# Stop services
docker-compose -f docker/prod/docker-compose.yml down

# Clean everything
docker system prune -a -f
docker container prune -f
docker image prune -a -f

# Rebuild and start
docker-compose -f docker/prod/docker-compose.yml up -d --build
```

### Quick Cleanup
```bash
docker system prune -f
```

## Troubleshooting

### View Running Containers
```bash
docker ps
```

### View All Containers
```bash
docker ps -a
```

### View Images
```bash
docker images
```

### Restart Single Service
```bash
docker-compose -f docker/prod/docker-compose.yml restart web
docker-compose -f docker/prod/docker-compose.yml restart server
```