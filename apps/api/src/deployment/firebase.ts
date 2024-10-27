import { getRequestListener } from "@hono/node-server";
import { onRequest } from "firebase-functions/v2/https";
import { handler } from "@/index";

export const web = onRequest(getRequestListener(handler));
