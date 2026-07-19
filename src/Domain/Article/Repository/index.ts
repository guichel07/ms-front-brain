import { API_URL_ARTICLES } from '../../../constants';

export class ArticleRepository {
  private static instance: ArticleRepository | null = null;

  private constructor() {}

  public static getInstance(): ArticleRepository {
    if (!ArticleRepository.instance) {
      ArticleRepository.instance = new ArticleRepository();
    }
    return ArticleRepository.instance;
  }

  private get headers() {
    return { 'Content-Type': 'application/json' };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Erreur API (${response.status}): ${errorMsg}`);
    }
    return response.json();
  }

  async getAll() {
    const response = await fetch(`${API_URL_ARTICLES}`, {
      method: 'GET',
      credentials: 'include',
      headers: this.headers,
    });
    return this.handleResponse(response);
  }
}
