import { AppEvent } from '../../../constants';
import { EventBus } from '../../../EventBus';
import { ArticleBD } from '../IndexDB';
import { ArticleRepository } from '../Repository';

export class ArticleService {
  private static instance: ArticleService | null = null;

  private constructor() {}

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  async getLocalAll() {
    return await ArticleBD.getInstance().getAllArticles();
  }

  async getArticles() {
    try {
      EventBus.getInstance().emit(AppEvent.ArticlesLoaded, await ArticleBD.getInstance().getAllArticles());

      const articlesFromBack = await ArticleRepository.getInstance().getAll();
      await ArticleBD.getInstance().saveArticles(articlesFromBack);

      EventBus.getInstance().emit(AppEvent.ArticlesLoaded, await ArticleBD.getInstance().getAllArticles());
      alert("Articles synchronisés avec succès ✅");
    } catch (e) {
      console.log(e);
      alert("Échec de la synchronisation des articles ❌");
    }
  }


  async getLocalById(id: string) {
    return await ArticleBD.getInstance().getArticleById(id);
  }

  async syncroStockByIdLocal(id: string, quantityOrdered: number) {
    const article = await ArticleBD.getInstance().syncroStockById(id, quantityOrdered);
    EventBus.getInstance().emit(AppEvent.ArticleStockSynced, article);
    return article;
  }
}
