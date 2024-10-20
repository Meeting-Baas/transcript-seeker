import dotenv from "dotenv";
import path from "path";

var root: string;
var client: string;

var root = path.resolve(__dirname, "..", "..");
dotenv.config({
  path: path.resolve(root, ".env"),
});

import express, { Express, Request, Response } from "express";
import { checkEnvironmentVariables } from "./lib/utils";

import cors from "cors";

const app: Express = express();
checkEnvironmentVariables();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(cors());

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).send("OK")
);

app.use((req, res) => {
  res.sendFile(path.join(client, "index.html"));
});

// webhook setup
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(
    `\n\n[server]: 🟢🟢 Proxy is running at \u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\ 🟢🟢`
  );
});
