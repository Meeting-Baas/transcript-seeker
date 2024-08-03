import { storage } from '@/store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ApiKeysState {
  baasApiKey: string;
  openAIApiKey: string;
  gladiaApiKey: string;
  assemblyAIApiKey: string;
  deepgramApiKey: string;
  setBaasApiKey: (key: string) => void;
  setOpenAIApiKey: (key: string) => void;
  setGladiaApiKey: (key: string) => void;
  setAssemblyAIApiKey: (key: string) => void;
  setDeepgramApiKey: (key: string) => void;
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set) => ({
      baasApiKey: '',
      openAIApiKey: '',
      gladiaApiKey: '',
      assemblyAIApiKey: '',
      deepgramApiKey: '',
      setBaasApiKey: (key) => set({ baasApiKey: key }),
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setGladiaApiKey: (key) => set({ gladiaApiKey: key }),
      setAssemblyAIApiKey: (key) => set({ assemblyAIApiKey: key }),
      setDeepgramApiKey: (key) => set({ deepgramApiKey: key }),
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
