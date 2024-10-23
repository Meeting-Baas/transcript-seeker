// shared/src/api.ts
import axios from 'axios';

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
          'x-spoke-api-key': apiKey,
        },
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

    const response = await axios.delete(
      url,
      {
        headers: {
          'x-spoke-api-key': apiKey,
        },
      },
    );

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
        'x-spoke-api-key': apiKey,
      },
    });

    return { data: response.data };
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}
