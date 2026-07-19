import 'tek-ms-ds/dist/style.css';
import './style.css';
import { AppEvent } from "./constants";
import { EventBus } from "./EventBus";
import { LoginPage } from "./Presentation/Pages/LoginPage";
import { Seller } from './Domain/Seller';
import { AuthController } from './Domain/Auth/Controller';
import { AppAssembler } from './Presentation/AppAssembler';
import { HeaderViewManager } from './Presentation/components/HeaderViewManager';
import { FooterViewManager } from './Presentation/components/FooterViewManager';
import { TabbarViewManager } from './Presentation/components/TabbarViewManager';
import { NavbarViewManager } from './Presentation/components/NavbarViewManager';
import { MobileNavigationManager } from './Presentation/components/MobileNavigationManager';
import { CatalogPage } from './Presentation/Pages/CatalogPage';
import { BarketViewManager } from './Presentation/components/BarketViewManager';
import { ArticleController } from './Domain/Article/Controller';
import { RecapViewManager } from './Presentation/components/RecapViewManager';
import { AddItemSheetManager } from './Presentation/components/AddItemSheetManager';
import { OrderController } from './Domain/Order/Controller';
import { ConfirmViewManager } from './Presentation/components/ConfirmViewManager';
import { DailySalesController } from './Domain/DailySales/Controller';

AuthController.init();
LoginPage.init();
AppAssembler.init();
HeaderViewManager.init();
TabbarViewManager.init();
NavbarViewManager.init();
FooterViewManager.init();
MobileNavigationManager.init();
CatalogPage.init();
ArticleController.init();
BarketViewManager.init();
RecapViewManager.init();
AddItemSheetManager.init();
OrderController.init();
ConfirmViewManager.init();
DailySalesController.init();

await AuthController.getInstance().checkLocalSession()
if (!Seller.getInstance().getIsConnected()) {
  EventBus.getInstance().emit(AppEvent.NotConnected, undefined);
} else {
  EventBus.getInstance().emit(AppEvent.Connected, Seller.getInstance());
  OrderController.getInstance().register();
}
