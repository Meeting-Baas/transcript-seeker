import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProviderOptionsState {
  providerOptions: Record<string, Record<string, unknown>>;
  setProviderOptions: (provider: string, options: Record<string, unknown>) => void;
  getProviderOptions: (provider: string) => Record<string, unknown> | undefined;
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
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
