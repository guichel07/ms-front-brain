import { Tabbar } from 'tek-ms-tabbar';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import type { CartItem } from 'tek-ms-barket';

export class TabbarViewManager extends Tabbar {
  static instance: TabbarViewManager | null = null;

  static getInstance() {
    if (!TabbarViewManager.instance) {
      const tabbarContainer =
        document.querySelector<HTMLDivElement>('#screen-tabbar');
      if (!tabbarContainer)
        throw new Error('#screen-tabbar introuvable dans le DOM');
      TabbarViewManager.instance = new Tabbar(
        document.querySelector<HTMLDivElement>('#screen-tabbar')!
      );
    }
    return TabbarViewManager.instance;
  }

  static reset() {
    TabbarViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      TabbarViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.Connected, () => {
      TabbarViewManager.getInstance().render({
        pageLabel: 'Catalogue',
        cartLabel: 'Panier',
        cartCount: 0,
        showTab: (tabName: string) => console.log(tabName),
        onclickPanier: () => {
          const cart = document.body.querySelector('#panel-cart')!;
          if (cart.classList.contains('visible')) return;

          document.body
            .querySelector('#panel-products')!
            .classList.remove('visible');
          cart.classList.add('visible');
        },
        onclickPage: () => {
          const products = document.body.querySelector('#panel-products')!;
          if (products.classList.contains('visible')) return;

          document.body
            .querySelector('#panel-cart')!
            .classList.remove('visible');
          products.classList.add('visible');
        },
      });
    });

    EventBus.getInstance().on(AppEvent.AddSheetValided, (payload) => {
      const data = payload as { qty: number };
      TabbarViewManager.getInstance().updateCartCount(data.qty);
    });

    EventBus.getInstance().on(AppEvent.CartItemRemoved, (key) => {
      const cartItem = key as CartItem;
      TabbarViewManager.getInstance().updateCartCount(-cartItem.quantity);
    });

    EventBus.getInstance().on(AppEvent.MenuItemSelected, (key) => {
      if (key != "Catalogue") return;

      TabbarViewManager.getInstance().activateTab("Produits")

    })

    EventBus.getInstance().on(AppEvent.SaleNew, (artcilesQuantity) => {
      console.log(artcilesQuantity)
      TabbarViewManager.getInstance().updateCartCount(
        -(artcilesQuantity as number)
      );
    });
  }
}
