import React from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@meeting-baas/ui/input';

export const NumberField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => (
  <Input id={id} type="number" className={error ? 'border-destructive' : ''} {...inputProps} />
);
