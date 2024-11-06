import { createProxyEventHandler } from 'h3-proxy'

export default eventHandler((event) => {
  const { meetingbaasApiUrl } = useRuntimeConfig(event);
  
  const proxy = createProxyEventHandler({
    target: meetingbaasApiUrl,
    pathRewrite: {
      '^/api/meetingbaas': '',
    },
    pathFilter: ['/api/meetingbaas/**']
  })

  return proxy(event);
});
