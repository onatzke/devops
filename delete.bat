@echo off
docker stop nginx-proxy api-a api-b
docker rm nginx-proxy api-a api-b

docker network rm product-network

docker rmi product-backend:v1
docker rmi product-frontend:v2

docker rmi oliwiantz/product-backend:v1
docker rmi oliwiantz/product-frontend:v2
docker rmi oliwiantz/product-backend:latest
docker rmi oliwiantz/product-frontend:latest