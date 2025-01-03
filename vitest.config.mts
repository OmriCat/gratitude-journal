/// <reference types="vitest" />

import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";
import tsconfigPaths from "vite-tsconfig-paths";

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
  })
);
