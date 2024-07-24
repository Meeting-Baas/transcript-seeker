import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { ProviderOption } from './types';
import { Switch } from '@/components/ui/switch';
import React from 'react';

interface ProvidersFormProps {
  data: ProviderOption[];
  onSubmit: (values: { [key: string]: unknown; }) => void;
}

// Define the type for the default values
type DefaultValuesType = {
  [key: string]: unknown;
};

export default function ProvidersForm({ data, onSubmit }: ProvidersFormProps) {
  const defaultValues = data.reduce((acc, provider) => {
    if (provider.type === 'switch') {
      acc[provider.value] = false;
    }
    return acc;
  }, {} as DefaultValuesType);

  const form = useForm({
    defaultValues,
  });

  const formData = form.watch();
  React.useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) onSubmit(formData)
  }, [form.formState, data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-1 flex-col space-y-4"
      >
        <ScrollArea className="flex-1">
          {data.map((provider) => {
            if (provider.type === 'switch') {
              return (
                <FormField
                  control={form.control}
                  name={provider.value}
                  key={provider.value}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <FormLabel>{provider.name}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            }
            return null;
          })}
        </ScrollArea>
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
