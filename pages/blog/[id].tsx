import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/lib/seo';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  published_at: string | null;
  tags: string[];
  created_at: string;
  previous_post: string | null;
  next_post: string | null;
}

interface BlogNavPost {
  id: string | null;
  title: string | null;
}

interface BlogDetailPageProps {
  post: BlogPost | null;
  previousPost: BlogNavPost | null;
  nextPost: BlogNavPost | null;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, previousPost, nextPost }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  // 데이터베이스의 \n 문자열을 실제 줄바꿈으로 변환하고 마크다운 형식으로 처리
  const processContent = (content: string | undefined) => {
    if (!content) return '';
    // 이스케이프된 \n을 실제 줄바꿈으로 변환
    let processed = content.replace(/\\n/g, '\n');
    // 여러 연속된 줄바꿈 정리
    processed = processed.replace(/\n{3,}/g, '\n\n');
    return processed;
  };

  if (!post) {
    return (
      <Layout>
        <SEO 
          title={t('blog.notFound')} 
          description=""
          path={`/blog/${router.query.id}`}
          enableAdSense={false} // 포스트가 없으면 AdSense 비활성화
          noindex={true}
        />
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('blog.notFound')}</h1>
            <Link href="/blog">
              <button className="btn-primary">
                {t('blog.backToList')}
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(router.locale || 'ja', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 콘텐츠 길이 확인 (최소 300자 이상일 때만 AdSense 활성화)
  const hasEnoughContent = Boolean(post.content && post.content.trim().length >= 300);
  
  return (
    <Layout>
      <SEO 
        title={post.title} 
        description={post.description} 
        path={`/blog/${post.id}`}
        enableAdSense={hasEnoughContent} // 충분한 콘텐츠가 있을 때만 AdSense 활성화
      />
      <div className="max-w-4xl mx-auto">
        {/* Back to List */}
        <div className="mb-6">
          <Link href="/blog" locale={router.locale}>
            <button className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.backToList')}
            </button>
          </Link>
        </div>

        {/* Article */}
        <article className="card">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <span className="text-sm">
                {t('blog.published')}: {formatDate(post.published_at || post.created_at)}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {post.description && (
              <p className="text-lg text-gray-900 leading-relaxed mb-8">
                {post.description}
              </p>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                br: ({ node, ...props }) => <br className="my-2" {...props} />,
                h1: ({ node, ...props }) => (
                  <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-outside space-y-2 my-6 text-gray-900 ml-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-outside space-y-2 my-6 text-gray-900 ml-6" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-900 mb-2 leading-relaxed" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-900 mb-6 leading-relaxed text-base" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-900" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="text-gray-900 italic" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-primary-600 hover:text-primary-700 underline" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary-300 pl-6 italic text-gray-900 my-6 bg-gray-50 py-4 rounded-r" {...props} />
                ),
              }}
            >
              {processContent(post.content)}
            </ReactMarkdown>
          </div>

          {/* Navigation */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Previous Post */}
              <div>
                {previousPost && previousPost.id ? (
                  <Link href={`/blog/${previousPost.id}`} locale={router.locale}>
                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="text-sm text-gray-500 mb-2">{t('blog.previousPost')}</div>
                      <div className="font-semibold text-gray-800 line-clamp-2">
                        {previousPost.title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg opacity-50">
                    <div className="text-sm text-gray-500 mb-2">{t('blog.previousPost')}</div>
                    <div className="text-gray-400">{t('blog.noPrevious')}</div>
                  </div>
                )}
              </div>

              {/* Next Post */}
              <div>
                {nextPost && nextPost.id ? (
                  <Link href={`/blog/${nextPost.id}`} locale={router.locale}>
                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="text-sm text-gray-500 mb-2 text-right">{t('blog.nextPost')}</div>
                      <div className="font-semibold text-gray-800 line-clamp-2 text-right">
                        {nextPost.title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg opacity-50">
                    <div className="text-sm text-gray-500 mb-2 text-right">{t('blog.nextPost')}</div>
                    <div className="text-gray-400 text-right">{t('blog.noNext')}</div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </article>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // 빈 경로 반환 (ISR을 사용하므로 모든 경로를 미리 생성하지 않음)
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const id = params?.id as string;
    const currentLocale = locale || 'ja';
    
    // 현재 언어에 맞는 테이블 선택
    const tableName = `blog_${currentLocale}` as 'blog_ja' | 'blog_en' | 'blog_ko' | 'blog_fr';
    
    // 게시물 조회
    // @ts-ignore - Supabase 타입 추론 문제 우회
    const { data: postData, error } = await (supabase.from(tableName) as any)
      .select('*')
      .eq('status', 'posted')
      .eq('id', id)
      .single();

    if (error || !postData) {
      return {
        notFound: true,
      };
    }

    const post = postData as BlogPost;

    // 이전/다음 게시물 조회
    let previousPost: BlogNavPost | null = null;
    let nextPost: BlogNavPost | null = null;

    if (post.previous_post) {
      // @ts-ignore - Supabase 타입 추론 문제 우회
      const { data } = await (supabase.from(tableName) as any)
        .select('id, title')
        .eq('id', post.previous_post)
        .eq('status', 'posted')
        .single();
      
      if (data) {
        previousPost = { id: data.id, title: data.title };
      }
    }

    if (post.next_post) {
      // @ts-ignore - Supabase 타입 추론 문제 우회
      const { data } = await (supabase.from(tableName) as any)
        .select('id, title')
        .eq('id', post.next_post)
        .eq('status', 'posted')
        .single();
      
      if (data) {
        nextPost = { id: data.id, title: data.title };
      }
    }

    const translations = await serverSideTranslations(currentLocale, ['common']);
    
    return {
      props: {
        ...translations,
        post,
        previousPost,
        nextPost,
      },
      revalidate: 60, // 60초마다 재검증
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
    };
  }
};

export default BlogDetailPage;

