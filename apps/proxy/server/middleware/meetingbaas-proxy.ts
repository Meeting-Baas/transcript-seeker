import { createProxyEventHandler } from 'h3-proxy';
import { eventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';

export default eventHandler((event) => {
  const config = useRuntimeConfig(event);
  const meetingBaasApiUrl = config.meetingBaasApiUrl;
  
  if (!meetingBaasApiUrl) {
    throw new Error('Missing meetingBaasApiUrl in runtime config');
  }

  const proxy = createProxyEventHandler({
    target: meetingBaasApiUrl,
    pathRewrite: {
      '^/api/meetingbaas': '',
    },
    pathFilter: ['/api/meetingbaas/**'],
  });

  return proxy(event);
});
