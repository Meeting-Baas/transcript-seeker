// shared/src/api.ts
import axios from 'axios';

import type { CalendarBaasData, CalendarBaasEvent } from './types';
import * as constants from './constants';

export interface JoinMeetingParams {
  meetingBotName?: string;
  meetingURL: string;
  meetingBotImage?: string;
  meetingBotEntryMessage?: string;
  apiKey: string;
}

export interface JoinMeetingResult {
  bot_id: string;
}

export async function joinMeeting({
  meetingBotName,
  meetingURL,
  meetingBotImage,
  meetingBotEntryMessage,
  apiKey,
  proxyUrl,
}: JoinMeetingParams & { proxyUrl: string }): Promise<{
  data?: JoinMeetingResult;
  error?: string;
}> {
  try {
    const url = `${proxyUrl}/api/meetingbaas/bots`;

    const response = await axios.post(
      url,
      {
        meeting_url: meetingURL,
        bot_name: meetingBotName || constants.DEFAULT_BOT_NAME,
        bot_image: meetingBotImage || constants.DEFAULT_BOT_IMAGE,
        speech_to_text: {
          provider: 'Default',
          api_key: null,
        },
        reserved: false,
        entry_message: meetingBotEntryMessage || constants.DEFAULT_ENTRY_MESSAGE,
        recording_mode: 'speaker_view',
      },
      {
        headers: {
          'x-meeting-baas-api-key': apiKey,
        },
        withCredentials: true,
      },
    );

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface LeaveMeetingParams {
  botId: string;
  apiKey: string;
  proxyUrl?: string;
}

export async function leaveMeeting({ botId, apiKey, proxyUrl }: LeaveMeetingParams) {
  try {
    const url = `${proxyUrl}/api/meetingbaas/bots/${botId}`;

    const response = await axios.delete(url, {
      headers: {
        'x-meeting-baas-api-key': apiKey,
      },
      withCredentials: true,
    });

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface BotDetailsParams {
  botId: string;
  apiKey: string;
  proxyUrl?: string;
}

export async function fetchBotDetails({ botId, apiKey, proxyUrl }: BotDetailsParams) {
  try {
    const url = `${proxyUrl}/api/meetingbaas/bots/meeting_data`;

    const response = await axios.get(url, {
      params: {
        bot_id: botId,
      },
      headers: {
        'x-meeting-baas-api-key': apiKey,
      },
      withCredentials: true,
    });

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface FetchCalendarsParams {
  apiKey: string;
  proxyUrl?: string;
}

export interface FetchCalendarsResponse {
  data?: CalendarBaasData[];
  error?: string;
}

export async function fetchCalendars({
  apiKey,
  proxyUrl,
}: FetchCalendarsParams): Promise<FetchCalendarsResponse> {
  try {
    const url = `${proxyUrl}/api/calendars`;

    const response = await axios.get(url, {
      headers: {
        'x-meeting-baas-api-key': apiKey,
      },
      withCredentials: true,
    });

    if (response.status != 200) {
      throw new Error('Failed to fetch calendar');
    }

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface CreateCalendarParams {
  platform: 'Google';
  apiKey: string;
  calendarId: string;
  proxyUrl?: string;
}

export interface CreateCalendarResponse {
  data?: CalendarBaasData[];
  error?: string;
}

export async function createCalendar({
  platform,
  apiKey,
  calendarId,
  proxyUrl,
}: CreateCalendarParams): Promise<CreateCalendarResponse> {
  try {
    const url = `${proxyUrl}/api/calendars`;

    const response = await axios.post(
      url,
      {
        platform: platform,
        calendarId: calendarId,
      },
      {
        headers: {
          'x-meeting-baas-api-key': apiKey,
        },
        withCredentials: true,
      },
    );

    if (response.status != 200) {
      throw new Error('Failed to create calendar');
    }

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface DeleteCalendarParams {
  calendarId: string;
  apiKey: string;
  proxyUrl?: string;
}

export interface DeleteCalendarResponse {
  data?: { statusCode: number };
  error?: string;
}

export async function deleteCalendar({
  calendarId,
  apiKey,
  proxyUrl,
}: DeleteCalendarParams): Promise<DeleteCalendarResponse> {
  try {
    const url = `${proxyUrl}/api/calendars`;

    const response = await axios.delete(url, {
      params: {
        calendarId: calendarId,
      },
      headers: {
        'x-meeting-baas-api-key': apiKey,
      },
      withCredentials: true,
    });

    if (response.status != 200) {
      throw new Error('Failed to delete calendar');
    }

    return {
      data: {
        statusCode: response.status,
      },
    };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}

export interface FetchCalendarEventsParams {
  calendarId: string;
  offset: number;
  limit: number;
  apiKey: string;
  proxyUrl?: string;
}

export interface FetchCalendarEventsResponse {
  data?: CalendarBaasEvent[];
  error?: string;
}

export async function fetchCalendarEvents({
  calendarId,
  offset = 0,
  limit = 100,
  apiKey,
  proxyUrl,
}: FetchCalendarEventsParams): Promise<FetchCalendarEventsResponse> {
  try {
    const url = `${proxyUrl}/api/calendars/calendar_events`;

    const response = await axios.get(url, {
      params: {
        calendarId: calendarId,
        offset,
        limit,
      },
      headers: {
        'x-meeting-baas-api-key': apiKey,
      },
      withCredentials: true,
    });

    if (response.status != 200) {
      throw new Error('Failed to fetch calendar events');
    }

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}
