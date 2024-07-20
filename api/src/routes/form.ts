import express from "express";
import { validateData } from "../middleware/zod";
import { formSchema } from "../schemas/form";

const formRouter = express.Router();

import { form } from "./formController";

formRouter.post("/", validateData(formSchema), form);

export default formRouter;
