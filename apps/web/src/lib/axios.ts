import { VITE_PROXY_URL } from '@/lib/constants';
import { joinMeeting, JoinMeetingParams } from '@meeting-baas/shared';

interface JoinMeetingWrapperProps {
  baasApiKey: string;
  params: JoinMeetingParams;
}

export const joinMeetingWrapper = async ({
  baasApiKey,
  params,
}: JoinMeetingWrapperProps) => {
  return await joinMeeting({
    ...params,
    apiKey: baasApiKey,
    proxyUrl: VITE_PROXY_URL,
  });
};

// export const fetchBotDetailsWrapper = async ({
//   baasApiKey,
//   serverAvailability,
//   botId,
// }: FetchBotDetailsWrapperProps) => {
//   const response = await MeetingBaas.fetchBotDetails({
//     botId,
//     apiKey: baasApiKey,
//     proxyUrl:
//       serverAvailability === 'server'
//         ? VITE_SERVER_API_URL.concat(`/meeting/${botId}`)
//         : PROXY_URL.concat('/bots/meeting_data'),
//   });

//   // todo: over here we need to port the new data to the old data as there are too many references of using old data types
//   const data: MeetingInfo = serverAvailability === 'server' ? response.data['data'] : response.data;

//   if (!data?.id)
//     return {
//       data: {
//         data: undefined,
//       },
//     };

//   return {
//     data: {
//       id: data.id,
//       name: 'Spoke Recorded Meeting',
//       attendees: data['attendees'].map((attendee: { name: string }) => {
//         return attendee.name;
//       }),
//       data: data,
//       createdAt: new Date(
//         data.created_at.secs_since_epoch * 1000 + data.created_at.nanos_since_epoch / 1000000,
//       ),
//     },
//   };
// };
