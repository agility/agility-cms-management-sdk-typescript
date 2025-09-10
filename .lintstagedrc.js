module.exports = {
	'*.{ts,tsx}': [
		'eslint --fix',
		'eslint', // Check for remaining errors (will fail on errors but not warnings)
		'prettier --write',
	],
	'*.{json,md,yml,yaml}': ['prettier --write'],
};
