import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';

interface ProviderOptionsState {
  providerOptions: { [provider: string]: { [key: string]: unknown } };
  setProviderOptions: (provider: string, options: { [key: string]: unknown }) => void;
  getProviderOptions: (provider: string) => { [key: string]: unknown } | undefined;
}

export const useProviderOptionsStore = create<ProviderOptionsState>()(
  persist(
    (set, get) => ({
      providerOptions: {},

      setProviderOptions: (provider, options) =>
        set((state) => ({
          providerOptions: {
            ...state.providerOptions,
            [provider]: {
              ...state.providerOptions[provider],
              ...options,
            },
          },
        })),

      getProviderOptions: (provider) => get().providerOptions[provider],
    }),
    {
      name: 'provider-options-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
