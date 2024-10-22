'use client';

import type { z } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ZodObjectOrWrapped } from '@meeting-baas/ui/auto-form/utils';
import AutoForm from '@meeting-baas/ui/auto-form';

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
  const [values, setValues] = useState<z.infer<T>>(defaultValues);

  const parsedSchema = useMemo(() => schema as unknown as ZodObjectOrWrapped, [schema]);

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
      formSchema={parsedSchema}
    />
  );
}
