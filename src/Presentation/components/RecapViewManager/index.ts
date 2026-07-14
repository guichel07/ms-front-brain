import { RecapSheet } from 'tek-ms-recap';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import type { CartItem } from 'tek-ms-barket';

export class RecapViewManager extends RecapSheet {
  private static instance: RecapViewManager | null = null;

  public static getInstance() {
    if (!RecapViewManager.instance) {
      const recapContainer = document.querySelector<HTMLDivElement>(
        '#container-recap-overlay'
      );
      if (!recapContainer)
        throw new Error('#container-recap-overlay introuvable dans le DOM');
      RecapViewManager.instance = new RecapViewManager(recapContainer);
    }
    return RecapViewManager.instance;
  }

  static reset() {
    RecapViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      RecapViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.CartValidated, (cartItems) => {
      const items = cartItems as CartItem[];
      if (!items || items.length == 0) return;
      RecapViewManager.getInstance().render({
        items: items,
        onCancel: () => console.log('vente annulé'),
        onConfirm: () => {
          EventBus.getInstance().emit(
            AppEvent.SaleConfirmed,
            RecapViewManager.getInstance().getItems()
          );
          RecapViewManager.getInstance().onClose();
        },
      });
    });
  }
}
