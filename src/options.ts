import type { ResolvedConfig } from "vite";
import type { Log, Options } from "./type";

export const getPluginOptions = (log: Log, config: any): Options => {
  log(`config: ${JSON.stringify(config)}`);
  return { root: config.root || "./" };
};

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
