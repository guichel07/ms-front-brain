import { OrderBD, type PendingOrder } from '../IndexDB';
import type { OrderDTO } from '../Model';
import { OrderRepository } from '../Repository';

export class OrderService {
  private static instance: OrderService | null = null;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getAll() {
    return OrderRepository.getInstance().getAll();
  }

  async getLocalAll() {
    return OrderBD.getInstance().getAllOrders();
  }

  async register(): Promise<{ success: number; failed: number }> {
    const pendingOrders: PendingOrder[] = await OrderBD.getInstance().getAllOrders();
    const repository = OrderRepository.getInstance();
    const orderBD = OrderBD.getInstance();

    const results = await Promise.allSettled(
      pendingOrders.map(async (pendingOrder) => {
        await repository.register(pendingOrder.order);
        await orderBD.DeleteOrderById(pendingOrder.localId);
      })
    );

    const failed = results.filter((r) => r.status === 'rejected');
    failed.forEach((r) => console.error((r as PromiseRejectedResult).reason));

    return { success: results.length - failed.length, failed: failed.length };
  }

  async registerLocal(orderDTO: OrderDTO) {
    return await OrderBD.getInstance().saveOrder(orderDTO);
  }
}
