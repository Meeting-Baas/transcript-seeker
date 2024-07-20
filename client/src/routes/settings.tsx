import { SettingsForm } from '../components/settings-form';

import { HeaderTitle } from '@/components/header-title';
import { Button } from '@/components/ui/button';

function Settings() {
  return (
    <div className="h-full min-h-[calc(100dvh-81px)] space-y-2 p-10 pb-16">
      <HeaderTitle
        path="/"
        title="API Keys"
        subtitle={
          <>
            Store API keys in your browser to test immediately, or host yourself by using our{' '}
            <Button variant="link" asChild className="p-0">
              <a href="https://meetingbaas.com/baas/" target="_blank" rel="noopener noreferrer">
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

export default Settings;
