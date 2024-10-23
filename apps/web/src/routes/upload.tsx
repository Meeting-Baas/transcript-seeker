import type { Provider } from '@/components/upload/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LanguageCombobox from '@/components/language-select';
import { ModeToggle } from '@/components/mode-toggle';
import ServerAvailablity from '@/components/server-availablity';
import ProvidersForm from '@/components/upload/providers-form';
// import { useProviderOptionsStore } from '@/store';

import { UploadForm } from '@/components/upload/upload-form';
import * as assemblyai from '@/lib/transcription/assemblyai/options';
import * as gladia from '@/lib/transcription/gladia/options';
import { useProviderOptionsStore } from '@/store/providerOptionsStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meeting-baas/ui/breadcrumb';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@meeting-baas/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@meeting-baas/ui/select';
import { Separator } from '@meeting-baas/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@meeting-baas/ui/sidebar';

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

  // todo: fix provider options so that it is stored like it was prev
  const handleProviderSubmit = useCallback(
    (values: Record<string, unknown>) => {
      setProviderOptions(options.provider, values);
    },
    [options, setProviderOptions],
  );

  const data = form.watch();
  useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) onSubmit(data);
  }, [form.formState, data, onSubmit]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-0">Settings</SidebarGroupLabel>
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarGroupLabel className="px-0">Select additional capabilities</SidebarGroupLabel>

            <SidebarGroupContent>
              {options.provider && (
                <ProvidersForm
                  defaultValues={defaultValues}
                  schema={providerSchema!}
                  onSubmit={handleProviderSubmit}
                />
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <ServerAvailablity />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Upload File</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-1 justify-end">
            <ModeToggle />
          </div>
        </header>

        <div className="p-4">
          {options ? (
            <UploadForm
              provider={options.provider as Provider}
              language={options.language}
              options={providerOptions!}
            />
          ) : (
            <p>Please save your options to proceed with the upload.</p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
