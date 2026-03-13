/**
 * Chat API route - Stream responses with chart context
 * POST /api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPT, buildZiweiPrompt } from '@/lib/prompts';
import { createRateLimitedHandler } from '@/lib/rate-limit';
import { ENV } from '@/lib/env';
import type { BaZiChart, ZiweiChart, BirthProfile } from '@/lib/types';

interface ChatRequest {
  message: string;
  context?: {
    profile?: BirthProfile;
    baziChart?: BaZiChart;
    ziweiChart?: ZiweiChart;
    language?: 'zh-CN' | 'en';
  };
}

const handler = async (request: NextRequest) => {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    const body = await request.json() as ChatRequest;

    if (!body.message) {
      return NextResponse.json(
        { success: false, error: 'message is required' },
        { status: 400 }
      );
    }

    // Check if API key is missing or invalid - use mock response for demo
    if (!ENV.groqApiKey) {
      const mockResponse = `根据${body.context?.profile?.name || '您'}的信息，我来为您分析事业运势：

在职业发展方面，目前正处于平稳期，适合积累经验和人脉。建议：
1. 专注于本职工作，提升专业技能
2. 主动拓展人际关系，为未来机遇做准备
3. 避免仓促决策，需要更多时间酝酿

下一个转机预计在未来3-6个月出现，届时可能有新的机遇或合作机会。`;

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for (const char of mockResponse.split('')) {
            await new Promise(r => setTimeout(r, 20));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: char })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, text: mockResponse })}\n\n`));
          controller.close();
        },
      });

      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Use actual Groq API
    const client = new Groq({
      apiKey: ENV.groqApiKey,
    });

    const language = body.context?.language || 'zh-CN';
    const systemPrompt = SYSTEM_PROMPT(language);

    let userMessage = body.message;
    if (body.context?.profile && body.context?.ziweiChart) {
      const chartContext = buildZiweiPrompt(
        body.context.profile,
        body.context.ziweiChart,
        language
      );
      userMessage = `${chartContext}\n\n用户问题：${body.message}`;
    }

    const stream = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    let buffer = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const choice = chunk.choices[0];
            const delta = choice.delta;

            if (delta.content) {
              const text = delta.content;
              buffer += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }

            if (choice.finish_reason === 'stop') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true, text: buffer })}\n\n`)
              );
              controller.close();
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
};

export const POST = createRateLimitedHandler(handler);
