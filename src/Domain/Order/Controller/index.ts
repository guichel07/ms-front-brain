import type { OrderDTO } from '../Model';
import { OrderService } from '../Service';

export class OrderController {
  private static instance: OrderController | null = null;

  private constructor() {}

  public static getInstance(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }

  async getAll() {
    return OrderService.getInstance().getAll();
  }

  async getLocalAll() {
    return OrderService.getInstance().getLocalAll();
  }

  async register() {
    return OrderService.getInstance().register()
  }

  async registerLocal(orderDTO: OrderDTO) {
    return OrderService.getInstance().registerLocal(orderDTO);
  }
}
