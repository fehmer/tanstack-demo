import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 3210,
  },
  plugins: [viteSolid()],
});
