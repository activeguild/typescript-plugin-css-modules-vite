import sass from "sass";
import type { ResolvedConfig } from "vite";
import { getPreprocessorOptions } from "./options";
import { AdditionalData, Log } from "./type";

const SPLIT_STR = `/* vite-plugin-sass-dts */\n`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadedSassPreprocessor: any;

export const parseCss = (
  log: Log,
  file: string,
  fileName: string,
  config: ResolvedConfig
): string => {
  // const sass = loadSassPreprocessor(config);

  const options = getPreprocessorOptions(config);
  const resolveFn = config.createResolver({
    extensions: [".scss", ".sass", ".css"],
    mainFields: ["sass", "style"],
    tryIndex: true,
    tryPrefix: "_",
    preferRelative: true,
  });

  const internalImporter: sass.Importer = (url, importer, done) => {
    resolveFn(url, importer).then((resolved) => {
      if (resolved) {
        new Promise<sass.ImporterReturnType>(function (resolve) {
          resolve({ file: resolved });
        })
          .then(done)
          .catch(done);
      } else {
        done && done(null);
      }
    });
  };

  const finalImporter = [internalImporter];

  if (options.importer) {
    Array.isArray(options.importer)
      ? finalImporter.push(...options.importer)
      : finalImporter.push(options.importer);
  }

  log(
    `getData(file, fileName, options.additionalData):${getData(
      file,
      fileName,
      options.additionalData
    )}`
  );

  const result = sass.renderSync({
    ...options,
    data: getData(file, fileName, options.additionalData),
    file: fileName,
    includePaths: options.includePaths,
    importer: finalImporter,
  });

  log(`result.css.toString():${result.css.toString()}`);

  return result.css.toString();
};

const getData = (
  data: string,
  filename: string,
  additionalData?: AdditionalData
): string => {
  if (!additionalData) return `\n${SPLIT_STR}${data}`;
  if (typeof additionalData === "function") {
    return additionalData(`\n${SPLIT_STR}${data}`, filename);
  }
  return `${additionalData}\n${SPLIT_STR}${data}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const loadSassPreprocessor = (config: ResolvedConfig): any => {
//   try {
//     if (loadedSassPreprocessor) {
//       return loadedSassPreprocessor;
//     }
//     const fallbackPaths = require.resolve.paths?.("sass") || [];
//     const resolved = require.resolve("sass", {
//       paths: [config.root, ...fallbackPaths],
//     });
//     return (loadedSassPreprocessor = require(resolved));
//   } catch (e) {
//     throw new Error(
//       `Preprocessor dependency 'sass' not found. Did you install it?`
//     );
//   }
// };
