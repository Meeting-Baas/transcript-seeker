import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { baasApiKeyAtom, gladiaApiKeyAtom, openAIApiKeyAtom } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  baasApiKey: z.string().optional(),
  openAIApiKey: z.string().optional(),
  gladiaApiKey: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface ApiKeyFieldProps {
  name: keyof FormSchema;
  label: string;
  description: React.ReactNode;
  control: any;
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({ name, label, description, control }) => {
  const [showValues, setShowValues] = useState(false);
  const toggleVisibility = () => setShowValues(!showValues);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-0">
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
  const [baasApiKey, setBaasApiKey] = useAtom(baasApiKeyAtom);
  const [openAIApiKey, setOpenAIApiKey] = useAtom(openAIApiKeyAtom);
  const [gladiaApiKey, setGladiaApiKey] = useAtom(gladiaApiKeyAtom);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baasApiKey,
      openAIApiKey,
      gladiaApiKey,
    },
  });
  const { isDirty } = useFormState({ control: form.control });

  const onSubmit = async (values: FormSchema) => {
    console.log('Submitted values:', values);
    setBaasApiKey(values.baasApiKey!);
    setOpenAIApiKey(values.openAIApiKey!);
    setGladiaApiKey(values.gladiaApiKey!);
    toast.success('API keys updated successfully');
    form.reset(values);
  };

  useEffect(() => {
    form.reset({ baasApiKey, openAIApiKey, gladiaApiKey });
  }, [baasApiKey, openAIApiKey, gladiaApiKey]);

  const renderLink = (text: string, href: string) => (
    <Button variant="link" asChild className="p-0">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </Button>
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ApiKeyField
            name="baasApiKey"
            label="Meeting Baas 🐟"
            description={
              <>
                Record, transcribe and display video meetings. Get your Meeting Baas API key by
                visiting {renderLink('MeetingBaas', 'https://meetingbaas.com/login')}.
              </>
            }
            control={form.control}
          />
          <ApiKeyField
            name="openAIApiKey"
            label="OpenAI"
            description={
              <>
                Optional. Used to "chat with your meetings". Get your key by visiting{' '}
                {renderLink('OpenAI', 'https://platform.openai.com/api-keys')}.
              </>
            }
            control={form.control}
          />
          <ApiKeyField
            name="gladiaApiKey"
            label="Gladia"
            description={
              <>
                Optional. Used to transcribe file uploads. Get your key by visiting{' '}
                {renderLink('Gladia', 'https://app.gladia.io/auth/signup/?utm_source=MeetingBaas')}.
              </>
            }
            control={form.control}
          />

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
