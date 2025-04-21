# mongo-seed/Dockerfile

FROM mongo:8.0

WORKDIR /init-data

# Copy seed data into container
COPY . /init-data

# Copy seed script
COPY seed.sh /docker-entrypoint-initdb.d/seed.sh
# COPY wait-for-mongo.sh /docker-entrypoint-initdb.d/wait-for-mongo.sh

# Make script executable
RUN chmod +x /docker-entrypoint-initdb.d/seed.sh

ENV MONGO_USER=${MONGO_USER}
ENV MONGO_PASSWORD=${MONGO_PASSWORD}
ENV MONGO_HOST=${MONGO_HOST}

# Default command (can be overridden)
CMD ["sh", "/docker-entrypoint-initdb.d/seed.sh"]
