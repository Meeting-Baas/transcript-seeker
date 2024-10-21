import { useEffect } from 'react';
import { Header } from '@/components/header';
import { columns } from '@/components/meeting/columns';
import { DataTable } from '@/components/meeting/data-table';
import { ImportMeeting } from '@/components/meeting/meeting-import';
import ServerAlert from '@/components/server-alert';
import ServerAvailablity from '@/components/server-availablity';
import { fetchBotDetails } from '@/lib/axios';
import { getAPIKey, getMeetings, updateMeeting } from '@/queries';
import { useServerAvailabilityStore } from '@/store';
import useSWR from 'swr';

import { SelectAPIKey } from '@meeting-baas/db/schema';
import { Separator } from '@meeting-baas/ui/separator';
import { Skeleton } from '@meeting-baas/ui/skeleton';

const fetchMeetings = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  if (Array.isArray(meetings)) {
    return meetings;
  }
  return [];
};

const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

function RecordingsPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  const { data: baasApiKey, isLoading: isBaasApiKeyLoading } = useSWR('meetingbaas', () =>
    fetchAPIKey('meetingbaas'),
  );
  const { data: meetings, isLoading, mutate } = useSWR('meetings', () => fetchMeetings());

  useEffect(() => {
    if (!baasApiKey) return;
    meetings?.map(async (meeting) => {
      if (meeting.status === 'loading' && meeting.type === 'meetingbaas') {
        const data = await fetchBotDetails({
          botId: meeting.botId,
          apiKey: baasApiKey,
        });
        if (!data) return;
        await updateMeeting({ id: meeting.id, values: data });
        mutate();
      }
    });
  }, [meetings, isLoading, isBaasApiKeyLoading]);

  return (
    <div className="h-full">
      <Header
        path={[
          {
            name: 'Recordings',
          },
        ]}
      />
      <div className="p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">View Recordings</h2>
          <p className="text-muted-foreground">View your recorded or uploaded meetings here.</p>
        </div>
        <Separator className="my-4" />

        <div className="my-4 bg-white">
          <ServerAlert mode={serverAvailability} />
        </div>
        <ImportMeeting />

        {meetings && meetings.length > 0 ? (
          <DataTable data={meetings} columns={columns} />
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-b-md border-x border-b border-border px-2 pb-2 pt-1 empty:pb-0">
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 min-w-32" />
                </>
              ) : (
                <></>
              )}
            </div>
            <p>{isLoading ? 'Loading...' : 'No results.'}</p>
          </>
        )}
      </div>
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default RecordingsPage;
