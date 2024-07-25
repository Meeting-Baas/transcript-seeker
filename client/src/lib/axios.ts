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
    return await axios.post('/api/join', params);
  } else {
    return await MeetingBaas.joinMeeting({
      ...params,
      apiKey: baasApiKey,
      proxyUrl: '/meetingbaas-api',
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
        ? `/api/meeting/${botId}`
        : '/meetingbaas-api/bots/meeting_data',
  });
  const data: MeetingInfo = serverAvailability === 'server' ? response.data['data'] : response.data;

  if (!data?.id)
    return {
      data: {
        data: {},
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
