import { AppEvent } from '../../../constants';
import { EventBus } from '../../../EventBus';
import { ArticleService } from '../Service';

export class ArticleController {
  private static instance: ArticleController | null = null;

  private constructor() {}

  public static getInstance(): ArticleController {
    if (!ArticleController.instance) {
      ArticleController.instance = new ArticleController();
    }
    return ArticleController.instance;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Connected, () => {
      ArticleController.getInstance().getArticles();
    })
  }

  async getArticles() {
    await ArticleService.getInstance().getArticles();
  }

  async getLocalAll() {
    return ArticleService.getInstance().getLocalAll();
  }

  async getLocalById(id: string) {
    return ArticleService.getInstance().getLocalById(id);
  }

  async syncroStockByIdLocal(id: string, quantityOrdered: number) {
    return await ArticleService.getInstance().syncroStockByIdLocal(
      id,
      quantityOrdered
    );
  }
}
