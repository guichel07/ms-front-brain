import type { SellerData } from '../model';

export class AuthBD {
  private static instance: AuthBD;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'auth-db';
  private readonly STORE = 'session';
  private readonly keyPath = 'current_seller';

  private constructor() { }

  public static getInstance(): AuthBD {
    if (!AuthBD.instance) {
      AuthBD.instance = new AuthBD();
    }
    return AuthBD.instance;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(this.STORE, { keyPath: this.keyPath });
      };
      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async saveSession (seller: SellerData, expiresIn = 3600){
    const db = await this.getDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.STORE, 'readwrite');
      const store = tx.objectStore(this.STORE);
      store.put(
        {current_seller: this.keyPath, seller, expiresAt: Date.now() + expiresIn * 1000 }
      );
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject();
    })
  };

  async getSessionByEmail (): Promise<SellerData | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(this.STORE).objectStore(this.STORE).get(this.keyPath);
      req.onsuccess = () => {
        const data = req.result;
        if (!data) return resolve(null);
        if (Date.now() > data.expiresAt) {
          this.clearSession();
          return resolve(null);
        }
        resolve(data.seller);
      };
      req.onerror = () => reject(req.error);
    });
  };

  async clearSession () {
    const db = await this.getDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.STORE, 'readwrite');
      const store = tx.objectStore(this.STORE);
      store.delete(this.keyPath);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject();
    })
  };

}
