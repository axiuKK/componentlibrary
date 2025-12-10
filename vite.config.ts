/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom", // 模拟浏览器环境
    include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.tsx"], // 单元测试文件
    exclude: ["**/*.stories.tsx"], // 排除 Story 文件
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyUI",
      fileName: "my-ui",
    },
    rollupOptions: {
      // 不把 react 打进包，交给使用者
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
