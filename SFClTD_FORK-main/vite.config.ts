import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      // Proxying API requests to the Express.js server
      '/api': {
        target: 'http://localhost:5174', // Assuming your Express app runs on port 5174
        changeOrigin: true,
      },
    },
  }, 
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
