import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build`        -> pasta dist/ (para hospedar, ex.: GitHub Pages)
// `npm run build:single` -> standalone/index.html (um único arquivo que abre com duplo clique)
export default defineConfig(({ mode }) => {
  const single = mode === "single";
  return {
    base: "./",
    plugins: [react(), ...(single ? [viteSingleFile()] : [])],
    build: { outDir: single ? "standalone" : "dist" },
  };
});
