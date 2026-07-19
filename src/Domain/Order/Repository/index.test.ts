import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderRepository } from '.';

describe('OrderRepository', () => {
  let repo: OrderRepository;

  beforeEach(() => {
    repo = OrderRepository.getInstance();

    globalThis.fetch = vi.fn() as typeof fetch;
  });

  it('singleton', () => {
    expect(OrderRepository.getInstance()).toBe(OrderRepository.getInstance());
  });

  it('register()', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Response);

    await repo.register({} as never);

    expect(fetch).toHaveBeenCalled();
  });

  it('getAll()', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    await repo.getAll();

    expect(fetch).toHaveBeenCalled();
  });
});
