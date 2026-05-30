import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We register the SW ourselves in main.jsx so we can add periodic +
      // on-focus update checks (a phone keeps the PWA backgrounded, so the
      // default "check on full launch" almost never fires).
      injectRegister: false,
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'קורות — CV Builder',
        short_name: 'קורות',
        description: 'מחולל קורות חיים מתקדם',
        theme_color: '#A8542C',
        background_color: '#F6F2EB',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})
