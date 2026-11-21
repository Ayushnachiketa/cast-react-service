import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Calls to /api/... are forwarded to the Spring Boot auth-service.
    // This avoids CORS errors during development.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
