/**
 * Rate limiting middleware for API routes
 * Implements token bucket algorithm with in-memory storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { ENV } from './env';

interface RateLimitStore {
  tokens: number;
  lastReset: number;
}

// In-memory store for rate limiting (would use Redis in production)
const rateLimitMap = new Map<string, RateLimitStore>();

/**
 * Extract client identifier from request
 * Priority: API key > IP address > user agent
 */
export function getClientId(request: NextRequest): string {
  // Check for API key header
  const apiKey = request.headers.get('x-api-key');
  if (apiKey) {
    return `api:${apiKey}`;
  }

  // Use IP address from headers
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';

  return `ip:${ip.trim()}`;
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(clientId: string): boolean {
  if (!ENV.rateLimit.enabled) {
    return true;
  }

  const now = Date.now();
  const store = rateLimitMap.get(clientId);

  // Initialize or reset if window has passed
  if (!store || now - store.lastReset > ENV.rateLimit.windowMs) {
    rateLimitMap.set(clientId, {
      tokens: ENV.rateLimit.maxRequests - 1,
      lastReset: now,
    });
    return true;
  }

  // Check if tokens available
  if (store.tokens > 0) {
    store.tokens--;
    return true;
  }

  return false;
}

/**
 * Helper to add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  clientId: string
): NextResponse {
  const store = rateLimitMap.get(clientId);
  
  response.headers.set('X-RateLimit-Limit', `${ENV.rateLimit.maxRequests}`);
  if (store) {
    response.headers.set('X-RateLimit-Remaining', `${store.tokens}`);
    response.headers.set(
      'X-RateLimit-Reset',
      `${store.lastReset + ENV.rateLimit.windowMs}`
    );
  }

  return response;
}

/**
 * Create a rate-limited route handler
 * Usage: export const POST = createRateLimitedHandler(handler);
 */
export function createRateLimitedHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const clientId = getClientId(request);
    const allowed = checkRateLimit(clientId);

    if (!allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': `${Math.ceil(ENV.rateLimit.windowMs / 1000)}`,
          },
        }
      );
      return addRateLimitHeaders(response, clientId);
    }

    // Call the actual handler
    const response = await handler(request);
    
    // Add rate limit headers
    return addRateLimitHeaders(response, clientId);
  };
}

/**
 * Clean up old entries to prevent memory leak
 * Run periodically (e.g., every hour)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxAge = ENV.rateLimit.windowMs * 2; // Keep for 2 windows

  for (const [clientId, store] of rateLimitMap.entries()) {
    if (now - store.lastReset > maxAge) {
      rateLimitMap.delete(clientId);
    }
  }
}

// Schedule cleanup
if (typeof global !== 'undefined' && !('_rateLimitCleanupScheduled' in global)) {
  setInterval(cleanupRateLimitStore, 3600000); // Every hour
  (global as any)._rateLimitCleanupScheduled = true;
}
