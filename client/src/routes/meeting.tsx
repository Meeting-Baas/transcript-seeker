import { Viewer } from '@/components/viewer';
import { StorageBucketAPI } from '@/lib/bucketAPI';
import { BLANK_MEETING_INFO } from '@/lib/utils';
import {  Meeting as MeetingT, MeetingInfo } from "@/types";
import { meetingsAtom } from '@/store';
import { baasApiKeyAtom, serverAvailabilityAtom } from '@/store/index';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'sonner';

function MeetingPage() {
  const { botId } = useParams();

  const [meetings] = useAtom(meetingsAtom);

  const [serverAvailability] = useAtom(serverAvailabilityAtom);
  const [baasApiKey] = useAtom(baasApiKeyAtom);

  const [meetingData, setMeetingData] = useState<MeetingInfo>(BLANK_MEETING_INFO);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetingData = async (): Promise<MeetingInfo> => {
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
