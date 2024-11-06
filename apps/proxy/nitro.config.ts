//https://nitro.unjs.io/config
import process from 'node:process';

const env = process.env;

const MEETINGBAAS_API_URL = env.NITRO_MEETINGBAAS_API_URL || 'https://api.meetingbaas.com';
const MEETINGBAAS_S3_URL =
  env.NITRO_MEETINGBAAS_S3_URL || 'https://s3.eu-west-3.amazonaws.com/meeting-baas-video';

export default defineNitroConfig({
  srcDir: 'server',

  // https://github.com/unjs/rou3/tree/radix3#route-matcher
  routeRules: {
    '/api/meetingbaas/**': { proxy: `${MEETINGBAAS_API_URL}/**`, cors: true },
    '/api/s3/**': { proxy: `${MEETINGBAAS_S3_URL}/**`, cors: true },
    // '/proxy/**': { proxy: '/api/**' },
  },

  firebase: {
    gen: 2,
    nodeVersion: '20',
  },

  compatibilityDate: '2024-11-05',
});