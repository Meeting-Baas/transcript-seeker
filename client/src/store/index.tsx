import { atomWithAsyncStorage } from '@/lib/indexedDB';
import { Chat, Editor, Meeting, ServerAvailability } from '@/types';
import { atom } from 'jotai';

// Define the API key atoms
export const baasApiKeyAtom = atomWithAsyncStorage('baasApiKey', '');
export const openAIApiKeyAtom = atomWithAsyncStorage('openAIApiKey', '');
export const gladiaApiKeyAtom = atomWithAsyncStorage('gladiaApiKey', '');

// Define the atom for storing RecordingInfo, that is, meta-data for storage
export const meetingsAtom = atomWithAsyncStorage<Meeting[]>('meetings', []);
export const providerOptionsAtom = atomWithAsyncStorage<{
    [key: string]: unknown
}>('providerOptions', {});

export const editorsAtom = atomWithAsyncStorage<Editor[]>('editors', []);
export const chatsAtom = atomWithAsyncStorage<Chat[]>('chats', []);

// Define the server availability atom, useful not to call the API
// too many times, for instance table storage view
export const serverAvailabilityAtom = atom<ServerAvailability>('error');
