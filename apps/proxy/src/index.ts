import type { Express, Request, Response } from "express";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import cors from "cors";

const app: Express = express();

app.set("trust proxy", 1); // trust first proxy
app.use(cors());

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).send("OK"),
);

const MEETINGBASS_API_URL = process.env.MEETINGBASS_API_URL;
const MEETINGBASS_S3_URL = process.env.MEETINGBASS_S3_URL;

const baasProxy = createProxyMiddleware<Request, Response>({
  target: MEETINGBASS_API_URL,
  changeOrigin: true,
});
app.use("/api/meetingbaas", baasProxy);

const s3Proxy = createProxyMiddleware<Request, Response>({
  target: MEETINGBASS_S3_URL,
  changeOrigin: true,
});
app.use("/api/s3", s3Proxy);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log(
    `\n\n[server]: 🟢🟢 Proxy is running at \u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\ 🟢🟢`,
  );
});
