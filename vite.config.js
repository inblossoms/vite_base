import { defineConfig, loadEnv } from "vite";
import viteBaseConfig from "./vite.base.config";
import viteProdConfig from "./vite.prod.config";
import viteDevConfig from "./vite.dev.config";

const envResolver = {
  build: () => Object.assign({}, viteBaseConfig, viteProdConfig),
  serve: () => Object.assign({}, viteBaseConfig, viteDevConfig),
};

export default defineConfig(({ command, mode }) => {
  const ENV = loadEnv(mode, process.cwd(), "");
  console.log("ENV --- :", ENV.ENV_KEY);
  return envResolver[command]();
});
