// @ts-check

import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, prettier, {
    rules: {
        "no-var": "error",
        "no-const-assign": "error",
        "no-unreachable": "error",
        "no-invalid-regexp": "error",
        "no-console": "off",
        "no-unused-vars": "off",
        "no-trailing-spaces": "off",
        "no-undef": "warn",
        "spaced-comment": "warn",
        "use-isnan": "error",
        eqeqeq: "error",
        radix: "warn",
        quotes: ["warn", "double"],
        semi: 2,
    },
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            ...globals.es2024,
        },
    },
});
