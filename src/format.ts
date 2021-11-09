export const formatClassNames = (classNameKeys: Map<string, boolean>) => {
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

  return `declare const classNames: {${exportTypes}\n};\n${exportStyle}\n${exportClassNames}`;
};
const formatExportType = (key: string) => `  readonly '${key}': '${key}';`;
