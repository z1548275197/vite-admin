import { defineConfig, normalizePath } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path';
import { fileURLToPath } from 'url'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteCompression(),
  ],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // entryFileNames: 'static/[name].[hash].js',
        // chunkFileNames: 'static/[name].[hash].js',
        // assetFileNames: 'static/[name].[hash].[ext]',
        chunkFileNames: 'mis_static/js/[name].[hash].js',
        entryFileNames: 'mis_static/js/[name].[hash].js',
        assetFileNames: 'mis_static/[ext]/[name].[hash].[ext]',
      },
    },
  },
})
