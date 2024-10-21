import { useEffect, useState } from 'react';
import { getAPIKey, setAPIKey } from '@/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import type { SelectAPIKey } from '@meeting-baas/db/schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@meeting-baas/ui/accordion';
import { Button } from '@meeting-baas/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@meeting-baas/ui/form';
import { Input } from '@meeting-baas/ui/input';
import { Separator } from '@meeting-baas/ui/separator';

const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

const formSchema = z.object({
  baasApiKey: z.string().optional(),
  baasPublicEncryptionKey: z.string().optional(),
  openAIApiKey: z.string().optional(),
  gladiaApiKey: z.string().optional(),
  assemblyAIApiKey: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface ApiKeyFieldProps {
  name: keyof FormSchema;
  label: string;
  description: React.ReactNode;
  control: any;
  className?: string;
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({
  name,
  label,
  description,
  control,
  className,
}) => {
  const [showValues, setShowValues] = useState(false);
  const toggleVisibility = () => setShowValues(!showValues);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-lg">{label}</FormLabel>
          <FormDescription className="text-primary">{description}</FormDescription>
          <FormControl>
            <div className="relative flex items-center gap-2">
              <Input
                type={showValues ? 'text' : 'password'}
                placeholder="Enter API key"
                {...field}
                value={field.value}
              />
              {field.value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={toggleVisibility}
                >
                  {showValues ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function SettingsForm() {
  const { data: baasApiKey, mutate: mutateBaasApiKey } = useSWR('baasApiKey', () =>
    fetchAPIKey('meetingbaas'),
  );
  const { data: openAIApiKey, mutate: mutateOpenAIApiKey } = useSWR('openAIApiKey', () =>
    fetchAPIKey('openai'),
  );
  const { data: gladiaApiKey, mutate: mutateGladiaApiKey } = useSWR('gladiaApiKey', () =>
    fetchAPIKey('gladia'),
  );
  const { data: assemblyAIApiKey, mutate: mutateAssemblyAIApiKey } = useSWR('assemblyAIApiKey', () =>
    fetchAPIKey('assemblyai'),
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baasApiKey: baasApiKey ?? '',
      openAIApiKey: openAIApiKey ?? '',
      gladiaApiKey: gladiaApiKey ?? '',
      assemblyAIApiKey: assemblyAIApiKey ?? '',
    },
  });
  const { isDirty } = useFormState({ control: form.control });

  const onSubmit = async (values: FormSchema) => {
    // console.log('Submitted values:', values);
    await setAPIKey({ type: 'meetingbaas', content: values.baasApiKey! });
    await setAPIKey({ type: 'openai', content: values.openAIApiKey! });
    await setAPIKey({ type: 'gladia', content: values.gladiaApiKey! });
    await setAPIKey({ type: 'assemblyai', content: values.assemblyAIApiKey! });

    mutateBaasApiKey();
    mutateOpenAIApiKey();
    mutateGladiaApiKey();
    mutateAssemblyAIApiKey();

    toast.success('API keys updated successfully');
    form.reset(values);
  };

  useEffect(() => {
    form.reset({
      baasApiKey: baasApiKey ?? '',
      openAIApiKey: openAIApiKey ?? '',
      gladiaApiKey: gladiaApiKey ?? '',
      assemblyAIApiKey: assemblyAIApiKey ?? '',
    });
  }, [baasApiKey, openAIApiKey, gladiaApiKey, assemblyAIApiKey]);

  const renderLink = (text: string, href: string) => (
    <Button variant="link" asChild className="h-min w-min p-0">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </Button>
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-0 pb-4 text-xl hover:no-underline">
                Meeting Baas API for video-meetings 🐟
              </AccordionTrigger>
              <AccordionContent className="space-y-6 px-1">
                <ApiKeyField
                  name="baasApiKey"
                  label="API Key"
                  description={
                    <>
                      Use this key to record, and transcribe. Get your Meeting Baas API key by
                      visiting {renderLink('MeetingBaas', 'https://meetingbaas.com/login')}.
                    </>
                  }
                  control={form.control}
                />

                <ApiKeyField
                  name="baasPublicEncryptionKey"
                  label="Public Encryption Key"
                  description={
                    <>
                      This key is used to encrypt your API keys when sharing recordings with others.
                      Get your Public Encryption Key by visiting{' '}
                      {renderLink('MeetingBaas', 'https://meetingbaas.com/login')}.
                    </>
                  }
                  control={form.control}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ApiKeyField
            name="openAIApiKey"
            label="Chat with your meetings using the OpenAI API"
            className="[&>label]:text-xl"
            description={
              <>
                Optional. Get your API key by visiting{' '}
                {renderLink('OpenAI', 'https://platform.openai.com/api-keys')}.
              </>
            }
            control={form.control}
          />
          <Separator />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-0 pb-4 text-xl hover:no-underline">
                Transcription API keys for local file uploads
              </AccordionTrigger>
              <AccordionContent className="space-y-6 px-1">
                <ApiKeyField
                  name="gladiaApiKey"
                  label="Gladia" // for now this will be transcription api key
                  description={
                    <>
                      Optional. Used to transcribe file uploads. Get your key by visiting{' '}
                      {renderLink(
                        'Gladia',
                        'https://app.gladia.io/auth/signup/?utm_source=MeetingBaas',
                      )}
                      .
                    </>
                  }
                  control={form.control}
                />

                <ApiKeyField
                  name="assemblyAIApiKey"
                  label="AssemblyAI" // for now this will be transcription api key
                  description={
                    <>
                      Optional. Used to transcribe file uploads. Get your key by visiting{' '}
                      {renderLink(
                        'AssemblyAI',
                        'https://www.assemblyai.com/?utm_source=MeetingBaas',
                      )}
                      .
                    </>
                  }
                  control={form.control}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {isDirty && (
            <Button className="mt-8" type="submit" variant="default">
              Save Changes
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
