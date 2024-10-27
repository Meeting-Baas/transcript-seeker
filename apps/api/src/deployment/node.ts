import app from "@/index";
import { serve } from "@hono/node-server";

const port = 3001;
console.log(`Hono Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
