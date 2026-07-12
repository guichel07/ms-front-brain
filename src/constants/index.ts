import type { Profil } from 'tek-ms-header/dist/model';
import { Seller } from '../Seller';
import type { RenderTabbarInterface } from 'tek-ms-tabbar';
import type { RenderNavInteface } from 'tek-ms-nav';
import { Brain } from '../Brain';
import type { RenderInterfaceSectionMenu } from 'tek-ms-menu';
import { Catalog, type RenderInterface } from 'tek-ms-catalog';
import { mockedCategories } from '../__mocks__';
import { ArticleController } from '../Domain/Article/Controller';
import type { ArticleDTO } from '../Domain/Article/Model';
import type { Article } from 'tek-ms-catalog/dist/model';
import { SingletonBarket } from '../SingletonBarket';
import type { CartItem } from 'tek-ms-barket';
import { SingletonCatalog } from '../SingletonCatalog';

export const FOOTER_MASSAGE = `© Maman Solution — Gestion des ventes simplifiée`;
export const API_URL_AUTH = 'http://localhost:8080/ms-auth';
export const API_URL_ARTICLES = 'http://localhost:8081/articles';
export const API_URL_ORDERS = 'http://localhost:8081/orders';

export function getCurrentSeller(): Profil {
  return {
    name: Seller.getInstance().getName(),
    role: Seller.getInstance().getRole(),
    svgAvatar: Seller.getInstance().getSvgAvatar(),
    tag: Seller.getInstance().getTag(),
    dailySalesTotal: 1000,
  };
}

export const MAMA_SOLUTION = {
  firstName: 'Maman',
  secondName: 'Solution',
  icone: `
  <svg viewBox="0 0 100 100">
    <path d="M26 66 L26 36 L41 58 L50 38 L59 58 L74 36 L74 66"
          stroke="#FF6B35" stroke-width="10" fill="none"
          stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="25" r="7" fill="#FF6B35"/>
  </svg>`,
};

export function getTabbarInterface(): RenderTabbarInterface {
  return {
    productsLabel: Brain.getInstance().getCurrentPageMobile(),
    cartLabel: 'Panier',
    cartCount: 0,
    showTab: (tabName: string) => console.log(tabName),
    onclickPanier: () => {
      const cart = document.body.querySelector('#panel-cart')!;
      if (cart.classList.contains('visible')) return;

      document.body
        .querySelector('#panel-products')!
        .classList.remove('visible');
      cart.classList.add('visible');
    },
    onclickProduits: () => {
      const products = document.body.querySelector('#panel-products')!;
      if (products.classList.contains('visible')) return;

      document.body.querySelector('#panel-cart')!.classList.remove('visible');
      products.classList.add('visible');
    },
  } as RenderTabbarInterface;
}

export function renderCatalogueArticles(produits: ArticleDTO[]): void {
  const panel = document.body.querySelector<HTMLDivElement>('#panel-products')!;
  const cataloguePage = new Catalog(panel);
  cataloguePage.render({
    categories: mockedCategories,
    produits,
    callback: (_article: Article) => {
      Brain.getInstance().setCurrentArticle(_article);
      console.log();
      SingletonBarket.getInstance().addToCart(
        Brain.getInstance().getCurrentArticle() as CartItem
      );
    },
  } as RenderInterface);
}

async function renderPanel(pageKey: string): Promise<void> {
  const panel = document.body.querySelector<HTMLDivElement>('#panel-products')!;

  switch (pageKey) {
    case 'Catalogue': {
      const produits = await ArticleController.getInstance().getLocalAll();
      SingletonCatalog.renderCatalogueArticles(produits);
      break;
    }
    case 'Commandes':
      panel.innerHTML = `<div>Commandes</div>`;
      break;
    case 'Clients':
      panel.innerHTML = `<div>Clients</div>`;
      break;
    case 'Paramètres':
      panel.innerHTML = `<div>Paramètres</div>`;
      break;
    default:
      panel.innerHTML = `<div>Catalogue</div>`;
  }

  document.body
    .querySelector('#body-wrap')
    ?.classList.toggle('no-cart', pageKey !== 'Catalogue');
}

export function renderWebPage() {
  renderPanel(Brain.getInstance().getCurrentPageWeb());
}

export function renderPageMobile() {
  renderPanel(Brain.getInstance().getCurrentPageMobile());
  Brain.getInstance().renderTabbarPage(getTabbarInterface());
}

export const NAV_INTERFACE: RenderNavInteface = {
  navItems: ['Catalogue', 'Commandes', 'Clients', 'Paramètres'],
  activeItem: 'Catalogue',
  onTabChange: (currentPageWeb: string) => {
    Brain.getInstance().setCurrentPageWeb(currentPageWeb);
    renderWebPage();
  },
};

export const MOBILE_MENU_INTERFACE = {
  sections: [
    { key: 'Catalogue', label: 'Catalogue' },
    { key: 'Commandes', label: 'Commandes' },
    { key: 'Clients', label: 'Clients' },
    { key: 'Paramètres', label: 'Paramètres' },
  ],
  activeKey: Brain.getInstance().getCurrentPageMobile(),
  onSelect: (key) => {
    Brain.getInstance().setCurrentPageMobile(key);
    renderPageMobile();
    document.querySelector('#section-overlay')!.classList.remove('show');
  },
} as RenderInterfaceSectionMenu;
