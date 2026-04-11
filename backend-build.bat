@echo off
docker stop api-a api-b
docker rm api-a api-b
docker build -t product-backend:v1 --build-arg IMAGE_VERSION=v1 ./backend/
docker run -d --name api-a --network product-network -e INSTANCE_ID=instance-a product-backend:v1
docker run -d --name api-b --network product-network -e INSTANCE_ID=instance-b product-backend:v1