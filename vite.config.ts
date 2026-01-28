import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [viteSolid()],
});
