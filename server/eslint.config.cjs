const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.{ts,js}"],
    ignores: ["dist"],

    languageOptions: {
      parser: tseslint.parser,  
      ecmaVersion: 2020,
      globals: globals.node,
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin, 
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,  
    ],

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  }
);
