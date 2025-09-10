import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Global test configuration
jest.setTimeout(30000);

// Mock console.log in tests unless explicitly needed
global.console = {
	...console,
	log: jest.fn(),
	warn: jest.fn(),
	error: console.error, // Keep errors visible
};
