import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    // ...tes autres plugins existants
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        id: '/',
        name: 'Mama Solution',
        short_name: 'MamaSolution',
        description: 'Application de gestion de ventes',
        theme_color: '#B6481E',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        screenshots: [
          {
            src: 'screenshots/desktop.png',
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'screenshots/mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        // Stratégie de cache pour les appels API (adapte les patterns à tes routes réelles)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/mama-solution\.duckdns\.org\/(articles|orders)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
