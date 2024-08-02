import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';
import { ServerAvailability } from '@/types';

interface ServerAvailabilityState {
  serverAvailability: ServerAvailability;
  setServerAvailability: (availability: ServerAvailability) => void;
}

export const useServerAvailabilityStore = create<ServerAvailabilityState>()(
  persist(
    (set) => ({
      serverAvailability: 'error',
      setServerAvailability: (availability) => set({ serverAvailability: availability }),
    }),
    {
      name: 'server-availability-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);