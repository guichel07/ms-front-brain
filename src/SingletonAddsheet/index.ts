import { AddSheet } from 'tek-ms-addsheet';

export class SingletonAddsheet {
  private static instance: AddSheet | null = null;

  constructor() {}

  public static getInstance() {
    if (!SingletonAddsheet.instance) {
      SingletonAddsheet.instance = new AddSheet(
        document.querySelector<HTMLDivElement>('#add-overlay-container')!
      );
    }
    return SingletonAddsheet.instance;
  }
}
