/**
 * @vitest-environment jsdom
 */
 import { beforeEach, describe, expect, it, vi } from 'vitest';
 import { HeaderViewManager } from '.';
 import { EventBus } from '../../../EventBus';
 import { AppEvent } from '../../../constants';
 import { DailySalesController } from '../../../Domain/DailySales/Controller';
 import { ArticleController } from '../../../Domain/Article/Controller';
 import type { SellerData } from '../../../Domain/Auth/model';

 describe('HeaderViewManager', () => {
   beforeEach(() => {
     document.body.innerHTML = `
       <div id="screen-header"></div>
     `;

     HeaderViewManager.reset();
   });

   it('singleton', () => {
     expect(HeaderViewManager.getInstance()).toBe(
       HeaderViewManager.getInstance()
     );
   });

   it('reset recrée une instance', () => {
     const instance1 = HeaderViewManager.getInstance();

     HeaderViewManager.reset();

     const instance2 = HeaderViewManager.getInstance();

     expect(instance1).not.toBe(instance2);
   });

   it('getInstance lève une erreur si #screen-header est absent', () => {
     document.body.innerHTML = '';

     HeaderViewManager.reset();

     expect(() => HeaderViewManager.getInstance()).toThrow(
       '#screen-header introuvable dans le DOM'
     );
   });

   it('init enregistre les listeners', () => {
     const onSpy = vi.spyOn(EventBus.getInstance(), 'on');

     HeaderViewManager.init();

     expect(onSpy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       expect.any(Function)
     );

     expect(onSpy).toHaveBeenCalledWith(
       AppEvent.DailyTotalChanged,
       expect.any(Function)
     );

     expect(onSpy).toHaveBeenCalledWith(
       AppEvent.Connected,
       expect.any(Function)
     );
   });

   it('DailyTotalChanged met à jour le total', () => {
     HeaderViewManager.init();

     const updateSpy = vi
       .spyOn(HeaderViewManager.getInstance(), 'updateDailySalesTotal')
       .mockImplementation(() => {});

     EventBus.getInstance().emit(AppEvent.DailyTotalChanged, 12500);

     expect(updateSpy).toHaveBeenCalledWith(12500);
   });

   it('Connected appelle render()', async () => {
     vi.spyOn(DailySalesController.getInstance(), 'getTodayTotal')
       .mockResolvedValue(35000);

     const renderSpy = vi
       .spyOn(HeaderViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     HeaderViewManager.init();

     const seller: SellerData = {
       name: 'John Doe',
       role: 'Vendeur',
       tag: 'JD',
       svgAvatar: '<svg></svg>',
     } as SellerData;

     EventBus.getInstance().emit(AppEvent.Connected, seller);

     await Promise.resolve();

     expect(renderSpy).toHaveBeenCalledTimes(3);

     const args = renderSpy.mock.calls[0];

     expect(args[0].firstName).toBe('Maman');
     expect(args[0].secondName).toBe('Solution');

     expect(args[1]).toEqual({
       name: seller.name,
       role: seller.role,
       dailySalesTotal: 35000,
       tag: seller.tag,
       svgAvatar: seller.svgAvatar,
     });

     expect(typeof args[2]).toBe('function');
     expect(typeof args[3]).toBe('function');
     expect(typeof args[4]).toBe('function');
   });

   it('callback logout émet Disconnected', async () => {
     vi.spyOn(DailySalesController.getInstance(), 'getTodayTotal')
       .mockResolvedValue(0);

     const renderSpy = vi
       .spyOn(HeaderViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     HeaderViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, {
       name: '',
       role: '',
       tag: '',
       svgAvatar: '',
     } as SellerData);

     await Promise.resolve();

     const logout = renderSpy.mock.calls[0][2];

     logout!();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.Disconnected,
       undefined
     );
   });

   it('callback menu émet MenuOpened', async () => {
     vi.spyOn(DailySalesController.getInstance(), 'getTodayTotal')
       .mockResolvedValue(0);

     const renderSpy = vi
       .spyOn(HeaderViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     const emitSpy = vi.spyOn(EventBus.getInstance(), 'emit');

     HeaderViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, {
       name: '',
       role: '',
       tag: '',
       svgAvatar: '',
     } as SellerData);

     await Promise.resolve();

     const openMenu = renderSpy.mock.calls[0][3];

     openMenu!();

     expect(emitSpy).toHaveBeenCalledWith(
       AppEvent.MenuOpened,
       undefined
     );
   });

   it('callback synchronisation appelle getArticles()', async () => {
     vi.spyOn(DailySalesController.getInstance(), 'getTodayTotal')
       .mockResolvedValue(0);

     const renderSpy = vi
       .spyOn(HeaderViewManager.getInstance(), 'render')
       .mockImplementation(() => {});

     const articlesSpy = vi
       .spyOn(ArticleController.getInstance(), 'getArticles')
       .mockResolvedValue(undefined);

     HeaderViewManager.init();

     EventBus.getInstance().emit(AppEvent.Connected, {
       name: '',
       role: '',
       tag: '',
       svgAvatar: '',
     } as SellerData);

     await Promise.resolve();

     const sync = renderSpy.mock.calls[0][4];

     sync!();

     expect(articlesSpy).toHaveBeenCalled();
   });
 });
