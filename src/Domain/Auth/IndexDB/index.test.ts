import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthBD } from '.';
import type { SellerData } from '../model';

describe('AuthBD', () => {
  let authBD: AuthBD;

  const seller: SellerData = {
    contact: '0600000000',
    email: 'john.doe@test.com',
    name: 'John Doe',
    role: 'ADMIN',
    svgAvatar: 'avatar.svg',
    tag: 'JD',
  };

  beforeEach(async () => {
    vi.restoreAllMocks();

    indexedDB.deleteDatabase('auth-db');

    authBD = AuthBD.getInstance();

    await authBD.clearSession().catch(() => {});
  });

  it('retourne toujours la même instance', () => {
    expect(AuthBD.getInstance()).toBe(AuthBD.getInstance());
  });

  it('saveSession sauvegarde une session', async () => {
    await authBD.saveSession(seller);

    const result = await authBD.getSessionByEmail();

    expect(result).toEqual(seller);
  });

  it('getSessionByEmail retourne null si aucune session', async () => {
    const result = await authBD.getSessionByEmail();

    expect(result).toBeNull();
  });

  it('clearSession supprime la session', async () => {
    await authBD.saveSession(seller);

    await authBD.clearSession();

    const result = await authBD.getSessionByEmail();

    expect(result).toBeNull();
  });

  it('retourne null lorsque la session est expirée', async () => {
    const now = 1_000_000;

    const spy = vi.spyOn(Date, 'now');

    spy.mockReturnValue(now);

    await authBD.saveSession(seller, 1);

    spy.mockReturnValue(now + 2000);

    const result = await authBD.getSessionByEmail();

    expect(result).toBeNull();

    spy.mockRestore();
  });

  it('la session est encore valide avant expiration', async () => {
    const now = Date.now();

    const spy = vi.spyOn(Date, 'now');

    spy
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 5000);

    await authBD.saveSession(seller, 10);

    const result = await authBD.getSessionByEmail();

    expect(result).toEqual(seller);
  });
});
