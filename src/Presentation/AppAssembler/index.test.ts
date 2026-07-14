// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppAssembler } from '.';
import { EventBus } from '../../EventBus';
import { AppEvent } from '../../constants';

describe('AppAssembler', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('singleton', () => {
    expect(AppAssembler.getInstance()).toBe(AppAssembler.getInstance());
  });

  it('buildAppLayout()', () => {
    AppAssembler.buildAppLayout();

    expect(document.querySelector('#body-wrap')).not.toBeNull();
    expect(document.querySelector('#screen-header')).not.toBeNull();
    expect(document.querySelector('#panel-products')).not.toBeNull();
  });

  it('toggleVisibilityOfTheCartPanel()', () => {
    AppAssembler.buildAppLayout();

    const bodyWrap = document.querySelector('#body-wrap')!;

    expect(bodyWrap.classList.contains('no-cart')).toBe(false);

    AppAssembler.toggleVisibilityOfTheCartPanel();

    expect(bodyWrap.classList.contains('no-cart')).toBe(true);

    AppAssembler.toggleVisibilityOfTheCartPanel();

    expect(bodyWrap.classList.contains('no-cart')).toBe(false);
  });

  it('showCart()', () => {
    AppAssembler.buildAppLayout();

    const bodyWrap = document.querySelector('#body-wrap')!;

    AppAssembler.showCart();

    expect(bodyWrap.classList.contains('no-cart')).toBe(true);
  });

  it('hiddenCart()', () => {
    AppAssembler.buildAppLayout();

    const bodyWrap = document.querySelector('#body-wrap')!;

    bodyWrap.classList.add('no-cart');

    AppAssembler.hiddenCart();

    expect(bodyWrap.classList.contains('no-cart')).toBe(false);
  });

  it('init() enregistre un listener sur Connected', () => {
    const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

    AppAssembler.init();

    expect(onSpy).toHaveBeenCalledWith(
      AppEvent.Connected,
      expect.any(Function)
    );
  });
});
