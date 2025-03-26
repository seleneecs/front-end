import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://seleneecs.com',
      outDir: 'dist', // Ensure sitemap is placed in dist/
      routes: ['/', '/about', '/contact', '/dashboard', '/resources'], // Add known routes
    }),
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    cors: {
      origin: ['http://localhost:5173'],
      credentials: true,
    },
    allowedHosts: ['8ff6-154-159-237-44.ngrok-free.app'],
  },
  build: {
    minify: false, // Prevent minification issues
  },
});
