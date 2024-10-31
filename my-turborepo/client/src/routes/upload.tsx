import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useProviderOptionsStore } from '@/store';

import { Upload } from '@/components/upload';
import { HeaderTitle } from '@/components/header-title';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LanguageCombobox from '@/components/language-select';
import ProvidersForm from '@/components/upload/providers-form';

import * as gladia from '@/lib/transcription/gladia/options';
import * as assemblyai from '@/lib/transcription/assemblyai/options';

import { Provider } from '@/components/upload/types';

export const formSchema = z.object({
  provider: z.string().min(1, {
    message: 'Please select a provider to use for transcription.',
  }),
  language: z.string().min(1, {
    message: 'Please select a language to use for transcription.',
  }),
});

function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
      return [key, undefined];
    }),
  );
}

export default function UploadPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: 'gladia',
      language: 'en',
    },
    mode: 'onChange',
  });

  const [options, setOptions] = useState<z.infer<typeof formSchema>>({
    provider: 'gladia',
    language: 'en',
  });

  const rawProviderOptions = useProviderOptionsStore((state) => state.providerOptions);
  const getProviderOptions = useProviderOptionsStore((state) => state.getProviderOptions);
  const setProviderOptions = useProviderOptionsStore((state) => state.setProviderOptions);

  const providerOptions = useMemo(
    () => getProviderOptions(options.provider),
    [rawProviderOptions, options, getProviderOptions],
  );

  const getProviderSchema = useCallback((provider?: string) => {
    if (provider === 'gladia') return gladia.options;
    if (provider === 'assemblyai') return assemblyai.options;
  }, []);

  const providerSchema = useMemo(
    () => getProviderSchema(options.provider),
    [options, getProviderSchema],
  );

  const defaultValues = useMemo(() => {
    if (!providerOptions) {
      if (!providerSchema) return;
      return getDefaults(providerSchema);
    }

    const data = { ...providerOptions };
    for (const key in data) {
      if (!data[key]) {
        data[key] = false;
      }
    }

    return data;
  }, [providerOptions, providerSchema]);

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    setOptions(values);
  }, []);

  const handleProviderSubmit = useCallback(
    (values: { [key: string]: unknown }) => {
      setProviderOptions(options.provider, values);
    },
    [options, setProviderOptions],
  );

  const data = form.watch();
  useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) onSubmit(data);
  }, [form.formState, data, onSubmit]);

  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <div>
        <div className="px-4 py-1">
          <HeaderTitle path="/" title="Upload" border={false} />
        </div>
        <Separator />
      </div>

      <ResizablePanelGroup
        className="flex min-h-[calc(100dvh-102px)]"
        direction={isDesktop ? 'horizontal' : 'vertical'}
      >
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full w-full flex-col space-y-4 bg-muted/50 p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                {/* Provider Selection */}
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gladia">Gladia</SelectItem>
                          <SelectItem value="assemblyai">AssemblyAI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language Selection */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      {/* todo: this doesn't do anything currently */}
                      {/* todo: add automatic option or auto detect */}
                      <FormLabel>Language</FormLabel>
                      <LanguageCombobox form={form} field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <Separator />

            {/* Additional Capabilities */}
            <div className="flex h-full flex-1 flex-col space-y-4">
              <h2 className="text-md font-semibold">Select additional capabilities</h2>

              {options?.provider && (
                <ProvidersForm
                  defaultValues={defaultValues!}
                  schema={providerSchema!}
                  onSubmit={handleProviderSubmit}
                />
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={30}>
          <div className="p-4">
            {options ? (
              <Upload
                provider={options.provider as Provider}
                language={options.language}
                options={providerOptions!}
              />
            ) : (
              <p>Please save your options to proceed with the upload.</p>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
