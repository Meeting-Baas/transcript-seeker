import { relations, sql } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import type { Message, Transcript } from '@meeting-baas/shared';

export const apiKeyTypeEnum = pgEnum('api_key_type', [
  'meetingbaas',
  'gladia',
  'openai',
  'assemblyai',
]);

export const apiKeysTable = pgTable('api_keys', {
  id: serial('id'),
  type: apiKeyTypeEnum(),
  content: text('content'),
});

export type InsertAPIKey = typeof apiKeysTable.$inferInsert;
export type SelectAPIKey = typeof apiKeysTable.$inferSelect;

export const meetingTypeEnum = pgEnum('meeting_type', ['meetingbaas', 'local']);
export const meetingStatusEnum = pgEnum('meeting_status', ['loaded', 'loading', 'error']);

export const meetingsTable = pgTable('meetings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: meetingTypeEnum().notNull(),
  status: meetingStatusEnum().notNull(),
  botId: text('bot_id').notNull(),
  attendees: text('attendees')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  transcripts: jsonb('transcripts')
    .notNull()
    .$type<Transcript[]>()
    .default(sql`'[]'::jsonb`),
  assets: jsonb('assets')
    .notNull()
    .$type<{
      // todo: this is very misleading saying that blob_can store Blob
      video_url: string | null;
      video_blob: Blob | null;
    }>()
    .default({
      video_url: null,
      video_blob: null,
    }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const meetingsRelations = relations(meetingsTable, ({ one }) => ({
  editors: one(editorsTable),
  chats: one(chatsTable),
}));

export type InsertMeeting = typeof meetingsTable.$inferInsert;
export type SelectMeeting = typeof meetingsTable.$inferSelect;

export const editorsTable = pgTable('editors', {
  id: serial('id'),
  meetingId: serial('meeting_id'),
  content: jsonb('content').notNull().default({}),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const editorsRelations = relations(editorsTable, ({ one }) => ({
  editor: one(meetingsTable, {
    fields: [editorsTable.meetingId],
    references: [meetingsTable.id],
  }),
}));

export type InsertEditor = typeof editorsTable.$inferInsert;
export type SelectEditor = typeof editorsTable.$inferSelect;

export const chatsTable = pgTable('chats', {
  id: serial('id'),
  meetingId: serial('meeting_id'),
  messages: jsonb('messages')
    .notNull()
    .$type<Message[]>()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const chatsRelations = relations(chatsTable, ({ one }) => ({
  chat: one(meetingsTable, {
    fields: [chatsTable.meetingId],
    references: [meetingsTable.id],
  }),
}));

export type InsertChat = typeof chatsTable.$inferInsert;
export type SelectChat = typeof chatsTable.$inferSelect;
