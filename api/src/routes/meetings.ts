import express from "express";

const meetingsRouter = express.Router();

import { meetings } from "./meetingsController";

meetingsRouter.get("/", meetings);

export default meetingsRouter;
