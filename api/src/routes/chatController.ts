import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req: Request, res: Response) => {
  const { messages } = req.body;
  const systemPrompt =
    "You are a helpful assistant named AI Meeting Bot. You will be given a context of a meeting and some meeting notes, you will answer questions based on the context.";

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch {
    res.status(500).send("Error completing chat request.");
  }
};
