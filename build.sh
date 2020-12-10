cp .env.prod .env
npm install
npm run build
npm run generate

docker-compose -f docker-compose.yml build
docker login -u "huynhdn" -p "toilatoi91" docker.io
docker push huynhdn/human_resource_cms:1.0
docker system prune -f