/**
 * Main library exports
 */

// Types
export * from './types';

// Chart computation
export * from './charts';

// Calendar utilities
export { getDailyLuck, getTodayDateString, formatLunarDate } from './utils/calendar';

// Claude prompts
export {
  SYSTEM_PROMPT,
  buildDailyLuckPrompt,
  buildBaZiPrompt,
  buildZiweiPrompt,
  buildQuestionPrompt,
  buildChatMessage,
} from './prompts';

// Environment
export { ENV, PUBLIC_ENV, validateEnvironment } from './env';

// Rate limiting
export {
  getClientId,
  checkRateLimit,
  createRateLimitedHandler,
  cleanupRateLimitStore,
} from './rate-limit';

// i18n
export { Messages, defaultLocale, locales, TimeZone } from './i18n.config';
