import { AppEvent } from '../../../constants';
import { EventBus } from '../../../EventBus';
import type { User } from '../model';
import { AuthService } from '../Service';

export class AuthController {

  private static instance: AuthController | null = null;

  static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      AuthController.getInstance().logout();
    });
  }

  async login(user: User) {
    return AuthService.getInstance().login(user);
  }

  async logout() {
    return AuthService.getInstance().logout();
  }

  async checkSession() {
    return AuthService.getInstance().checkSession();
  }

  async checkLocalSession() {
    return AuthService.getInstance().checkLocalSession();
  }
}
