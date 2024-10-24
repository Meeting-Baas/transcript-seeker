import 'dotenv/config';

import { Hono } from 'hono';
import { onRequest } from 'firebase-functions/v2/https';
import { getRequestListener, serve } from '@hono/node-server';
import { auth } from "@/lib/auth";

const app = new Hono();
 
app.get('/api/auth/*', (c) => auth.handler(c.req.raw));
app.post('/api/auth/*', (c) => auth.handler(c.req.raw));

const port = 3001;
console.log(`Hono Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// export const web = onRequest(getRequestListener(app.fetch));
