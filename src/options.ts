import type { ResolvedConfig } from "vite";

export const getPreprocessorOptions = (config: ResolvedConfig) => {
  let additionalData, includePaths, importer;

  if (
    !config.css ||
    !config.css.preprocessorOptions ||
    !config.css.preprocessorOptions.scss
  ) {
    return { additionalData, includePaths, importer };
  }

  return config.css.preprocessorOptions.scss;
};
