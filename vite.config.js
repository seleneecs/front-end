import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://seleneecs.com',
      outDir: 'dist',
      routes: ['/', '/about', '/contact', '/login/register', '/resources'],
    }),
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    cors: {
      origin: ['https://seleneecs.com', 'http://localhost:5173'],
      credentials: true,
    },
  },
  build: {
    minify: false,
  },
});
