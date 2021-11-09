<h1 align="center">ts-css-modules-vite-plugin ⚡ Welcome 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/ts-css-modules-vite-plugin/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# ts-css-modules-vite-plugin

Read the definition of `vite.config.ts` and resolve the `CSS Modules` type.
Supports `sass`.

## Install

```bash
npm i -D ts-css-modules-vite-plugin
```

## Add it to the `tsconfig.json`

```json
{
  "compilerOptions": {
    ...
    "plugins": [{"name": "ts-css-modules-vite-plugin"}]
  },
}
```

## Resolve the `vite.config.ts`

Resolve the `preprocessorOptions` setting within the plugin.

```ts
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as common;`,
        importer(...args) {
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
});
```
