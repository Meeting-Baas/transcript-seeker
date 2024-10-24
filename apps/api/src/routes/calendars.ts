import { Hono } from "hono";
import { cors } from "hono/cors";

import { db } from "@/db/client";
import { account } from "@/db/schema";

import { eq } from "@/db";

import type { Bindings } from "@/types";
import { auth } from "@/lib/auth";

const calendars = new Hono<Bindings>();
calendars.use("/*", cors());

// todo: do only pass the parsed data do not pass everything
// tod: this is bcs that we have client_id and secret in baas apis
// todo: think about if we should use /api/meetingbaas or custom routes
// todo: i think 2nd option is better
// todo: use routes to seperate auth with calendars
calendars.post("/", async (c) => {
  const baasApiKey = c.req.header("x-spoke-api-key");
  const body = c.req.parseBody();

  if (!baasApiKey) return c.body(null, 401);

  const user = c.get("user");
  if (!user) return c.body(null, 401);

  const userAccount = await db.query.account.findFirst({
    where: eq(account.userId, user.id),
  });
  if (!userAccount) return c.body(null, 401);

  const response = await fetch(`${process.env.MEETINGBASS_API_URL}/calendars`, {
    headers: {
      "x-spoke-api-key": baasApiKey,
    },
    body: {
      ...body,
      oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      oauth_refresh_token: userAccount.refreshToken,
    },
  });

  console.log(await response.json())
  return c.body(null, 200);
});

export default calendars;
