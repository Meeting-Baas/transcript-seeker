import * as MeetingBaas from "@meeting-baas/shared";
import { Request, Response } from "express";

import { deleteMeeting } from "../db/queries";

export const meeting = async (req: Request, res: Response) => {
  const botId = req.params.botId;
  // todo: cleanup fetchBotDetails and joinMeeting later
  const details = await MeetingBaas.fetchBotDetails({
    botId,
    apiKey: process.env.BASS_API_KEY || "",
  });

  if ("error" in details) {
    return res.status(500).json(details);
  }
  res.json(details);
};

export const deleteController = async (req: Request, res: Response) => {
  const botId = req.params.botId;
  const response = await deleteMeeting(parseInt(botId) || 0);
  console.log("deleted", response);

  res.json({ botId });
};
