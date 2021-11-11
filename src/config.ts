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

  const compiledTs = service.compile(
    replaceDirName(log, src, dirName),
    "vite.config.ts"
  );
  writeFileSync(outputFilePath, compiledTs);
  const config = require("./vite.config.js").default;
  unlinkSync(outputFilePath);
  return config;
};

export const replaceDirName = (log: Log, src: Buffer, dirName: string) => {
  const replaceDirName = src.toString().replace("__dirname", `"${dirName}"`);
  log(`replacedFunc: ${replaceDirName}`);

  return replaceDirName;
};
