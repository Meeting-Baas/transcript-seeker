import { pwaInfo } from 'virtual:pwa-info';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { Alert, AlertTitle } from '@meeting-baas/ui/alert';
import { Button } from '@meeting-baas/ui/button';

// console.log(pwaInfo);

function ReloadPrompt() {
  const reloadSW = '__RELOAD_SW__';

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            console.log('Checking for sw update');
            r.update();
          }, 20000 /* 20s for testing purposes */);
      } else {
         
        console.log('SW Registered: ' + r);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Alert className="absolute bottom-0 right-0 m-6 w-72 px-3 py-3 shadow-md empty:hidden">
      {(offlineReady || needRefresh) && (
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <AlertTitle className="mb-0 text-sm font-normal">
              {offlineReady ? (
                <>Service worker has been installed on this device.</>
              ) : (
                <>New content available, click on reload button to update.</>
              )}
            </AlertTitle>
          </div>
          <div className="flex gap-1">
            {needRefresh && (
              <Button
                onClick={() => updateServiceWorker(true)}
                size="sm"
                className="h-auto px-2 py-1 text-xs"
              >
                Reload
              </Button>
            )}
            <Button onClick={() => close()} size="sm" className="h-auto px-2 py-1 text-xs">
              Close
            </Button>
          </div>
        </div>
      )}
    </Alert>
  );
}

export default ReloadPrompt;
