import { z } from "zod";

export const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.string().optional(),
      content: z.string(),
    }),
  ),
});
