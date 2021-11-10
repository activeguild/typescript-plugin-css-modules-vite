export const cssLangs = `\\.(css|sass|scss)($|\\?)`;
export const cssLangReg = new RegExp(cssLangs);

export const isCSSFile = (request: string): boolean => cssLangReg.test(request);
