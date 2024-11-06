import React, { useTransition } from 'react';
import { signOut } from '@/lib/auth';
import { LoaderIcon, LogOut } from 'lucide-react';

import { ButtonProps } from '@meeting-baas/ui/button';

interface SignOutProps extends ButtonProps {
}

function SignOut({ children, ...props }: SignOutProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await signOut();
        });
      }}
      disabled={isPending}
      {...props}
    >
      {!isPending && <LogOut />}
      {isPending && <LoaderIcon className="size-4 animate-spin" />}
      Sign Out
    </button>
  );
}

export default SignOut;
