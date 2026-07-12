import type { User } from '../model';
import { AuthRepository } from '../Repository';

export class AuthService {
  async login(user: User) {
    const repo = new AuthRepository();
    return repo.login(user);
  }

  async logout() {
    const repo = new AuthRepository();
    return repo.logout();
  }

  async checkSession() {
    const repo = new AuthRepository();
    return repo.checkSession();
  }
}
