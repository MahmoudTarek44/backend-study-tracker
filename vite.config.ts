/// <reference types="vitest" />

import { defineConfig } from "vite";
import analog from "@analogjs/platform";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/backend-study-tracker/" : "/",
  build: {
    target: ["es2020"],
  },
  resolve: {
    mainFields: ["module"],
    dedupe: ["@angular/core"],
  },
  optimizeDeps: {
    exclude: ["@angular/cdk"],
  },
  plugins: [
    analog({
      ssr: false,
      prerender: {
        routes: [],
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
    include: ["**/*.spec.ts"],
    reporters: ["default"],
  },
}));
