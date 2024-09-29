import { MeetingInfo } from '@/types';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a constant for a blank MeetingInfo object
export const BLANK_MEETING_INFO: MeetingInfo = {
  name: '',
    bot_data: {
      bot: null,
      transcripts: []
    },
    mp4: '',
};

export const LOADING_EDITOR_DATA = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Loading...',
        },
      ],
    },
  ],
};

export const BLANK_EDITOR_DATA = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Nothing here yet!',
        },
      ],
    },
  ],
};