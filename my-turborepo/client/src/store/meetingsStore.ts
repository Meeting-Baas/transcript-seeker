import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';
import { Meeting } from '@/types';

interface MeetingsState {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
}

export const useMeetingsStore = create<MeetingsState>()(
  persist(
    (set) => ({
      meetings: [],
      setMeetings: (meetings) => set({ meetings }),
    }),
    {
      name: 'meetings-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
