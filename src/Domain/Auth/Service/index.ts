import { Seller } from '../../Seller';
import { AuthBD } from '../IndexDB';
import type { User } from '../model';
import { AuthRepository } from '../Repository';

export class AuthService {

  private static instance: AuthService | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(user: User) {
    const response = await AuthRepository.getInstance().login(user);
    await AuthBD.getInstance().saveSession(response)
    return response;
  }

  async logout() {
    try {
      await AuthRepository.getInstance().logout();
      await AuthBD.getInstance().clearSession();
    } catch (e) {
      console.log(e)
    }
  }

  async checkSession() {
    return AuthRepository.getInstance().checkSession();
  }

  async checkLocalSession() {
    const response = await AuthBD.getInstance().getSessionByEmail();
    if (!response) {
      return false;
    }
    Seller.getInstance().setFromData(response);
    Seller.getInstance().setIsConnected(true);
    return true;
  }
}
