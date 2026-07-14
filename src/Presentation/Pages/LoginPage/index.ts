import { Login } from 'ms-login';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import { AuthController } from '../../../Domain/Auth/Controller';
import { Seller } from '../../../Domain/Seller';

export class LoginPage extends Login {
  private static instance: LoginPage | null = null;

  static reset() {
    LoginPage.instance = null;
  }
  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      LoginPage.reset();
    });
    EventBus.getInstance().on(AppEvent.NotConnected, () => {
      LoginPage.getInstance().render({
        onLogin: (username, password) =>
          LoginPage.getInstance().onLogin(username, password),
      });
    });
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      LoginPage.getInstance().render({
        onLogin: (username, password) =>
          LoginPage.getInstance().onLogin(username, password),
      });
    });
  }

  static getInstance() {
    if (!LoginPage.instance) {
      const app = document.querySelector<HTMLDivElement>('#app');
      if (!app) throw new Error('#app introuvable dans le DOM');
      LoginPage.instance = new LoginPage(app);
    }
    return LoginPage.instance;
  }

  onLogin = async (email: string, password: string) => {
    try {
      const response = await AuthController.getInstance().login({
        email,
        password,
      });
      Seller.getInstance().setFromData(response);
      Seller.getInstance().setIsConnected(true);
      EventBus.getInstance().emit(AppEvent.Connected, Seller.getInstance());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      LoginPage.getInstance().showError(message);
    }
  };
}
