import { Options } from '../models/options';

export const getTestOptions = (): Options => {
  return {
    token: process.env.AGILITY_API_TOKEN || 'test-token',
    baseUrl: process.env.AGILITY_API_URL || 'https://api.agilitycms.com',
    refresh_token: process.env.AGILITY_REFRESH_TOKEN || 'test-refresh-token',
    duration: 3000,
    retryCount: 500
  };
}; 