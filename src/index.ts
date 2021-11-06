import * as ts from "typescript/lib/tsserverlibrary";
import { getCssOptions } from "./config";

const factory: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  const pluginModule: ts.server.PluginModule = {
    create,
  };
  return pluginModule;
};

const create = (info: ts.server.PluginCreateInfo): ts.LanguageService => {
  const ls = info.languageService;
  let css: any;
  getCssOptions().then((_css) => (css = _css));

  // オリジナルのメソッドを退避しておく
  const delegate = ls.getQuickInfoAtPosition;

  // tooltip用のメソッドを上書き
  ls.getQuickInfoAtPosition = (fileName: string, position: number) => {
    const result = delegate(fileName, position); // 元メソッドを呼び出す
    if (!result) {
      return result;
    }
    if (!result.displayParts || !result.displayParts.length) {
      return result;
    }
    // 結果を修正する
    result.displayParts = [
      { kind: "", text: " 🎉🎉 " },
      ...result.displayParts,
      { kind: "", text: JSON.stringify(css) },
    ];
    return result;
  };

  return ls;
};

export = factory;
