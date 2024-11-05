export interface Message {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

export interface Chat {
  id: string;
  messages?: Message[];
}
