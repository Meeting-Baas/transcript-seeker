import { storage } from '@/store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ApiKeysState {
  baasApiKey: string;
  baasPublicEncryptionKey: string;
  openAIApiKey: string;
  gladiaApiKey: string;
  assemblyAIApiKey: string;
  setBaasApiKey: (key: string) => void;
  setBaasPublicEncryptionKey: (key: string) => void;
  setOpenAIApiKey: (key: string) => void;
  setGladiaApiKey: (key: string) => void;
  setAssemblyAIApiKey: (key: string) => void;
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set) => ({
      baasApiKey: '',
      baasPublicEncryptionKey: '',
      openAIApiKey: '',
      gladiaApiKey: '',
      assemblyAIApiKey: '',
      setBaasApiKey: (key) => set({ baasApiKey: key }),
      setBaasPublicEncryptionKey: (key) => set({ baasPublicEncryptionKey: key }),
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setGladiaApiKey: (key) => set({ gladiaApiKey: key }),
      setAssemblyAIApiKey: (key) => set({ assemblyAIApiKey: key }),
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
