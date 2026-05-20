import Import from "eslint-plugin-import";
import ReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "@eslint/config-helpers";
import { fixupPluginRules } from "@eslint/compat";

export default defineConfig([
  {
    plugins: {
      import: fixupPluginRules(Import)
    },
  },
  {
    plugins: {
      "react-hooks": fixupPluginRules(ReactHooks)
    },
  }
]);
