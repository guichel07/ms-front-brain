import { AddSheet } from 'tek-ms-addsheet';
import { EventBus } from '../../../EventBus';
import { AppEvent } from '../../../constants';
import type { AddSheetProduct } from 'tek-ms-addsheet/dist/AddSheet';
import type { ArticleDTO } from '../../../Domain/Article/Model';

export class AddItemSheetManager extends AddSheet {
  private static instance: AddItemSheetManager | null = null;

  public static getInstance() {
    if (!AddItemSheetManager.instance) {
      const addSheetContainer = document.querySelector<HTMLDivElement>(
        '#add-overlay-container'
      );
      if (!addSheetContainer)
        throw new Error('#add-overlay-container introuvable dans le DOM');
      AddItemSheetManager.instance = new AddItemSheetManager(addSheetContainer);
    }
    return AddItemSheetManager.instance;
  }

  static reset() {
    AddItemSheetManager.instance = null;
  }

  static init(): void {
    EventBus.getInstance().on(AppEvent.Disconnected, () => {
      AddItemSheetManager.reset();
    });
    EventBus.getInstance().on(AppEvent.ArticleClicked, (produit) => {
      const article = produit as ArticleDTO;
      AddItemSheetManager.getInstance().render({
        product: article as unknown as AddSheetProduct,
        onConfirm: (price: number, qty: number) => {
          EventBus.getInstance().emit(AppEvent.AddSheetValided, {
            ...article,
            price,
            qty,
          });
          AddItemSheetManager.getInstance().close();
        },
        onCancel: () => {
          AddItemSheetManager.getInstance().close();
        },
      });
    });
  }
}
