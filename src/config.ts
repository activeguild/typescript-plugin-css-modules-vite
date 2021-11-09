import { readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { register } from "ts-node";
import { Log } from "./type";

export const getViteConfig = (log: Log, dirName: string) => {
  const service = register({ transpileOnly: true });
  log(`dirName${dirName}`);
  const filePath = path.resolve(dirName, "./vite.config.ts");
  log(`filePath${filePath}`);
  const src = readFileSync(filePath);
  const outputFilePath = path.resolve(__dirname, "vite.config.js");

  const compiledTs = service.compile(src.toString(), "vite.config.ts");
  writeFileSync(outputFilePath, compiledTs);
  const config = require("./vite.config.js").default;
  unlinkSync(outputFilePath);
  return config;
};
