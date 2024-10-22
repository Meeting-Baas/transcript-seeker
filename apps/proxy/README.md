# Proxy Server for Transcript Seeker

This proxy server facilitates seamless communication between Transcript Seeker and MeetingBaas, including integration with its S3 bucket.

## Setup Instructions

To deploy the proxy server, use one of the deployment options listed here: [Nitro Deploy Options](https://nitro.unjs.io/deploy).

Once deployed, make sure to set the following environment variables:

- `NITRO_MEETINGBAAS_API_URL` - The URL for the MeetingBaas API
- `NITRO_MEETINGBAAS_S3_URL` - The URL for the MeetingBaas S3 bucket

### Local Development

If you need to use the proxy server for local development, set the `VITE_PROXY_URL` in the root `.env` file accordingly.

### Firebase Deployment

To deploy using firebase use the following command:
```sh
pnpm dlx firebase-tools deploy --only functions:server,hosting --project <project-id>
```