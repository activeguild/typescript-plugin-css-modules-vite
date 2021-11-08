import path from "path";
import postcss from "postcss";
import postcssJs from "postcss-js";
import ts from "typescript/lib/tsserverlibrary";
import { ResolvedConfig } from "vite";
import { parseCss } from "./css";
import { extractClassNameKeys } from "./extract";
import { getViteConfig } from "./sample";
// import { CSS } from "./type";
import { isCSSFile } from "./util";

// resolve vite.config.ts

const factory: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  const create = (info: ts.server.PluginCreateInfo): ts.LanguageService => {
    const config: ResolvedConfig | undefined = getViteConfig(__dirname);

    const ls = info.languageService;
    const lsh = info.languageServiceHost;

    const formatExportType = (key: string) => `  readonly '${key}': '${key}';`;

    // オリジナルのメソッドを退避しておく
    const delegate = {
      getQuickInfoAtPosition: ls.getQuickInfoAtPosition,
      createLanguageServiceSourceFile:
        mod.typescript.createLanguageServiceSourceFile,
      updateLanguageServiceSourceFile:
        mod.typescript.updateLanguageServiceSourceFile,
      resolveModuleNames: lsh.resolveModuleNames,
    };
    const log = (logText: string) =>
      info.project.projectService.logger.info(logText);

    for (const __fileNmae of info.languageServiceHost.getScriptFileNames()) {
      log(`😱${__fileNmae}`);
    }
    // tooltip用のメソッドを上書き
    ls.getQuickInfoAtPosition = (fileName: string, position: number) => {
      const result = delegate.getQuickInfoAtPosition(fileName, position); // 元メソッドを呼び出す
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
        { kind: "", text: " 🎉🎉 " },
      ];
      return result;
    };

    mod.typescript.createLanguageServiceSourceFile = (
      fileName,
      scriptSnapshot,
      scriptTarget,
      version,
      setNodeParents,
      scriptKind
    ): ts.SourceFile => {
      // Info 90   [14:28:05.533] fileName😅/Users/JG20033/Documents/projects/ts-css-modules-vite-plugin/example/src/hoge/hoge.module.css

      if (isCSSFile(fileName)) {
        log(`fileName😅${fileName}`);
        log(`config${config}`);
        if (config) {
          let css = scriptSnapshot.getText(0, scriptSnapshot.getLength());
          log(`css${css}`);

          if (fileName.endsWith(".css")) {
          } else {
            try {
              css = parseCss(css, fileName, config);
            } catch (e) {
              log(`css${e}`);
            }
          }
          const classNameKeys = extractClassNameKeys(
            postcssJs.objectify(postcss.parse(css))
          );

          let exportTypes = "",
            exportClassNames = "export type ClassNames = ";
          const exportStyle = "export default classNames;";
          for (const classNameKey of classNameKeys.keys()) {
            exportTypes = `${exportTypes}\n${formatExportType(classNameKey)}`;
            exportClassNames =
              exportClassNames !== "export type ClassNames = "
                ? `${exportClassNames} | '${classNameKey}'`
                : `${exportClassNames} '${classNameKey}'`;
          }

          let outputFileString = "";
          outputFileString = `declare const classNames: {${exportTypes}\n};\n${exportStyle}\n${exportClassNames}`;
          log(`outputFileString😅${outputFileString}`);

          scriptSnapshot = ts.ScriptSnapshot.fromString(outputFileString);
        }
      }
      return delegate.createLanguageServiceSourceFile(
        fileName,
        scriptSnapshot,
        scriptTarget,
        version,
        setNodeParents,
        scriptKind
      );
    };

    mod.typescript.updateLanguageServiceSourceFile = (
      sourceFile,
      scriptSnapshot,
      version,
      textChangeRange,
      aggressiveChecks
    ): ts.SourceFile => {
      log(`😅${sourceFile}`);
      return delegate.updateLanguageServiceSourceFile(
        sourceFile,
        scriptSnapshot,
        version,
        textChangeRange,
        aggressiveChecks
      );
    };

    log(`moduleName😱${delegate.resolveModuleNames}`);

    if (lsh.resolveModuleNames) {
      const _resolveModuleNames = lsh.resolveModuleNames.bind(
        info.languageServiceHost
      );

      lsh.resolveModuleNames = (
        moduleNames,
        containingFile,
        reusedNames,
        redirectedReference,
        $options
      ): (ts.ResolvedModuleFull | ts.ResolvedModule | undefined)[] => {
        for (const moduleName of moduleNames) {
          // log(`containingFile${containingFile}`);
          // log(`moduleName😱${moduleName}`);
        }

        if (!_resolveModuleNames) return [];

        const resolvedModules = _resolveModuleNames(
          moduleNames,
          containingFile,
          reusedNames,
          redirectedReference,
          $options
        );

        return moduleNames.map<
          ts.ResolvedModuleFull | ts.ResolvedModule | undefined
        >((moduleName, index) => {
          if (resolvedModules[index]) {
            return {
              ...resolvedModules[index],
            } as ts.ResolvedModule;
          }
          if (isCSSFile(moduleName)) {
            log(
              `resolevedModuleName😱${path.resolve(
                path.dirname(containingFile),
                moduleName
              )}`
            );

            return {
              resolvedFileName: path.resolve(
                path.dirname(containingFile),
                moduleName
              ),
              isExternalLibraryImport: false,
              extension: mod.typescript.Extension.Dts,
            } as ts.ResolvedModuleFull;
          }

          return resolvedModules[index];
        });
      };
    }
    return ls;
  };
  const pluginModule: ts.server.PluginModule = {
    create,
  };
  return pluginModule;
};

export = factory;
