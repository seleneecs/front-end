import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['e5d5-154-159-254-66.ngrok-free.app'], // Add your ngrok domain here
  },
})
