import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DailySalesService } from '.';
import { DailySalesDB } from '../IndexDB';

describe('DailySalesService', () => {
  const db = {
    getTodayTotal: vi.fn(),
    addToTodayTotal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(DailySalesDB, 'getInstance').mockReturnValue(
      db as unknown as ReturnType<typeof DailySalesDB.getInstance>
    );
  });

  it('retourne toujours la même instance', () => {
    expect(DailySalesService.getInstance()).toBe(
      DailySalesService.getInstance()
    );
  });

  it('getTodayTotal appelle la base', async () => {
    db.getTodayTotal.mockResolvedValue(100);

    const result = await DailySalesService.getInstance().getTodayTotal();

    expect(result).toBe(100);
    expect(db.getTodayTotal).toHaveBeenCalled();
  });

  it('addToTodayTotal appelle la base', async () => {
    db.addToTodayTotal.mockResolvedValue(250);

    const result = await DailySalesService.getInstance().addToTodayTotal(50);

    expect(result).toBe(250);
    expect(db.addToTodayTotal).toHaveBeenCalledWith(50);
  });
});
