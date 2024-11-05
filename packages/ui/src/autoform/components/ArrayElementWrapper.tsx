import type { ArrayElementWrapperProps } from '@autoform/react';
import React from 'react';
import { TrashIcon } from 'lucide-react';

import { Button } from '@meeting-baas/ui/button';

export const ArrayElementWrapper: React.FC<ArrayElementWrapperProps> = ({ children, onRemove }) => {
  return (
    <div className="relative mt-2 rounded-md border p-4">
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2"
        type="button"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      {children}
    </div>
  );
};
