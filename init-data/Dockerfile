# mongo-seed/Dockerfile

FROM mongo:8

WORKDIR /init-data

# Copy seed data into container
COPY ./init-data /init-data

# Copy seed script
COPY seed.sh /docker-entrypoint-initdb.d/seed.sh

# Make script executable
RUN chmod +x /docker-entrypoint-initdb.d/seed.sh

# Default command (can be overridden)
CMD ["bash", "/docker-entrypoint-initdb.d/seed.sh"]
