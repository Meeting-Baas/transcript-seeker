import { Hono } from "hono";
import { cors } from "hono/cors";

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

export default meetingbaas;
