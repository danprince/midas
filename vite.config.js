module.exports = {
  jsx: "preact",

  // can't use terser because it mangles command function names which
  // breaks Game#dispatch.
  minify: "esbuild",

  sourcemap: true,
};
