import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "public"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          // shadcn primitives export their `cva` variant helper alongside the
          // component. That is the library's documented convention and how
          // consumers customise them, so it is not worth a warning. Listed
          // explicitly — this option matches exact names, not globs.
          // `useTheme` sits with its provider for the same reason: splitting a
          // context from its hook onto two files helps nobody.
          allowExportNames: [
            "buttonVariants",
            "badgeVariants",
            "tabsListVariants",
            "toggleVariants",
            "useTheme",
            // Pure helpers that belong next to the component that owns them.
            "initialsOf",
            "slugify",
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Build and check scripts are plain Node / test harnesses, not app code.
    // `console.log` is their entire output mechanism.
    files: ["scripts/**/*.mjs", "scripts/**/*.tsx"],
    languageOptions: { globals: globals.node },
    rules: { "no-console": "off" },
  },
);
