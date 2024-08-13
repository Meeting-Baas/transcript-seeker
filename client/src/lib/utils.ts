import { MeetingInfo } from '@/types';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a constant for a blank MeetingInfo object
export const BLANK_MEETING_INFO: MeetingInfo = {
  id: '',
  name: '',
  editors: [
    {
      video: {
        transcripts: [
          {
            speaker: '',
            words: [
              {
                start_time: 0,
                end_time: 0,
                text: '',
              },
            ],
          },
        ],
      },
    },
  ],
  attendees: [{ name: '-' }],
  assets: [
    {
      mp4_s3_path: '',
    },
  ],
  created_at: {
    secs_since_epoch: 0,
    nanos_since_epoch: 0,
  },
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