/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { RecapViewManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent } from '../../../constants';
 import type { CartItem } from 'tek-ms-barket';

 describe('RecapViewManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `
       <div id="container-recap-overlay"></div>
     `;

     RecapViewManager.reset();
   });

   it('singleton', () => {
     expect(RecapViewManager.getInstance()).toBe(
       RecapViewManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance1 = RecapViewManager.getInstance();

     RecapViewManager.reset();

     const instance2 = RecapViewManager.getInstance();

     expect(instance1).not.toBe(instance2);
   });

   it('getInstance lève une erreur si le conteneur est absent', () => {
     document.body.innerHTML = '';

     RecapViewManager.reset();

     expect(() => RecapViewManager.getInstance()).toThrow(
       '#container-recap-overlay introuvable dans le DOM'
     );
   });

   it('init enregistre les listeners', () => {
     const spy = vi.spyOn(EventBus.getInstance(), 'on');

     RecapViewManager.init();

     expect(spy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       expect.any(Function)
     );

     expect(spy).toHaveBeenCalledWith(
       AppEvent.CartValidated,
       expect.any(Function)
     );
   });

   it('CartValidated avec un panier vide ne fait rien', () => {
     RecapViewManager.init();

     const renderSpy = vi
       .spyOn(RecapViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     EventBus.getInstance().emit(AppEvent.CartValidated, []);

     expect(renderSpy).not.toHaveBeenCalled();
   });

   it('onConfirm émet SaleConfirmed', () => {
     RecapViewManager.init();

     const items = [
       {
         id: 1,
         name: 'Produit',
         quantity: 2,
         price: 1500,
         icon: '',
         color: '#000',
         category: 'Santé',
       },
     ] as unknown as CartItem[];

     const renderSpy = vi
       .spyOn(RecapViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     const getItemsSpy = vi
       .spyOn(RecapViewManager.getInstance(), 'getItems')
       .mockReturnValue(items);

     const closeSpy = vi
       .spyOn(RecapViewManager.getInstance(), 'onClose')
       .mockImplementation(() => {});

     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     EventBus.getInstance().emit(AppEvent.CartValidated, items);

     const config = renderSpy.mock.calls[0][0];

     expect(config.onConfirm).toBeDefined();

     config.onConfirm!(items as never);

     expect(getItemsSpy).toHaveBeenCalled();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.SaleConfirmed,
       items
     );

     expect(closeSpy).toHaveBeenCalled();
   });

   it('onCancel est défini', () => {
     RecapViewManager.init();

     const renderSpy = vi
       .spyOn(RecapViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     const items = [
       {
         id: 1,
         name: 'Produit',
         quantity: 2,
         price: 1500,
         icon: '',
         color: '#000',
         category: 'Santé',
       },
     ] as unknown as CartItem[];

     EventBus.getInstance().emit(AppEvent.CartValidated, items);

     const config = renderSpy.mock.calls[0][0];

     expect(config.onCancel).toBeDefined();
     expect(typeof config.onCancel).toBe('function');
   });
 });
