const preactRefresh = require("@prefresh/vite")

module.exports = {
  jsx: "preact",
  plugins: [preactRefresh()],

  // can't use terser because it mangles command function names which
  // breaks Game#dispatch.
  minify: "esbuild",
};
