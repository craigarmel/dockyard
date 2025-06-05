import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import env from 'dotenv'
env.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss() 
  ],
  base: process.env.BASE_URL_VITE || '/',
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
