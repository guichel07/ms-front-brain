import { AppEvent } from '../../constants';
import { EventBus } from '../../EventBus';

export class AppAssembler {
  private static instance: AppAssembler | null = null;

  private constructor() {}

  public static getInstance(): AppAssembler {
    if (!AppAssembler.instance) {
      AppAssembler.instance = new AppAssembler();
    }
    return AppAssembler.instance;
  }

  static buildAppLayout() {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
            <div id="app-screen">
              <div class="screen-header" id="screen-header"></div>
              <div class="screen-tabbar" id="screen-tabbar"></div>
              <div class="body-wrap" id="body-wrap">
                <div id="screen-nav"></div>
                <main class="tab-panel visible catalog-area" id="panel-products"></main>
                <div id="panel-cart-contenair"></div>
              </div>
              <div id="menu-mobile"></div>
              <div id="add-overlay-container"></div>
              <div id="container-recap-overlay"></div>
              <div class="screen-footer" id="screen-footer"></div>
            </div>
            <div id="container-confirm-screen"></div>
        `;
  }

  static toggleVisibilityOfTheCartPanel() {
    const bodyWrap = document.querySelector<HTMLElement>('#body-wrap');

    if (!bodyWrap) {
      return;
    }
    bodyWrap?.classList.toggle('no-cart');
  }

  static showCart() {
    const bodyWrap = document.querySelector<HTMLElement>('#body-wrap');

    if (!bodyWrap) {
      return;
    }
    bodyWrap?.classList.add('no-cart');
  }

  static hiddenCart() {
    const bodyWrap = document.querySelector<HTMLElement>('#body-wrap');

    if (!bodyWrap) {
      return;
    }
    bodyWrap?.classList.remove('no-cart');
  }
  static init(): void {
    EventBus.getInstance().on(AppEvent.Connected, () => {
      AppAssembler.buildAppLayout();
    });

    EventBus.getInstance().on(AppEvent.MenuItemSelected, (key) => {
      if (key != "Catalogue") return;
      const products = document.body.querySelector('#panel-products')!;
      if (products.classList.contains('visible')) return;

      document.body
        .querySelector('#panel-cart')!
        .classList.remove('visible');
      products.classList.add('visible');
    })
  }
}
