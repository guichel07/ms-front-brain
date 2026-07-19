import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '.';
import { AuthRepository } from '../Repository';
import { AuthBD } from '../IndexDB';
import { Seller } from '../../Seller';
import type { SellerData, User } from '../model';

describe('AuthService', () => {
  const repository = {
    login: vi.fn(),
    logout: vi.fn(),
    checkSession: vi.fn(),
  };

  const authBD = {
    saveSession: vi.fn(),
    clearSession: vi.fn(),
    getSessionByEmail: vi.fn(),
  };

  const seller = {
    setFromData: vi.fn(),
    setIsConnected: vi.fn(),
  };

  const sellerData: SellerData = {
    contact: '0600000000',
    email: 'john@test.com',
    name: 'John Doe',
    role: 'ADMIN',
    svgAvatar: 'avatar.svg',
    tag: 'JD',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(AuthRepository, 'getInstance').mockReturnValue(
      repository as unknown as ReturnType<typeof AuthRepository.getInstance>
    );

    vi.spyOn(AuthBD, 'getInstance').mockReturnValue(
      authBD as unknown as ReturnType<typeof AuthBD.getInstance>
    );

    vi.spyOn(Seller, 'getInstance').mockReturnValue(
      seller as unknown as ReturnType<typeof Seller.getInstance>
    );
  });

  it('retourne toujours la même instance', () => {
    expect(AuthService.getInstance()).toBe(AuthService.getInstance());
  });

  it('login appelle le repository puis sauvegarde la session', async () => {
    const user: User = {
      email: 'john@test.com',
      password: '123456',
    };

    repository.login.mockResolvedValue(sellerData);
    authBD.saveSession.mockResolvedValue(undefined);

    const result = await AuthService.getInstance().login(user);

    expect(repository.login).toHaveBeenCalledWith(user);
    expect(authBD.saveSession).toHaveBeenCalledWith(sellerData);
    expect(result).toEqual(sellerData);
  });

  it('logout appelle le repository puis supprime la session', async () => {
    repository.logout.mockResolvedValue(undefined);
    authBD.clearSession.mockResolvedValue(undefined);

    await AuthService.getInstance().logout();

    expect(repository.logout).toHaveBeenCalledTimes(1);
    expect(authBD.clearSession).toHaveBeenCalledTimes(1);
  });

  it('logout ne relance pas une erreur si le repository échoue', async () => {
    const error = new Error('Erreur');

    repository.logout.mockRejectedValue(error);

    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    await AuthService.getInstance().logout();

    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('checkSession appelle le repository', async () => {
    repository.checkSession.mockResolvedValue(true);

    const result = await AuthService.getInstance().checkSession();

    expect(repository.checkSession).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('checkLocalSession retourne false si aucune session', async () => {
    authBD.getSessionByEmail.mockResolvedValue(null);

    const result = await AuthService.getInstance().checkLocalSession();

    expect(result).toBe(false);
    expect(seller.setFromData).not.toHaveBeenCalled();
    expect(seller.setIsConnected).not.toHaveBeenCalled();
  });

  it('checkLocalSession restaure la session', async () => {
    authBD.getSessionByEmail.mockResolvedValue(sellerData);

    const result = await AuthService.getInstance().checkLocalSession();

    expect(seller.setFromData).toHaveBeenCalledWith(sellerData);
    expect(seller.setIsConnected).toHaveBeenCalledWith(true);
    expect(result).toBe(true);
  });
});
