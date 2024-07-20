import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the server availability type
export type ServerAvailability = 'server' | 'local' | 'error';

// Define the recording info type
export type Meeting = {
  id: string;
  name: string;
  bot_id: string;
  attendees: string[];
  data?: MeetingInfo;
  createdAt: Date;
  status: 'loaded' | 'loading' | 'error';
};

export type MeetingInfo = {
  id: string;
  name: string;
  editors: [
    {
      video: {
        transcripts: Transcript[];
      };
    },
  ];
  attendees: [{ name: string }];
  assets: [
    {
      mp4_s3_path: string | Blob;
    },
  ];
  created_at: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
};

export type Transcript = {
  speaker: string;
  words: {
    start_time: number;
    end_time: number;
    text: string;
  }[];
};

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
