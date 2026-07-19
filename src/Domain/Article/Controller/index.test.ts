// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArticleService } from '../Service';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { ArticleController } from '.';

describe('ArticleController', () => {
  const articleService = {
    getArticles: vi.fn(),
    getLocalAll: vi.fn(),
    getLocalById: vi.fn(),
    syncroStockByIdLocal: vi.fn(),
  };

  const eventBus = {
    on: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(ArticleService, 'getInstance').mockReturnValue(
      articleService as unknown as ReturnType<typeof ArticleService.getInstance>
    );

    vi.spyOn(EventBus, 'getInstance').mockReturnValue(
      eventBus as unknown as ReturnType<typeof EventBus.getInstance>
    );
  });

  it('retourne toujours la même instance', () => {
    const controller1 = ArticleController.getInstance();
    const controller2 = ArticleController.getInstance();

    expect(controller1).toBe(controller2);
  });

  it('init enregistre un listener sur Connected', () => {
    ArticleController.init();

    expect(eventBus.on).toHaveBeenCalledTimes(1);
    expect(eventBus.on).toHaveBeenCalledWith(
      AppEvent.Connected,
      expect.any(Function)
    );
  });

  it('getArticles appelle ArticleService.getArticles', async () => {
    await ArticleController.getInstance().getArticles();

    expect(articleService.getArticles).toHaveBeenCalledTimes(1);
  });

  it('getLocalAll retourne les articles locaux', async () => {
    const articles = [{ id: '1' }];

    articleService.getLocalAll.mockResolvedValue(articles);

    const result = await ArticleController.getInstance().getLocalAll();

    expect(articleService.getLocalAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(articles);
  });

  it('getLocalById retourne un article', async () => {
    const article = { id: '1' };

    articleService.getLocalById.mockResolvedValue(article);

    const result = await ArticleController.getInstance().getLocalById('1');

    expect(articleService.getLocalById).toHaveBeenCalledWith('1');
    expect(result).toEqual(article);
  });

  it('syncroStockByIdLocal appelle le service', async () => {
    const article = { id: '1', stock: 5 };

    articleService.syncroStockByIdLocal.mockResolvedValue(article);

    const result = await ArticleController.getInstance().syncroStockByIdLocal(
      '1',
      2
    );

    expect(articleService.syncroStockByIdLocal).toHaveBeenCalledWith('1', 2);
    expect(result).toEqual(article);
  });

  it('le callback de init appelle getArticles', async () => {
    ArticleController.init();

    const callback = eventBus.on.mock.calls[0][1];

    await callback();

    expect(articleService.getArticles).toHaveBeenCalledTimes(1);
  });
});
