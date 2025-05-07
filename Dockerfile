# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies in a separate layer for better caching
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source code (excluding files in .dockerignore)
COPY --link . .

# Create a non-root user and switch to it
RUN groupadd -r appuser && useradd -m -g appuser appuser
USER appuser

# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
