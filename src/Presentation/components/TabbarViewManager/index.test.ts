/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TabbarViewManager } from '.';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';

describe('TabbarViewManager', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="screen-tabbar"></div>
      <div id="panel-products" class="visible"></div>
      <div id="panel-cart"></div>
    `;

    TabbarViewManager.reset();
  });

  it('singleton', () => {
    expect(TabbarViewManager.getInstance()).toBe(
      TabbarViewManager.getInstance()
    );
  });

  it('reset recrée une instance', () => {
    const instance = TabbarViewManager.getInstance();

    TabbarViewManager.reset();

    expect(TabbarViewManager.getInstance()).not.toBe(instance);
  });

  it('getInstance lève une erreur si #screen-tabbar est absent', () => {
    document.body.innerHTML = '';

    TabbarViewManager.reset();

    expect(() => TabbarViewManager.getInstance()).toThrow(
      '#screen-tabbar introuvable dans le DOM'
    );
  });

  it('init enregistre les listeners', () => {
    const spy = vi.spyOn(EventBus.getInstance(), 'on');

    TabbarViewManager.init();

    expect(spy).toHaveBeenCalled();
  });

  it('Connected appelle render', () => {
    const render = vi.spyOn(
      TabbarViewManager.getInstance(),
      'render'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.Connected, undefined);

    expect(render).toHaveBeenCalled();
  });

  it('AddSheetValided met à jour le compteur', () => {
    const update = vi.spyOn(
      TabbarViewManager.getInstance(),
      'updateCartCount'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.AddSheetValided, {
      qty: 4,
    });

    expect(update).toHaveBeenCalledWith(4);
  });

  it('CartItemRemoved retire la quantité', () => {
    const update = vi.spyOn(
      TabbarViewManager.getInstance(),
      'updateCartCount'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.CartItemRemoved, {
      quantity: 2,
    });

    expect(update).toHaveBeenCalledWith(-2);
  });

  it('SaleNew remet le compteur à jour', () => {
    const update = vi.spyOn(
      TabbarViewManager.getInstance(),
      'updateCartCount'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.SaleNew, 5);

    expect(update).toHaveBeenCalledWith(-5);
  });

  it('MenuItemSelected réaffiche la tabbar', () => {
    const render = vi.spyOn(
      TabbarViewManager.getInstance(),
      'render'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(
      AppEvent.MenuItemSelected,
      'Historique'
    );

    expect(render).toHaveBeenCalled();
  });

  it('onclickPanier affiche le panier', () => {
    const render = vi.spyOn(
      TabbarViewManager.getInstance(),
      'render'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.Connected, undefined);

    const config = render.mock.calls[0][0];

    config.onclickPanier!();

    expect(document.querySelector('#panel-cart')!.classList.contains('visible')).toBe(true);
    expect(document.querySelector('#panel-products')!.classList.contains('visible')).toBe(false);
  });

  it('onclickPage affiche les produits', () => {
    document.querySelector('#panel-products')!.classList.remove('visible');
    document.querySelector('#panel-cart')!.classList.add('visible');

    const render = vi.spyOn(
      TabbarViewManager.getInstance(),
      'render'
    );

    TabbarViewManager.init();

    EventBus.getInstance().emit(AppEvent.Connected, undefined);

    const config = render.mock.calls[0][0];

    config.onclickPage!('Catalogue');

    expect(document.querySelector('#panel-products')!.classList.contains('visible')).toBe(true);
    expect(document.querySelector('#panel-cart')!.classList.contains('visible')).toBe(false);
  });
});
