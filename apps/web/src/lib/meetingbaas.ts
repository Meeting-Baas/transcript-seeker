// This is where we convert the meetingbaas data to our data type
import type { Meeting } from '@/types';
import { VITE_PROXY_URL } from '@/lib/constants';

import type { BotDetailsParams, JoinMeetingParams, LeaveMeetingParams, MeetingData } from '@meeting-baas/shared';
import * as MeetingBaas from '@meeting-baas/shared';

interface JoinMeetingProps extends Omit<JoinMeetingParams, 'proxyUrl'> {}

export const joinMeeting = async ({ ...params }: JoinMeetingProps) => {
  return await MeetingBaas.joinMeeting({
    proxyUrl: VITE_PROXY_URL,
    ...params,
  });
};

interface LeaveMeetingProps extends Omit<LeaveMeetingParams, 'proxyUrl'> {}

export const leaveMeeting = async ({ ...params }: LeaveMeetingProps) => {
  return await MeetingBaas.leaveMeeting({
    proxyUrl: VITE_PROXY_URL,
    ...params,
  });
};

interface FetchBotDetailsProps extends Omit<BotDetailsParams, 'proxyUrl'> {}

export const fetchBotDetails = async ({ ...params }: FetchBotDetailsProps) => {
  const response = await MeetingBaas.fetchBotDetails({
    proxyUrl: VITE_PROXY_URL,
    ...params,
  });

  const data: MeetingData = response.data;

  if (!data.bot_data.bot?.id) return null;

  const bot = data.bot_data.bot;
  const transcripts = data.bot_data.transcripts;

  const speakers = new Set<string>();
  transcripts.forEach((transcript) => {
    speakers.add(transcript.speaker);
  });

  return {
    botId: bot.uuid,
    attendees: Array.from(speakers),
    transcripts: transcripts,
    assets: {
      video_url: data.mp4,
      video_blob: null,
    },
    endedAt: bot.ended_at ? new Date(bot.ended_at + 'Z') : null,
    createdAt: new Date(bot.created_at + 'Z'),
  } as Omit<Meeting, 'id'>;
};
