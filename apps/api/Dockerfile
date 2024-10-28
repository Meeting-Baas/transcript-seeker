# https://pnpm.io/docker
# The issue we are having is bcs the dockerfile isn't in the root of the file system, we need to fix the docker file or use gcloud or fix fucntions
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN pnpm --global add turbo@^2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "@meeting-baas/api" is the name entered in the project's package.json: { name: "@meeting-baas/api" }
RUN turbo prune @meeting-baas/api --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter @meeting-baas/api...
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
USER hono
 
# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=hono:nodejs /app/apps/api/dist ./apps/api/dist

CMD node apps/api/dist/index.js