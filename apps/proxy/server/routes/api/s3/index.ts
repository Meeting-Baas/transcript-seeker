export default defineEventHandler((event) => {
  const targetUrl = useRuntimeConfig(event).meetingbaasS3Url;
  const headers = getRequestHeaders(event);

  return sendProxy(event, targetUrl, {
    fetchOptions: {
      headers: {
        // 'x-custom-header': 'value',
        ...headers,
      },
    },
  });
});
