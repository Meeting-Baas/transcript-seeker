import { useTransition } from 'react';
import ServerAvailablity from '@/components/server-availablity';
import { signIn } from '@/lib/auth';

import { Button } from '@meeting-baas/ui/button';
import { LoaderIcon } from 'lucide-react';

function LoginPage() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center">
      <div className="flex max-w-md flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Login</h1>
        <p className="text-lg text-gray-500">
          The calendar extension for Transcript Seeker, needs you to login to Google Calendar.
        </p>

        <Button
          className="w-full"
          onClick={() => {
            startTransition(async () => {
              await signIn.social({
                provider: 'google',
                callbackURL: '/meetings'
              });
            });
          }}
          disabled={isPending}
        >
          {isPending && <LoaderIcon className="size-4 animate-spin" />}
          Login With Google
        </Button>
        <div className="fixed bottom-4 left-0 right-0 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <ServerAvailablity />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
