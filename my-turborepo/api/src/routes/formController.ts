import * as MeetingBaas from "@meeting-baas/shared";
import { Request, Response } from "express";

export const form = async (req: Request, res: Response) => {
  const {
    meetingBotName,
    meetingURL,
    meetingBotImage,
    meetingBotEntryMessage,
    apiKey,
  } = req.body;

  const response = await MeetingBaas.joinMeeting({
    meetingBotName,
    meetingURL,
    meetingBotImage,
    meetingBotEntryMessage,
    apiKey,
  });

  if (response.error) {
    res.status(500).send(response.error);
  } else {
    res.send(response.data);
  }
};
