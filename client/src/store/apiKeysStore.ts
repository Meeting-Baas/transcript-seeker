import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/store';

interface ApiKeysState {
  baasApiKey: string;
  openAIApiKey: string;
  gladiaApiKey: string;
  assemblyAIApiKey: string;
  setBaasApiKey: (key: string) => void;
  setOpenAIApiKey: (key: string) => void;
  setGladiaApiKey: (key: string) => void;
  setAssemblyAIApiKey: (key: string) => void;
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set) => ({
      baasApiKey: '',
      openAIApiKey: '',
      gladiaApiKey: '',
      assemblyAIApiKey: '',
      setBaasApiKey: (key) => set({ baasApiKey: key }),
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setGladiaApiKey: (key) => set({ gladiaApiKey: key }),
      setAssemblyAIApiKey: (key) => set({ assemblyAIApiKey: key }),
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
