import type { ResolvedConfig } from "vite";
import type { GetParseCaseFunction, Log, Options } from "./type";
import { toCamelCase, toDashCase } from "./util";

export const getPluginOptions = (log: Log, config: any): Options => {
  log(`config: ${JSON.stringify(config)}`);
  return { root: config.root || "./" };
};

export const getParseCase = (config: ResolvedConfig): GetParseCaseFunction => {
  if (
    !config.css ||
    !config.css.modules ||
    !config.css.modules.localsConvention
  ) {
    return;
  }

  const { localsConvention } = config.css.modules;

  if (
    localsConvention === "camelCase" ||
    localsConvention === "camelCaseOnly"
  ) {
    return toCamelCase;
  } else if (
    localsConvention === "dashes" ||
    localsConvention === "dashesOnly"
  ) {
    return toDashCase;
  }
  return;
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
