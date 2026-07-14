import type { RecapItem } from 'tek-ms-recap';
import { AppEvent } from '../../../constants';
import { EventBus } from '../../../EventBus';
import type { OrderDTO, OrderLineDTO } from '../Model';
import { OrderService } from '../Service';
import { Seller } from '../../Seller';

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
    await OrderService.getInstance().registerLocal(orderDTO);
    return OrderService.getInstance().register();
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.SaleConfirmed, (recapItems) => {
      const orderLines = (recapItems as RecapItem[]).map(recapItem => {
        return {
          articleId: recapItem.id,
          quantity: recapItem.quantity,
          price: recapItem.price
        } as OrderLineDTO
      })
      OrderController.getInstance().registerLocal({
        sellerName: Seller.getInstance().getName(),
        saleDate: new Date().toISOString(),
        email: Seller.getInstance().getEmail(),
        items: orderLines
      });
    })
  }
}
