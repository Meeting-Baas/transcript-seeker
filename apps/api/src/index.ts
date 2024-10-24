import "dotenv/config";

import { Hono } from "hono";
import { onRequest } from "firebase-functions/v2/https";
import { getRequestListener, serve } from "@hono/node-server";

import meetingbaas from "@/routes/meetingbaas";
import authRouter from "@/routes/auth";
import { auth } from "@/lib/auth";

import type { Bindings } from "@/types";

const app = new Hono<Bindings>();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.route('/api/meetingbaas', meetingbaas)
app.route('/api/auth', authRouter)

const port = 3001;
console.log(`Hono Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// export const web = onRequest(getRequestListener(app.fetch));
