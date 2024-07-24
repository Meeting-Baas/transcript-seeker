import ChatInput, { formSchema } from '@/components/viewer/chat/chat-input';
import Message from '@/components/viewer/chat/message';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Message as MessageT } from '@/types';

import { z } from 'zod';

interface ChatProps {
  messages?: MessageT[];
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
}

function Chat({ messages = [], handleSubmit }: ChatProps) {
  return (
    <Card className="relative mx-auto flex h-full w-full flex-col rounded-none border-0 border-x border-b lg:border-0 lg:border-b lg:border-r">
      <CardHeader className="flex items-center gap-4 p-4">
        <div className="text-sm font-medium">GPT-4o-mini</div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 overflow-auto p-4">
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {messages.length === 0 && (
            <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
              There are no messages. Type something to start chatting.
            </div>
          )}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>

        <div className="flex flex-1 items-end">
          <ChatInput handleSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
}

export default Chat;
