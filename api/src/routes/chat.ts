import express from "express";
import { validateData } from "../middleware/zod";
import { chatSchema } from "../schemas/chat";

const chatRouter = express.Router();

import { chat } from "./chatController";

chatRouter.post("/", validateData(chatSchema), chat);

export default chatRouter;
