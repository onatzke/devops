@echo off
docker stop nginx-proxy
docker rm nginx-proxy
docker build -t product-frontend:v2 --build-arg IMAGE_VERSION=v2 ./frontend/
docker run -d --name nginx-proxy --network front-net -p 80:80 product-frontend:v2
docker network connect back-net nginx-proxy