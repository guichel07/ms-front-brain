import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrderBD } from '.';

describe('OrderBD', () => {
  let db: OrderBD;

  beforeEach(() => {
    indexedDB.deleteDatabase('order-db');

    db = OrderBD.getInstance();

    (db as unknown as { db: IDBDatabase | null }).db = null;
  });

  it('singleton', () => {
    expect(OrderBD.getInstance()).toBe(OrderBD.getInstance());
  });

  it('saveOrder', async () => {
    await db.saveOrder({} as never);

    const orders = await db.getAllOrders();

    expect(orders.length).toBe(1);
  });
});
