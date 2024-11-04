import type { ReactNode } from 'react';
import ServerAvailablity from '@/components/server-availablity';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@meeting-baas/ui/button';

interface ErrorProps {
  children: ReactNode;
}

function ErrorPage({ children }: ErrorProps) {
  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center">
      <div className="flex max-w-md flex-1 flex-col justify-center gap-4">
        <h1 className="text-4xl font-bold">Error!</h1>
        <p className="text-lg text-muted-foreground">
          Oops! Something went wrong. We couldn't complete the requested operation. Here are more
          details:
        </p>
        <code className="h-128 w-full rounded-md bg-muted p-4">{children}</code>
        <Button asChild>
          <Link to="/">Back To Home</Link>
        </Button>
        <div className="fixed bottom-4 left-0 right-0 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <ServerAvailablity />
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
