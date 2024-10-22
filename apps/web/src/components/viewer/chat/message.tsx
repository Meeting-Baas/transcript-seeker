import { BotMessageSquareIcon, UserIcon } from 'lucide-react';

import { cn } from '@meeting-baas/ui';
import {
  Avatar,
  // AvatarImage,
  AvatarFallback,
} from '@meeting-baas/ui/avatar';

function Message({ message }: { message: { content: string; role: string } }) {
  return (
    <>
      <div
        className={cn('flex items-start gap-4', {
          'flex-row-reverse': message.role === 'user',
        })}
      >
        <Avatar className="h-8 w-8 border">
          <AvatarFallback>
            {message.role === 'assistant' ? (
              <BotMessageSquareIcon className="h-4 w-4" />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn('max-w-[70%] rounded-lg bg-muted p-3 text-sm', {
            'bg-primary text-primary-foreground': message.role === 'assistant',
          })}
        >
          <p>{message.content}</p>
        </div>
      </div>
    </>
  );
}

export default Message;
