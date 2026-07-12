import 'tek-ms-ds/dist/style.css';
import './style.css';
import { Brain } from './Brain';
import { Seller } from './Seller';
import { AuthController } from './Domain/Auth/Controller';
import type { User } from './Domain/Auth/model';
import type { Login } from 'ms-login';
import {
  FOOTER_MASSAGE,
  getCurrentSeller,
  getTabbarInterface,
  MAMA_SOLUTION,
  MOBILE_MENU_INTERFACE,
  NAV_INTERFACE,
  renderPageMobile,
  renderWebPage,
} from './constants';
import { clearSession, getSession, saveSession } from './Domain/Auth/auth.db';
import type { SectionMenu } from 'tek-ms-menu';
import { ArticleController } from './Domain/Article/Controller';
import { SingletonBarket } from './SingletonBarket';
import type { CartItem } from 'tek-ms-barket';
import { ArticleBD } from './Domain/Article/IndexDB';
import { SingletonRecap } from './SingletonRecap';
import type { RenderInterfaceRecap } from 'tek-ms-recap';
import { SingletonConfirm } from './SingletonConfirm';
import type { RenderInterfaceConfirm } from 'tek-ms-confirm';
import { SingletonTabbar } from './SingletonTabbar';
import type { OrderDTO } from './Domain/Order/Model';
import { OrderController } from './Domain/Order/Controller';

const authController = new AuthController();
let currentLoginPage: Login | null = null;
let currentMenuMobilePage: SectionMenu | null = null;

const onLogin = async (email: string, password: string) => {
  try {
    const response = await authController.login({ email, password } as User);
    Seller.getInstance().setFromData(response);
    Seller.getInstance().setIsConnected(true);
    await saveSession(response);
    initApp();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    currentLoginPage?.showError(message);
  }
};

const onLogout = async () => {
  try {
    await authController.logout();
  } catch (err) {
    console.error('Erreur lors du logout:', err);
  } finally {
    await clearSession();
    Seller.getInstance().setIsConnected(false);
    initApp();
  }
};

const checkSession = async () => {
  const cached = await getSession();
  if (cached != null) {
    Seller.getInstance().setFromData(cached);
    Seller.getInstance().setIsConnected(true);
  }
};

export const initApp = async () => {
  await checkSession();

  if (Seller.getInstance().getIsConnected()) {
    Brain.getInstance().initialisation();
    ArticleController.getInstance().onUpdate(renderPageMobile);
    ArticleController.getInstance().syncFromBackend();

    Brain.getInstance().renderHeaderPage(
      MAMA_SOLUTION,
      getCurrentSeller(),
      onLogout,
      () => currentMenuMobilePage?.openSectionMenu(),
      () => ArticleController.getInstance().syncFromBackend()
    );

    SingletonTabbar.getInstance().render(getTabbarInterface());
    Brain.getInstance().renderNavpage(NAV_INTERFACE);

    currentMenuMobilePage = Brain.getInstance().renderMobileMenu(
      MOBILE_MENU_INTERFACE
    );

    SingletonBarket.getInstance().render({
      receiptNumber: '00482',
      receiptDate: new Date().toISOString(),
      onClickValidation: () => {
        SingletonRecap.getInstance().render({
          items: SingletonBarket.getInstance().getItems(),
          onCancel: () => console.log('vente confirmée'),
          onConfirm:async () => {
            const orderDTO: OrderDTO = {
              sellerName: Seller.getInstance().getName(),
              email: Seller.getInstance().getEmail(),
              saleDate: new Date().toISOString(),
              items: SingletonBarket.getInstance().getItems().map((item) => ({
                articleId: item.id,
                price: item.price,
                quantity: item.quantity,
              })),
            };
            await OrderController.getInstance().registerLocal(orderDTO);
            OrderController.getInstance().register();

            SingletonConfirm.showConfirmScreen();
            SingletonConfirm.getInstance().render({
              amount: SingletonRecap.getInstance().getTotal(),
              articles: SingletonRecap.getInstance().getItems().length, dailyTotal: 1000,
              onNewSale: () => {
                SingletonBarket.getInstance().resetItems();
                SingletonRecap.getInstance().onClose();
                SingletonTabbar.getInstance().render(getTabbarInterface());
                SingletonConfirm.returnToAppAfterConfirmation()
              }
            } as RenderInterfaceConfirm)
          }
        } as RenderInterfaceRecap);
      },
      onClickRemoveCard: (cart: CartItem) => {
        ArticleBD.getInstance().syncroStockById(cart.id, cart.quantity);
        renderWebPage();
        renderPageMobile();
      },
    });

    Brain.getInstance().renderFooterPage(
      document.querySelector<HTMLDivElement>('#screen-footer')!,
      FOOTER_MASSAGE
    );

    renderWebPage();
    renderPageMobile();
  } else {
    currentLoginPage = Brain.getInstance().renderLoginPage(onLogin);
  }
};
