import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige las llamadas a /api hacia el backend de Express (evita problemas de CORS)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
