import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default defineConfig([
	tseslint.configs.recommended,
	...sveltePlugin.configs["flat/recommended"],
	{
		files: ["**/*.svelte", "**/*.svelte.ts"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".svelte", ".svelte.ts"],
			},
		},
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,svelte}"],
		ignores: ["node_modules"],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			"prefer-const": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["camelCase", "UPPER_CASE"],
					leadingUnderscore: "allow",
				},
				{
					selector: "function",
					format: ["camelCase"],
				},
				{
					selector: "parameter",
					format: ["camelCase"],
					leadingUnderscore: "allow",
				},
			],
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-require-imports": "off",
			"svelte/no-at-html-tags": "off",
		},
	},
]);
