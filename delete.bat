@echo off
docker stop nginx-proxy backend
docker rm nginx-proxy backend

docker network rm back-net front-net

docker rmi product-backend:v2
docker rmi product-frontend:v2

docker rmi oliwiantz/product-backend:v2
docker rmi oliwiantz/product-frontend:v2
docker rmi oliwiantz/product-backend:latest

docker rmi oliwiantz/product-frontend:latest