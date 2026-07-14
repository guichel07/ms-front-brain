import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderService } from '.';
import { OrderBD } from '../IndexDB';
import { OrderRepository } from '../Repository';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

vi.mock('../IndexDB');
vi.mock('../Repository');

describe('OrderService', () => {
  let service: OrderService;

  const db = {
    getAllOrders: vi.fn(),
    saveOrder: vi.fn(),
    DeleteOrderById: vi.fn(),
  };

  const repo = {
    getAll: vi.fn(),
    register: vi.fn(),
  };

  beforeEach(() => {
    service = OrderService.getInstance();

    vi.spyOn(OrderBD, 'getInstance').mockReturnValue(db as unknown as OrderBD);

    vi.spyOn(OrderRepository, 'getInstance').mockReturnValue(
      repo as unknown as OrderRepository
    );
  });

  it('singleton', () => {
    expect(OrderService.getInstance()).toBe(OrderService.getInstance());
  });

  it('getAll', async () => {
    await service.getAll();

    expect(repo.getAll).toHaveBeenCalled();
  });

  it('getLocalAll', async () => {
    await service.getLocalAll();

    expect(db.getAllOrders).toHaveBeenCalled();
  });

  it('registerLocal', async () => {
    const emit = vi.spyOn(EventBus.getInstance(), 'emit');

    const dto = {} as never;

    await service.registerLocal(dto);

    expect(db.saveOrder).toHaveBeenCalledWith(dto);

    expect(emit).toHaveBeenCalledWith(
      AppEvent.SaleRegistered,
      dto
    );
  });

  it('register succès', async () => {
    db.getAllOrders.mockResolvedValue([
      {
        localId: '1',
        order: {},
      },
    ]);

    repo.register.mockResolvedValue(undefined);
    db.DeleteOrderById.mockResolvedValue(undefined);

    const result = await service.register();

    expect(result).toEqual({
      success: 1,
      failed: 0,
    });
  });

  it('register avec erreur', async () => {
    db.getAllOrders.mockResolvedValue([
      {
        localId: '1',
        order: {},
      },
    ]);

    repo.register.mockRejectedValue(new Error());

    const result = await service.register();

    expect(result.failed).toBe(1);
  });
});
