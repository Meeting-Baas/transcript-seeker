import { createProxyEventHandler } from 'h3-proxy';
import { eventHandler, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

export default eventHandler((event) => {
  const { meetingBaasS3Url } = useRuntimeConfig(event);

  if (!meetingBaasS3Url) {
    console.error('Missing configuration: meetingBaasS3Url');
    throw createError({
      statusCode: 500,
      message: 'Server configuration error',
    });
  }

  const proxy = createProxyEventHandler({
    target: meetingBaasS3Url,
    pathRewrite: {
      '^/api/s3': '',
    },
    pathFilter: ['/api/s3/**'],
  });

  try {
    return proxy(event);
  } catch (error) {
    console.error('S3 proxy error:', error);
    throw createError({
      statusCode: 502,
      message: 'Error connecting to storage service',
    });
  }
});
