import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { z } from 'zod';
import { Country, Locale, Database } from '@/types/database';
import { generateRecipePromptWithExamples } from '@/lib/prompts';
import { supabase } from '@/lib/supabase';
import * as crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const TodayRequestSchema = z.object({
  country: z.enum(['korea', 'japan', 'spain', 'italy', 'india', 'turkey']),
  servings: z.number().min(1).max(10).optional().default(2),
  locale: z.enum(['ko', 'ja', 'en', 'fr']).optional().default('en'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ recipe_md: string; metadata: any } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validated = TodayRequestSchema.parse(req.body);
    const { country, servings, locale } = validated;

    // 프롬프트 생성 (오늘의 추천은 재료 없이 국가만으로 생성)
    const { system, user } = generateRecipePromptWithExamples(
      country as Country,
      {
        ingredients: [],
        servings,
        maxTime: undefined,
        difficulty: 'medium',
        allergies: [],
      },
      locale as Locale
    );

    // 오늘의 추천 메시지 추가
    const enhancedUser = user + `\n\nGenerate a popular, traditional recipe from ${country}. It should be suitable for today's recommendation and highlight the best of this cuisine.`;

    const promptHash = crypto
      .createHash('sha256')
      .update(system + enhancedUser)
      .digest('hex');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: enhancedUser },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const recipeMarkdown = completion.choices[0].message.content || '';
    const usage = completion.usage;

    // AI 요청 로그 저장
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const logData: Database['public']['Tables']['ai_requests_log']['Insert'] = {
          prompt_hash: promptHash,
          model: 'gpt-4',
          tokens_in: usage?.prompt_tokens || 0,
          tokens_out: usage?.completion_tokens || 0,
          response_excerpt: recipeMarkdown.substring(0, 200),
          status: 'success',
        };
        await supabase.from('ai_requests_log').insert([logData] as any);
      } catch (logError) {
        console.error('Failed to log AI request:', logError);
      }
    }

    const metadata = {
      country,
      servings,
      time_minutes: 30,
      difficulty: 'medium' as const,
    };

    return res.status(200).json({
      recipe_md: recipeMarkdown,
      metadata,
    });
  } catch (error) {
    console.error('Error generating today recipe:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request: ' + error.errors.map(e => e.message).join(', ') });
    }

    return res.status(500).json({ error: 'Failed to generate recipe' });
  }
}



