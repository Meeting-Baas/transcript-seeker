import { getAPIKey, getChatByMeetingId, getEditorByMeetingId, getMeetings } from '@/queries';

import type { SelectAPIKey, SelectEditor } from '@meeting-baas/db/schema';

// These are the fetchers, this is how we get data from the db
export const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

export const fetchMeetings = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  if (Array.isArray(meetings)) {
    return meetings;
  }
  return [];
};

export const fetchEditorContentByMeetingId = async (meetingId: SelectEditor['meetingId']) => {
  const editor = await getEditorByMeetingId({ meetingId });
  if (editor) return editor.content;
  return null;
};

export const fetchChatByMeetingId = async (meetingId: SelectEditor['meetingId']) => {
  const chat = await getChatByMeetingId({ meetingId });
  if (chat) return chat;
  return null;
};

// todo: follow swr best practices and scrap all of this, instead use hooks for each function and have a generic db fetcher, make the queries.ts return proper data instead