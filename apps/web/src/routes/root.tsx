import { ModeToggle } from '@/components/mode-toggle';
import ServerAlert from '@/components/server-alert';
import ServerAvailablity from '@/components/server-availablity';
import { useApiKey } from '@/hooks/use-api-key';
import { useSession } from '@/lib/auth';
import { useServerAvailabilityStore } from '@/store';
import { Calendar, Info, Key, List, Mic, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@meeting-baas/ui';
import { buttonVariants } from '@meeting-baas/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meeting-baas/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@meeting-baas/ui/tooltip';

function RootPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });
  const { apiKey: gladiaApiKey } = useApiKey({ type: 'gladia' });
  const { apiKey: assemblyAIApiKey } = useApiKey({ type: 'assemblyai' });
  const { apiKey: openAIApiKey } = useApiKey({ type: 'openai' });

  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = useSession();
  const apiKeysExist = baasApiKey && gladiaApiKey && assemblyAIApiKey && openAIApiKey;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40 p-4">
      <div className="fixed left-0 right-0 top-0 z-50 m-4 flex justify-center">
        <div className="max-w-md">
          <ServerAlert mode={serverAvailability} contrast="bright" />
        </div>
      </div>
      <div className="fixed right-0 top-0 z-50 m-4 flex justify-center">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Transcript Seeker</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
            Open-source interface by{' '}
            <a
              href="https://meetingbaas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Meeting Baas
            </a>{' '}
            🐟
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    target="_blank"
                    href="https://github.com/Meeting-Baas/transcript-seeker"
                    className={cn(buttonVariants({ variant: 'ghost' }), 'h-min w-min p-0.5')}
                  >
                    <Info className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>More info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/join"
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full items-center gap-2', {
                'pointer-events-none opacity-50': !baasApiKey,
              })}
            >
              <Mic className="h-4 w-4" />
              Record Meeting
            </Link>
            <Link
              to="/upload"
              className={cn(buttonVariants({ variant: 'outline' }), 'gap-2', {
                'pointer-events-none opacity-50': !gladiaApiKey && !assemblyAIApiKey,
              })}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/recordings" className={cn(buttonVariants({ variant: 'default' }), 'gap-2')}>
              <List className="h-4 w-4" />
              Recordings
            </Link>
            <Link
              to="/settings"
              className={cn(
                buttonVariants({ variant: apiKeysExist ? 'secondary' : 'default' }),
                'gap-2',
              )}
            >
              <Key className="h-4 w-4" />
              Manage API Keys
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/meetings"
              className={cn(buttonVariants({ variant: 'default' }), 'gap-2', {
                'pointer-events-none opacity-50': !session,
              })}
            >
              <Calendar className="h-4 w-4" />
              Upcoming Meetings
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="fixed bottom-4 left-0 right-0 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default RootPage;
