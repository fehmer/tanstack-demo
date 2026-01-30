import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [viteSolid(), devtools()],
});
