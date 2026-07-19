/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { BarketViewManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent } from '../../../constants';
 import { ArticleController } from '../../../Domain/Article/Controller';

 describe('BarketViewManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `
       <div id="panel-cart-contenair"></div>
     `;

     BarketViewManager.reset();

     vi.restoreAllMocks();

     vi.spyOn(
       ArticleController.getInstance(),
       'syncroStockByIdLocal'
     ).mockResolvedValue(undefined as never);
   });

   it('singleton', () => {
     expect(BarketViewManager.getInstance()).toBe(
       BarketViewManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance = BarketViewManager.getInstance();

     BarketViewManager.reset();

     expect(BarketViewManager.getInstance()).not.toBe(instance);
   });

   it('getInstance lève une erreur si le conteneur est absent', () => {
     document.body.innerHTML = '';

     expect(() => BarketViewManager.getInstance()).toThrow(
       '#panel-cart-contenair introuvable dans le DOM'
     );
   });

   it('init enregistre les listeners', () => {
     const spy = vi.spyOn(EventBus.getInstance(), 'on');

     BarketViewManager.init();

     expect(spy).toHaveBeenCalledWith(
       AppEvent.Connected,
       expect.any(Function)
     );

     expect(spy).toHaveBeenCalledWith(
       AppEvent.AddSheetValided,
       expect.any(Function)
     );

     expect(spy).toHaveBeenCalledWith(
       AppEvent.SaleRegistered,
       expect.any(Function)
     );

     expect(spy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       expect.any(Function)
     );
   });

   it('Connected appelle render', () => {
     const renderSpy = vi.spyOn(
       BarketViewManager.getInstance(),
       'render'
     );

     BarketViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, undefined);

     expect(renderSpy).toHaveBeenCalled();
   });

   it('onClickValidation émet CartValidated', () => {
     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     const items = [
       {
         id: 1,
         name: 'Savon',
         quantity: 2,
         price: 1000,
       },
     ];

     vi.spyOn(
       BarketViewManager.getInstance(),
       'getItems'
     ).mockReturnValue(items as never);

     const renderSpy = vi
       .spyOn(BarketViewManager.getInstance(), 'render');

     BarketViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, undefined);

     const config = renderSpy.mock.calls[0][0];

     config.onClickValidation!();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.CartValidated,
       items
     );
   });

   it('onClickRemoveCard synchronise le stock et émet CartItemRemoved', async () => {
     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     const stockSpy = vi.spyOn(
       ArticleController.getInstance(),
       'syncroStockByIdLocal'
     );

     const renderSpy = vi
       .spyOn(BarketViewManager.getInstance(), 'render');

     BarketViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, undefined);

     const config = renderSpy.mock.calls[0][0];

     const item = {
       id: 5,
       quantity: 3,
       name: 'Savon',
       price: 500,
     } as never;

     await config.onClickRemoveCard!(item);

     expect(stockSpy).toHaveBeenCalledWith(5, 3);

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.CartItemRemoved,
       item
     );
   });

   it('AddSheetValided ajoute un article au panier', async () => {
     const addSpy = vi.spyOn(
       BarketViewManager.getInstance(),
       'addToCart'
     );

     const stockSpy = vi.spyOn(
       ArticleController.getInstance(),
       'syncroStockByIdLocal'
     );

     BarketViewManager.init();

     const article = {
       id: 2,
       name: 'Produit',
       quantity: 10,
       qty: 4,
       price: 300,
     };

     EventBus.getInstance().emit(
       AppEvent.AddSheetValided,
       article
     );

     await Promise.resolve();

     expect(stockSpy).toHaveBeenCalledWith(2, -4);

     expect(addSpy).toHaveBeenCalledWith(
       expect.objectContaining({
         id: 2,
         quantity: 4,
         price: 300,
       })
     );
   });

   it('SaleRegistered vide le panier', () => {
     const resetSpy = vi.spyOn(
       BarketViewManager.getInstance(),
       'resetItems'
     );

     BarketViewManager.init();

     EventBus.getInstance().emit(AppEvent.SaleRegistered, undefined);

     expect(resetSpy).toHaveBeenCalled();
   });
 });
