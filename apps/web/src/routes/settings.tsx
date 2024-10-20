import { SettingsForm } from '../components/settings-form';

import { HeaderTitle } from '@/components/header-title';
import { Button } from '@meeting-baas/ui/button';

function SettingsPage() {
  return (
    <div className="h-full min-h-[calc(100dvh-81px)] space-y-2 p-10 pb-16">
      <HeaderTitle
        path="/"
        title="Settings"
        subtitle={
          <>
            Store API keys in your browser to test immediately, or host yourself by using our{' '}
            <Button variant="link" asChild className="p-0">
              <a
                href="https://github.com/Meeting-Baas/transcript-seeker"
                target="_blank"
                rel="noopener noreferrer"
              >
                open-source backend
              </a>
            </Button>
            .
          </>
        }
      />
      <div>
        <SettingsForm />
      </div>
    </div>
  );
}

export default SettingsPage;
