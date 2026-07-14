/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NavbarViewManager } from '.';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

describe('NavbarViewManager', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="screen-nav"></div>
    `;

    NavbarViewManager.reset();
  });

  it('singleton', () => {
    expect(NavbarViewManager.getInstance()).toBe(
      NavbarViewManager.getInstance()
    );
  });

  it('reset recrée une instance', () => {
    const instance1 = NavbarViewManager.getInstance();

    NavbarViewManager.reset();

    const instance2 = NavbarViewManager.getInstance();

    expect(instance1).not.toBe(instance2);
  });

  it('getInstance lève une erreur si #screen-nav est absent', () => {
    document.body.innerHTML = '';

    NavbarViewManager.reset();

    expect(() => NavbarViewManager.getInstance()).toThrow(
      '#screen-nav introuvable dans le DOM'
    );
  });

  it('init enregistre les listeners', () => {
    const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

    NavbarViewManager.init();

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.Disconnected,
      expect.any(Function)
    );

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.Connected,
      expect.any(Function)
    );
  });

  it('Connected appelle render()', () => {
    NavbarViewManager.init();

    const renderSpy = vi
      .spyOn(NavbarViewManager.getInstance(), 'render')
      .mockImplementation(() => {});

    EventBus.getInstance().emit(AppEvent.Connected, undefined);

    expect(renderSpy).toHaveBeenCalledTimes(2);

    const config = renderSpy.mock.calls[0][0];

    expect(config.activeItem).toBe('Catalogue');

    expect(config.navItems).toEqual([
      'Catalogue',
      'Commandes',
      'Clients',
      'Paramètres',
    ]);

    expect(config.onTabChange).toBeDefined();
  });

  it('onTabChange émet NavItemSelected', () => {
    NavbarViewManager.init();

    const renderSpy = vi
      .spyOn(NavbarViewManager.getInstance(), 'render')
      .mockImplementation(() => {});

    const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

    EventBus.getInstance().emit(AppEvent.Connected, undefined);

    const config = renderSpy.mock.calls[0][0];

    expect(config.onTabChange).toBeDefined();

    config.onTabChange?.('Clients');

    expect(emitSpy).toHaveBeenCalledWith(
      AppEvent.NavItemSelected,
      'Clients'
    );
  });
});
