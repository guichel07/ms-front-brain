import { API_URL_ORDERS } from '../../../constants';
import type { OrderDTO } from '../Model';

export class OrderRepository {
  private static instance: OrderRepository | null = null;

  private constructor() {}

  public static getInstance(): OrderRepository {
    if (!OrderRepository.instance) {
      OrderRepository.instance = new OrderRepository();
    }
    return OrderRepository.instance;
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
    const response = await fetch(`${API_URL_ORDERS}`, {
      method: 'GET',
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getById(id: string) {
    const response = await fetch(`${API_URL_ORDERS}/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async register(orderDTO: OrderDTO) {
    const response = await fetch(`${API_URL_ORDERS}`, {
      method: 'POST',
      credentials: 'include',
      headers: this.headers,
      body: JSON.stringify(orderDTO),
    });
    return this.handleResponse(response);
  }

  async getTotalSoldToday(email: string) {
    const response = await fetch(`${API_URL_ORDERS}/total-today/${email}`, {
      method: 'GET',
      credentials: 'include',
    });
    return this.handleResponse(response);
  }
}
