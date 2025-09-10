import { ApiClient } from '../../src/apiClient';
import { Options } from '../../src/models/options';

/**
 * Test configuration for API client
 */
export interface TestConfig {
	pat: string;
	guid: string;
	website: string;
	locales: string;
	baseUrl?: string;
	retryCount?: number;
	duration?: number;
}

/**
 * Creates a test API client with proper configuration
 */
export function createTestClient(): ApiClient {
	const config: TestConfig = {
		pat: process.env.AGILITY_PAT ?? 'mock-pat',
		guid: process.env.AGILITY_GUID ?? 'mock-guid',
		website: process.env.AGILITY_WEBSITE ?? 'mock-website',
		locales: process.env.AGILITY_LOCALES ?? 'en-us',
		baseUrl: process.env.AGILITY_BASE_URL ?? 'https://mgmt.aglty.io',
		retryCount: 3,
		duration: 5000,
	};

	// Only throw error if we're trying to make real API calls
	if (!process.env.AGILITY_PAT && process.env.NODE_ENV !== 'test') {
		console.warn('AGILITY_PAT not set - using mock credentials for testing');
	}

	if (!process.env.AGILITY_GUID && process.env.NODE_ENV !== 'test') {
		console.warn('AGILITY_GUID not set - using mock credentials for testing');
	}

	if (!process.env.AGILITY_WEBSITE && process.env.NODE_ENV !== 'test') {
		console.warn('AGILITY_WEBSITE not set - using mock credentials for testing');
	}

	const options: Options = {
		token: config.pat,
		baseUrl: config.baseUrl,
		refresh_token: '', // Not needed for management API
		duration: config.duration,
		retryCount: config.retryCount,
	};

	return new ApiClient(options);
}

/**
 * Get test configuration
 */
export function getTestConfig(): TestConfig {
	return {
		pat: process.env.AGILITY_PAT ?? 'mock-pat',
		guid: process.env.AGILITY_GUID ?? 'mock-guid',
		website: process.env.AGILITY_WEBSITE ?? 'mock-website',
		locales: process.env.AGILITY_LOCALES ?? 'en-us',
		baseUrl: process.env.AGILITY_BASE_URL ?? 'https://mgmt.aglty.io',
		retryCount: 3,
		duration: 5000,
	};
}

/**
 * Test utilities for common operations
 */
export class TestUtils {
	/**
	 * Generates a unique test identifier
	 */
	static generateTestId(): string {
		return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Waits for a specified amount of time (for rate limiting)
	 */
	static async wait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Retries an operation with exponential backoff
	 */
	static async retry<T>(
		operation: () => Promise<T>,
		maxAttempts: number = 3,
		baseDelay: number = 1000
	): Promise<T> {
		let lastError: Error;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error as Error;

				if (attempt === maxAttempts) {
					throw lastError;
				}

				const delay = baseDelay * Math.pow(2, attempt - 1);
				await this.wait(delay);
			}
		}

		throw lastError!;
	}
}
