import { z } from 'zod';

export const options = z.object({
  model: z.string().default('nova-2').describe('AI model used to process submitted audio'),
  diarize: z.boolean().describe('Recognize speaker changes'),
  summarize: z.enum(['v2']).optional().describe('Summarize content'),
  smart_format: z.boolean().describe('Apply formatting to transcript output'),
  utterances: z.boolean().describe('Segment speech into meaningful units'),
  detect_topics: z.boolean().optional().describe('Identify and extract key topics'),
  detect_entities: z.boolean().optional().describe('Entity Detection'),
  sentiment: z.boolean().optional().describe('Sentiment Analysis'),
  paragraphs: z.boolean().optional().describe('Split audio into paragraphs'),
});

export type DeepgramTranscriptionOptions = z.infer<typeof options>;
