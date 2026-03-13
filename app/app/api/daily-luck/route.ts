/**
 * Example: Daily luck API route with rate limiting
 * GET /api/daily-luck?date=2024-03-12
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDailyLuck } from '@/lib/utils/calendar';
import { createRateLimitedHandler } from '@/lib/rate-limit';

const handler = async (request: NextRequest) => {
  try {
    // CORS headers (optional - add for browser requests)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'GET') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Get date from query parameter or default to today
    const searchParams = request.nextUrl.searchParams;
    let dateString = searchParams.get('date');

    if (!dateString) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Get daily luck data
    const dailyLuck = await getDailyLuck(dateString);

    return NextResponse.json(
      {
        success: true,
        data: dailyLuck,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Daily luck API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
};

// Export with rate limiting wrapper
export const GET = createRateLimitedHandler(handler);
