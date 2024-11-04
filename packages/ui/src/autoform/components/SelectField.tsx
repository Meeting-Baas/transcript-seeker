import React from 'react';
import type { AutoFormFieldProps } from '@autoform/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@meeting-baas/ui/select';

export const SelectField: React.FC<AutoFormFieldProps> = ({ field, inputProps, error, id }) => (
  <Select {...inputProps}>
    <SelectTrigger id={id} className={error ? 'border-destructive' : ''}>
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      {(field.options || []).map(([key, label]) => (
        <SelectItem key={key} value={key}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
