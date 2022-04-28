import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      pinia: path.resolve(__dirname, '../pinia/dist/pinia.mjs')
    }
  },
  plugins: [vue()]
})
