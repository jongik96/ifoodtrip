import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { z } from 'zod';
import { Locale, Database } from '@/types/database';
import { supabase } from '@/lib/supabase';
import * as crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const DietPlanRequestSchema = z.object({
  calories: z.number().min(300).max(2000),
  days: z.number().min(1).max(7).optional().default(1),
  allergies: z.array(z.string()).optional().default([]),
  locale: z.enum(['ko', 'ja', 'en', 'fr']).optional().default('en'),
  preferences: z.array(z.string()).optional().default([]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ diet_plan_md: string; metadata: any } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validated = DietPlanRequestSchema.parse(req.body);
    const { calories, days, allergies, locale, preferences } = validated;

    const localeMap: Record<Locale, string> = {
      ko: '한국어',
      ja: '日本語',
      en: 'English',
      fr: 'Français',
    };

    const systemPrompt = `You are a professional nutritionist and dietitian. Generate meal plans as Markdown. Use locale ${localeMap[locale]}. Respect allergies and dietary preferences. Output sections: Title, Overview, Daily Plan (for each day), Recipes (detailed), Nutrition Summary.`;

    let userPrompt = `Create a ${days}-day meal plan with the following requirements:\n`;
    userPrompt += `- Target calories per day: ${calories} kcal\n`;
    
    if (allergies && allergies.length > 0) {
      userPrompt += `- Allergies to avoid: ${allergies.join(', ')}\n`;
    }
    
    if (preferences && preferences.length > 0) {
      userPrompt += `- Dietary preferences: ${preferences.join(', ')}\n`;
    }

    // 언어별 마크다운 템플릿
    const templateMap = {
      ko: {
        title: '# {식단 제목}\n\n',
        overview: `## 개요\n- 총 칼로리: xxx kcal/일\n- 기간: ${days}일\n\n`,
        day: (i: number) => `## ${i}일차\n### 아침\n- 메뉴명 (xxx kcal)\n### 점심\n- 메뉴명 (xxx kcal)\n### 저녁\n- 메뉴명 (xxx kcal)\n\n`,
        recipes: `## 레시피\n각 식사의 상세 레시피를 제공하세요.\n\n`,
        nutrition: `## 영양 요약\n- 일일 평균 칼로리: xxx kcal\n- 주요 영양소 분포...\n`,
      },
      ja: {
        title: '# {食事プラン タイトル}\n\n',
        overview: `## 概要\n- 総カロリー: xxx kcal/日\n- 期間: ${days}日\n\n`,
        day: (i: number) => `## ${i}日目\n### 朝\n- メニュー名 (xxx kcal)\n### 昼\n- メニュー名 (xxx kcal)\n### 夜\n- メニュー名 (xxx kcal)\n\n`,
        recipes: `## レシピ\n各食事の詳細レシピを提供してください。\n\n`,
        nutrition: `## 栄養まとめ\n- 1日の平均カロリー: xxx kcal\n- 主要栄養素分布...\n`,
      },
      en: {
        title: '# {Meal Plan Title}\n\n',
        overview: `## Overview\n- Total calories: xxx kcal/day\n- Duration: ${days} days\n\n`,
        day: (i: number) => `## Day ${i}\n### Breakfast\n- Menu name (xxx kcal)\n### Lunch\n- Menu name (xxx kcal)\n### Dinner\n- Menu name (xxx kcal)\n\n`,
        recipes: `## Recipes\nProvide detailed recipes for each meal.\n\n`,
        nutrition: `## Nutrition Summary\n- Daily average calories: xxx kcal\n- Key nutrient distribution...\n`,
      },
      fr: {
        title: '# {Titre du Plan Repas}\n\n',
        overview: `## Aperçu\n- Calories totales: xxx kcal/jour\n- Durée: ${days} jours\n\n`,
        day: (i: number) => `## Jour ${i}\n### Petit déjeuner\n- Nom du menu (xxx kcal)\n### Déjeuner\n- Nom du menu (xxx kcal)\n### Dîner\n- Nom du menu (xxx kcal)\n\n`,
        recipes: `## Recettes\nFournissez des recettes détaillées pour chaque repas.\n\n`,
        nutrition: `## Résumé Nutritionnel\n- Calories moyennes quotidiennes: xxx kcal\n- Distribution des nutriments clés...\n`,
      },
    };

    const template = templateMap[locale];
    userPrompt += `\nGenerate the meal plan in ${localeMap[locale]} following this Markdown format:\n\n`;
    userPrompt += template.title;
    userPrompt += template.overview;
    
    for (let i = 1; i <= days; i++) {
      userPrompt += template.day(i);
    }
    
    userPrompt += template.recipes;
    userPrompt += template.nutrition;

    const promptHash = crypto
      .createHash('sha256')
      .update(systemPrompt + userPrompt)
      .digest('hex');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const dietPlanMarkdown = completion.choices[0].message.content || '';
    const usage = completion.usage;

    // AI 요청 로그 저장
    try {
      const logData: Database['public']['Tables']['ai_requests_log']['Insert'] = {
        prompt_hash: promptHash,
        model: 'gpt-4',
        tokens_in: usage?.prompt_tokens || 0,
        tokens_out: usage?.completion_tokens || 0,
        response_excerpt: dietPlanMarkdown.substring(0, 200),
        status: 'success',
      };
      await supabase.from('ai_requests_log').insert(logData);
    } catch (logError) {
      console.error('Failed to log AI request:', logError);
    }

    const metadata = {
      calories,
      days,
      allergies,
      preferences,
    };

    return res.status(200).json({
      diet_plan_md: dietPlanMarkdown,
      metadata,
    });
  } catch (error) {
    console.error('Error generating diet plan:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request: ' + error.errors.map(e => e.message).join(', ') });
    }

    return res.status(500).json({ error: 'Failed to generate diet plan' });
  }
}


