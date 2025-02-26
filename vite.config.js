import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 👈 Explicitly set Vite to run on port 5173
    host: 'localhost', // 👈 Allow connections from localhost
    cors: true, // 👈 Enable CORS for all origins
  },
});