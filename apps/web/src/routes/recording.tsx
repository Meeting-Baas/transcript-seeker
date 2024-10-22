import type { Meeting as MeetingT } from '@/types';
import FullSpinner from '@/components/loader';
import { Viewer } from '@/components/viewer';
import { useApiKey } from '@/hooks/use-api-key';
import { fetchBotDetails } from '@/lib/meetingbaas';
import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import { getMeetingByBotId } from '@/queries';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import NotFoundPage from './not-found';

const fetchMeeting = async (botId: string): Promise<MeetingT | null> => {
  // todo: make this function fetch data from baas directly and then pull
  if (!botId) throw new Error('No bot ID provided');

  const meeting: MeetingT | null | undefined = await getMeetingByBotId({ botId });
  if (!meeting) return null;

  if (meeting.type === 'local') {
    const storageAPI = new StorageBucketAPI('local_files');
    await storageAPI.init();

    const videoContent = await storageAPI.get(`${meeting.botId}.mp4`);
    if (videoContent && meeting.assets) meeting.assets.video_blob = videoContent;
  }

  // refreshing the data
  // if (meeting.type === 'meetingbaas') {
  //   const data = await fetchBotDetails({
  //     botId,
  //     apiKey: baasApiKey,
  //   });
  //   if (!data) return meeting;
  //   return {
  //     id: meeting.id,
  //     ...data,
  //   };
  // }

  return meeting || null;
};

function MeetingPage() {
  const { botId } = useParams();
  if (!botId) {
    return <NotFoundPage />;
  }
  // https://swr.vercel.app/docs/revalidation
  const { data: meeting, isLoading } = useSWR(
    `meeting_${botId}`,
    () => fetchMeeting(botId),
    { refreshInterval: 5000 },
  );

  if (!meeting) {
    if (isLoading) return <FullSpinner />;
    return <NotFoundPage />;
  }
  return <Viewer botId={botId} isLoading={isLoading} meeting={meeting} />;
}

export default MeetingPage;
