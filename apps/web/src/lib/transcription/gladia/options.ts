import { z } from 'zod';

export const options = z.object({
  diarization: z.boolean().describe('Speaker Diarization').optional(),
  summarization: z.boolean().describe('Summarization').optional(),
  named_entity_recognition: z.boolean().describe('Named Entity Recognition').optional(),
  sentiment_analysis: z.boolean().describe('Sentiment Analysis').optional(),
  chapterization: z.boolean().describe('Chapterization').optional(),
});
