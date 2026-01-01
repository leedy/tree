import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    host: true,
    allowedHosts: [
      '.int.notesin9.com',
      '.notesin9.com',
      'treeonatruck.com',
      'localhost',
      '127.0.0.1',
      '192.168.1.20'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  }
});
