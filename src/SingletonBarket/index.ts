import { Basket } from 'tek-ms-barket';

export class SingletonBarket {
  private static instance: Basket | null = null;

  constructor() {}

  public static getInstance() {
    if (!SingletonBarket.instance) {
      SingletonBarket.instance = new Basket(
        document.querySelector<HTMLDivElement>('#panel-cart-contenair')!
      );
    }
    return SingletonBarket.instance;
  }
}
