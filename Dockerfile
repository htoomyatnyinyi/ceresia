# Use official bun image
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy manifests first to leverage layer cache
COPY package.json bun.lock ./

# Install all deps (dev + prod) for building
RUN bun install

# Copy sources and build if a "build" script exists
COPY . .
RUN grep -q "\"build\"" package.json && bun run build || true

# Final runtime image
FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy app + deps + build output from builder
COPY --from=builder /app /app

# Optionally prune dev deps (reinstall only production deps)
RUN bun install --production

EXPOSE 3000
# Default start command — expects a "start" script in package.json
CMD ["bun", "run", "start"]
# Multi-stage Dockerfile for a typical Node.js web app (works with npm)
# Put this file at /Users/htoomyatnyinyi/Desktop/WEB/ceresia-coffee/Dockerfile

# # ---- Dependencies stage ----

#     # node version: 22-alpine
# FROM node:22-alpine AS deps
# WORKDIR /app

# # install build tools for optional native modules
# RUN apk add --no-cache python3 g++ make

# # copy package manifests and install production deps (prefer npm ci if lockfile present)
# COPY package.json package-lock.json* ./ 
# RUN if [ -f package-lock.json ]; then npm ci --production; else npm install --production; fi

# # ---- Build stage (optional) ----
# FROM node:22-alpine AS build
# WORKDIR /app

# # copy source and production deps from previous stage
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # run a build if script exists (safe no-op if not defined)
# RUN if npm run | grep -q " build"; then npm run build; fi

# # ---- Runtime stage ----
# FROM node:22-alpine
# ENV NODE_ENV=production
# WORKDIR /app

# # create non-root user
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# # copy built app and node_modules
# COPY --from=build /app ./

# # drop privileges
# USER appuser

# # default port commonly used by Node apps; adjust if your app uses different port
# EXPOSE 3000

# # start the app - ensure your package.json has a "start" script
# CMD ["npm", "start"]