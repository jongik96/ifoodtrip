import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, category } = req.query;

    let queryBuilder = supabase
      .from('ingredient_master')
      .select('*');

    // 검색 쿼리가 있으면 이름 또는 별칭으로 검색
    if (query && typeof query === 'string') {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,aliases.cs.{${query}}`);
    }

    // 카테고리 필터
    if (category && typeof category === 'string') {
      queryBuilder = queryBuilder.eq('category', category);
    }

    // 최대 50개 결과
    queryBuilder = queryBuilder.limit(50);

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching ingredients:', error);
      return res.status(500).json({ error: 'Failed to fetch ingredients' });
    }

    return res.status(200).json({ ingredients: data || [] });
  } catch (error) {
    console.error('Error in ingredients API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}





