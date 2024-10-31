import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';
import { Chat } from '@/types';

interface ChatsState {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export const useChatsStore = create<ChatsState>()(
  persist(
    (set) => ({
      chats: [],
      setChats: (chats) => set({ chats }),
    }),
    {
      name: 'chats-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
