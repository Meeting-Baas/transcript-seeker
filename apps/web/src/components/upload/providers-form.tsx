'use client';

import type { z } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ZodProvider } from '@autoform/zod';

import { AutoForm } from '@meeting-baas/ui/autoform';

interface ProvidersFormProps<T extends z.ZodTypeAny> {
  defaultValues: z.infer<T>;
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
}

export default function ProvidersForm<T extends z.ZodTypeAny>({
  defaultValues,
  schema,
  onSubmit,
}: ProvidersFormProps<T>) {
  const schemaProvider = new ZodProvider(schema);
  const [values, setValues] = useState<z.infer<T>>(defaultValues);

  useEffect(() => {
    if (!defaultValues) return;
    setValues(defaultValues);
  }, [defaultValues]);

  const handleParsedValuesChange = useCallback(
    (parsedValues: z.infer<T>) => {
      setValues(parsedValues);
      onSubmit(parsedValues);
    },
    [onSubmit],
  );

  return (
    <AutoForm
      values={values}
      onParsedValuesChange={handleParsedValuesChange}
      schema={schemaProvider}
    />
  );
}
