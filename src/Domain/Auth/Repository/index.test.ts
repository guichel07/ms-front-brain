import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '.';
import { API_URL_AUTH } from '../../../constants';
import type { User } from '../model';

describe('AuthRepository', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('retourne toujours la même instance', () => {
    const repo1 = AuthRepository.getInstance();
    const repo2 = AuthRepository.getInstance();

    expect(repo1).toBe(repo2);
  });

  it('login appelle la bonne URL', async () => {
    const user: User = {
      email: 'john@test.com',
      password: '123456',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(
        JSON.stringify({
          contact: '0600000000',
          email: 'john@test.com',
          name: 'John Doe',
          role: 'ADMIN',
          svgAvatar: 'avatar.svg',
          tag: 'JD',
        })
      ),
    } as  unknown as Response);

    const result = await AuthRepository.getInstance().login(user);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL_AUTH}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      }
    );

    expect(result).toEqual({
      contact: '0600000000',
      email: 'john@test.com',
      name: 'John Doe',
      role: 'ADMIN',
      svgAvatar: 'avatar.svg',
      tag: 'JD',
    });
  });

  it('logout appelle la bonne URL', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(''),
    } as unknown as Response);

    const result = await AuthRepository.getInstance().logout();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL_AUTH}/logout`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    expect(result).toBeNull();
  });

  it('checkSession retourne true', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const result = await AuthRepository.getInstance().checkSession();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL_AUTH}/me`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    expect(result).toBe(true);
  });

  it('login lève une erreur si la réponse est en erreur', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      text: vi.fn().mockResolvedValue('Unauthorized'),
    } as unknown as Response);

    await expect(
      AuthRepository.getInstance().login({
        email: 'john@test.com',
        password: '123456',
      })
    ).rejects.toThrow('Erreur API (401): Unauthorized');
  });

  it('logout lève une erreur si la réponse est en erreur', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('Erreur serveur'),
    } as unknown as Response);

    await expect(
      AuthRepository.getInstance().logout()
    ).rejects.toThrow('Erreur API (500): Erreur serveur');
  });

  it('checkSession lève une erreur si la session est invalide', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    await expect(
      AuthRepository.getInstance().checkSession()
    ).rejects.toThrow('Session invalide');
  });

  it('login retourne null si la réponse est vide', async () => {
    const user: User = {
      email: 'john@test.com',
      password: '123456',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(''),
    } as unknown as Response);

    const result = await AuthRepository.getInstance().login(user);

    expect(result).toBeNull();
  });
});
