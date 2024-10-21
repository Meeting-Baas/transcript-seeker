import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  //   AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@meeting-baas/ui/alert-dialog';
import { Button } from '@meeting-baas/ui/button';

export default function TabManager() {
  const [isActive, setIsActive] = useState(true);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('tab_manager');
    setChannel(broadcastChannel);

    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'tab_opened') {
        setIsActive(false);
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    broadcastChannel.postMessage('tab_opened');

    return () => {
      broadcastChannel.removeEventListener('message', handleMessage);
      broadcastChannel.close();
    };
  }, []);

  const handleClose = () => {
    window.close();
  };

  return (
    <AlertDialog open={!isActive}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>This website is open in another tab</AlertDialogTitle>
          <AlertDialogDescription>
            For technical reasons, this website can only be used in a single tab at a time. Please
            close this tab and continue working in the other one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          <AlertDialogAction asChild>
            <Button variant="default" onClick={handleClose}>
              Close this tab
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
