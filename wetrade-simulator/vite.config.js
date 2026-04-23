import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep asset filenames stable so cached links don't break
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
