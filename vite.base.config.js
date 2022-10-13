import { defineConfig } from "vite"; // 开启vite配置文件语法提示

export default defineConfig({
  envPrefix: "ENV_", // 配置vite注入env变量客户端环境前缀校验
  optimizeDeps: {
    exclude: [],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: "local",
      scopeBehaviour: "local",
      hashPrefix: "inblossoms",
      // globalModulePaths: ["./src/css/box.module.less"],
    },
    preprocessorOptions: {
      less: {
        math: "always",
        globalVars: {
          mainBackColor: "#008c8c50",
          mainFont: "18px",
        },
      },
    },
    devSourcemap: true,
  },
});
