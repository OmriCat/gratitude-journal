/// <reference types="vitest" />

import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      include: ["./tests/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    },
    plugins: [tsconfigPaths()],
  }),
);
