import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'

// Note: vite-plugin-top-level-await is not compatible with Vite 8 (uses rolldown instead of rollup).
// Vite 8 handles top-level await natively via rolldown.
export default defineConfig({
  plugins: [vue(), wasm()],
})
