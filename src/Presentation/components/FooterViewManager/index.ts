import { Footer } from 'tek-ms-footer';
import { EventBus } from '../../../EventBus';
import { AppEvent, FOOTER_MASSAGE } from '../../../constants';

export class FooterViewManager extends Footer {
  private static instance: FooterViewManager | null = null;

  public static getInstance() {
    if (!FooterViewManager.instance) {
      const footerContainer =
        document.querySelector<HTMLDivElement>('#screen-footer');
      if (!footerContainer)
        throw new Error('#screen-footer introuvable dans le DOM');
      FooterViewManager.instance = new FooterViewManager(footerContainer);
    }
    return FooterViewManager.instance;
  }

  static reset() {
    FooterViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      FooterViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.Connected, () =>
      FooterViewManager.getInstance().render(FOOTER_MASSAGE)
    );
  }
}
