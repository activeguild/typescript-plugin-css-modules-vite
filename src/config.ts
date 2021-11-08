import { readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { register } from "ts-node";

export const getViteConfig = (dirName: string) => {
  const service = register({ transpileOnly: true });
  const filePath = path.resolve(dirName, "../vite.config.ts");
  const src = readFileSync(filePath);
  const outputFilePath = path.resolve(path.dirname(filePath), "vite.config.js");

  const compiledTs = service.compile(src.toString(), "vite.config.ts");
  writeFileSync(outputFilePath, compiledTs);
  const config = require("../vite.config.js").default;
  unlinkSync(outputFilePath);
  return config;
};

console.log("getCssOptions() :>> ", getViteConfig(__dirname));
