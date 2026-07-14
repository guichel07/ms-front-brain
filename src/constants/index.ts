export const FOOTER_MASSAGE = `© Maman Solution — Gestion des ventes simplifiée`;
export const API_URL_AUTH = 'http://localhost:8080/ms-auth';
export const API_URL_ARTICLES = 'http://localhost:8081/articles';
export const API_URL_ORDERS = 'http://localhost:8081/orders';

/**
 * Liste centrale de tous les événements de l'application.
 * Convention de nommage : "domaine:action" (toujours au présent ou au participe passé,
 * jamais au futur — l'événement dit ce qui VIENT DE se passer).
 */
export const AppEvent = {
  // --- Authentification ---
  NotConnected: 'auth:not-connected', // émis au tout début de l'app si personne n'est connecté
  Connected: 'auth:connected', // émis juste après une connexion réussie
  Disconnected: 'auth:disconnected', // émis après un logout

  // --- Navigation (tabbar / menu) ---
  TabChanged: 'nav:tab-changed', // émis au clic sur un onglet (catalogue / commandes / réglages)
  MenuOpened: 'menu:opened',
  MenuItemSelected: 'menu:item-selected',

  NavItemSelected: 'nav:item-selected',

  AddSheetValided: 'addSheet:validated',

  // 1er emit : données locales déjà en cache
  ArticlesSynced: 'article:articles-synced', // 2e emit : données fraîches du backend

  // --- Catalogue ---
  ArticleClicked: 'article:clicked', // émis au clic sur une carte produit du catalogue
  ArticleStockSynced: 'article:stock-synced',
  ArticlesLoaded: 'article:articles-loaded',

  // --- Panier ---
  CartItemAdded: 'cart:item-added', // émis quand un article est ajouté au panier
  CartItemRemoved: 'cart:item-removed', // émis quand un article est retiré du panier
  CartValidated: 'cart:validated', // émis au clic sur "Valider la vente"

  // --- Récapitulatif / vente ---
  SaleConfirmed: 'sale:confirmed', // émis au clic sur "Confirmer la vente" dans le récap
  SaleRegistered: 'sale:registered', // émis une fois la commande enregistrée (IndexedDB + backend)
  SaleNew: 'sale:new', // émis au clic sur "Nouvelle vente" depuis l'écran de confirmation

  DailyTotalUpdated: 'sale:daily-total-updated',
  DailyTotalChanged: 'sale:daily-total-changed',
} as const;
