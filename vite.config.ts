import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Create an alias '@' that points to the 'src' directory
      // This allows imports like import Button from '@/components/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },
});