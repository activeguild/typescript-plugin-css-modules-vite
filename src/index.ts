import ts from "typescript/lib/tsserverlibrary";
import { getCssOptions } from "./config";

const factory: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  const create = (info: ts.server.PluginCreateInfo): ts.LanguageService => {
    const ls = info.languageService;
    const lsh = info.languageServiceHost;
    let css: any;
    getCssOptions().then((_css) => (css = _css));

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
        { kind: "", text: JSON.stringify(css) },
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
      log(`😅${fileName}`);
      log(`😅${scriptSnapshot}`);
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
          log(`moduleName😱${moduleName}`);
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
        >((resolevedModule, index) => {
          if (resolvedModules[index]) {
            return {
              ...resolvedModules[index],
              // extension: mod.typescript.Extension.Dts,
            } as ts.ResolvedModule;
          }
          // if (!resolevedModule) {
          //   return undefined;
          // }

          log(`resolevedModuleName😱${resolevedModule}`);

          return {
            ...resolvedModules[index],
            extension: mod.typescript.Extension.Dts,
          } as ts.ResolvedModuleFull;
        });

        // return _resolveModuleNames(
        //   moduleNames,
        //   containingFile,
        //   reusedNames,
        //   redirectedReference,
        //   $options
        // );
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
