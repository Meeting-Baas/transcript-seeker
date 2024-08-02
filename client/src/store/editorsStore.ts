import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';
import { Editor } from '@/types';

interface EditorsState {
  editors: Editor[];
  setEditors: (editors: Editor[]) => void;
}

export const useEditorsStore = create<EditorsState>()(
  persist(
    (set) => ({
      editors: [],
      setEditors: (editors) => set({ editors }),
    }),
    {
      name: 'editors-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);