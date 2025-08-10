docker-compose down

docker system prune -a -f

docker container prune -f

docker image prune -a -f

docker-compose up -d --build
