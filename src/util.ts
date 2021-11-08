export const cssLangs = `\\.(css|sass|scss)($|\\?)`;
export const cssLangReg = new RegExp(cssLangs);

export const isCSSFile = (request: string): boolean => cssLangReg.test(request);

// export const getRelativePath = (
//   from: string | undefined,
//   to: string | undefined
// ) => path.relative(path.dirname(from || ""), path.dirname(to || "")) || "./";
