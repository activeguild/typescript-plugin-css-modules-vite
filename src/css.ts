import sass from "sass";
import type { ResolvedConfig } from "vite";
import { getPreprocessorOptions } from "./options";
import { AdditionalData, Log } from "./type";

export const parseCss = (
  log: Log,
  file: string,
  fileName: string,
  config: ResolvedConfig
): string => {
  const options = getPreprocessorOptions(config);

  const finalImporters = [];
  if (options.importer) {
    Array.isArray(options.importer)
      ? finalImporters.push(...options.importer)
      : finalImporters.push(options.importer);
  }

  log(
    `getData(file, fileName, options.additionalData): ${getData(
      file,
      fileName,
      options.additionalData
    )}`
  );
  log(`finalImporter:${finalImporters}`);

  const result = sass.renderSync({
    ...options,
    data: getData(file, fileName, options.additionalData),
    file: fileName,
    includePaths: options.includePaths,
    importer: finalImporters,
  });

  log(`result.css.toString(): ${result.css.toString()}`);

  return result.css.toString();
};

const getData = (
  data: string,
  filename: string,
  additionalData?: AdditionalData
): string => {
  if (!additionalData) return `\n${data}`;
  if (typeof additionalData === "function") {
    return additionalData(`\n${data}`, filename);
  }
  return `${additionalData}\n${data}`;
};
