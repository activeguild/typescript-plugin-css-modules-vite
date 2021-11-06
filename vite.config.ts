// import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as common;`,
        // [Sample]
        // additionalData: (content: string, path: string): string => {
        //   return [
        //     '@use "@/styles" as common;',
        //     content,
        //   ].join('\n');
        // },
        importer(...args: string[]) {
          if (args[0] !== "@/styles") {
            return;
          }

          return {
            file: `${path.resolve(__dirname, "./src/assets/styles")}`,
          };
        },
      },
    },
  },
  // plugins: [react()],
});
