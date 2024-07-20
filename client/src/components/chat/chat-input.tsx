import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  // ArrowLeft,
  ArrowUpIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  //   FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

export const formSchema = z.object({
  message: z.string().trim().min(2, {
    message: 'Message must be at least 2 characters.',
  }),
});

interface ChatInputProps {
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
}

function ChatInput({ handleSubmit }: ChatInputProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await handleSubmit(values);

      setIsLoading(false);
      form.reset({ message: '' });
    } catch (error) {
      console.error('Error sending message:', error);

      setIsLoading(false);
      form.reset({ message: '' });
      toast.error('Ooops! Something went wrong. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Chat with your meeting here..."
                  rows={1}
                  className="min-h-[48px] resize-none rounded-2xl border p-4 shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && 'form' in e.target) {
                      e.preventDefault();
                      (e.target.form as HTMLFormElement).requestSubmit();
                    }
                  }}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-3 top-2.5 h-8 w-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircleIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </Form>
  );
}

export default ChatInput;
