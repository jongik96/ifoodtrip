import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { z } from 'zod';
import { Recipe } from '@/types/recipe';
import { Country, Locale } from '@/types/database';
import { generateRecipePromptWithExamples } from '@/lib/prompts';
import { supabase } from '@/lib/supabase';
import * as crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// 요청 스키마 검증
const RecipeRequestSchema = z.object({
  country: z.enum(['korea', 'japan', 'spain', 'italy', 'india', 'turkey']),
  ingredients: z.array(z.string()),
  servings: z.number().min(1).max(10).optional().default(2),
  time_limit: z.number().min(15).max(180).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  allergies: z.array(z.string()).optional().default([]),
  extra_instructions: z.string().optional(),
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
    // 요청 본문 검증
    const validated = RecipeRequestSchema.parse(req.body);

    const { country, ingredients, servings, time_limit, difficulty, allergies, locale } = validated;

    // 프롬프트 생성
    const { system, user } = generateRecipePromptWithExamples(
      country as Country,
      {
        ingredients,
        servings,
        maxTime: time_limit,
        difficulty: difficulty || 'medium',
        allergies: allergies || [],
      },
      locale as Locale
    );

    // 프롬프트 해시 생성 (로깅용)
    const promptHash = crypto
      .createHash('sha256')
      .update(system + user)
      .digest('hex');

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const recipeMarkdown = completion.choices[0].message.content || '';
    const usage = completion.usage;

    // AI 요청 로그 저장
    try {
      await supabase.from('ai_requests_log').insert({
        prompt_hash: promptHash,
        model: 'gpt-4',
        tokens_in: usage?.prompt_tokens || 0,
        tokens_out: usage?.completion_tokens || 0,
        response_excerpt: recipeMarkdown.substring(0, 200),
        status: 'success',
      });
    } catch (logError) {
      console.error('Failed to log AI request:', logError);
    }

    // 마크다운에서 메타데이터 추출
    const metadata = {
      country,
      servings,
      time_minutes: time_limit || 30,
      difficulty: difficulty || 'medium',
    };

    // 레시피 응답
    return res.status(200).json({
      recipe_md: recipeMarkdown,
      metadata,
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request: ' + error.errors.map(e => e.message).join(', ') });
    }

    return res.status(500).json({ error: 'Failed to generate recipe' });
  }
}

