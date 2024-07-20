import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex h-full min-h-[calc(100dvh-94px)] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-lg text-gray-500">The page you're looking for does not exist.</p>
      <div className="flex gap-2 py-4">
        <Button asChild>
          <Link to="/">Back To Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
