import { HeaderTitle } from '@/components/header-title';
import { MeetingForm } from '@/components/meeting/meeting-record-form';
import ServerAlert from '@/components/server-alert';
import { useServerAvailabilityStore } from '@/store';

import { Separator } from '@meeting-baas/ui/separator';

function JoinPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  return (
    <div className="h-full">
      <HeaderTitle
        path={[
          {
            name: 'Record Meeting',
          },
        ]}
      />
      <div className="p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Record Meeting</h2>
          <p className="text-muted-foreground">
            Quickly record meetings using Meetingbaas's fleet of meeting bots.
          </p>
        </div>
        <Separator className="my-4" />
        <div className="my-2 bg-white">
          <ServerAlert mode={serverAvailability} />
        </div>
        <MeetingForm />
      </div>
    </div>
  );
}

export default JoinPage;
