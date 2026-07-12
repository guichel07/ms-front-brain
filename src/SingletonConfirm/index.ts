import { Confirm } from "tek-ms-confirm";

export class SingletonConfirm {
  private static instance: Confirm | null = null;

  constructor() {}

  public static getInstance() {
    if (!SingletonConfirm.instance) {
      SingletonConfirm.instance = new Confirm(
        document.querySelector<HTMLDivElement>('#container-confirm-screen')!
      );
    }
    return SingletonConfirm.instance;
  }


  public static showConfirmScreen() {
    document.getElementById('app-screen')!.style.display = 'none';
    const confirmScreen = document.getElementById('confirm-screen');
    if (confirmScreen) {
      confirmScreen.style.display = 'flex';
    }
  }

  public static returnToAppAfterConfirmation() {
    document.getElementById('confirm-screen')!.style.display = 'none';
    document.getElementById('app-screen')!.style.display = 'flex';
  }

}
