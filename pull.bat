@echo off
docker network create product-network

docker pull oliwiantz/product-backend:v1
docker pull oliwiantz/product-frontend:v2

docker run -d --name api-a --network product-network -e INSTANCE_ID=instance-a oliwiantz/product-backend:v1
docker run -d --name api-b --network product-network -e INSTANCE_ID=instance-b oliwiantz/product-backend:v1

docker run -d --name nginx-proxy --network product-network -p 80:80 oliwiantz/product-frontend:v2