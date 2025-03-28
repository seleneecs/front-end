export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://seleneecs.com',
      outDir: 'dist', // Ensure sitemap is placed in dist/
      routes: ['/', '/about', '/contact', '/login/register', '/resources'], // Add known routes
    }),
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    cors: {
      origin: ['https://seleneecs.com', 'http://localhost:5173'],  // Update to production front-end URL
      credentials: true,
    },
    allowedHosts: ['8ff6-154-159-237-44.ngrok-free.app'],  // Include your ngrok or production URL if needed
    proxy: {
      '/auth': 'https://api.seleneecs.com/auth',          // Proxy /auth routes to your production backend
      '/api': 'https://api.seleneecs.com/api',            // Proxy /api routes to your production backend
      '/subscriptions': 'https://api.seleneecs.com/subscriptions',  // Proxy /subscriptions routes to your production backend
    },
  },
  build: {
    minify: false, // Prevent minification issues
  },
});
