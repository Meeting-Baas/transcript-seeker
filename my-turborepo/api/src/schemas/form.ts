import { z } from "zod";

export const formSchema = z.object({
  meetingBotName: z.string().min(3).optional().or(z.literal("")),
  meetingURL: z.string().url(),
  meetingBotImage: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .default(
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    ),
  meetingBotEntryMessage: z.string().optional().or(z.literal("")),
  apiKey: z.string(),
});
