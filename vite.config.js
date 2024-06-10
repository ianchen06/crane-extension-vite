import { defineConfig } from "vite";
import { resolve } from "path";
import hotReloadExtension from "hot-reload-extension-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    hotReloadExtension({
      log: true,
      backgroundPath: "src/entrypoints/background/index.js",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/entrypoints/background/index.js"),
        content: resolve(__dirname, "src/entrypoints/content/index.js"),
        popup: resolve(__dirname, "src/entrypoints/popup/index.html"),
      },
      output: {
        dir: "dist",
        entryFileNames: "src/entrypoints/[name]/index.js",
        chunkFileNames: "assets/js/[name].js",
      },
    },
  },
});
