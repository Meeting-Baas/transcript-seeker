import { Hono } from "hono";
import { cors } from "hono/cors";

import { db } from "@/db/client";
import { account } from "@/db/schema";

import { eq } from "@/db";

import type { Bindings } from "@/types";
import { auth } from "@/lib/auth";

const calendars = new Hono<Bindings>();
calendars.use(
  "/*",
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGINS!,
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

calendars.get("/", async (c) => {
  const baasApiKey = c.req.header("x-spoke-api-key");
  if (!baasApiKey) return c.body(null, 401);

  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const userAccount = await db.query.account.findFirst({
    where: eq(account.userId, user.id),
  });
  if (!userAccount) return c.body(null, 401);

  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendars`, {
    method: "GET",
    headers: {
      "x-spoke-api-key": baasApiKey,
    }
  });

  if (response.status != 200) {
    console.log("error, failed to get calendars:", await response.text())
    return c.body(null, 500);
  }

  const calendars = await response.json();
  return c.body(calendars, 200);
});

// todo: do only pass the parsed data do not pass everything
// todo: this is bcs that we have client_id and secret in baas apis

calendars.post("/", async (c) => {
  const baasApiKey = c.req.header("x-spoke-api-key");
  if (!baasApiKey) return c.body(null, 401);

  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const userAccount = await db.query.account.findFirst({
    where: eq(account.userId, user.id),
  });
  if (!userAccount) return c.body(null, 401);

  const body = c.req.parseBody();  
  console.log(`${process.env.MEETINGBAAS_API_URL}/calendars`)

  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendars`, {
    method: "POST",
    headers: {
      "x-spoke-api-key": baasApiKey,
      'Content-Type': 'application/json'

    },
    body: JSON.stringify({
      ...body,
      oauth_client_id: process.env.GOOGLE_CLIENT_ID!,
      oauth_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      oauth_refresh_token: userAccount.refreshToken,
    }),
  });

  if (response.status != 200) {
    console.log("error, failed to create calendar:", await response.text())
    return c.body(null, 500);
  }

  const calendars = await response.json();
  console.log(calendars)
  return c.body(null, 200);
});

export default calendars;
