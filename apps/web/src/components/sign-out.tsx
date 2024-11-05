import { useTransition } from 'react';
import { signOut } from '@/lib/auth';
import { LoaderIcon } from 'lucide-react';

import { Button } from '@meeting-baas/ui/button';

function SignOut() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await signOut();
        });
      }}
      disabled={isPending}
    >
      {isPending && <LoaderIcon className="size-4 animate-spin" />}
      Sign Out
    </Button>
  );
}

export default SignOut;
