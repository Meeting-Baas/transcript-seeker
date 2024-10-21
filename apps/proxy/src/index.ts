import dotenv from "dotenv";
import path from "path";

var root: string;

var root = path.resolve(__dirname, "..", "..");
dotenv.config({
  path: path.resolve(root, ".env"),
});

import express, { Express, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { checkEnvironmentVariables } from "./lib/utils";

import cors from "cors";

const app: Express = express();
checkEnvironmentVariables();

app.set("trust proxy", 1); // trust first proxy
app.use(cors());

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).send("OK"),
);

const baasProxy = createProxyMiddleware<Request, Response>({
  // todo: revert this back later
  target: "https://api.meeting-baas.com",
  changeOrigin: true,
});

app.use("/api/meetingbaas", baasProxy);

const s3Proxy = createProxyMiddleware<Request, Response>({
  target: "https://s3.eu-west-3.amazonaws.com/meeting-baas-video",
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
