import { defineConfig } from 'vite'
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
  ],
})
