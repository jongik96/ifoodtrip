# 🔐 환경 변수 설정 가이드

이 파일은 `.env.local` 파일을 설정하는 방법을 안내합니다.

## 1. .env.local 파일 생성

프로젝트 루트 디렉토리(`word-food-ai` 폴더)에 `.env.local` 파일을 생성하세요.

**Windows:**
- 메모장이나 VS Code로 새 파일 생성
- 파일명: `.env.local` (앞에 점 포함)

**Mac/Linux:**
```bash
touch .env.local
```

## 2. 환경 변수 입력 예시

`.env.local` 파일에 다음 형식으로 입력하세요:

```env
# OpenAI API Key (필수 - 레시피 생성에 필요)
OPENAI_API_KEY=sk-proj-abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567

# Supabase URL (선택사항 - 로그인/저장 기능 사용 시 필요)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co

# Supabase Anon Key (선택사항 - 로그인/저장 기능 사용 시 필요)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODU2NzgyMCwiZXhwIjoxOTQ0MTQzODIwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## 3. OpenAI API 키 발급 방법

### 단계별 가이드:

1. **OpenAI 웹사이트 접속**
   - https://platform.openai.com 접속
   - 계정이 없으면 회원가입

2. **API 키 생성**
   - 로그인 후 왼쪽 메뉴에서 "API keys" 클릭
   - "Create new secret key" 버튼 클릭
   - 키 이름 입력 (예: "word-food-ai")
   - "Create secret key" 클릭

3. **키 복사 및 저장**
   - 생성된 키를 복사 (한 번만 표시됨!)
   - `.env.local` 파일의 `OPENAI_API_KEY=` 뒤에 붙여넣기
   - 키는 `sk-proj-` 로 시작합니다

**예시:**
```env
OPENAI_API_KEY=sk-proj-abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567
```

⚠️ **주의**: API 키는 절대 공개하지 마세요!

## 4. Supabase 설정 방법 (선택사항)

로그인, 레시피 저장 기능을 사용하려면 Supabase 설정이 필요합니다.

### 단계별 가이드:

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - "Start your project" 클릭
   - 새 프로젝트 생성
   - 프로젝트 이름과 데이터베이스 비밀번호 설정

2. **API 정보 확인**
   - 프로젝트 대시보드에서 왼쪽 메뉴 "Settings" 클릭
   - "API" 메뉴 선택
   - "Project URL" 복사 → `NEXT_PUBLIC_SUPABASE_URL`에 입력
   - "anon public" 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **데이터베이스 테이블 생성**

Supabase 대시보드에서 SQL Editor를 열고 다음 SQL 실행:

```sql
-- users 테이블 (Supabase Auth 사용 시 자동 생성되지만 확장 정보 저장용)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prefs JSONB
);

-- pantry_items 테이블
CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ingredient_master 테이블
CREATE TABLE IF NOT EXISTS ingredient_master (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  synonyms_json JSONB
);

-- recipes 테이블
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  country TEXT,
  servings INTEGER NOT NULL,
  ingredients_json JSONB NOT NULL,
  steps_md TEXT NOT NULL,
  nutrition_json JSONB,
  time_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  public_bool BOOLEAN DEFAULT false
);

-- saved_recipes 테이블
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- blog_posts 테이블
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'en',
  published_at TIMESTAMP WITH TIME ZONE,
  draft_bool BOOLEAN DEFAULT true
);

-- ai_requests_log 테이블
CREATE TABLE IF NOT EXISTS ai_requests_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prompt_hash TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_in INTEGER NOT NULL,
  tokens_out INTEGER NOT NULL,
  response_excerpt TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- translations_cache 테이블
CREATE TABLE IF NOT EXISTS translations_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text_hash TEXT NOT NULL,
  locale TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  UNIQUE(source_text_hash, locale)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_country ON recipes(country);
CREATE INDEX IF NOT EXISTS idx_pantry_items_user_id ON pantry_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id ON ai_requests_log(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests_log ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (예시 - 필요에 따라 수정)
CREATE POLICY "Users can view own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id OR public_bool = true);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own pantry" ON pantry_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved recipes" ON saved_recipes
  FOR ALL USING (auth.uid() = user_id);
```

## 5. 최소 설정 (레시피 생성만 사용)

레시피 생성 기능만 사용하고 로그인/저장 기능은 사용하지 않으려면:

```env
# OpenAI API Key만 설정
OPENAI_API_KEY=sk-proj-your-key-here
```

Supabase 설정은 생략해도 됩니다.

## 6. 전체 설정 예시 (모든 기능 사용)

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODU2NzgyMCwiZXhwIjoxOTQ0MTQzODIwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## 7. 환경 변수 확인 및 테스트

설정이 완료되면:

1. **파일 위치 확인**
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - `package.json`과 같은 위치여야 함

2. **서버 재시작**
   ```bash
   # 개발 서버가 실행 중이면 Ctrl+C로 중지 후
   npm run dev
   ```

3. **테스트**
   - http://localhost:3000 접속
   - 레시피 생성 기능 테스트
   - OpenAI API 키가 올바르면 레시피가 생성됩니다

## 8. 주의사항

⚠️ **보안 관련:**

- ✅ `.env.local` 파일은 절대 Git에 커밋하지 마세요
- ✅ `.gitignore`에 `.env*.local`이 포함되어 있는지 확인
- ✅ API 키를 공개 저장소나 채팅에 공유하지 마세요
- ✅ 키가 노출되었다면 즉시 재발급하세요
- ✅ `.env.example` 파일만 커밋하고 실제 키는 포함하지 마세요

## 9. 문제 해결

### OpenAI API 오류
- ✅ API 키가 올바른지 확인 (sk-proj- 로 시작)
- ✅ 크레딧 잔액 확인: https://platform.openai.com/account/billing
- ✅ 서버 재시작 (환경 변수 변경 후 반드시 재시작)

### Supabase 연결 오류
- ✅ URL 형식 확인 (https:// 로 시작)
- ✅ Anon Key가 올바른지 확인
- ✅ Supabase 프로젝트가 활성화되어 있는지 확인
- ✅ 테이블이 생성되었는지 확인 (SQL Editor에서 확인)

### 환경 변수가 인식되지 않음
- ✅ 파일명이 정확한지 확인 (`.env.local` - 점 포함)
- ✅ 프로젝트 루트에 있는지 확인
- ✅ 서버를 재시작했는지 확인
- ✅ 주석이나 공백 문제 확인

## 10. Vercel 배포 시 설정

Vercel에 배포할 때는:

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. 다음 변수 추가:
   - `OPENAI_API_KEY` (Production, Preview, Development 모두)
   - `NEXT_PUBLIC_SUPABASE_URL` (선택)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (선택)
3. 배포 자동 실행

---

**도움이 필요하신가요?**
- GitHub Issues에 질문 올려주세요
- 또는 문서를 확인해주세요





