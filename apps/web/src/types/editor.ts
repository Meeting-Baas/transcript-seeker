import type { JSONContent } from 'novel';

export interface Editor {
  id: string;
  content?: JSONContent;
}
