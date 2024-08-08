import { fetchMeetingDetails } from '@/components/meeting/meeting-table';
import { Viewer } from '@/components/viewer';
import { StorageBucketAPI } from '@/lib/bucketAPI';
import { BLANK_MEETING_INFO } from '@/lib/utils';
import { useApiKeysStore, useMeetingsStore, useServerAvailabilityStore } from '@/store';
import { Meeting, MeetingInfo, Meeting as MeetingT, ServerAvailability } from '@/types';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { toast } from 'sonner';

async function fetchPublicLink(
  botId: string,
  publicLink: string,
  serverAvailability: ServerAvailability,
): Meeting {
  const initialMeeting: Meeting = {
    id: publicLink,
    name: 'Loading...',
    bot_id: botId!,
    attendees: ['-'],
    createdAt: new Date(),
    status: 'loading',
  };

  try {
    let fetchedDetails = await fetchMeetingDetails(botId, publicLink, serverAvailability);
    return fetchedDetails;
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    return {
      ...initialMeeting,
      name: 'Error fetching meeting details',
      status: 'error',
    };
  }
}

function MeetingPage() {
  const { botId } = useParams();
  const [searchParams] = useSearchParams();
  const publicLink = searchParams.get('public-link');

  const meetings = useMeetingsStore((state) => state.meetings);

  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const baasApiKey = useApiKeysStore((state) => state.baasApiKey);

  const [meetingData, setMeetingData] = useState<MeetingInfo>(BLANK_MEETING_INFO);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetingData = async (): Promise<MeetingInfo> => {
    // check if it's a public link
    if (publicLink && botId) {
      console.log('fetching public link with public link', publicLink);
      console.log('fetching public link with botId', botId);
      const meeting: Meeting = await fetchPublicLink(botId, publicLink, serverAvailability);
      return meeting.data || BLANK_MEETING_INFO;
    }
    if (!botId) throw new Error('No bot ID provided');

    const meeting: MeetingT | undefined = meetings.find(
      (meeting: MeetingT) => meeting.bot_id === botId,
    );
    if (!meeting) throw new Error('Meeting not found');

    const storageAPI = new StorageBucketAPI('local_files');
    await storageAPI.init();

    const videoContent = await storageAPI.get(`${meeting.bot_id}.mp4`);
    if (videoContent && meeting.data?.assets[0]) meeting.data.assets[0].mp4_s3_path = videoContent;

    return meeting.data || BLANK_MEETING_INFO;
  };

  useEffect(() => {
    // if (!baasApiKey) return;
    if (meetings.length <= 0) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedData = await fetchMeetingData();

        setMeetingData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error('error', error);
        toast.error('Failed to fetch meeting data');
        setIsLoading(false);
      }
    };

    loadData();
  }, [meetings, baasApiKey, serverAvailability]);

  return <Viewer botId={botId!} isLoading={isLoading} meetingData={meetingData} />;
}

export default MeetingPage;
