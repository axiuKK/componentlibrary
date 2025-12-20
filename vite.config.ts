/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html", // 输出文件
      open: true, // 打包完成自动打开浏览器
      gzipSize: true, // 显示压缩后的体积
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom", // 模拟浏览器环境
    include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.tsx"], // 单元测试文件
    exclude: ["**/*.stories.tsx"], // 排除 Story 文件
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
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
