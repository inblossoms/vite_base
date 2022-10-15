import { defineConfig } from "vite"; // 开启vite配置文件语法提示
// import path from "path";
import { ViteAliases } from "vite-aliases";

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
    // postcss: {}, 这里配置 postcss 的优先级会高于描述文件
  },
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //     "@assets": path.resolve(__dirname, "./src/assets"),
  //   },
  // },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "[name].[hash].[ext]",
      },
    },
    assetsInlineLimit: 4096,
    outDir: "dist",
    assetsDir: "static",
  },
  plugins: [ViteAliases()],
});
