import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import { createHtmlPlugin } from 'vite-plugin-html';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy(),
    createHtmlPlugin({ minify: true })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({ add: true }),
      ],
    }
  }
});
