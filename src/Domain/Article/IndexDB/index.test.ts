import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ArticleDTO } from '../Model';
import { ArticleBD } from '.';

describe('ArticleBD', () => {
  const articleBD = ArticleBD.getInstance();

  const article1: ArticleDTO = {
    id: '1',
    name: 'Article 1',
    icon: '🍎',
    color: '#ff0000',
    category: 'Fruit',
    price: 2,
    quantity: 10,
  };

  const article2: ArticleDTO = {
    id: '2',
    name: 'Article 2',
    icon: '🥖',
    color: '#ffff00',
    category: 'Boulangerie',
    price: 1.5,
    quantity: 5,
  };

  beforeEach(async () => {
    indexedDB.deleteDatabase('article-db');

    // Réinitialise l'instance pour forcer la recréation de la base
    (ArticleBD as unknown as { instance: ArticleBD }).instance =
      ArticleBD.getInstance();

    await articleBD.saveArticles([]);
  });

  it('retourne toujours la même instance', () => {
    expect(ArticleBD.getInstance()).toBe(ArticleBD.getInstance());
  });

  it('saveArticles sauvegarde les articles', async () => {
    await articleBD.saveArticles([article1, article2]);

    const articles = await articleBD.getAllArticles();

    expect(articles).toHaveLength(2);
    expect(articles).toEqual([article1, article2]);
  });

  it('getAllArticles retourne un tableau vide au départ', async () => {
    const articles = await articleBD.getAllArticles();

    expect(articles).toEqual([]);
  });

  it('getArticleById retourne un article', async () => {
    await articleBD.saveArticles([article1]);

    const article = await articleBD.getArticleById('1');

    expect(article).toEqual(article1);
  });

  it('getArticleById retourne null si absent', async () => {
    const article = await articleBD.getArticleById('999');

    expect(article).toBeNull();
  });

  it('syncroStockById augmente la quantité', async () => {
    await articleBD.saveArticles([article1]);

    const updated = await articleBD.syncroStockById('1', 3);

    expect(updated).not.toBeNull();
    expect(updated?.quantity).toBe(13);

    const article = await articleBD.getArticleById('1');

    expect(article?.quantity).toBe(13);
  });

  it('syncroStockById retourne null si l’article est introuvable', async () => {
    const article = await articleBD.syncroStockById('999', 2);

    expect(article).toBeNull();
  });

  it('saveArticles remplace les anciennes données', async () => {
    await articleBD.saveArticles([article1]);

    await articleBD.saveArticles([article2]);

    const articles = await articleBD.getAllArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0]).toEqual(article2);
  });
});
