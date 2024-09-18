module.exports = [
  {
    parser: "@typescript-eslint/parser",
    ignores: [".config/*", ".gitignore", "eslint.config.js", "contracts/*.sol"],
    plugins: ["solid"],
    extends: ["eslint:recommended", "plugin:solid/recommended"],
    rules: {
      "solid/reactivity": "warn",
      "solid/no-destructure": "warn",
      "solid/jsx-no-undef": "error",
    },
  },
];
