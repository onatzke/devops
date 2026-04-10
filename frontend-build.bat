@echo off
docker stop nginx-proxy
docker rm nginx-proxy
docker build -t product-frontend:v2 ./frontend/
docker run -d --name nginx-proxy --network product-network -p 80:80 product-frontend:v2