export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path');
  const base = useRuntimeConfig(event).meetingbaasS3Url;
  const targetUrl = new URL(path, base).href;
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
