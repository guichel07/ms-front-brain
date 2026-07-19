/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { AddItemSheetManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent } from '../../../constants';

 describe('AddItemSheetManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `
       <div id="add-overlay-container"></div>
     `;

     AddItemSheetManager.reset();

     vi.restoreAllMocks();
   });

   it('singleton', () => {
     expect(AddItemSheetManager.getInstance()).toBe(
       AddItemSheetManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance = AddItemSheetManager.getInstance();

     AddItemSheetManager.reset();

     expect(AddItemSheetManager.getInstance()).not.toBe(instance);
   });

   it('getInstance lève une erreur si le conteneur est absent', () => {
     document.body.innerHTML = '';

     expect(() => AddItemSheetManager.getInstance()).toThrow(
       '#add-overlay-container introuvable dans le DOM'
     );
   });

   it('init enregistre les listeners', () => {
     const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

     AddItemSheetManager.init();

     expect(onSpy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       expect.any(Function)
     );

     expect(onSpy).toHaveBeenCalledWith(
       AppEvent.ArticleClicked,
       expect.any(Function)
     );
   });

   it('ArticleClicked appelle render', () => {
     const renderSpy = vi.spyOn(
       AddItemSheetManager.getInstance(),
       'render'
     );

     AddItemSheetManager.init();

     const article = {
       id: 1,
       name: 'Savon',
       quantity: 20,
       price: 500,
       icon: '',
       color: '#fff',
       category: 'Soins',
     };

     EventBus.getInstance().emit(
       AppEvent.ArticleClicked,
       article
     );

     expect(renderSpy).toHaveBeenCalled();
   });

   it('onConfirm émet AddSheetValided puis ferme la sheet', () => {
     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     const closeSpy = vi.spyOn(
       AddItemSheetManager.getInstance(),
       'close'
     );

     const renderSpy = vi.spyOn(
       AddItemSheetManager.getInstance(),
       'render'
     );

     AddItemSheetManager.init();

     const article = {
       id: 1,
       name: 'Savon',
       quantity: 20,
       price: 500,
       icon: '',
       color: '#fff',
       category: 'Soins',
     };

     EventBus.getInstance().emit(
       AppEvent.ArticleClicked,
       article
     );

     const config = renderSpy.mock.calls[0][0];

     config.onConfirm!(1500, 3);

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.AddSheetValided,
       {
         ...article,
         price: 1500,
         qty: 3,
       }
     );

     expect(closeSpy).toHaveBeenCalled();
   });

   it('onCancel ferme la sheet', () => {
     const closeSpy = vi.spyOn(
       AddItemSheetManager.getInstance(),
       'close'
     );

     const renderSpy = vi.spyOn(
       AddItemSheetManager.getInstance(),
       'render'
     );

     AddItemSheetManager.init();

     EventBus.getInstance().emit(
       AppEvent.ArticleClicked,
       {
         id: 1,
         name: 'Savon',
         quantity: 20,
         price: 500,
         icon: '',
         color: '#fff',
         category: 'Soins',
       }
     );

     const config = renderSpy.mock.calls[0][0];

     config.onCancel!();

     expect(closeSpy).toHaveBeenCalled();
   });
 });
