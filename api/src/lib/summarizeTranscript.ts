import { OpenAI } from "openai";

interface TranscriptEntry {
  speaker: string;
  words: Array<{
    start: number;
    end: number;
    word: string;
  }>;
}

const SYSTEM_PROMPT_DESCRIPTION = `Given a detailed transcript of a meeting, generate a concise summary that captures the key points, decisions made, and action items, formatted in Markdown for better readability and organization. Note: Do NOT include a date in the response.`;

export async function summarizeTranscript(transcript: TranscriptEntry[]) {
  try {
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
        apiKey: process.env.OPENAI_API_KEY,
      });
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT_DESCRIPTION },
          {
            role: "user",
            content: transcript
              .map(
                (entry: TranscriptEntry) =>
                  `${entry.speaker}: ${entry.words
                    .map((word) => word.word)
                    .join(" ")}`,
              )
              .join("\n"),
          },
        ],
      });

      return completion.choices[0].message.content;
    } else {
      return "OpenAI key is not set in Node JS.";
    }
  } catch (error) {
    console.error("Error summarizing transcript:", error);
    return null;
  }
}
