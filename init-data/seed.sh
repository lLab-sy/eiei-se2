#!/bin/bash

sleep 1

echo "Seeding MongoDB..."

mongoimport --authenticationDatabase admin \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --host "$MONGO_HOST" \
  --port 27017 \
  --db eiei \
  --collection mediaType \
  --type json \
  --file /init-data/mediaType.json \
  --jsonArray

mongoimport --authenticationDatabase admin \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --host "$MONGO_HOST" \
  --port 27017 \
  --db eiei \
  --collection users \
  --type json \
  --file /init-data/users.json \
  --jsonArray

mongoimport --authenticationDatabase admin \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --host "$MONGO_HOST" \
  --port 27017 \
  --db eiei \
  --collection postTypes \
  --type json \
  --file /init-data/posts.json \
  --jsonArray

mongoimport --authenticationDatabase admin \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --host "$MONGO_HOST" \
  --port 27017 \
  --db eiei \
  --collection postRoleTypes \
  --type json \
  --file /init-data/postRoleTypes.json \
  --jsonArray

mongoimport --authenticationDatabase admin \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --host "$MONGO_HOST" \
  --port 27017 \
  --db eiei \
  --collection mediaTypes \
  --type json \
  --file /init-data/mediaTypes.json \
  --jsonArray
