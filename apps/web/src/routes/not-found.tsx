import ServerAvailablity from '@/components/server-availablity';
import { Link } from 'react-router-dom';

import { Button } from '@meeting-baas/ui/button';

function NotFoundPage() {
  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center">
      <div className="flex max-w-md flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-lg text-gray-500">The page you're looking for does not exist.</p>

        <Button asChild className="w-full">
          <Link to="/">Back To Home</Link>
        </Button>
        <div className="fixed bottom-4 left-0 right-0 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <ServerAvailablity />
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
