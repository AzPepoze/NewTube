import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
	tseslint.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		ignores: ["node_modules"],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			"prefer-const": "warn",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variableLike",
					format: ["snake_case"],
					leadingUnderscore: "allow",
				},
				{
					selector: "parameter",
					format: ["snake_case"],
					leadingUnderscore: "allow",
				},
			],
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-require-imports": "off",
		},
	},
]);
