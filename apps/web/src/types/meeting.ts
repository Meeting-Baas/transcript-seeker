// import type { JSONContent } from 'novel';

import type { Transcript } from '.';

export interface Meeting {
  id: number;
  name: string;
  botId: string;
  attendees: string[];
  transcripts: Transcript[];
  assets: {
    video_url: string | null;
    video_blob: Blob | null;
  };
  // editorContent?: JSONContent;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  status: 'loaded' | 'loading' | 'error';
  type: 'meetingbaas' | 'local';
}
