export const formatClassNames = (classNameKeys: Map<string, boolean>) => {
  let exportTypes = "";
  const exportStyle = "export = classNames;";
  for (const classNameKey of classNameKeys.keys()) {
    exportTypes = `${exportTypes}\n${formatExportType(classNameKey)}`;
  }

  return `declare const classNames: {${exportTypes}\n};\n${exportStyle}`;
};
const formatExportType = (key: string) => `  readonly '${key}': '${key}';`;
