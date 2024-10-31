import express from "express";
import { validateData } from "../middleware/zod";
import { webhookSchema } from "../schemas/webhook";

const webhookRouter = express.Router();

import { webhook } from "./webhookController";

webhookRouter.post("/", validateData(webhookSchema), webhook);

export default webhookRouter;
