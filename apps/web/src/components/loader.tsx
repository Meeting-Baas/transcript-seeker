import { LoaderCircleIcon } from 'lucide-react';

export default function FullSpinner() {
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center space-y-4 bg-gradient-to-br from-muted/20 to-muted/40">
      <LoaderCircleIcon className="h-12 w-12 animate-spin" />
      <p className="text-lg">Loading...</p>
    </div>
  );
}
