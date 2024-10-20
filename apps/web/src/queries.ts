import { db } from '@meeting-baas/db/client';
import {
  apiKeysTable,
  InsertAPIKey,
  InsertMeeting,
  meetingsTable,
  SelectAPIKey,
  SelectMeeting,
} from '@meeting-baas/db/schema';
import { eq } from 'drizzle-orm';

export async function getAPIKey({ type }: { type: SelectAPIKey['type'] }) {
  if (!type) return;
  return await db.query.apiKeysTable.findFirst({
    where: (apiKeys, { eq }) => eq(apiKeys.type, type),
  });
}

export async function setAPIKey({ type, content }: InsertAPIKey) {
  if (!type) return;
  const apiKey = await db.query.apiKeysTable.findFirst({
    where: (apiKeys, { eq }) => eq(apiKeys.type, type),
  });
  if (apiKey) {
    return await db
      .update(apiKeysTable)
      .set({ type: type, content: content })
      .where(eq(apiKeysTable.type, type))
      .returning();
  } else {
    return await db.insert(apiKeysTable).values({ type: type, content: content }).returning();
  }
}

export async function getMeetings() {
  return await db.query.meetingsTable.findMany();
}

export async function createMeeting(values: InsertMeeting) {
  return await db.insert(meetingsTable).values(values).returning();
}

export async function renameMeeting({
  id,
  name,
}: {
  id: InsertMeeting['id'];
  name: InsertMeeting['name'];
}) {
  if (!id) return;
  return await db
    .update(meetingsTable)
    .set({ name, updatedAt: new Date() })
    .where(eq(meetingsTable.id, id))
    .returning();
}

export async function deleteMeeting({ id }: { id: SelectMeeting['id'] }) {
  return await db.delete(meetingsTable).where(eq(meetingsTable.id, id));
}

export async function deleteMeetingByBotId({ botId }: { botId: SelectMeeting['bot_id'] }) {
  return await db.delete(meetingsTable).where(eq(meetingsTable.bot_id, botId));
}
