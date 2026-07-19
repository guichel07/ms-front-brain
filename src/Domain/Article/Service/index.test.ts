// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArticleBD } from '../IndexDB';
import { ArticleRepository } from '../Repository';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { ArticleService } from './index.ts';

vi.mock('../IndexDB');
vi.mock('../Repository');
vi.mock('../../../EventBus');

describe('ArticleService', () => {
  const articleBD = {
    getAllArticles: vi.fn(),
    saveArticles: vi.fn(),
    getArticleById: vi.fn(),
    syncroStockById: vi.fn(),
  };

  const repository = {
    getAll: vi.fn(),
  };

  const eventBus = {
    emit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(ArticleBD, 'getInstance').mockReturnValue(articleBD as any);
    vi.spyOn(ArticleRepository, 'getInstance').mockReturnValue(
      repository as any
    );
    vi.spyOn(EventBus, 'getInstance').mockReturnValue(eventBus as any);

    vi.stubGlobal('alert', vi.fn());
  });

  it('retourne toujours la même instance', () => {
    expect(ArticleService.getInstance()).toBe(ArticleService.getInstance());
  });

  it('getLocalAll retourne les articles locaux', async () => {
    const articles = [{ id: '1' }];

    articleBD.getAllArticles.mockResolvedValue(articles);

    const result = await ArticleService.getInstance().getLocalAll();

    expect(result).toEqual(articles);
    expect(articleBD.getAllArticles).toHaveBeenCalledOnce();
  });

  it('getLocalById retourne un article', async () => {
    const article = { id: '1' };

    articleBD.getArticleById.mockResolvedValue(article);

    const result = await ArticleService.getInstance().getLocalById('1');

    expect(result).toEqual(article);
    expect(articleBD.getArticleById).toHaveBeenCalledWith('1');
  });

  it('syncroStockByIdLocal met à jour le stock et émet un événement', async () => {
    const article = { id: '1', stock: 8 };

    articleBD.syncroStockById.mockResolvedValue(article);

    const result = await ArticleService.getInstance().syncroStockByIdLocal(
      '1',
      2
    );

    expect(articleBD.syncroStockById).toHaveBeenCalledWith('1', 2);
    expect(eventBus.emit).toHaveBeenCalledWith(
      AppEvent.ArticleStockSynced,
      article
    );
    expect(result).toEqual(article);
  });

  it('getArticles synchronise les articles', async () => {
    const localArticles = [{ id: '1' }];
    const backendArticles = [{ id: '2' }];

    articleBD.getAllArticles
      .mockResolvedValueOnce(localArticles)
      .mockResolvedValueOnce(backendArticles);

    repository.getAll.mockResolvedValue(backendArticles);

    await ArticleService.getInstance().getArticles();

    expect(eventBus.emit).toHaveBeenNthCalledWith(
      1,
      AppEvent.ArticlesLoaded,
      localArticles
    );

    expect(repository.getAll).toHaveBeenCalled();

    expect(articleBD.saveArticles).toHaveBeenCalledWith(backendArticles);

    expect(eventBus.emit).toHaveBeenNthCalledWith(
      2,
      AppEvent.ArticlesLoaded,
      backendArticles
    );

    expect(alert).toHaveBeenCalledWith('Articles synchronisés avec succès ✅');
  });

  it("getArticles affiche une alerte en cas d'erreur", async () => {
    const error = new Error('Erreur');

    repository.getAll.mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await ArticleService.getInstance().getArticles();

    expect(consoleSpy).toHaveBeenCalledWith(error);

    expect(alert).toHaveBeenCalledWith(
      'Échec de la synchronisation des articles ❌'
    );
  });
});
