# Export these vars 
export COMMIT_SHA=$(git rev-parse --short HEAD)
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"

# First Time
gcloud init
gcloud run deploy transcript-seeker-api-prod \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region="$DEPLOY_REGION" \
  --allow-unauthenticated \
  --port=3001 \
  --set-env-vars "$(grep -v '^#' apps/api/.env.production.local | grep -v '^\s*$' | sed 's/=\s*"\(.*\)"$/=\1/' | tr '\n' ',' | sed 's/,$//')"

# Every Time
gcloud builds submit --region="$DEPLOY_REGION" --config=cloudbuild.yaml --substitutions=_GITHUB_USERNAME="your_github_username",_DEPLOY_REGION=$DEPLOY_REGION,_SERVICE_NAME=$SERVICE_NAME,COMMIT_SHA=$COMMIT_SHA