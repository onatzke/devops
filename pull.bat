@echo off
docker network create back-net
docker network create front-net

docker pull oliwiantz/product-backend:v2
docker pull oliwiantz/product-frontend:v2

docker run -d --name backend --network back-net -v items-data:/data oliwiantz/product-backend:v1

docker run -d --name nginx-proxy --network front-net -p 80:80 oliwiantz/product-frontend:v2