import { HeaderTitle } from '@/components/header-title';
import { ImportMeeting } from '@/components/import-meeting';
import MeetingTable from '@/components/meeting-table';
import ServerAlert from '@/components/server-alert';
import { serverAvailabilityAtom } from '@/store';
import { useAtom } from 'jotai';

function Meetings() {
  const [serverAvailability] = useAtom(serverAvailabilityAtom);

  return (
    <div className="h-full p-8">
      <div className="pb-4">
        <HeaderTitle path="/" title="Recordings" />
      </div>

      <div className="my-2 bg-white">
        <ServerAlert mode={serverAvailability} />
      </div>
      <div className="py-4">
        <ImportMeeting />
      </div>
      <MeetingTable />
    </div>
  );
}

export default Meetings;
