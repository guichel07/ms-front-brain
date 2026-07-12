import type { ArticleDTO } from '../Model';
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

  public onUpdate(callBack: (articleDTOs: ArticleDTO[]) => void) {
    ArticleService.getInstance().onUpdate(callBack);
  }

  async syncFromBackend() {
    try {
      await ArticleService.getInstance().syncFromBackend();
      alert('Synchronisation réussie');
    } catch (e) {
      console.error(e);
      alert('Synchronisation échouée');
    }
  }

  async getLocalAll() {
    return ArticleService.getInstance().getLocalAll();
  }

  async getLocalById(id: string) {
    return ArticleService.getInstance().getLocalById(id);
  }

  async syncroStockByIdLocal(id: string, quantityOrdered: number) {
    return ArticleService.getInstance().syncroStockByIdLocal(
      id,
      quantityOrdered
    );
  }
}
