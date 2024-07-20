import { Request, Response } from "express";
import { getMeetings } from "../db/queries";

export const meetings = async (req: Request, res: Response) => {
  const response = await getMeetings();
  console.log("meetings", response);

  res.json(response);
};
