import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['456e-154-159-238-21.ngrok-free.app', "http://localhost:5173"], // Add your ngrok domain here
  },
})
