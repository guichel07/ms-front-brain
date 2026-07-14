import { Nav } from 'tek-ms-nav';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

export class NavbarViewManager extends Nav {
  private static instance: NavbarViewManager | null = null;

  public static getInstance() {
    if (!NavbarViewManager.instance) {
      const navContainer =
        document.querySelector<HTMLDivElement>('#screen-nav');
      if (!navContainer) throw new Error('#screen-nav introuvable dans le DOM');
      NavbarViewManager.instance = new NavbarViewManager(navContainer);
    }
    return NavbarViewManager.instance;
  }

  static reset() {
    NavbarViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      NavbarViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.Connected, () =>
      NavbarViewManager.getInstance().render({
        navItems: ['Catalogue', 'Commandes', 'Clients', 'Paramètres'],
        activeItem: 'Catalogue',
        onTabChange: (currentPageWeb: string) => {
          EventBus.getInstance().emit(AppEvent.NavItemSelected, currentPageWeb);
        },
      })
    );
  }
}
