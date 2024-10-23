//https://nitro.unjs.io/config
import process from 'node:process';

const env = process.env;

const MEETINGBAAS_API_URL = env.NITRO_MEETINGBAAS_API_URL || 'https://api.meeting-baas.com';
const MEETINGBAAS_S3_URL =
  env.NITRO_MEETINGBAAS_S3_URL || 'https://s3.eu-west-3.amazonaws.com/meeting-baas-video';

export default defineNitroConfig({
  srcDir: 'server',
  database: {
    default: {
      connector: 'sqlite',
      options: { name: 'db' }
    },
    // users: {
    //   connector: 'postgresql',
    //   url: 'postgresql://username:password@hostname:port/database_name'
    // }
  },
  runtimeConfig: {
    googleClientId: 'dev_token',
    googleClientSecret: 'dev_token',
    googleRedirectUri: 'dev_token',
  },
  // https://github.com/unjs/rou3/tree/radix3#route-matcher
  routeRules: {
    '/api/meetingbaas/**': { proxy: `${MEETINGBAAS_API_URL}/**`, cors: true },
    '/api/s3/**': { proxy: `${MEETINGBAAS_S3_URL}/**`, cors: true },
    // '/proxy/**': { proxy: '/api/**' },
  },
  experimental: {
    database: true
  },
  firebase: {
    gen: 2,
    nodeVersion: '20',
  },
});
