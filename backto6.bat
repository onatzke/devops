docker stop nginx-proxy backend
docker rm nginx-proxy backend
docker network rm front-net back-net
docker volume rm items-data
docker compose up -d