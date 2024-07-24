import { Upload } from '@/components/upload';

import { HeaderTitle } from '@/components/header-title';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Separator } from '@/components/ui/separator';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import React from 'react';
import LanguageCombobox from '@/components/language-select';

import * as gladia from '@/lib/transcription/gladia/options';
import * as assemblyai from '@/lib/transcription/assemblyai/options';

import ProvidersForm from '@/components/upload/providers-form';
import { useAtom } from 'jotai';
import { providerOptionsAtom } from '@/store';

export const formSchema = z.object({
  provider: z.string().min(1, {
    message: 'Please select a provider to use for transcription.',
  }),
  language: z.string().min(1, {
    message: 'Please select a language to use for transcription.',
  }),
});

export default function UploadPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: 'gladia',
      language: 'en',
    },
    mode: "onChange"
  });

  const [options, setOptions] = React.useState<z.infer<typeof formSchema>>({
    provider: 'gladia',
    language: 'en',
  });
  const [providerOptions, setProviderOptions] = useAtom(providerOptionsAtom)

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setOptions(values);
  }

  const data = form.watch();
  React.useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) onSubmit(data)
  }, [form.formState, data]);

  function handleProviderSubmit(values: {
    [key: string]: unknown
  }) {
    // this is the jankiest of jank
    setProviderOptions(values)
  }

  function getProviderOptions(provider?: string) {
    if (provider === 'gladia') return gladia.options;
    if (provider === 'assemblyai') return assemblyai.options;

    return [];
  }

  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <div className="px-4 pt-2">
        <HeaderTitle path="/" title="Upload" />
      </div>
      <div>
        <ResizablePanelGroup
          // padding + footer + header + 1px = 110px
          // header = 45px
          // footer = 48px
          // padding = pt-2 = 8px
          className="flex min-h-[calc(100dvh-102px)]"
          direction={isDesktop ? 'horizontal' : 'vertical'}
        >
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="flex flex-col h-full w-full space-y-4 bg-muted/50 p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                  {/* Provider */}
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
                        {/* <FormDescription>
                          You can manage email addresses in your{' '}
                          <Link href="/examples/forms">email settings</Link>.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Language</FormLabel>
                        <LanguageCombobox form={form} field={field} />
                        {/* <FormDescription>
                          You can manage email addresses in your{' '}
                          <Link href="/examples/forms">email settings</Link>.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <Button type="submit">Save changes</Button> */}
                </form>
              </Form>

              <Separator />
              {/* Select additional capabilites (optional) */}
              <div className="h-full flex-1 space-y-4 flex flex-col">
                <h2 className="text-md font-semibold">Select additional capabilites</h2>

                {options?.provider && <ProvidersForm data={getProviderOptions(options.provider)} onSubmit={handleProviderSubmit} />}
              </div>
              {/* Diarazation */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} minSize={30}>
            <div className="p-4">
              {options ? (
                <Upload provider={options.provider!} language={options.language!} options={providerOptions} />
              ) : (
                <p>Please save your options to proceed with the upload.</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
