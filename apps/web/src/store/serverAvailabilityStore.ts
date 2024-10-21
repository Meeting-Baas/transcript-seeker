import { ServerAvailability } from '@/types';
import { create } from 'zustand';

interface ServerAvailabilityState {
  serverAvailability: ServerAvailability;
  setServerAvailability: (availability: ServerAvailability) => void;
}

export const useServerAvailabilityStore = create<ServerAvailabilityState>()((set) => ({
  serverAvailability: 'loading',
  setServerAvailability: (availability) => set({ serverAvailability: availability }),
}));
