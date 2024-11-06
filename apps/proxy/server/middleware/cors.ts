export default defineEventHandler((event) => {
  const trustedOrigins = useRuntimeConfig(event).trustedOrigins.split(',');
  const didHandleCors = handleCors(event, {
    origin: trustedOrigins,
    preflight: {
      statusCode: 204,
    },
    methods: '*',
  });

  if (didHandleCors) {
    return;
  }
});
