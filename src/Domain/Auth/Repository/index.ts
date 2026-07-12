import { API_URL_AUTH } from '../../../constants';
import type { User } from '../model';

export class AuthRepository {
  async login(user: User) {
    const response = await fetch(`${API_URL_AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      let message = `Erreur ${response.status}`;
      try {
        const errorBody = await response.json();
        message = errorBody.message ?? message;
      } catch {}
      throw new Error(message);
    }

    return response.json();
  }

  async logout() {
    const response = await fetch(`${API_URL_AUTH}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    return response.json().catch(() => {});
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
