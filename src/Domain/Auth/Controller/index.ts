import type { User } from '../model';
import { AuthService } from '../Service';

export class AuthController {
  async login(user: User) {
    const repo = new AuthService();

    return repo.login(user);
  }

  async logout() {
    const repo = new AuthService();
    return repo.logout();
  }

  async checkSession() {
    const repo = new AuthService();
    return repo.checkSession();
  }
}
