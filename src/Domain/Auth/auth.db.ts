const DB_NAME = 'auth-db';
const STORE = 'session';

export interface SellerData {
  contact: string;
  email: string;
  name: string;
  role: string;
  svgAvatar: string;
  tag: string;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const saveSession = async (seller: SellerData, expiresIn = 3600) => {
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(
    { seller, expiresAt: Date.now() + expiresIn * 1000 },
    'current'
  );
};

export const getSession = async (): Promise<SellerData | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get('current');
    req.onsuccess = () => {
      const data = req.result;
      if (!data) return resolve(null);
      if (Date.now() > data.expiresAt) {
        clearSession();
        return resolve(null);
      }
      resolve(data.seller);
    };
    req.onerror = () => reject(req.error);
  });
};

export const clearSession = async () => {
  const db = await openDB();
  db.transaction(STORE, 'readwrite').objectStore(STORE).delete('current');
};
