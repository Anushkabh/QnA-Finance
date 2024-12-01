

// https://vitejs.dev/config/


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://qna-finance-1.onrender.com/', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
