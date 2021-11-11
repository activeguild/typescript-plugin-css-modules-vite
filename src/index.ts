import path from "path";
import postcss from "postcss";
import postcssJs from "postcss-js";
import ts from "typescript/lib/tsserverlibrary";
import { ResolvedConfig } from "vite";
import { getViteConfig } from "./config";
import { parseCss } from "./css";
import { extractClassNameKeys } from "./extract";
import { formatClassNames } from "./format";
import { isCSSFile } from "./util";

const factory: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  const create = (info: ts.server.PluginCreateInfo): ts.LanguageService => {
    const dirName = info.project.getCurrentDirectory();

    const log = (logText: string) =>
      info.project.projectService.logger.info(
        `[ts-css-modules-vite-plugin] "${logText}"`
      );
    log(`dirName: ${dirName}`);

    // resolve vite.config.ts
    const config: ResolvedConfig | undefined = getViteConfig(log, dirName);
    const { languageService: ls, languageServiceHost: lsh } = info;

    if (!config) {
      log("Could not find vite.config.ts");
      return ls;
    }

    // evacuate the original
    const delegate = {
      getQuickInfoAtPosition: ls.getQuickInfoAtPosition,
      createLanguageServiceSourceFile:
        mod.typescript.createLanguageServiceSourceFile,
      updateLanguageServiceSourceFile:
        mod.typescript.updateLanguageServiceSourceFile,
      resolveModuleNames: lsh.resolveModuleNames,
    };

    const generateScriptSnapshot = (
      scriptSnapshot: ts.IScriptSnapshot,
      fileName: any
    ) => {
      if (isCSSFile(fileName)) {
        if (config) {
          let css = scriptSnapshot.getText(0, scriptSnapshot.getLength());
          if (fileName.endsWith(".css")) {
          } else {
            try {
              css = parseCss(log, css, fileName, config);
              log(`css: ${css}`);
            } catch (e) {
              log(`${e}`);
            }
          }
          const classNameKeys = extractClassNameKeys(
            postcssJs.objectify(postcss.parse(css))
          );

          for (const classNameKey of classNameKeys) {
            log(`classNameKey: ${classNameKey}`);
          }
          scriptSnapshot = ts.ScriptSnapshot.fromString(
            formatClassNames(classNameKeys)
          );
        }
      }

      return scriptSnapshot;
    };

    mod.typescript.createLanguageServiceSourceFile = (
      fileName,
      scriptSnapshot,
      scriptTarget,
      version,
      setNodeParents,
      scriptKind
    ): ts.SourceFile => {
      return delegate.createLanguageServiceSourceFile(
        fileName,
        generateScriptSnapshot(scriptSnapshot, fileName),
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
      const fileName = sourceFile.fileName;

      return delegate.updateLanguageServiceSourceFile(
        sourceFile,
        generateScriptSnapshot(scriptSnapshot, fileName),
        version,
        textChangeRange,
        aggressiveChecks
      );
    };

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
