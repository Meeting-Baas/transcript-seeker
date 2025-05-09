//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',

  runtimeConfig: {
    trustedOrigins: "https://app.transcriptseeker.com",
    meetingbaasApiUrl: "https://api.meetingbaas.com",
    meetingbaasS3Url: "https://s3.eu-west-3.amazonaws.com/meeting-baas-video",
  },

  firebase: {
    gen: 2,
    nodeVersion: '20',
  },

  compatibilityDate: '2024-11-05',
});