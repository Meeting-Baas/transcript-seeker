import type { AutoFormFieldProps } from '@autoform/react';
import React from 'react';

import { Input } from '@meeting-baas/ui/input';

export const StringField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => (
  <Input id={id} className={error ? 'border-destructive' : ''} {...inputProps} />
);
