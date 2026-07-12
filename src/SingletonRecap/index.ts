import { RecapSheet } from "tek-ms-recap";

export class SingletonRecap {
  private static instance: RecapSheet  | null = null;
  constructor() { }

  static getInstance() {
    if (!SingletonRecap.instance) {
      SingletonRecap.instance = new RecapSheet(
        document.querySelector<HTMLDivElement>('#container-recap-overlay')!
      );
    }
    return SingletonRecap.instance;
  }
}
