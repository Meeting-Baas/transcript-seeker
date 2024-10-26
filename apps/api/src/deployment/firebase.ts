// todo: find a better way
import "dotenv/config";

import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { onRequest } from "firebase-functions/v2/https";

import meetingbaas from "@/routes/meetingbaas";
import authRouter from "@/routes/auth";
import calendars from "@/routes/calendars";

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

app.route("/api/auth", authRouter);
app.route("/api/meetingbaas", meetingbaas);
app.route("/api/calendars", calendars);

export const web = onRequest(getRequestListener(app.fetch));
