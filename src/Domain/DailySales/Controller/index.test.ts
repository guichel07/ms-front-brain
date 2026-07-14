import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DailySalesController } from '.';
import { DailySalesService } from '../Service';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

describe('DailySalesController', () => {
  const service = {
    getTodayTotal: vi.fn(),
    addToTodayTotal: vi.fn(),
  };

  const eventBus = {
    on: vi.fn(),
    emit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(DailySalesService, 'getInstance').mockReturnValue(
      service as unknown as ReturnType<typeof DailySalesService.getInstance>
    );

    vi.spyOn(EventBus, 'getInstance').mockReturnValue(
      eventBus as unknown as ReturnType<typeof EventBus.getInstance>
    );
  });

  it('retourne toujours la même instance', () => {
    expect(DailySalesController.getInstance()).toBe(
      DailySalesController.getInstance()
    );
  });

  it('getTodayTotal appelle le service', async () => {
    service.getTodayTotal.mockResolvedValue(150);

    const result = await DailySalesController.getInstance().getTodayTotal();

    expect(result).toBe(150);
    expect(service.getTodayTotal).toHaveBeenCalled();
  });

  it('addToTodayTotal appelle le service', async () => {
    service.addToTodayTotal.mockResolvedValue(200);

    const result = await DailySalesController.getInstance().addToTodayTotal(50);

    expect(result).toBe(200);
    expect(service.addToTodayTotal).toHaveBeenCalledWith(50);
  });

  it('init enregistre un listener', () => {
    DailySalesController.init();

    expect(eventBus.on).toHaveBeenCalledWith(
      AppEvent.DailyTotalUpdated,
      expect.any(Function)
    );
  });

  it('le callback émet DailyTotalChanged', async () => {
    service.addToTodayTotal.mockResolvedValue(300);

    DailySalesController.init();

    const callback = eventBus.on.mock.calls[0][1];

    await callback(100);

    expect(service.addToTodayTotal).toHaveBeenCalledWith(100);

    expect(eventBus.emit).toHaveBeenCalledWith(
      AppEvent.DailyTotalChanged,
      300
    );
  });
});
