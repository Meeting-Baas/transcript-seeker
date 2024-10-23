import { Header } from '@/components/header';
import { MeetingForm } from '@/components/join/join-meeting-form';
import ServerAlert from '@/components/server-alert';
import ServerAvailablity from '@/components/server-availablity';
import { useServerAvailabilityStore } from '@/store';

import { Separator } from '@meeting-baas/ui/separator';

function JoinPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  return (
    <div className="h-full">
      <Header
        path={[
          {
            name: 'Record Meeting',
          },
        ]}
      />
      <div className="container p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Record Meeting</h2>
          <p className="text-muted-foreground">
            Quickly record meetings using Meetingbaas's fleet of meeting bots.
          </p>
        </div>
        <Separator className="my-4" />
        <div className="my-2 bg-background">
          <ServerAlert mode={serverAvailability} />
        </div>
        <MeetingForm />
      </div>
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground flex w-full justify-center">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default JoinPage;
