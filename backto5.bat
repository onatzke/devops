docker compose down
docker network create front-net
docker network create back-net
docker volume create items-data
docker run -d --name backend --network back-net -v items-data:/data oliwiantz/product-backend:v2
docker run -d --name nginx-proxy --network front-net -p 80:80 oliwiantz/product-frontend:v2
docker network connect back-net nginx-proxy