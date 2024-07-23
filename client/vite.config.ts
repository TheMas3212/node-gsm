import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5443,
    https: {
      cert: './certs/cert.pem',
      key: './certs/key.pem'
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['/logo.png'],
      manifest: {
        name: 'SimpleCast',
        start_url: "/",
        short_name: 'SimpleCast',
        description: 'Web-based Broadcasting Software Suite',
        theme_color: '#031c36',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
