import 'dotenv/config';

import { Hono } from 'hono';
import { onRequest } from 'firebase-functions/v2/https';
import { getRequestListener, serve } from '@hono/node-server';
import { auth } from "@/lib/auth";
import { cors } from "hono/cors";

const app = new Hono();
 
app.use(
	"/api/auth/**",
	cors({
		origin: "http://localhost:5173", 
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);
app.on(["POST", "GET"], "/api/auth/**", (c) => {
	return auth.handler(c.req.raw); 
});

const port = 3001;
console.log(`Hono Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// export const web = onRequest(getRequestListener(app.fetch));
