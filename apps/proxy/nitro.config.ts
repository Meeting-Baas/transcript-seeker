//https://nitro.unjs.io/config
import process from 'node:process';

const env = process.env;

const MEETINGBAAS_API_URL = env.NITRO_MEETINGBAAS_API_URL || 'https://api.meetingbaas.com';
const MEETINGBAAS_S3_URL =
  env.NITRO_MEETINGBAAS_S3_URL || 'https://s3.eu-west-3.amazonaws.com/meeting-baas-video';
const NITRO_WEB_URL = env.NITRO_WEB_URL || 'https://app.transcriptseeker.com';

export default defineNitroConfig({
  srcDir: 'server',

  runtimeConfig: {
    trustedOrigins: NITRO_WEB_URL,
    meetingBaasApiUrl: MEETINGBAAS_API_URL,
    meetingBaasS3Url: MEETINGBAAS_S3_URL,
  },

  firebase: {
    gen: 2,
    nodeVersion: '20',
  },

  compatibilityDate: '2024-11-05',
});
