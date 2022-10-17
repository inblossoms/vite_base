import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          console.log(id);
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
    viteCompression(),
  ],
});
