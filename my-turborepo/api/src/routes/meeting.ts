import express from "express";

const meetingRouter = express.Router();

import { meeting, deleteController } from "./meetingController";

meetingRouter.get("/:botId", meeting);
meetingRouter.delete("/:botId", deleteController);

export default meetingRouter;
