import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["apps/ain-valuation-engine/src/**/*.{ts,tsx}"],
    ignores: [
      "apps/ain-valuation-engine/dist",
      "apps/ain-valuation-engine/src/ain-backend/**",
      "apps/ain-valuation-engine/src/engines/**",
      "apps/ain-valuation-engine/src/integrations/**",
      "apps/ain-valuation-engine/src/lib/**",
      "apps/ain-valuation-engine/src/scripts/**",
      "apps/ain-valuation-engine/src/services/marketAgents/**",
      "apps/ain-valuation-engine/src/services/testUnifiedDecoder.ts",
      "apps/ain-valuation-engine/src/tools/**",
      "apps/ain-valuation-engine/src/valuation/**",
      "apps/ain-valuation-engine/src/api/**",
      "apps/ain-valuation-engine/src/api_integrations/**",
      "apps/ain-valuation-engine/src/db/**",
      "apps/ain-valuation-engine/src/types_custom/**",
      "apps/ain-valuation-engine/src/components/enhanced-ui/**",
      "apps/ain-valuation-engine/src/utils/metrics-*",
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
