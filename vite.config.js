import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Projetos-TOTVS/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tap: resolve(__dirname, 'tap.html'),
      },
    },
  },
});
