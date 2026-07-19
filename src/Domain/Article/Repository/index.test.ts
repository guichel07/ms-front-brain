// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ArticleRepository } from './index';
import { API_URL_ARTICLES } from '../../../constants';

describe('ArticleRepository', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('doit retourner la même instance', () => {
    const repo1 = ArticleRepository.getInstance();
    const repo2 = ArticleRepository.getInstance();

    expect(repo1).toBe(repo2);
  });

  it('doit récupérer tous les articles', async () => {
    const articles = [
      { id: 1, nom: 'Article 1' },
      { id: 2, nom: 'Article 2' },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(articles),
    } as unknown as Response);

    const result = await ArticleRepository.getInstance().getAll();

    expect(fetch).toHaveBeenCalledWith(API_URL_ARTICLES, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(articles);
  });

  it("doit lever une erreur si l'API renvoie une erreur", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('Erreur serveur'),
    } as unknown as Response);

    await expect(ArticleRepository.getInstance().getAll()).rejects.toThrow(
      'Erreur API (500): Erreur serveur'
    );
  });
});
