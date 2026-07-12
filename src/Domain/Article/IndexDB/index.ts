import type { ArticleDTO } from '../Model';

export class ArticleBD {
  private static instance: ArticleBD;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'article-db';
  private readonly STORE = 'articles';

  private constructor() {}

  public static getInstance(): ArticleBD {
    if (!ArticleBD.instance) {
      ArticleBD.instance = new ArticleBD();
    }
    return ArticleBD.instance;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);

      req.onupgradeneeded = () => {
        req.result.createObjectStore(this.STORE, { keyPath: 'id' });
      };

      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async saveArticles(articles: ArticleDTO[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE, 'readwrite');
      const store = tx.objectStore(this.STORE);

      store.clear();
      articles.forEach((article) => store.put(article));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllArticles(): Promise<ArticleDTO[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(this.STORE).objectStore(this.STORE).getAll();

      req.onsuccess = () => {
        const data = req.result;
        resolve(data as ArticleDTO[]);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async getArticleById(id: string): Promise<ArticleDTO | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(this.STORE).objectStore(this.STORE).get(id);

      req.onsuccess = () => {
        const data = req.result;
        resolve(data ? (data as ArticleDTO) : null);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async syncroStockById(
    id: string,
    quantityOrdered: number
  ): Promise<ArticleDTO | null> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      // 1. Ouvrir une transaction en mode 'readwrite'
      const transaction = db.transaction(this.STORE, 'readwrite');
      const store = transaction.objectStore(this.STORE);

      // 2. Récupérer l'article
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const article = getReq.result as ArticleDTO;

        if (!article) {
          resolve(null);
          return;
        }

        // 3. Modifier la quantité
        article.quantity += quantityOrdered;

        // 4. Sauvegarder la modification dans le store
        const putReq = store.put(article);

        putReq.onsuccess = () => {
          resolve(article);
        };

        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  }

  async DeleteAllArticles(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(this.STORE).objectStore(this.STORE).clear();

      req.onsuccess = () => {
        resolve();
      };

      req.onerror = () => reject(req.error);
    });
  }

}
