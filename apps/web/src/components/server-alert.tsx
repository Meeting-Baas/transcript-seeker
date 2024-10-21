import type { ServerAvailability } from '@/types';
import { CircleAlertIcon, LoaderCircleIcon, TerminalIcon, TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@meeting-baas/ui';
import { Alert, AlertDescription, AlertTitle } from '@meeting-baas/ui/alert';
import { Skeleton } from '@meeting-baas/ui/skeleton';

export function ServerAlert(props: { mode: ServerAvailability; contrast?: 'default' | 'bright' }) {
  return (
    <>
      {props.mode === 'loading' ? (
        <Alert
          className={cn('border-gray-300/30 bg-gray-300/10', {
            'border-gray-300/60 bg-gray-300/20': props.contrast === 'bright',
          })}
        >
          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
          <AlertTitle>Loading...</AlertTitle>
          <AlertDescription>
            <Skeleton className="h-10 min-w-96"></Skeleton>
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}

      {props.mode === 'local' ? (
        <Alert
          className={cn('border-blue-300/30 bg-blue-300/10', {
            'border-blue-300/60 bg-blue-300/20': props.contrast === 'bright',
          })}
        >
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertTitle>FYI</AlertTitle>
          <AlertDescription>
            We're using your browser's local storage (IndexedDB) to run Transcript Seeker.
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}

      {props.mode === 'error' ? (
        <Alert
          className={cn('border-yellow-300/30 bg-yellow-300/10', {
            'border-yellow-300/60 bg-yellow-300/20': props.contrast === 'bright',
          })}
        >
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>No API key defined</AlertTitle>
          <AlertDescription>
            You don't have an API key, which allows transcript seeker to join meetings. Head{' '}
            <Link to="/settings" className="font-semibold underline">
              here
            </Link>{' '}
            to get one instantly.
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}
    </>
  );
}

export default ServerAlert;
