import { HeaderTitle } from '@/components/header-title';
import { ImportMeeting } from '@/components/import-meeting';
import MeetingTable from '@/components/meeting/meeting-table';
import ServerAlert from '@/components/server-alert';
import { useServerAvailabilityStore } from '@/store';

function RecordingsPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  return (
    <div className="h-full p-8">
      <div className="pb-4">
        <HeaderTitle path="/" title="Recordings" />
      </div>

      <div className="my-2 bg-white">
        <ServerAlert mode={serverAvailability} />
      </div>
      <ImportMeeting />
      <MeetingTable />
    </div>
  );
}

export default RecordingsPage;
