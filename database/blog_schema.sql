-- 블로그 테이블 생성 스키마
-- 각 언어별로 별도의 테이블을 생성합니다

-- blog_ja 테이블 (일본어)
CREATE TABLE IF NOT EXISTS blog_ja (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  previous_post UUID REFERENCES blog_ja(id) ON DELETE SET NULL,
  next_post UUID REFERENCES blog_ja(id) ON DELETE SET NULL
);

-- blog_en 테이블 (영어)
CREATE TABLE IF NOT EXISTS blog_en (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  previous_post UUID REFERENCES blog_en(id) ON DELETE SET NULL,
  next_post UUID REFERENCES blog_en(id) ON DELETE SET NULL
);

-- blog_ko 테이블 (한국어)
CREATE TABLE IF NOT EXISTS blog_ko (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  previous_post UUID REFERENCES blog_ko(id) ON DELETE SET NULL,
  next_post UUID REFERENCES blog_ko(id) ON DELETE SET NULL
);

-- blog_fr 테이블 (프랑스어)
CREATE TABLE IF NOT EXISTS blog_fr (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  previous_post UUID REFERENCES blog_fr(id) ON DELETE SET NULL,
  next_post UUID REFERENCES blog_fr(id) ON DELETE SET NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_blog_ja_published_at ON blog_ja(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_ja_status ON blog_ja(status);
CREATE INDEX IF NOT EXISTS idx_blog_ja_tags ON blog_ja USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_ja_created_at ON blog_ja(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_en_published_at ON blog_en(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_en_status ON blog_en(status);
CREATE INDEX IF NOT EXISTS idx_blog_en_tags ON blog_en USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_en_created_at ON blog_en(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_ko_published_at ON blog_ko(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_ko_status ON blog_ko(status);
CREATE INDEX IF NOT EXISTS idx_blog_ko_tags ON blog_ko USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_ko_created_at ON blog_ko(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_fr_published_at ON blog_fr(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_fr_status ON blog_fr(status);
CREATE INDEX IF NOT EXISTS idx_blog_fr_tags ON blog_fr USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_fr_created_at ON blog_fr(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE blog_ja ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_en ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_ko ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_fr ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공개된 게시물을 조회할 수 있도록 정책 생성
CREATE POLICY "Anyone can view posted blog posts" ON blog_ja
  FOR SELECT USING (status = 'posted');

CREATE POLICY "Anyone can view posted blog posts" ON blog_en
  FOR SELECT USING (status = 'posted');

CREATE POLICY "Anyone can view posted blog posts" ON blog_ko
  FOR SELECT USING (status = 'posted');

CREATE POLICY "Anyone can view posted blog posts" ON blog_fr
  FOR SELECT USING (status = 'posted');

-- published_at이 현재 시간보다 이전인 경우 자동으로 status를 'posted'로 변경하는 함수
CREATE OR REPLACE FUNCTION update_blog_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published_at IS NOT NULL AND NEW.published_at <= NOW() THEN
    NEW.status := 'posted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 트리거 추가
CREATE TRIGGER update_blog_ja_status
  BEFORE INSERT OR UPDATE ON blog_ja
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_status();

CREATE TRIGGER update_blog_en_status
  BEFORE INSERT OR UPDATE ON blog_en
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_status();

CREATE TRIGGER update_blog_ko_status
  BEFORE INSERT OR UPDATE ON blog_ko
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_status();

CREATE TRIGGER update_blog_fr_status
  BEFORE INSERT OR UPDATE ON blog_fr
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_status();

-- 기존 게시물의 status를 자동으로 업데이트하는 함수
CREATE OR REPLACE FUNCTION sync_blog_status()
RETURNS void AS $$
BEGIN
  UPDATE blog_ja SET status = 'posted' 
  WHERE published_at IS NOT NULL AND published_at <= NOW() AND status = 'draft';
  
  UPDATE blog_en SET status = 'posted' 
  WHERE published_at IS NOT NULL AND published_at <= NOW() AND status = 'draft';
  
  UPDATE blog_ko SET status = 'posted' 
  WHERE published_at IS NOT NULL AND published_at <= NOW() AND status = 'draft';
  
  UPDATE blog_fr SET status = 'posted' 
  WHERE published_at IS NOT NULL AND published_at <= NOW() AND status = 'draft';
END;
$$ LANGUAGE plpgsql;

-- 참고: scheduled sync는 Supabase Edge Functions나 Vercel Cron Jobs를 통해 구현할 수 있습니다.
-- 또는 트리거로 INSERT/UPDATE 시 자동으로 상태를 업데이트하므로 수동 sync는 필요에 따라만 호출하면 됩니다.

