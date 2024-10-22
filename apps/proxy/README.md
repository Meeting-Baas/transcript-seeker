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

To deploy this application using Firebase, use the following command:
```sh
pnpm dlx firebase-tools deploy --only functions:server,hosting --project <project-id>
```

Before running this command, ensure that you have properly configured your Firebase project, including setting up your project ID and enabling Firebase Functions and Hosting. Additionally, make sure to uncomment the `NITRO_PRESET=firebase` in your configuration, as this customization ensures that the project is built specifically for Firebase. The command will then deploy your proxy server functions, making them accessible via Firebase. For more detailed instructions, refer to the Firebase documentation on deploying cloud functions and hosting services.