FROM node:20-alpine AS base
 
FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app
 
# Copy root package.json and lockfile
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy the api package.json
COPY apps/api/package.json ./apps/api/package.json
 
RUN pnpm install && \
    pnpm run build && \
    pnpm prune --prod
 
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy app source
COPY --from=builder --chown=hono:nodejs . .
 
USER hono
EXPOSE 3001 
CMD [ "node", "apps/api/dist/index.js" ]