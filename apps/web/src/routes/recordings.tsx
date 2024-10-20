import { HeaderTitle } from '@/components/header-title';
import { ImportMeeting } from '@/components/meeting/meeting-import';
import MeetingTable from '@/components/meeting/meeting-table';
import ServerAlert from '@/components/server-alert';
import { useServerAvailabilityStore } from '@/store';

import { Separator } from '@meeting-baas/ui/separator';

function RecordingsPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  return (
    <div className="h-full">
      <HeaderTitle
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

        <div className="my-2 bg-white">
          <ServerAlert mode={serverAvailability} />
        </div>
        <ImportMeeting />
        <MeetingTable />
      </div>
    </div>
  );
}

export default RecordingsPage;
