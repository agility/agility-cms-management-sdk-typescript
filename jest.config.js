module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/*.(test|spec).+(ts|tsx|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/index.ts', // Re-export file
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
	testTimeout: 30000, // 30 seconds for API calls (overridden for integration tests)
	verbose: true,
	maxWorkers: 1, // Reduced to 1 for integration tests to avoid conflicts
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
