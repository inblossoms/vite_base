import { defineConfig } from "vite"; // 开启vite配置文件语法提示

export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/index.html",
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
