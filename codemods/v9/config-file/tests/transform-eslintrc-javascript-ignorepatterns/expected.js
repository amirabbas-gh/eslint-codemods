import { defineConfig, globalIgnores } from "@eslint/config-helpers";

export default defineConfig([
  globalIgnores(["dist","coverage/**"]),
  {
    languageOptions: {
      globals: {},
      parserOptions: {}
    },
    rules: {
      "no-console": "off"
    },
  }
]);
