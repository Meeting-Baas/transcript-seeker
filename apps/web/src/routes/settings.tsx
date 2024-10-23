import { Header } from '@/components/header';
import ServerAvailablity from '@/components/server-availablity';

import { Button } from '@meeting-baas/ui/button';
import { Separator } from '@meeting-baas/ui/separator';

import { SettingsForm } from '../components/settings/settings-form';

function SettingsPage() {
  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <Header
        path={[
          {
            name: 'Settings',
          },
        ]}
      />

      <div className="container p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Store API keys in your browser to test immediately, or host yourself by using our{' '}
            <Button variant="link" asChild className="p-0">
              <a
                href="https://github.com/Meeting-Baas/transcript-seeker"
                target="_blank"
                rel="noopener noreferrer"
              >
                github repository
              </a>
            </Button>
            .
          </p>
        </div>
        <Separator className="my-4" />

        <SettingsForm />
      </div>
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground flex w-full justify-center">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default SettingsPage;
