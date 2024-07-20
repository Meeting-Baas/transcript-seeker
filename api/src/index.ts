import dotenv from "dotenv";
import path from "path";

// handle env variable parsing
var root: string;
var client: string;

if (process.env?.NODE_ENV === "development") {
  var root = path.resolve(__dirname, "..", "..");
  var client = path.resolve(root, "client", "dist");

  dotenv.config({
    path: path.resolve(root, ".env"),
  });
} else {
  var root = path.resolve(__dirname, "..", "..", "..");
  var client = path.resolve(root, "client", "dist");

  dotenv.config({
    path: path.resolve(root, ".env"),
  });
}

import express, { Express, Request, Response } from "express";
import { checkEnvironmentVariables, listDatabases } from "./lib/utils";

import { Client } from "@notionhq/client";

import formRouter from "./routes/form";
import webhookRouter from "./routes/webhook";
import meetingsRouter from "./routes/meetings";
import meetingRouter from "./routes/meeting";
import chatRouter from "./routes/chat";

import cors from "cors";

const app: Express = express();

// SANITY CHWECK
// ENV variables
const missingEnvVars = checkEnvironmentVariables();
// NOTION DATABASES (easy source of error)
if (process.env.NOTION_API_KEY) {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    listDatabases(notion);
  } catch {
    console.log("⚠️ Could not access Notion.");
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(cors());

app.use(express.static(path.join(client)));

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).send("OK"),
);

app.use("/api/meetings", meetingsRouter);
app.use("/api/meeting", meetingRouter);

app.use("/api/chat", chatRouter);

app.use("/api/join", formRouter);
app.use("/api/webhook", webhookRouter);

app.use((req, res) => {
  res.sendFile(path.join(client, "index.html"));
});

// webhook setup
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(
    `\n\n[server]: 🟢🟢 Server is running at \u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\ 🟢🟢`,
  );
});
