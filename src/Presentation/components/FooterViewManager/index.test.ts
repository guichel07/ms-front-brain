/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { FooterViewManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent, FOOTER_MASSAGE } from '../../../constants';

 describe('FooterViewManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `<div id="screen-footer"></div>`;
     FooterViewManager.reset();
     vi.restoreAllMocks();
   });

   it('singleton', () => {
     expect(FooterViewManager.getInstance()).toBe(
       FooterViewManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance = FooterViewManager.getInstance();

     FooterViewManager.reset();

     expect(FooterViewManager.getInstance()).not.toBe(instance);
   });

   it('getInstance lève une erreur', () => {
     document.body.innerHTML = '';

     expect(() => FooterViewManager.getInstance()).toThrow();
   });

   it('Connected appelle render', () => {
     const renderSpy = vi.spyOn(
       FooterViewManager.getInstance(),
       'render'
     );

     FooterViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, undefined);

     expect(renderSpy).toHaveBeenCalledWith(FOOTER_MASSAGE);
   });
 });
