import { DailySalesDB } from "../IndexDB";

export class DailySalesService {
  private static instance: DailySalesService | null = null;

  private constructor() {}

  public static getInstance(): DailySalesService {
    if (!DailySalesService.instance) {
      DailySalesService.instance = new DailySalesService();
    }
    return DailySalesService.instance;
  }

  async getTodayTotal() {
    return await DailySalesDB.getInstance().getTodayTotal();
  }

  async addToTodayTotal(amount: number) {
    return await DailySalesDB.getInstance().addToTodayTotal(amount);
  }

}
