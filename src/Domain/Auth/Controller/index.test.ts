import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../Service';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import type { User } from '../model';
import { AuthController } from '.';

describe('AuthController', () => {
  const authService = {
    login: vi.fn(),
    logout: vi.fn(),
    checkSession: vi.fn(),
    checkLocalSession: vi.fn(),
  };

  const eventBus = {
    on: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(AuthService, 'getInstance').mockReturnValue(
      authService as unknown as ReturnType<typeof AuthService.getInstance>
    );

    vi.spyOn(EventBus, 'getInstance').mockReturnValue(
      eventBus as unknown as ReturnType<typeof EventBus.getInstance>
    );
  });

  it('retourne toujours la même instance', () => {
    const controller1 = AuthController.getInstance();
    const controller2 = AuthController.getInstance();

    expect(controller1).toBe(controller2);
  });

  it('init enregistre un listener sur Disconnected', () => {
    AuthController.init();

    expect(eventBus.on).toHaveBeenCalledTimes(1);
    expect(eventBus.on).toHaveBeenCalledWith(
      AppEvent.Disconnected,
      expect.any(Function)
    );
  });

  it('le callback de init appelle logout', async () => {
    authService.logout.mockResolvedValue(undefined);

    AuthController.init();

    const callback = eventBus.on.mock.calls[0][1];

    await callback();

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  it('login appelle AuthService.login', async () => {
    const user: User = {
      email: 'admin',
      password: 'admin',
    };

    authService.login.mockResolvedValue(undefined);

    await AuthController.getInstance().login(user);

    expect(authService.login).toHaveBeenCalledWith(user);
  });

  it('logout appelle AuthService.logout', async () => {
    authService.logout.mockResolvedValue(undefined);

    await AuthController.getInstance().logout();

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  it('checkSession appelle AuthService.checkSession', async () => {
    authService.checkSession.mockResolvedValue(true);

    const result = await AuthController.getInstance().checkSession();

    expect(authService.checkSession).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('checkLocalSession appelle AuthService.checkLocalSession', async () => {
    authService.checkLocalSession.mockResolvedValue(true);

    const result = await AuthController.getInstance().checkLocalSession();

    expect(authService.checkLocalSession).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});
