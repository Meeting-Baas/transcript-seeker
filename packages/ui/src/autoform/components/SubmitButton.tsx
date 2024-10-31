import React from 'react';
import { Button } from 's/components/ui/button';

export const SubmitButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Button type="submit">{children}</Button>
);
