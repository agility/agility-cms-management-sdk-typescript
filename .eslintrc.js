module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.test.json'],
		tsconfigRootDir: __dirname,
	},
	plugins: ['@typescript-eslint', 'import', 'prettier'],
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		// TypeScript specific
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/no-misused-promises': 'error',

		// Import organization
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'import/no-duplicates': 'error',
		'import/no-unresolved': 'off', // TypeScript handles this

		// General code quality
		'no-console': 'warn',
		'no-debugger': 'error',
		'prefer-const': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-template': 'error',

		// Prettier integration
		'prettier/prettier': 'error',
	},
	env: {
		node: true,
		es2020: true,
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.d.ts'],
	overrides: [
		{
			files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
			env: {
				jest: true,
			},
			globals: {
				fail: 'readonly',
			},
			rules: {
				// Relax some rules for test files
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'no-console': 'off',
			},
		},
	],
};
