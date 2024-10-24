import { Hono } from "hono";
import { cors } from "hono/cors";

import { db } from "@/db/client";
import { account } from "@/db/schema";

import { eq } from "@/db";

import type { Bindings } from "@/types";

const meetingbaas = new Hono<Bindings>();
meetingbaas.use("/*", cors());

meetingbaas.all("/*", async (c) => {
  const res = await fetch(process.env.MEETINGBASS_API_URL!, {
    // headers: c.req.raw.headers,
    ...c.req.raw,
  });
  const newResponse = new Response(res.body, res);
  return newResponse;
});

// todo: do only pass the parsed data do not pass everything
// tod: this is bcs that we have client_id and secret in baas apis
// todo: think about if we should use /api/meetingbaas or custom routes
// todo: i think 2nd option is better
// todo: use routes to seperate auth with calendars

// meetingbaas.post("/calendars/*", async (c) => {
//   const headers = c.req.header();
//   const body = await c.req.parseBody();

//   const user = c.get("user");

//   if (!user) return c.body(null, 401);
//   const userAccount = await db.query.account.findFirst({
//     where: eq(account.userId, user.id),
//   });
//   console.log(userAccount);

//   if (!userAccount) return c.body(null, 401);

//   const calendarPath = c.req.path.split("/api/meetingbaas/calendars/")[1];
//   const response = await fetch(
//     `${process.env.MEETINGBASS_API_URL}/calendars/${calendarPath}`,
//     {
//       headers: headers,
//       body: {
//         ...body,
//         oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
//         oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
//         oauth_refresh_token: userAccount.refreshToken,
//       },
//     }
//   );

//   const newResponse = new Response(response.body, response);
//   return newResponse;
// });

export default meetingbaas;
