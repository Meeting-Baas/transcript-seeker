import { eq } from 'drizzle-orm';

import { db } from '@meeting-baas/db/client';
import {
  apiKeysTable,
  chatsTable,
  editorsTable,
  InsertAPIKey,
  InsertChat,
  InsertEditor,
  InsertMeeting,
  meetingsTable,
  SelectAPIKey,
  SelectChat,
  SelectEditor,
  SelectMeeting,
} from '@meeting-baas/db/schema';

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

export async function getMeetingByBotId({ botId }: { botId: SelectMeeting['botId'] }) {
  if (!botId) return;
  return await db.query.meetingsTable.findFirst({
    where: (meetings, { eq }) => eq(meetings.botId, botId),
  });
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

export async function deleteMeetingByBotId({ botId }: { botId: SelectMeeting['botId'] }) {
  return await db.delete(meetingsTable).where(eq(meetingsTable.botId, botId));
}

export async function getEditorByMeetingId({ meetingId }: { meetingId: SelectEditor['meetingId'] }) {
  if (!meetingId) return;
  const editor = await db.query.editorsTable.findFirst({
    where: (editors, { eq }) => eq(editors.meetingId, meetingId),
  });
  return editor;
}

export async function setEditor({ meetingId, content }: { meetingId: InsertEditor['meetingId']; content: InsertEditor['content'] }) {
  if (!meetingId) return;
  const editor = await db.query.editorsTable.findFirst({
    where: (editors, { eq }) => eq(editors.meetingId, meetingId),
  });
  if (editor) {
    return await db
      .update(editorsTable)
      .set({ content: content, updatedAt: new Date() })
      .where(eq(editorsTable.meetingId, meetingId))
      .returning();
  } else {
    return await db.insert(editorsTable).values({ meetingId: meetingId, content: content }).returning();
  }
}

export async function getChatByMeetingId({ meetingId }: { meetingId: SelectChat['meetingId'] }) {
  if (!meetingId) return;
  const chat = await db.query.chatsTable.findFirst({
    where: (chats, { eq }) => eq(chats.meetingId, meetingId),
  });
  return chat;
}

export async function setChat({ meetingId, messages }: { meetingId: InsertChat['meetingId']; messages: InsertChat['messages'] }) {
  if (!meetingId) return;
  const chat = await db.query.chatsTable.findFirst({
    where: (chats, { eq }) => eq(chats.meetingId, meetingId),
  });
  if (chat) {
    return await db
      .update(chatsTable)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatsTable.meetingId, meetingId))
      .returning();
  } else {
    return await db.insert(chatsTable).values({ meetingId: meetingId, messages }).returning();
  }
}
