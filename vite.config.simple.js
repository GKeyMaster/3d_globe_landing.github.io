import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simplified Vite config without complex plugins for Vercel compatibility
export default defineConfig({
  plugins: [react()],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/')
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          cesium: ['cesium']
        }
      }
    }
  },
  // Copy Cesium assets manually in build process
  publicDir: 'public'
})