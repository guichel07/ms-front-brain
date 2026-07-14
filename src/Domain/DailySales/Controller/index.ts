import { AppEvent } from "../../../constants";
import { EventBus } from "../../../EventBus";
import { DailySalesService } from "../Service";

export class DailySalesController {
  private static instance: DailySalesController | null = null;

  private constructor() {}

  public static getInstance(): DailySalesController {
    if (!DailySalesController.instance) {
      DailySalesController.instance = new DailySalesController();
    }
    return DailySalesController.instance;
  }

  async getTodayTotal() {
    return await DailySalesService.getInstance().getTodayTotal();
  }

  async addToTodayTotal(amount: number) {
    return await DailySalesService.getInstance().addToTodayTotal(amount);
  }


  static init(): void {
    EventBus.getInstance().on(AppEvent.DailyTotalUpdated,async (amount) => {
      const newTotal = await DailySalesController.getInstance().addToTodayTotal(amount as number);
      EventBus.getInstance().emit(AppEvent.DailyTotalChanged, newTotal);
    })
  }
}
