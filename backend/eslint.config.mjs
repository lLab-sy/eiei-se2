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
];