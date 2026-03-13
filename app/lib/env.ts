/**
 * Environment configuration
 */

export const ENV = {
  // API Keys
  groqApiKey: process.env.GROQ_API_KEY || '',

  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'fortunetelling',
  defaultLanguage: (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'zh-CN') as 'zh-CN' | 'en',
  supportedLanguages: (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'zh-CN,en').split(','),

  // Feature Flags
  features: {
    dailyLuck: process.env.NEXT_PUBLIC_ENABLE_DAILY_LUCK !== 'false',
    personalReading: process.env.NEXT_PUBLIC_ENABLE_PERSONAL_READING !== 'false',
    chat: process.env.NEXT_PUBLIC_ENABLE_CHAT !== 'false',
  },

  // Rate Limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10),
  },

  // Logging
  logLevel: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',

  // Derived values
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

/**
 * Validate that required environment variables are set
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!ENV.groqApiKey) {
    errors.push('GROQ_API_KEY is not set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get safe public environment for client-side use
 */
export const PUBLIC_ENV = {
  appName: ENV.appName,
  defaultLanguage: ENV.defaultLanguage,
  supportedLanguages: ENV.supportedLanguages,
  features: ENV.features,
};
