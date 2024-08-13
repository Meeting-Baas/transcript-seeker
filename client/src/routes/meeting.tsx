import { Viewer } from '@/components/viewer';
import { StorageBucketAPI } from '@/lib/bucketAPI';
import { BLANK_MEETING_INFO } from '@/lib/utils';
import { Meeting as MeetingT, MeetingInfo } from '@/types';
import { useApiKeysStore, useMeetingsStore, useServerAvailabilityStore } from '@/store';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'sonner';

function MeetingPage() {
  const { botId } = useParams();

  const meetings = useMeetingsStore((state) => state.meetings);

  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const baasApiKey = useApiKeysStore((state) => state.baasApiKey);

  const [meetingData, setMeetingData] = useState<MeetingInfo>(BLANK_MEETING_INFO);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetingData = async (): Promise<MeetingInfo> => {
    if (!botId) throw new Error('No bot ID provided');

    const meeting: MeetingT | undefined = meetings.find(
      (meeting: MeetingT) => meeting.bot_id === botId,
    );
    if (!meeting) throw new Error('Meeting not found');

    if (meeting.bot_id.startsWith('local_file')) {
      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();

      const videoContent = await storageAPI.get(`${meeting.bot_id}.mp4`);
      if (videoContent && meeting.data?.assets[0]) meeting.data.assets[0].mp4_blob = videoContent;
    }

    return meeting.data || BLANK_MEETING_INFO;
  };

  useEffect(() => {
    // if (!baasApiKey) return;
    // Note: This condition checks for meetings. Initially, the meetings array will be empty and later populated.
    // Attachment: https://share.cleanshot.com/Z59XsrtV
    console.log('Meetings:', meetings);
    if (meetings.length === 0) return;

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
