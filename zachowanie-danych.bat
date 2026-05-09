curl.exe http://localhost/api/items
docker rm -f backend
docker run -d --name backend --network back-net -v items-data:/data oliwiantz/product-backend:v2
curl.exe http://localhost/api/items
