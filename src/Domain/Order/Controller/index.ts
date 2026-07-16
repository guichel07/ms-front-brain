import type { RecapItem } from 'tek-ms-recap';
import { AppEvent } from '../../../constants';
import { EventBus } from '../../../EventBus';
import type { OrderDTO, OrderLineDTO } from '../Model';
import { OrderService } from '../Service';
import { Seller } from '../../Seller';
import { DailySalesDB } from '../../DailySales/IndexDB';

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
    EventBus.getInstance().on(AppEvent.SaleConfirmed, async (recapItems) => {
      const runningTotal = await DailySalesDB.getInstance().getTodayTotal();
      const saleDate = new Date().toISOString();
      const orderLines = (recapItems as RecapItem[]).map(recapItem => {
        return {
          articleId: recapItem.id,
          quantity: recapItem.quantity,
          price: recapItem.price
        } as OrderLineDTO
      })
      OrderController.getInstance().registerLocal({
        sellerName: Seller.getInstance().getName(),
        saleDate: saleDate,
        dailySummary: runningTotal,
        email: Seller.getInstance().getEmail(),
        items: orderLines
      });
    })
  }
}
