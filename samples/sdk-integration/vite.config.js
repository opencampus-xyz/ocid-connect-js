import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const includeSampleBaseName =
    command === "build" && !process.env.STANDALONE_SAMPLE_BUILD;
  return {
    base: includeSampleBaseName ? "/routing/reach-router/" : "/",
    plugins: [react(), viteCommonjs()],
    define: {
      "process.env": {},
    },
    resolve: {
      alias: {
        "react-router-dom": path.resolve(
          __dirname,
          "node_modules/react-router-dom"
        ),
      },
    },
    server: {
      port: process.env.PORT || 8081,
    },
    preview: {
      port: process.env.PORT || 8081,
    },
    build: {
      rollupOptions: {
        // always throw with build warnings
        onwarn(warning, warn) {
          warn(
            '\nBuild warning happened, customize "onwarn" callback in vite.config.js to handle this error.'
          );
          throw new Error(warning);
        },
      },
    },
  };
});
