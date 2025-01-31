import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { 
    globals: globals.browser,
    parser: tsParser,
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {ignores: [
    "node_modules/", // Ignore node_modules
    "dist/",         // Ignore build output folder
    "coverage/",     // Ignore test coverage reports
    "src/temp-files/", // Ignore a specific directory
    "src/ignore-this-file.ts" // Ignore a specific file
  ],}
];