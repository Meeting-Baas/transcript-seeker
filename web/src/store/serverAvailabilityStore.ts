import { create } from 'zustand';
import { ServerAvailability } from '@/types';

interface ServerAvailabilityState {
    serverAvailability: ServerAvailability;
    setServerAvailability: (availability: ServerAvailability) => void;
}

export const useServerAvailabilityStore = create<ServerAvailabilityState>()(
    (set) => ({
        serverAvailability: 'error',
        setServerAvailability: (availability) => set({ serverAvailability: availability }),
    })
);