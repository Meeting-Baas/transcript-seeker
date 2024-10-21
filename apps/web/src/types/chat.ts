export type Message = {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

export type Chat = {
  id: string;
  messages?: Message[];
};
