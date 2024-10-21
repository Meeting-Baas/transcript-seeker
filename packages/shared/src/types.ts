export type Transcript = {
  speaker: string;
  words: {
    start_time: number;
    end_time: number;
    text: string;
  }[];
};

export type Message = {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

export type Chat = {
  id: string;
  messages?: Message[];
};
