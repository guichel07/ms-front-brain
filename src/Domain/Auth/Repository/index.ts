import { API_URL_AUTH } from '../../../constants';
import type { User } from '../model';

export class AuthRepository {
  private static instance: AuthRepository | null = null;

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  private get headers() {
    return { 'Content-Type': 'application/json' };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Erreur API (${response.status}): ${errorMsg}`);
    }

    const text = await response.text();
    if (!text) return null;

    return JSON.parse(text);
  }

  async login(user: User) {

    const response = await fetch(`${API_URL_AUTH}/login`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify(user),
    });

    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_URL_AUTH}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    return this.handleResponse(response);
  }

  async checkSession() {
    const response = await fetch(`${API_URL_AUTH}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Session invalide');
    }
    return true;
  }
}
