<h1 align="center">ts-css-modules-vite-plugin ⚡ Welcome 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/ts-css-modules-vite-plugin/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# ts-css-modules-vite-plugin

Read the definition of `vite.config.ts` and resolve the `CSS Modules` type.
Supports `sass`.

## Demo

<img src="https://user-images.githubusercontent.com/39351982/141417812-4b4b3963-897f-4dce-840d-a0bb04a82bd1.gif" width="600" />

## Install

```bash
npm i -D ts-css-modules-vite-plugin
```

## Options

| Parameter | Type   | Description                                                                            |
| --------- | ------ | -------------------------------------------------------------------------------------- |
| root      | string | Set the relative path from the project root to the 'vite.config.ts' file. (default ./) |

## Add it to the `tsconfig.json`

```json
{
  "compilerOptions": {
    ...
    "plugins": [{"name": "ts-css-modules-vite-plugin", "root": "./"}]
  },
}
```

## Resolve the `vite.config.ts`

Resolve the `preprocessorOptions` setting within the plugin.

```ts
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

## Using VS Code

The VScode typescript version needs to match the project.
Set the following.

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Use the workspace version.
![スクリーンショット 2022-12-23 23 20 51](https://user-images.githubusercontent.com/39351982/209350906-4eaef407-6a69-49b0-99a7-43ccd46c449e.png)
