/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '.';
import { AuthController } from '../../../Domain/Auth/Controller';
import { Seller } from '../../../Domain/Seller';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

vi.mock('ms-login', () => ({
  Login: class {
    render = vi.fn();
    showError = vi.fn();

  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    LoginPage.reset();
    vi.restoreAllMocks();
  });

  it('singleton', () => {
    expect(LoginPage.getInstance()).toBe(LoginPage.getInstance());
  });

  it('reset crée une nouvelle instance', () => {
    const first = LoginPage.getInstance();

    LoginPage.reset();

    const second = LoginPage.getInstance();

    expect(first).not.toBe(second);
  });

  it('getInstance lève une erreur si #app est absent', () => {
    document.body.innerHTML = '';
    LoginPage.reset();

    expect(() => LoginPage.getInstance()).toThrow(
      '#app introuvable dans le DOM'
    );
  });

  it('init enregistre les listeners', () => {
    const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

    LoginPage.init();

    expect(onSpy).toHaveBeenCalledTimes(3);
    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.NotConnected,
      expect.any(Function)
    );
    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.Disconnected,
      expect.any(Function)
    );
  });

  it('onLogin connecte le vendeur', async () => {
    const response = {
      name: 'John',
      email: 'john@test.fr',
    };

    vi.spyOn(AuthController.getInstance(), 'login').mockResolvedValue(
      response as never
    );

    const seller = Seller.getInstance();

    const setFromData = vi.spyOn(seller, 'setFromData');
    const setIsConnected = vi.spyOn(seller, 'setIsConnected');
    const emit = vi.spyOn(EventBus.getInstance(), 'emit');

    await LoginPage.getInstance().onLogin(
      'john@test.fr',
      'password'
    );

    expect(setFromData).toHaveBeenCalledWith(response);
    expect(setIsConnected).toHaveBeenCalledWith(true);
    expect(emit).toHaveBeenCalledWith(
      AppEvent.Connected,
      seller
    );
  });

  it('onLogin affiche une erreur si login échoue', async () => {
    vi.spyOn(AuthController.getInstance(), 'login').mockRejectedValue(
      new Error('Erreur')
    );

    const showError = vi.spyOn(
      LoginPage.getInstance(),
      'showError'
    );

    await LoginPage.getInstance().onLogin('a', 'b');

    expect(showError).toHaveBeenCalledWith('Erreur');
  });
});
