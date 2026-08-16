// Client-only build used for the Android (Capacitor) package.
// Output goes to `www/`, which Capacitor copies into the APK / AAB.
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: ".",
  base: "./",
  plugins: [tsConfigPaths(), react(), tailwindcss()],
  build: {
    outDir: "www",
    emptyOutDir: true,
    rollupOptions: {
      input: "mobile/index.html",
    },
  },
});
