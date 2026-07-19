import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderController } from '.';
import { OrderService } from '../Service';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

vi.mock('../Service');

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(() => {
    controller = OrderController.getInstance();

    service = {
      getAll: vi.fn(),
      getLocalAll: vi.fn(),
      register: vi.fn(),
      registerLocal: vi.fn(),
    } as unknown as OrderService;

    vi.spyOn(OrderService, 'getInstance').mockReturnValue(service);
  });

  it('retourne toujours la même instance', () => {
    expect(OrderController.getInstance()).toBe(OrderController.getInstance());
  });

  it('getAll()', async () => {
    await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
  });

  it('getLocalAll()', async () => {
    await controller.getLocalAll();

    expect(service.getLocalAll).toHaveBeenCalled();
  });

  it('register()', async () => {
    await controller.register();

    expect(service.register).toHaveBeenCalled();
  });

  it('registerLocal()', async () => {
    const dto = {} as never;

    await controller.registerLocal(dto);

    expect(service.registerLocal).toHaveBeenCalledWith(dto);
    expect(service.register).toHaveBeenCalled();
  });

  it('init écoute SaleConfirmed', () => {
    const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

    OrderController.init();

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.SaleConfirmed,
      expect.any(Function)
    );
  });
});
