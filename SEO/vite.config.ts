import viteCompression from "vite-plugin-compression";
import importToCDN from "vite-plugin-cdn-import";
import checker from "vite-plugin-checker";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          console.log("dist dir file:", id);
          if (id.includes("node_modules")) {
            return "vender";
          }
        },
      },
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
    viteCompression(), //
    importToCDN({
      modules: [
        {
          name: "lodash",
          var: "_",
          path: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`,
        },
      ],
    }),
  ],
});
