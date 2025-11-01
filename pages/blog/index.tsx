import React, { useState, useEffect, useCallback } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/lib/seo';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  published_at: string | null;
  tags: string[];
  created_at: string;
}

const BlogListPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // 현재 언어에 맞는 테이블 선택
      const tableName = `blog_${currentLocale}` as 'blog_ja' | 'blog_en' | 'blog_ko' | 'blog_fr';
      
      // status가 'posted'인 게시물만 조회, published_at 기준 내림차순 정렬
      const { data, error } = await supabase
        .from(tableName)
        .select('id, title, description, published_at, tags, created_at')
        .eq('status', 'posted')
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }, [currentLocale]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 모든 태그 추출
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).filter(Boolean);

  // 선택된 태그에 따라 필터링
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return t('blog.today');
    } else if (diffDays === 1) {
      return t('blog.yesterday');
    } else if (diffDays < 7) {
      return `${diffDays}${t('blog.daysAgo')}`;
    } else {
      return date.toLocaleDateString(currentLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <Layout>
      <SEO title={t('blog.title')} description={t('blog.subtitle')} path="/blog" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-700">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('blog.allPosts')}
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">{t('blog.loading')}</p>
          </div>
        ) : (
          /* Posts List */
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">{t('blog.noPosts')}</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.id}`} locale={currentLocale}>
                  <article className="card cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-900 mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400 flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const translations = await serverSideTranslations(locale || 'ja', ['common']);
    return {
      props: {
        ...translations,
      },
      revalidate: 60, // 60초마다 재검증 (ISR)
    };
  } catch (error) {
    console.error('Translation loading error:', error);
    return {
      props: {
        ...(await serverSideTranslations('ja', ['common'])),
      },
      revalidate: 60,
    };
  }
};

export default BlogListPage;


