import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlertIcon, TerminalIcon, TriangleAlertIcon } from 'lucide-react';

export function ServerAlert(props: { mode: 'server' | 'local' | 'error' }) {
  return (
    <>
      {props.mode === 'server' ? (
        <Alert className="border-blue-300/30 bg-blue-300/10">
          <TerminalIcon className="h-4 w-4" />
          <AlertTitle>FYI</AlertTitle>
          <AlertDescription>
            Connected to API Backend.
            {/* {customAxios && customAxios.defaults && (
            <>
              {" @"}
              {customAxios.defaults.baseURL}
            </>
          )} */}
          </AlertDescription>
        </Alert>
      ) : props.mode === 'local' ? (
        <Alert className="border-blue-300/30 bg-blue-300/10">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertTitle>FYI</AlertTitle>
          <AlertDescription>
            We're using your browser's local storage (IndexedDB) as there is no server to connect
            to.{' '}
            {/* <p>
              Get your back-end running by following our{" "}
              <a
                href="https://github.com/Meeting-Baas/Meeting-Bot-As-A-Service/main/apps"
                target="_blank"
                className="underline font-semibold"
              >
                GitHub tutorial
              </a>
              .
            </p> */}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-yellow-300/30 bg-yellow-300/10">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>No API key defined</AlertTitle>
          <AlertDescription>
            You don't have an API key, or a back-end connected which could send it. Head{' '}
            <a href="/settings" className="font-semibold underline">
              here
            </a>{' '}
            to get one instantly.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export default ServerAlert;
