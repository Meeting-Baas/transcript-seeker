import { z } from "zod";

export const webhookSchema = z.object({
  event: z.string(),
  data: z.object({
    bot_id: z.string(),
    transcript: z.array(
      z.object({
        speaker: z.string(),
        words: z.array(
          z.object({
            start: z.number(),
            end: z.number(),
            word: z.string(),
          }),
        ),
      }),
    ),
    speakers: z.array(z.string()),
    mp4: z.string().url(),
  }),
});
