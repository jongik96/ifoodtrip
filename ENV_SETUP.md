# 🔐 환경변수 설정 가이드

## 필수 단계: .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI API Key (필수)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (레시피 저장 기능을 사용하려면 필요)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 1. OpenAI API 키 발급 (필수)

### 단계:
1. https://platform.openai.com 방문
2. 로그인 또는 계정 생성
3. 왼쪽 메뉴에서 "API keys" 클릭
4. "Create new secret key" 버튼 클릭
5. 키 이름 입력 (예: "word-food-ai")
6. 생성된 키를 복사하여 `.env.local`의 `OPENAI_API_KEY`에 붙여넣기

**중요:** 
- API 키는 한 번만 표시되므로 안전한 곳에 보관하세요
- 무료 계정은 제한된 크레딧을 제공합니다
- 사용량은 https://platform.openai.com/usage 에서 확인 가능

## 2. Supabase 설정 (선택사항)

**레시피 저장 기능을 사용하지 않는다면 이 단계는 건너뛸 수 있습니다.**

### 단계:
1. https://supabase.com 방문
2. "Start your project" 클릭하여 프로젝트 생성
3. 프로젝트 이름과 비밀번호 설정
4. 왼쪽 메뉴에서 "SQL Editor" 클릭
5. "New query" 버튼 클릭
6. 다음 SQL을 실행하여 테이블 생성:

```sql
-- recipes 테이블 생성
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  calories INTEGER,
  recipe_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_type ON recipes(recipe_type);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 레시피를 조회할 수 있도록 정책 생성
CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT USING (true);

-- 인증된 사용자만 레시피를 삽입할 수 있도록 정책 생성
CREATE POLICY "Authenticated users can insert recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

7. Settings > API 메뉴로 이동
8. "Project URL"과 "anon public" 키를 복사
9. `.env.local` 파일에 붙여넣기

## 3. 환경변수 확인

`.env.local` 파일 내용 예시:

```env
OPENAI_API_KEY=sk-proj-aBc123XyZ456...
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속!

## 5. Vercel 배포 시 환경변수 설정

Vercel 대시보드 > Settings > Environment Variables에서 다음 변수를 추가:

- `OPENAI_API_KEY` (필수)
- `NEXT_PUBLIC_SUPABASE_URL` (선택)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (선택)

## 🚨 보안 주의사항

- ❌ `.env.local` 파일을 절대 Git에 커밋하지 마세요
- ❌ API 키를 공개 저장소에 업로드하지 마세요
- ✅ `.gitignore`에 `.env*.local`이 포함되어 있는지 확인하세요
- ✅ API 키가 노출되었다면 즉시 재발급하세요

## 문제 해결

### OpenAI API 오류
- API 키가 올바른지 확인
- 크레딧 잔액 확인 (https://platform.openai.com/account/billing)
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 서버 재시작 (Ctrl+C 후 `npm run dev`)

### Supabase 연결 오류
- URL과 키가 올바른지 확인
- 테이블이 정상적으로 생성되었는지 확인
- RLS 정책이 적용되었는지 확인

---

설정이 완료되면 프로젝트를 즐기세요! 🎉








