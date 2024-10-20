import { sql } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const meetingTypeEnum = pgEnum('meeting_type', ['meetingbaas', 'local']);
export const meetingStatusEnum = pgEnum('meeting_status', ['loaded', 'loading', 'error']);

export const meetingsTable = pgTable('meetings', {
  id: serial('id'),
  type: meetingTypeEnum(),
  name: text('name'),
  botId: text('bot_id').notNull(),
  attendees: text('attendees')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  status: meetingStatusEnum(),
  editorContent: jsonb('editor_content').notNull().default({}),
  // transcript: text("transcript")
  //   .array()
  //   .notNull()
  //   .default(sql`'{}'::jsonb[]`),
  // video_url: text("video_url").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export type InsertMeeting = typeof meetingsTable.$inferInsert;
export type SelectMeeting = typeof meetingsTable.$inferSelect;

// todo: refactor this
// export const editorsTable = pgTable("editors", {
//     id: serial("id"),
//     content: jsonb("content")
//       .notNull()
//       .default({}),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", {
//         mode: "date",
//         withTimezone: true,
//     }),
// });

// export type InsertEditor = typeof editorsTable.$inferInsert;
// export type SelectEditor = typeof editorsTable.$inferSelect;

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
