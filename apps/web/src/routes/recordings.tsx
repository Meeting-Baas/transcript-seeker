import { Header } from '@/components/header';
import { columns } from '@/components/meeting/columns';
import { DataTable } from '@/components/meeting/data-table';
import { ImportMeeting } from '@/components/meeting/meeting-import';
import ServerAlert from '@/components/server-alert';
import { getMeetings } from '@/queries';
import { useServerAvailabilityStore } from '@/store';
import useSWR from 'swr';

import { Separator } from '@meeting-baas/ui/separator';
import { Skeleton } from '@meeting-baas/ui/skeleton';
import ServerAvailablity from '@/components/server-availablity';

const fetchMeetings = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  if (Array.isArray(meetings)) {
    return meetings;
  }
  return [];
};

function RecordingsPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const { data: meetings, isLoading, mutate } = useSWR('meetings', () => fetchMeetings());

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
                  <Skeleton className='w-full h-9' />
                  <Skeleton className='min-w-32 h-9' />
                </>
              ) : (<></>)}
            </div>
            <p>{isLoading ? 'Loading...' : 'No results.'}</p>
          </>
        )}
      </div>
      <div className="fixed bottom-4 left-4 text-sm text-muted-foreground flex items-center gap-2">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default RecordingsPage;
