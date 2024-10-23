import { z } from 'zod';

export const options = z.object({
  speaker_labels: z.boolean().describe('Speaker Diarization').optional(),
  summarization: z.object({
    summarization: z.boolean().describe('Enabled').optional(),
    summary_model: z.enum(['informative']).default('informative').describe('Summary Model'),
    summary_type: z.enum(['bullets']).default('bullets').describe('Summary Type'),
  }),
  entity_detection: z.boolean().describe('Named Entity Recognition').optional(),
  sentiment_analysis: z.boolean().describe('Sentiment Analysis').optional(),
  auto_chapters: z.boolean().describe('Chapterization').optional(),
});
