import { ArticleBD } from '../IndexDB';
import type { ArticleDTO } from '../Model';
import { ArticleRepository } from '../Repository';

export class ArticleService {
  private static instance: ArticleService | null = null;
  private callBacks: ((articleDTOs: ArticleDTO[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  public onUpdate(callBack: (articleDTOs: ArticleDTO[]) => void) {
    this.callBacks.push(callBack);
  }

  async syncFromBackend() {
    const data: ArticleDTO[] = await ArticleRepository.getInstance().getAll();
    await ArticleBD.getInstance().saveArticles(data);
    this.callBacks.forEach((callbackfn) => {
      callbackfn(data);
    });
  }

  async getLocalAll() {
    return await ArticleBD.getInstance().getAllArticles();
  }

  async getLocalById(id: string) {
    return await ArticleBD.getInstance().getArticleById(id);
  }

  async syncroStockByIdLocal(id: string, quantityOrdered: number) {
    return ArticleBD.getInstance().syncroStockById(id, quantityOrdered);
  }
}
