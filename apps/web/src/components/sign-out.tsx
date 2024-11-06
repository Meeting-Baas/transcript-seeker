import { useTransition } from 'react';
import { signOut } from '@/lib/auth';
import { LoaderIcon } from 'lucide-react';

import { Button, ButtonProps } from '@meeting-baas/ui/button';

interface SignOutProps extends ButtonProps {
}

function SignOut({ children, ...props }: SignOutProps) {
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
      {...props}
    >
      {!children && (
        <>
          {isPending && <LoaderIcon className="size-4 animate-spin" />}
          Sign Out
        </>
      )}
      {children}
    </Button>
  );
}

export default SignOut;
