# Proxy Server for Transcript Seeker

This proxy server facilitates seamless communication between Transcript Seeker and MeetingBaas, including integration with its S3 bucket.

## Setup Instructions

To deploy the proxy server, use one of the deployment options listed here: [Nitro Deploy Options](https://nitro.unjs.io/deploy).

Once deployed, make sure to set the following environment variables:

- `NITRO_MEETINGBAAS_API_URL` - The URL for the MeetingBaas API
- `NITRO_MEETINGBAAS_S3_URL` - The URL for the MeetingBaas S3 bucket

### Local Development

If you need to use the proxy server for local development, set the `VITE_PROXY_URL` in the root `.env` file accordingly.

### Google Cloud Run Deployment

To deploy this application using Cloud Run, follow the guide below:
[Deploying Node.js Apps to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service).

Skip the "Write the sample service" section, and then proceed to the next steps.

The command will deploy your API, making it accessible via Cloud Run. For more detailed instructions, refer to the Firebase documentation on deploying cloud functions and hosting services.
