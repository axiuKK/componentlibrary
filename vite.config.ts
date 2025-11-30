import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // 可以直接使用 test/expect
    environment: "jsdom",   // 模拟浏览器环境
  }
}as any)
