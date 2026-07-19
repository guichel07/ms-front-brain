/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileNavigationManager } from '.';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

describe('MobileNavigationManager', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="menu-mobile"></div>
    `;

    MobileNavigationManager.reset();
  });

  it('singleton', () => {
    expect(MobileNavigationManager.getInstance()).toBe(
      MobileNavigationManager.getInstance()
    );
  });

  it('reset recrée une instance', () => {
    const instance1 = MobileNavigationManager.getInstance();

    MobileNavigationManager.reset();

    const instance2 = MobileNavigationManager.getInstance();

    expect(instance1).not.toBe(instance2);
  });

  it('getInstance lève une erreur si #menu-mobile est absent', () => {
    document.body.innerHTML = '';

    MobileNavigationManager.reset();

    expect(() => MobileNavigationManager.getInstance()).toThrow(
      '##menu-mobile introuvable dans le DOM'
    );
  });

  it('render appelle render() puis openSectionMenu()', () => {
    const renderSpy = vi
      .spyOn(MobileNavigationManager.getInstance(), 'render')
      .mockImplementation(() => {});

    const openSpy = vi
      .spyOn(MobileNavigationManager.getInstance(), 'openSectionMenu')
      .mockImplementation(() => {});

    MobileNavigationManager.render();

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledTimes(1);

    const config = renderSpy.mock.calls[0][0];

    expect(config.activeKey).toBe('Catalogue');

    expect(config.sections).toEqual([
      { key: 'Catalogue', label: 'Catalogue' },
      { key: 'Déconnexion', label: 'Déconnexion' },
    ]);

    expect(config.onSelect).toBeDefined();
  });

  it('render ne rappelle pas render() si #section-overlay existe', () => {
    document.body.innerHTML = `
      <div id="menu-mobile"></div>
      <div id="section-overlay"></div>
    `;

    MobileNavigationManager.reset();

    const renderSpy = vi
      .spyOn(MobileNavigationManager.getInstance(), 'render')
      .mockImplementation(() => {});

    const openSpy = vi
      .spyOn(MobileNavigationManager.getInstance(), 'openSectionMenu')
      .mockImplementation(() => {});

    MobileNavigationManager.render();

    expect(renderSpy).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('onSelect émet MenuItemSelected', () => {
    const renderSpy = vi
      .spyOn(MobileNavigationManager.getInstance(), 'render')
      .mockImplementation(() => {});

    const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

    MobileNavigationManager.render();

    const config = renderSpy.mock.calls[0][0];

    config.onSelect?.('Clients');

    expect(emitSpy).toHaveBeenCalledWith(
      AppEvent.MenuItemSelected,
      'Clients'
    );
  });

  it('init enregistre les listeners', () => {
    const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

    MobileNavigationManager.init();

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.Disconnected,
      expect.any(Function)
    );

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.MenuOpened,
      expect.any(Function)
    );
  });

  it('MenuOpened appelle render()', () => {
    const renderSpy = vi
      .spyOn(MobileNavigationManager, 'render')
      .mockImplementation(() => {});

    MobileNavigationManager.init();

    EventBus.getInstance().emit(AppEvent.MenuOpened, undefined);

    expect(renderSpy).toHaveBeenCalled();
  });
});
