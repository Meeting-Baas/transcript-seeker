import { PROXY_URL, VITE_SERVER_API_URL } from '@/App';
import { MeetingInfo } from '@/types';
import * as MeetingBaas from '@meeting-baas/shared';
import axios from 'axios';

interface JoinMeetingWrapperProps {
  baasApiKey: string;
  serverAvailability: 'server' | 'local' | 'error';
  params: MeetingBaas.JoinMeetingParams;
}

interface FetchBotDetailsWrapperProps {
  baasApiKey: string;
  serverAvailability: 'server' | 'local' | 'error';
  botId: string;
  raw?: boolean;
}

export const joinMeetingWrapper = async ({
  baasApiKey,
  serverAvailability,
  params,
}: JoinMeetingWrapperProps) => {
  if (serverAvailability === 'server') {
    return await axios.post(VITE_SERVER_API_URL.concat('/join'), params);
  } else {
    return await MeetingBaas.joinMeeting({
      ...params,
      apiKey: baasApiKey,
      proxyUrl: PROXY_URL,
    });
  }
};

export const fetchBotDetailsWrapper = async ({
  baasApiKey,
  serverAvailability,
  botId,
}: FetchBotDetailsWrapperProps) => {
  const response = await MeetingBaas.fetchBotDetails({
    botId,
    apiKey: baasApiKey,
    proxyUrl:
      serverAvailability === 'server'
        ? VITE_SERVER_API_URL.concat(`/meeting/${botId}`)
        : PROXY_URL.concat('/bots/meeting_data'),
  });

  // todo: over here we need to port the new data to the old data as there are too many references of using old data types
  const data: MeetingInfo = serverAvailability === 'server' ? response.data['data'] : response.data;

  if (!data?.id)
    return {
      data: {
        data: undefined,
      },
    };

  return {
    data: {
      id: data.id,
      name: 'Spoke Recorded Meeting',
      attendees: data['attendees'].map((attendee: { name: string }) => {
        return attendee.name;
      }),
      data: data,
      createdAt: new Date(
        data.created_at.secs_since_epoch * 1000 + data.created_at.nanos_since_epoch / 1000000,
      ),
    },
  };
};
