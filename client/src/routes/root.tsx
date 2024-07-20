import ServerAlert from '@/components/server-alert';
import { Button } from '@/components/ui/button';
import { Upload } from '@/components/upload';
import { serverAvailabilityAtom } from '@/store';
import { SettingsIcon } from 'lucide-react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

function Root() {
  const [serverAvailability] = useAtom(serverAvailabilityAtom);

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-94px)] flex-col items-center justify-center space-y-2">
      <div className="fixed left-0 right-0 top-4 z-50 flex justify-center">
        <div className="max-w-md">
          <ServerAlert mode={serverAvailability} />
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <h1 className="mb-2 text-center text-4xl font-bold">Transcript Seeker</h1>
        <p className="mb-6 text-center text-lg">
          Open-source interface by{' '}
          <a
            href="https://github.com/meeting-baas/meeting-bot-as-a-service/apps/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Meeting Baas 🐟
          </a>
        </p>
        <div className="flex w-full items-center gap-4 pb-2">
          <Button className="flex-1" variant="secondary" asChild>
            <Link to="/settings">
              <SettingsIcon className="mr-2 h-4 w-4" /> API Keys
            </Link>
          </Button>
          <Button className="flex-1" variant="outline" asChild>
            <Link to="/meetings">Recordings</Link>
          </Button>
        </div>
        <div className="flex w-full gap-4">
          <Upload>
            <Button className="h-16 flex-1 text-lg">Upload File</Button>
          </Upload>
          <Button className="h-16 flex-1 text-lg" asChild>
            <Link to="/join">Record Meeting</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Root;
