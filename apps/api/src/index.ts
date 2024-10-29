import "dotenv/config";

import { Hono } from "hono";

import meetingbaas from "@/routes/meetingbaas";
import authRouter from "@/routes/auth";
import calendars from "@/routes/calendars";

import { auth } from "@/lib/auth";
import type { Bindings } from "@/types";

import { handle } from '@hono/node-server/vercel'

export const config = {
  api: {
    bodyParser: false,
  },
}

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

app.route("/api/auth", authRouter);
app.route("/api/meetingbaas", meetingbaas);
app.route("/api/calendars", calendars);

const port = process.env.PORT ?? 3001;
console.log(`Hono Server is running on port ${port}`);

export default handle(app);
