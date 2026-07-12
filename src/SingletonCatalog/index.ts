import { Catalog } from 'tek-ms-catalog';
import { mockedCategories } from '../__mocks__';
import type { ArticleDTO } from '../Domain/Article/Model';
import { SingletonBarket } from '../SingletonBarket';
import { ArticleController } from '../Domain/Article/Controller';
import { SingletonAddsheet } from '../SingletonAddsheet';
import { SingletonTabbar } from '../SingletonTabbar';
import { Brain } from '../Brain';

export class SingletonCatalog {
  private static instance: Catalog | null = null;

  public static getInstance(): Catalog {
    if (!SingletonCatalog.instance) {
      SingletonCatalog.instance = new Catalog(
        document.body.querySelector<HTMLDivElement>('#panel-products')!
      );
    }
    return SingletonCatalog.instance;
  }

  static renderCatalogueArticles(produits: ArticleDTO[]): void {
    const cataloguePage = SingletonCatalog.getInstance();
    cataloguePage.render({
      categories: mockedCategories,
      produits,
      callback: (article: ArticleDTO) =>
        SingletonCatalog.onProductClick(article),
    });
  }

  static onProductClick(article: ArticleDTO) {
    SingletonAddsheet.getInstance().render({
      product: {
        name: article.name,
        price: article.price,
        icon: article.icon,
        color: article.color,
        id: article.id,
      },
      onConfirm: async (price, qty) => {
        SingletonAddsheet.getInstance().close();

        const updated =
          await ArticleController.getInstance().syncroStockByIdLocal(
            article.id,
            -qty
          );
        if (!updated) return;

        SingletonCatalog.getInstance().updateArticleQuantity(
          updated.id,
          updated.quantity
        );

        SingletonBarket.getInstance().addToCart({
          id: updated.id,
          name: updated.name,
          price,
          category: updated.category,
          quantity: qty,
          color: updated.color,
          icon: updated.icon,
        });

        SingletonTabbar.getInstance().activateTab('Panier');
        SingletonTabbar.getInstance().updateCartCount(qty);

        Brain.getInstance().showTab('Panier');
      },
      onCancel: () => {
        SingletonAddsheet.getInstance().close();
      },
    });
  }
}
