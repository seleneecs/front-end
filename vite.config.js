import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 👈 Explicitly set Vite to run on port 5173
    allowedHosts: ['456e-154-159-238-21.ngrok-free.app', "localhost"], // No need for http:// in allowedHosts
  },
})
