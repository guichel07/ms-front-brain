import { Tabbar } from 'tek-ms-tabbar';

export class SingletonTabbar {
  static instance: Tabbar | null = null;

  static getInstance() {
    if (!SingletonTabbar.instance) {
      SingletonTabbar.instance = new Tabbar(
        document.querySelector<HTMLDivElement>('#screen-tabbar')!
      );
    }
    return SingletonTabbar.instance;
  }
}
