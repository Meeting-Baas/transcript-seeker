
export type Transcript = {
    speaker: string;
    words: {
      start_time: number;
      end_time: number;
      text: string;
    }[];
  };