/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogPage } from '.';
import { ArticleController } from '../../../Domain/Article/Controller';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

vi.mock('tek-ms-catalog', () => ({
  Catalog: class {
    render = vi.fn();
    updateArticleQuantity = vi.fn();
  },
}));

describe('CatalogPage', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="body-wrap" class="no-cart"></div>
      <div id="panel-products"></div>
    `;

    CatalogPage.reset();
    vi.restoreAllMocks();
  });

  it('singleton', () => {
    expect(CatalogPage.getInstance()).toBe(CatalogPage.getInstance());
  });

  it('reset recrée une instance', () => {
    const first = CatalogPage.getInstance();

    CatalogPage.reset();

    const second = CatalogPage.getInstance();

    expect(first).not.toBe(second);
  });

  it('getInstance lève une erreur si #panel-products est absent', () => {
    document.body.innerHTML = '';
    CatalogPage.reset();

    expect(() => CatalogPage.getInstance()).toThrow(
      '#panel-products introuvable dans le DOM'
    );
  });

  it('showCart retire la classe no-cart', () => {
    const body = document.querySelector('#body-wrap')!;

    expect(body.classList.contains('no-cart')).toBe(true);

    CatalogPage.showCart();

    expect(body.classList.contains('no-cart')).toBe(false);
  });

  it('renderCatalogue ne fait rien si la clé ne contient pas Catalogue', async () => {
    const render = vi.spyOn(CatalogPage.getInstance(), 'render');

    await CatalogPage.renderCatalogue('Commandes');

    expect(render).not.toHaveBeenCalled();
  });

  it('renderCatalogue affiche le catalogue', async () => {
    const articles = [
      {
        id: 1,
        quantity: 10,
      },
    ];

    vi.spyOn(
      ArticleController.getInstance(),
      'getLocalAll'
    ).mockResolvedValue(articles as never);

    const render = vi.spyOn(CatalogPage.getInstance(), 'render');

    await CatalogPage.renderCatalogue('Catalogue');

    expect(render).toHaveBeenCalledTimes(1);

    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({
        produits: articles,
        categories: expect.any(Array),
        callback: expect.any(Function),
      })
    );
  });

  it('init enregistre les listeners', () => {
    const on = vi.spyOn(EventBus.getInstance(), 'on');

    CatalogPage.init();

    expect(on).toHaveBeenCalledTimes(5);
  });

  it('ArticleStockSynced met à jour le stock', () => {
    const on = vi.spyOn(EventBus.getInstance(), 'on');

    CatalogPage.init();

    const listener = on.mock.calls.find(
      ([event]) => event === AppEvent.ArticleStockSynced
    )?.[1] as (article: { id: number; quantity: number }) => void;

    const update = vi.spyOn(
      CatalogPage.getInstance(),
      'updateArticleQuantity'
    );

    listener({
      id: 12,
      quantity: 7,
    });

    expect(update).toHaveBeenCalledWith(12, 7);
  });
});
