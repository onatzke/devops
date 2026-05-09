curl.exe http://localhost/api/items
docker compose --profile tools run --rm db-seed
curl.exe http://localhost/api/items
