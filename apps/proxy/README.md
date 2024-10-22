# Proxy Server for Transcript Seeker

This proxy server facilitates seamless communication between Transcript Seeker and MeetingBaas, including integration with its S3 bucket.

## Setup Instructions

To deploy the proxy server, use one of the deployment options listed here: [Nitro Deploy Options](https://nitro.unjs.io/deploy).

For a quick and straightforward setup, consider deploying on Vercel, which offers a one-click, zero-configuration deployment option. Once deployed, make sure to set the following environment variables:

- `NITRO_MEETINGBAAS_API_URL` - The URL for the MeetingBaas API
- `NITRO_MEETINGBAAS_S3_URL` - The URL for the MeetingBaas S3 bucket

### Local Development

If you need to use the proxy server for local development, set the `VITE_PROXY_URL` in the root `.env` file accordingly.

