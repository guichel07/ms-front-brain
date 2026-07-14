import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { Confirm } from 'tek-ms-confirm';
import type { OrderDTO } from '../../../Domain/Order/Model';
import { DailySalesController } from '../../../Domain/DailySales/Controller';

export class ConfirmViewManager extends Confirm {
  private static instance: ConfirmViewManager | null = null;

  public static getInstance() {
    if (!ConfirmViewManager.instance) {
      const confirmContainer = document.querySelector<HTMLDivElement>(
        '#container-confirm-screen'
      );
      if (!confirmContainer)
        throw new Error('#container-confirm-screen introuvable dans le DOM');
      ConfirmViewManager.instance = new ConfirmViewManager(confirmContainer);
    }
    return ConfirmViewManager.instance;
  }

  static reset() {
    ConfirmViewManager.instance = null;
  }

  public showConfirmScreen() {
    document.getElementById('app-screen')!.style.display = 'none';
    const confirmScreen = document.getElementById('confirm-screen');
    if (confirmScreen) {
      confirmScreen.style.display = 'flex';
    }
  }

  public returnToAppAfterConfirmation() {
    document.getElementById('confirm-screen')!.style.display = 'none';
    document.getElementById('app-screen')!.style.display = 'flex';
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      ConfirmViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.SaleRegistered, async (payload) => {
      ConfirmViewManager.getInstance().showConfirmScreen();

      const articles = (payload as OrderDTO).items;

      const artcilesAmount = articles.reduce(
        (total, orderLine) => total + orderLine.price * orderLine.quantity,
        0
      );

      EventBus.getInstance().emit(AppEvent.DailyTotalUpdated, artcilesAmount);

      ConfirmViewManager.getInstance().render({
        amount: artcilesAmount,
        articles: articles.reduce(
          (total, orderLine) => total + orderLine.quantity,
          0
        ),
        dailyTotal: await DailySalesController.getInstance().getTodayTotal(),
        onNewSale: () => {
          EventBus.getInstance().emit(AppEvent.SaleNew, artcilesAmount);
          ConfirmViewManager.getInstance().returnToAppAfterConfirmation();
        },
      });
    });
  }
}
