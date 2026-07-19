import { Catalog } from 'tek-ms-catalog';
import type { ArticleDTO } from '../../../Domain/Article/Model';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { ArticleController } from '../../../Domain/Article/Controller';

export class CatalogPage extends Catalog {
  private static instance: CatalogPage | null = null;
  private static categories = [
    'Tous',
    'Soins',
    'Santé',
    'Bien-etre',
    'hygiène',
  ];

  public static getInstance() {
    if (!CatalogPage.instance) {
      const CatalogContainer =
        document.querySelector<HTMLDivElement>('#panel-products');
      if (!CatalogContainer)
        throw new Error('#panel-products introuvable dans le DOM');
      CatalogPage.instance = new CatalogPage(CatalogContainer);
    }
    return CatalogPage.instance;
  }

  static showCart() {
    const bodyWrap = document.querySelector<HTMLElement>('#body-wrap');

    if (!bodyWrap) {
      return;
    }
    bodyWrap?.classList.remove('no-cart');
  }

  static async renderCatalogue(key: string) {
    if (!key.includes('Catalogue')) return;

    const articles = await ArticleController.getInstance().getLocalAll();

    CatalogPage.showCart();
    CatalogPage.getInstance().render({
      categories: this.categories,
      produits: articles,
      callback: async (article: ArticleDTO) => {
        EventBus.getInstance().emit(AppEvent.ArticleClicked, article);
      },
    });
  }

  static reset() {
    CatalogPage.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      CatalogPage.reset();
    });
    EventBus.getInstance().on(AppEvent.ArticlesLoaded,async () => {
      await CatalogPage.renderCatalogue('Catalogue');
    });

    EventBus.getInstance().on(AppEvent.MenuItemSelected,async (key) => {
      await CatalogPage.renderCatalogue(key as string);
    });

    EventBus.getInstance().on(AppEvent.NavItemSelected,async (key) => {
      await CatalogPage.renderCatalogue(key as string);
    });

    EventBus.getInstance().on(AppEvent.ArticleStockSynced, (key) => {
      const article = key as ArticleDTO;
      CatalogPage.getInstance().updateArticleQuantity(
        article.id,
        article.quantity
      );
    });
  }
}
