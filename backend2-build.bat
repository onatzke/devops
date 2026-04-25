@echo off
docker stop backend
docker rm backend
docker build -t product-backend:v2 --build-arg IMAGE_VERSION=v2 ./backend/
docker run -d --name backend --network back-net -v items-data:/data product-backend:v2