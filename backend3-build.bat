@echo off
docker stop backend
docker rm backend
docker build -t product-backend:v3 --build-arg IMAGE_VERSION=v3 ./backend/
