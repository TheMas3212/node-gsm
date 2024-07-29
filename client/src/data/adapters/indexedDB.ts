import {openDB} from 'idb';

const getDatabase = async (dbName) => {
  return await openDB('node-gsm', 1, {
    upgrade(db) {
      db.createObjectStore(dbName);
    }
  });
};

export const saveData = async (key, data) => {
  try {
  const db = await getDatabase('data');
  const transaction = db.transaction('data', 'readwrite');
  const store = transaction.objectStore('data');
  store.put(data, key);
  return store.get(key);
  } catch (error) {
    console.error(error);
  }
};

export const loadData = async (key) => {
  try {
  const db = await getDatabase('data');
  const transaction = db.transaction('data', 'readonly');
  const store = transaction.objectStore('data');
  return store.get(key);
  } catch (error) {
    console.error(error);
  }
};

export const removeData = async (key) => {
  try {
  const db = await getDatabase('data');
  const transaction = db.transaction('data', 'readwrite');
  const store = transaction.objectStore('data');
  store.delete(key);
  } catch (error) {
    console.error(error);
  }
};

