import { Login } from 'ms-login';
import type { Article } from 'tek-ms-catalog/dist/model';
import { Footer } from 'tek-ms-footer';
import { Header } from 'tek-ms-header';
import type { Entreprise, Profil } from 'tek-ms-header/dist/model';
import { SectionMenu, type RenderInterfaceSectionMenu } from 'tek-ms-menu';
import { Nav, type RenderNavInteface } from 'tek-ms-nav';
import { Tabbar, type RenderTabbarInterface } from 'tek-ms-tabbar';

export class Brain {
  private static instance: Brain | null = null;
  private currentPageWeb: string = 'Catalogue';
  private currentPageMobile: string = 'Catalogue';
  private currentArticle: Article | null = null;

  private constructor() {}

  public static getInstance(): Brain {
    if (!Brain.instance) {
      Brain.instance = new Brain();
    }
    return Brain.instance;
  }

  getCurrentArticle() {
    return this.currentArticle;
  }
  setCurrentArticle(_article: Article) {
    this.currentArticle = _article;
  }
  setCurrentPageMobile(_currentPageMobile: string) {
    this.currentPageMobile = _currentPageMobile;
  }

  getCurrentPageMobile() {
    return this.currentPageMobile;
  }

  setCurrentPageWeb(navCategory: string) {
    this.currentPageWeb = navCategory;
  }

  getCurrentPageWeb() {
    return this.currentPageWeb;
  }

  showTab(tabName: string): void {
    const productsPanel =
      document.body.querySelector<HTMLElement>('#panel-products');
    const cartPanel = document.body.querySelector<HTMLElement>('#panel-cart');

    productsPanel?.classList.toggle('visible', tabName === 'products');
    cartPanel?.classList.toggle('visible', tabName === 'cart');
  }

  initialisation() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div id="app-screen">
          <div class="screen-header" id="screen-header"></div>
          <div class="screen-tabbar" id="screen-tabbar"></div>
          <div class="body-wrap" id="body-wrap">
            <div id="screen-nav"></div>
            <main
              class="tab-panel visible catalog-area"
              id="panel-products"
            ></main>
            <div id="panel-cart-contenair"></div>
          </div>
          <div id="menu-mobile"></div>
          <div id="add-overlay-container"></div>
          <div id="container-recap-overlay"></div>
          <div class="screen-footer" id="screen-footer"></div>
        </div>
        <div id="container-confirm-screen"></div>
    `;
  }

  public renderLoginPage(
    onLogin: (username: string, password: string) => void
  ) {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = '';
    const loginPage = new Login(
      document.querySelector<HTMLDivElement>('#app')!
    );
    loginPage.render({ onLogin });
    return loginPage;
  }

  public renderHeaderPage(
    mamaSolution: Entreprise,
    profil: Profil,
    logout: () => void,
    openSectionMenu: () => void,
    onClickSyncroButton: () => void
  ) {
    const headerPage = new Header(
      document.querySelector<HTMLDivElement>('#screen-header')!
    );
    headerPage.render(
      mamaSolution,
      profil,
      logout,
      openSectionMenu,
      onClickSyncroButton
    );
  }

  public renderFooterPage(footerContainer: HTMLElement, text: string) {
    new Footer(footerContainer).render(text);
  }

  public renderTabbarPage(tabbarInterface: RenderTabbarInterface) {
    const tabbarContainer = new Tabbar(
      document.querySelector<HTMLDivElement>('#screen-tabbar')!
    );
    tabbarContainer.render(tabbarInterface);
  }

  public renderNavpage(navInterface: RenderNavInteface) {
    const navContainer = new Nav(
      document.querySelector<HTMLDivElement>('#screen-nav')!
    );
    navContainer.render(navInterface);
  }

  public renderMobileMenu(mobileMenuInterface: RenderInterfaceSectionMenu) {
    const menuContainer = new SectionMenu(
      document.querySelector<HTMLDivElement>('#menu-mobile')!
    );
    menuContainer.render(mobileMenuInterface);
    return menuContainer;
  }
}
