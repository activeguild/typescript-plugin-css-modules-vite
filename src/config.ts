export const getCssOptions = async () => {
  try {
    const fallbackPaths = require.resolve.paths?.("vite") || [];
    const resolved = require.resolve("vite", {
      paths: ["./", ...fallbackPaths],
    });
    const { resolveConfig } = require(resolved);
    const { css } = await resolveConfig({}, "serve");

    return css;
  } catch (e) {
    console.error(e);
  }
};

console.log("getCssOptions() :>> ", getCssOptions());
