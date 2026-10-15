import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customers': 'http://localhost:8007',
      '/products': 'http://localhost:8007',
      '/wishlist': 'http://localhost:8007',
      '/cart': 'http://localhost:8007',
      '/orders': 'http://localhost:8007',
    },
  },
})
