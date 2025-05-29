// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Srabon/', // make sure it's exactly your repo name with casing
  build: {
    sourcemap: true,  // ✅ Must be present
    outDir: 'dist'
  }
});

