import { buildZodFieldConfig } from '@autoform/react';
import { ZodProvider } from '@autoform/zod';
import * as z from 'zod';

import type { FieldTypes } from '@meeting-baas/ui/autoform';
import { AutoForm } from '@meeting-baas/ui/autoform'; // use any UI library

const fieldConfig = buildZodFieldConfig<
  FieldTypes,
  {
    // You can define custom props here
    isImportant?: boolean;
  }
>();

export const options = z.object({
  diarization: z.boolean().describe('Speaker Diarization').optional(),
  summarization: z.boolean().describe('Summarization').optional(),
  named_entity_recognition: z.boolean().describe('Named Entity Recognition').optional(),
  sentiment_analysis: z.boolean().describe('Sentiment Analysis').optional(),
  chapterization: z.boolean().describe('Chapterization').optional(),
});
