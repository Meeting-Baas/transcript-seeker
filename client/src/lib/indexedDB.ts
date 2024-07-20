import { DBSchema, openDB } from 'idb';

const dbName = 'meeting-baas-db';
const storeName = 'meeting-baas-store';

interface MyDB extends DBSchema {
  [storeName]: {
    key: string;
    value: any;
  };
}

const dbPromise = openDB<MyDB>(dbName, 1, {
  upgrade(db: any) {
    db.createObjectStore(storeName);
  },
});

export async function getItem<T>(key: string): Promise<T | undefined> {
  return (await dbPromise).get(storeName, key);
}

export async function setItem<T>(key: string, val: T): Promise<void> {
  await (await dbPromise).put(storeName, val, key);
}

export async function deleteItem(key: string): Promise<void> {
  await (await dbPromise).delete(storeName, key);
}

export async function clear(): Promise<void> {
  await (await dbPromise).clear(storeName);
}

export async function keys(): Promise<string[]> {
  return (await dbPromise).getAllKeys(storeName) as Promise<string[]>;
}
