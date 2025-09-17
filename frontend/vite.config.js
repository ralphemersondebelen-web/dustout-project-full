import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ensures assets load correctly on Netlify
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['*'], // needed for ngrok/local dev
  },
})