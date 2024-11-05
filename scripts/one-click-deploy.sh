#!/bin/bash

# Log start of script
echo "Starting deployment script..."

# Clean workspaces and install dependencies
echo "Cleaning workspaces..."
pnpm clean:workspaces
echo "Installing dependencies..."
pnpm install

# Set environment to production
export NODE_ENV=production
echo "Environment set to production."

# Build and deploy apps/web
echo "Building and deploying apps/web..."
cd apps/web
pnpm build
firebase deploy || { echo "Firebase deploy for apps/web failed"; exit 1; }
cd ../..

# Build and deploy apps/proxy
echo "Building and deploying apps/proxy..."
cd apps/proxy
pnpm build
firebase deploy || { echo "Firebase deploy for apps/proxy failed"; exit 1; }
cd ../..

# Build apps/api
echo "Building apps/api..."
cd apps/api
pnpm build || { echo "Build failed for apps/api"; exit 1; }
cd ../..

# Log Cloud Run deployment
echo "Preparing for Cloud Run deployment..."

# Set environment variables for Cloud Run
export COMMIT_SHA=$(git rev-parse --short HEAD)
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"
export GITHUB_USERNAME="techwithanirudh"

echo "Environment variables set:"
echo "  COMMIT_SHA: $COMMIT_SHA"
echo "  DEPLOY_REGION: $DEPLOY_REGION"
echo "  SERVICE_NAME: $SERVICE_NAME"
echo "  GITHUB_USERNAME: $GITHUB_USERNAME"

# Deploy to Cloud Run
echo "Deploying $SERVICE_NAME to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region="$DEPLOY_REGION" \
  --allow-unauthenticated \
  --port=3001 \
  --set-env-vars "$(grep -v '^#' apps/api/.env.production.local | grep -v '^\s*$' | sed 's/=\s*"\(.*\)"$/=\1/' | tr '\n' ',' | sed 's/,$//')" \
  || { echo "Cloud Run deployment failed for $SERVICE_NAME"; exit 1; }

# Build and submit to Cloud Build
echo "Submitting build to Cloud Build..."
gcloud builds submit \
  --region="$DEPLOY_REGION" \
  --config=cloudbuild.yaml \
  --substitutions=_GITHUB_USERNAME="$GITHUB_USERNAME",_DEPLOY_REGION="$DEPLOY_REGION",_SERVICE_NAME="$SERVICE_NAME",COMMIT_SHA="$COMMIT_SHA" \
  || { echo "Cloud Build submission failed"; exit 1; }

# Log end of script
echo "Deployment script completed successfully."
