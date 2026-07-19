import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { DailySalesDB } from '.';

describe('DailySalesDB', () => {
  let db: DailySalesDB;

  beforeEach(async () => {
    const instance = DailySalesDB.getInstance();

    const database = (instance as unknown as { db: IDBDatabase | null }).db;

    if (database) {
      database.close();
    }

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('dailySales-db');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });

    (instance as unknown as { db: IDBDatabase | null }).db = null;

    db = instance;
  });

  it('retourne toujours la même instance', () => {
    expect(DailySalesDB.getInstance()).toBe(DailySalesDB.getInstance());
  });

  it('retourne 0 au départ', async () => {
    const total = await db.getTodayTotal();

    expect(total).toBe(0);
  });

  it('ajoute un montant', async () => {
    const total = await db.addToTodayTotal(100);

    expect(total).toBe(100);

    const stored = await db.getTodayTotal();
    expect(stored).toBe(100);
  });

  it('cumule les montants', async () => {
    await db.addToTodayTotal(100);
    await db.addToTodayTotal(50);

    const total = await db.getTodayTotal();

    expect(total).toBe(150);
  });

  it('getTodayTotal retourne le total courant', async () => {
    await db.addToTodayTotal(70);

    const total = await db.getTodayTotal();

    expect(total).toBe(70);
  });
});
