import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Explicitly set Vite to run on port 5173
    host: true, // Allow external connections, including ngrok
    strictPort: true, // Ensures Vite runs on 5173
    cors: {
      origin: ['http://localhost:5173'], // Allow localhost & ngrok
      credentials: true, // Allow cookies & authentication headers
    },
    allowedHosts: ['8cb0-105-29-166-71.ngrok-free.app'], // Explicitly allow ngrok domain
  },
});
