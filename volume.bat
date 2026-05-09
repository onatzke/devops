curl.exe http://localhost/api/items
docker rm -f backend
docker volume rm items-data
docker volume create items-data
docker run -d --name backend --network back-net -v items-data:/data oliwiantz/product-backend:v2
curl.exe http://localhost/api/items
