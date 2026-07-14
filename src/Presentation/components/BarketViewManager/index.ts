import { AppEvent } from '../../../constants';
import { ArticleController } from '../../../Domain/Article/Controller';
import type { ArticleDTO } from '../../../Domain/Article/Model';
import { EventBus } from '../../../EventBus';
import { Basket, type CartItem } from 'tek-ms-barket';

export class BarketViewManager extends Basket {
  private static instance: BarketViewManager | null = null;

  public static getInstance() {
    if (!BarketViewManager.instance) {
      const barketContainer = document.querySelector<HTMLDivElement>(
        '#panel-cart-contenair'
      );
      if (!barketContainer)
        throw new Error('#panel-cart-contenair introuvable dans le DOM');
      BarketViewManager.instance = new BarketViewManager(barketContainer);
    }
    return BarketViewManager.instance;
  }

  static reset() {
    BarketViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      BarketViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.Connected, () =>
      BarketViewManager.getInstance().render({
        receiptNumber: '00482',
        receiptDate: new Date().toISOString(),
        onClickValidation: () => {
          EventBus.getInstance().emit(
            AppEvent.CartValidated,
            BarketViewManager.getInstance().getItems()
          );
        },
        onClickRemoveCard: async (cartItem: CartItem) => {
          ArticleController.getInstance().syncroStockByIdLocal(
            cartItem.id,
            cartItem.quantity
          );
          EventBus.getInstance().emit(AppEvent.CartItemRemoved, cartItem);
        },
      })
    );
    EventBus.getInstance().on(AppEvent.AddSheetValided, async (payload) => {
      const data = payload as ArticleDTO & { price: number; qty: number };

      await ArticleController.getInstance().syncroStockByIdLocal(
        data.id,
        -data.qty
      );
      BarketViewManager.getInstance().addToCart({
        ...data,
        quantity: data.qty,
      } as CartItem);
    });

    EventBus.getInstance().on(AppEvent.SaleRegistered, () => {
      BarketViewManager.getInstance().resetItems();
    });
  }
}
