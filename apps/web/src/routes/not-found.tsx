import ServerAvailablity from '@/components/server-availablity';
import { Link } from 'react-router-dom';

import { Button } from '@meeting-baas/ui/button';

function NotFoundPage() {
  return (
    <div className="flex h-full min-h-[calc(100dvh-94px)] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-lg text-gray-500">The page you're looking for does not exist.</p>
      <div className="flex gap-2 py-4">
        <Button asChild>
          <Link to="/">Back To Home</Link>
        </Button>
      </div>
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground flex w-full justify-center">
        <ServerAvailablity />
      </div>
    </div>
  );
}

export default NotFoundPage;
