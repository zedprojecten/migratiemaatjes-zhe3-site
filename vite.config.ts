import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import bkBron from "./bk-bron-plugin.mjs";

export default defineConfig({
  plugins: [bkBron(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
