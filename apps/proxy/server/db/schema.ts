import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  googleId: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull().unique(),
  picture: text().notNull(),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: int().notNull().references(() => usersTable.id),
  expiresAt: int().notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;
