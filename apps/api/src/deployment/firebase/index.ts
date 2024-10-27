import { getRequestListener } from "@hono/node-server";
import { onRequest } from "firebase-functions/v2/https";
import { handler } from "@/deployment/firebase/handler";
import app from '@/index';

export const api = onRequest(handler(app));
