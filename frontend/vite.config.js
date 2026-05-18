import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration - proxies /api requests to the Node.js backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Redirect all /api/* requests to the Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
