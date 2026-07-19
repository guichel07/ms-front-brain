/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { ConfirmViewManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent } from '../../../constants';
 import { DailySalesController } from '../../../Domain/DailySales/Controller';

 describe('ConfirmViewManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `
       <div id="app-screen"></div>
       <div id="container-confirm-screen"></div>
       <div id="confirm-screen"></div>
     `;

     ConfirmViewManager.reset();

     vi.restoreAllMocks();

     vi.spyOn(
       DailySalesController.getInstance(),
       'getTodayTotal'
     ).mockResolvedValue(10000);
   });

   it('singleton', () => {
     expect(ConfirmViewManager.getInstance()).toBe(
       ConfirmViewManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance = ConfirmViewManager.getInstance();

     ConfirmViewManager.reset();

     expect(ConfirmViewManager.getInstance()).not.toBe(instance);
   });

   it('getInstance lève une erreur si le conteneur est absent', () => {
     document.body.innerHTML = '';

     expect(() => ConfirmViewManager.getInstance()).toThrow(
       '#container-confirm-screen introuvable dans le DOM'
     );
   });

   it('showConfirmScreen masque app-screen', () => {
     const manager = ConfirmViewManager.getInstance();

     manager.showConfirmScreen();

     expect(
       document.getElementById('app-screen')!.style.display
     ).toBe('none');

     expect(
       document.getElementById('confirm-screen')!.style.display
     ).toBe('flex');
   });

   it('returnToAppAfterConfirmation réaffiche app-screen', () => {
     const manager = ConfirmViewManager.getInstance();

     manager.returnToAppAfterConfirmation();

     expect(
       document.getElementById('confirm-screen')!.style.display
     ).toBe('none');

     expect(
       document.getElementById('app-screen')!.style.display
     ).toBe('flex');
   });

   it('init enregistre les listeners', () => {
     const spy = vi.spyOn(EventBus.getInstance(), 'on');

     ConfirmViewManager.init();

     expect(spy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       expect.any(Function)
     );

     expect(spy).toHaveBeenCalledWith(
       AppEvent.SaleRegistered,
       expect.any(Function)
     );
   });

   it('SaleRegistered affiche la confirmation', async () => {
     const renderSpy = vi.spyOn(
       ConfirmViewManager.getInstance(),
       'render'
     );

     ConfirmViewManager.init();

     const order = {
       items: [
         {
           id: 1,
           name: 'Savon',
           price: 1000,
           quantity: 2,
         },
         {
           id: 2,
           name: 'Shampoing',
           price: 500,
           quantity: 1,
         },
       ],
     };

     EventBus.getInstance().emit(
       AppEvent.SaleRegistered,
       order as never
     );

     await Promise.resolve();

     expect(renderSpy).toHaveBeenCalled();

     const config = renderSpy.mock.calls[0][0];

     expect(config.amount).toBe(2500);
     expect(config.articles).toBe(3);
     expect(config.dailyTotal).toBe(10000);
   });

   it('émet DailyTotalUpdated', async () => {
     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     ConfirmViewManager.init();

     EventBus.getInstance().emit(
       AppEvent.SaleRegistered,
       {
         items: [
           {
             id: 1,
             name: 'Produit',
             quantity: 2,
             price: 300,
           },
         ],
       } as never
     );

     await Promise.resolve();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.DailyTotalUpdated,
       600
     );
   });

   it('onNewSale émet SaleNew', async () => {
     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     const returnSpy = vi.spyOn(
       ConfirmViewManager.getInstance(),
       'returnToAppAfterConfirmation'
     );

     const renderSpy = vi
       .spyOn(ConfirmViewManager.getInstance(), 'render');

     ConfirmViewManager.init();

     EventBus.getInstance().emit(
       AppEvent.SaleRegistered,
       {
         items: [
           {
             id: 1,
             name: 'Produit',
             quantity: 2,
             price: 500,
           },
         ],
       } as never
     );

     await Promise.resolve();

     const config = renderSpy.mock.calls[0][0];

     config.onNewSale();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.SaleNew,
       2
     );

     expect(returnSpy).toHaveBeenCalled();
   });
 });
