/**
 * Charts API route - Compute BaZi and Ziwei charts
 * POST /api/charts
 *
 * Request body:
 * {
 *   "name": "张三",
 *   "birthDate": "1990-06-15",
 *   "birthTime": "02:30",
 *   "gender": "M"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { computeBaZiChart, computeZiweiChart } from '@/lib/charts';
import { createRateLimitedHandler } from '@/lib/rate-limit';
import type { BirthProfile, ApiResponse } from '@/lib/types';

const handler = async (request: NextRequest) => {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    const body = await request.json() as Partial<BirthProfile>;

    // Validate required fields
    const errors: string[] = [];
    if (!body.name) errors.push('name is required');
    if (!body.birthDate) errors.push('birthDate is required');
    if (!body.birthTime) errors.push('birthTime is required');
    if (!body.gender) errors.push('gender is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join('; ') },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate!)) {
      return NextResponse.json(
        { success: false, error: 'birthDate must be YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate time format
    if (!/^\d{2}:\d{2}$/.test(body.birthTime!)) {
      return NextResponse.json(
        { success: false, error: 'birthTime must be HH:MM' },
        { status: 400 }
      );
    }

    // Validate gender
    if (!['M', 'F', '男', '女'].includes(body.gender!)) {
      return NextResponse.json(
        { success: false, error: 'gender must be M, F, 男, or 女' },
        { status: 400 }
      );
    }

    const profile: BirthProfile = {
      name: body.name!,
      birthDate: body.birthDate!,
      birthTime: body.birthTime!,
      gender: body.gender as 'M' | 'F' | '男' | '女',
    };

    // Compute charts
    const [baziChart, ziweiChart] = await Promise.all([
      computeBaZiChart(profile),
      computeZiweiChart(profile),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          profile,
          baziChart,
          ziweiChart,
        },
      } as ApiResponse<any>,
      {
        headers: {
          'Cache-Control': 'private, no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Charts API error:', error);
    
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      {
        success: false,
        error: message,
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
};

export const POST = createRateLimitedHandler(handler);
