// import type { JSONContent } from 'novel';

import { Transcript } from '.';

export type Meeting = {
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
  createdAt: Date;
  status: 'loaded' | 'loading' | 'error';
  type: 'meetingbaas' | 'local';
};
