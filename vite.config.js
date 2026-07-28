/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes Vite on your local network (0.0.0.0)
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Forwards all /api requests to your Express server
        changeOrigin: true,
      },
    },
  },
})
