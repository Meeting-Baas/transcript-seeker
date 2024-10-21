import type { formSchema } from '@/components/viewer/chat/chat-input';
import ChatInput from '@/components/viewer/chat/chat-input';
import Message from '@/components/viewer/chat/message';
import type { Message as MessageT } from '@/types';
import type { z } from 'zod';

import { Card, CardContent, CardHeader } from '@meeting-baas/ui/card';

interface ChatProps {
  messages?: MessageT[];
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
  disabled?: {
    value: boolean;
    reason: 'openai' | 'loading';
  };
}

function Chat({ messages = [], handleSubmit, disabled }: ChatProps) {
  return (
    <Card className="relative mx-auto flex h-full w-full flex-col rounded-none border-0 border-x border-b lg:border-0 lg:border-b lg:border-r">
      <CardHeader className="flex items-center gap-4 p-4">
        <div className="text-sm font-medium">GPT-4o-mini</div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 overflow-auto p-4">
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {!disabled?.value && messages.length === 0 && (
            <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
              There are no messages. Type something to start chatting.
            </div>
          )}
          {disabled?.value && disabled.reason === 'openai' && (
            <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
              No OpenAI API key was found. Please input one in the settings to start chatting.
            </div>
          )}
          {disabled?.value && disabled.reason === 'loading' && (
            <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
              The chat is loading... Please wait...
            </div>
          )}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>

        <div className="flex flex-1 items-end">
          <ChatInput handleSubmit={handleSubmit} disabled={disabled?.value || false} />
        </div>
      </CardContent>
    </Card>
  );
}

export default Chat;
