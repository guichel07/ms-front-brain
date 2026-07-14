import { Header } from 'tek-ms-header';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { ArticleController } from '../../../Domain/Article/Controller';
import { DailySalesController } from '../../../Domain/DailySales/Controller';
import type { SellerData } from '../../../Domain/Auth/model';

export class HeaderViewManager extends Header {
  private static instance: HeaderViewManager | null = null;

  public static getInstance() {
    if (!HeaderViewManager.instance) {
      const headerContainer =
        document.querySelector<HTMLDivElement>('#screen-header');
      if (!headerContainer)
        throw new Error('#screen-header introuvable dans le DOM');
      HeaderViewManager.instance = new HeaderViewManager(headerContainer);
    }
    return HeaderViewManager.instance;
  }

  static reset() {
    HeaderViewManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      HeaderViewManager.reset();
    });
    EventBus.getInstance().on(AppEvent.DailyTotalChanged, async (newTotal) => {
      HeaderViewManager.getInstance().updateDailySalesTotal(newTotal as number);
    });
    EventBus.getInstance().on(AppEvent.Connected, async (payload) => {
      const seller = payload as SellerData;
      const dailySalesTotal =
        await DailySalesController.getInstance().getTodayTotal();
      HeaderViewManager.getInstance().render(
        {
          firstName: 'Maman',
          secondName: 'Solution',
          icone: `
          <svg viewBox="0 0 100 100">
            <path d="M26 66 L26 36 L41 58 L50 38 L59 58 L74 36 L74 66"
                  stroke="#FF6B35" stroke-width="10" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="50" cy="25" r="7" fill="#FF6B35"/>
          </svg>`,
        },
        {
          name: seller.name,
          role: seller.role,
          dailySalesTotal: dailySalesTotal,
          tag: seller.tag,
          svgAvatar: seller.svgAvatar,
        },
        () => {
          EventBus.getInstance().emit(AppEvent.Disconnected, undefined);
        },
        () => {
          EventBus.getInstance().emit(AppEvent.MenuOpened, undefined);
        },
        () => {
          ArticleController.getInstance().getArticles();
        }
      );
    });
  }
}
