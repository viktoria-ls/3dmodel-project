import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Disable minification
    minify: false,
    // Disable chunk splitting
    chunkSizeWarningLimit: Infinity,
    // Disable CSS extraction (if you're using CSS)
    cssCodeSplit: false,
    // Setters to control asset generation
    assetsInlineLimit: 0,
    assetsDir: '',
  },
});