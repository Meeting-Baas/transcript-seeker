import { sql } from "drizzle-orm";
import { serial, text, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core";

export const meetingTypeEnum = pgEnum("type", ["meetingbaas", "local"]);
export const meetingStatusEnum = pgEnum("status", ["loaded", "loading", "error"]);

export const meetingsTable = pgTable("meetings", {
    id: serial("id"),
    type: meetingTypeEnum(),
    name: text("name"),
    bot_id: text("bot_id").notNull(),
    attendees: text("attendees")
        .array()
        .notNull()
        .default(sql`'{}'::text[]`),
    status: meetingStatusEnum(),
    // transcript: text("transcript")
    //   .array()
    //   .notNull()
    //   .default(sql`'{}'::jsonb[]`),
    // video_url: text("video_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
});

export type InsertMeeting = typeof meetingsTable.$inferInsert;
export type SelectMeeting = typeof meetingsTable.$inferSelect;

export const apiKeyTypeEnum = pgEnum("type", ["meetingbaas", "gladia", "openai", "assemblyai"]);

export const apiKeysTable = pgTable("api_keys", {
    id: serial("id"),
    type: apiKeyTypeEnum(),
    content: text("content")
});

export type InsertAPIKey = typeof apiKeysTable.$inferInsert;
export type SelectAPIKey = typeof apiKeysTable.$inferSelect;
