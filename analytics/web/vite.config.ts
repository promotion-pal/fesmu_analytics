import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],

  preview: {
    host: true,
    port: 4173,
    allowedHosts: ["fesmu.promotion-pal.ru", "localhost", "127.0.0.1"],
  },
});
