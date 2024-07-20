import * as idbStorage from '@/lib/indexedDB';
import { Meeting, ServerAvailability } from '@/lib/utils';
import { atom } from 'jotai';

const createIndexedDBAtom = <T,>(key: string, initialValue: T) => {
  const baseAtom = atom(initialValue);

  baseAtom.onMount = (setAtom) => {
    idbStorage.getItem<T>(key).then((value) => {
      if (value !== undefined) {
        setAtom(value);
      }
    });
  };

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const nextValue =
        typeof update === 'function' ? (update as (prev: T) => T)(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      idbStorage.setItem(key, nextValue);
    },
  );

  return derivedAtom;
};

// Define the API key atoms
export const baasApiKeyAtom = createIndexedDBAtom('baasApiKey', '');
export const openAIApiKeyAtom = createIndexedDBAtom('openAIApiKey', '');
export const gladiaApiKeyAtom = createIndexedDBAtom('gladiaApiKey', '');

// Define the atom for storing RecordingInfo, that is, meta-data for storage
export const meetingsAtom = createIndexedDBAtom<Meeting[]>('meetings', []);

// Define the server availability atom, useful not to call the API
// too many times, for instance table storage view
export const serverAvailabilityAtom = atom<ServerAvailability>('error');
