# ifoodtrip

global ai recipe

---

# 🍳 AI Recipe Generator

AI 기반 레시피 추천 서비스 - OpenAI와 Supabase를 활용한 맞춤형 요리 레시피 생성 플랫폼

## 📋 주요 기능

### 1. 재료 기반 AI 추천 레시피 🥘
- 보유한 재료를 입력하면 AI가 최적의 레시피를 생성
- 인분, 조리 시간, 난이도 설정 가능
- 알레르기 및 제외할 재료 지정
- **'다른 음식 추천받기'** 버튼으로 무한 재추천 가능

### 2. 오늘의 추천 요리 🌟
- 한식 또는 일식 중 선택
- 랜덤으로 추천된 전통 요리의 상세 레시피 제공
- AI가 요리의 문화적 배경과 함께 레시피 생성
- 다른 요리 추천 기능 지원

### 3. 맞춤형 식단 레시피 💪
- 다이어트 또는 근육 증강 목표 선택
- 목표 칼로리 설정 (800~4000 kcal)
- 상세한 영양 정보 제공
- 알레르기 고려한 맞춤형 식단

## 🛠 기술 스택

| 항목 | 기술/서비스 | 용도 |
|------|------------|------|
| **프론트엔드** | Next.js 14 (React, TypeScript) | UI 및 서버사이드 렌더링 |
| **스타일링** | Tailwind CSS | 반응형 디자인 |
| **배포** | Vercel | 호스팅 및 배포 |
| **데이터베이스** | Supabase | 레시피 저장 및 인증 |
| **AI 엔진** | OpenAI GPT-4 | 레시피 생성 |
| **다국어** | next-i18next | 영어/일본어 지원 |

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- OpenAI API Key
- Supabase 프로젝트 (선택사항)

### 설치 방법

1. **저장소 클론**
```bash
cd word-food-ai
```

2. **패키지 설치**
```bash
npm install
```

3. **환경변수 설정**

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 다음 값을 입력:

```env
# OpenAI API Key (필수)
OPENAI_API_KEY=sk-your-openai-api-key

# Supabase (레시피 저장 기능을 사용하려면 필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인

## 📁 프로젝트 구조

```
word-food-ai/
├── components/          # React 컴포넌트
│   ├── Layout.tsx      # 전체 레이아웃
│   ├── RecipeResult.tsx # 레시피 결과 표시
│   └── LoadingSpinner.tsx
├── pages/              # Next.js 페이지
│   ├── index.tsx       # 홈페이지
│   ├── ingredient-based.tsx  # 재료 기반 레시피
│   ├── daily-recommendation.tsx  # 오늘의 추천
│   ├── diet-plan.tsx   # 식단 플랜
│   └── api/            # API Routes
│       ├── generate-recipe.ts  # 레시피 생성 API
│       ├── save-recipe.ts      # 레시피 저장 API
│       └── daily-dishes.ts     # 추천 요리 목록 API
├── lib/                # 유틸리티 라이브러리
│   └── supabase.ts     # Supabase 클라이언트
├── types/              # TypeScript 타입 정의
│   ├── recipe.ts       # 레시피 타입
│   └── database.ts     # DB 타입
├── public/locales/     # 다국어 번역 파일
│   ├── en/common.json  # 영어
│   └── ja/common.json  # 일본어
└── styles/             # 스타일시트
    └── globals.css
```

## 🔧 Supabase 데이터베이스 스키마 (선택사항)

레시피 저장 기능을 사용하려면 다음 테이블을 생성:

### `recipes` 테이블

```sql
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
```

### `daily_recommendations` 테이블 (선택사항)

```sql
CREATE TABLE daily_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cuisine_type TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 핵심 기능: '다른 음식 추천받기'

각 기능에는 **'다른 음식 추천받기'** 버튼이 포함되어 있습니다:

1. **재료 기반 레시피**: 동일한 재료와 조건으로 완전히 다른 레시피 생성
2. **오늘의 추천**: 같은 요리 유형에서 다른 요리 랜덤 선택
3. **식단 플랜**: 동일한 칼로리 목표로 새로운 식단 레시피 생성

### 구현 로직

```typescript
// 이전 레시피 제목을 추적
const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);

// 재추천 시 이전 레시피를 제외하도록 프롬프트에 추가
if (previousRecipes.length > 0) {
  prompt += `\n⚠️ IMPORTANT: DO NOT generate these recipes: ${previousRecipes.join(', ')}`;
}
```

## 🌐 다국어 지원

- **영어 (English)**: 기본 언어
- **일본語 (Japanese)**: 완전 지원

언어 전환은 우측 상단 네비게이션에서 가능합니다.

## 📦 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 연결
3. 환경변수 설정 (OPENAI_API_KEY, Supabase 키)
4. 자동 배포 완료!

```bash
# Vercel CLI로 배포 (선택사항)
npm install -g vercel
vercel
```

## 🔑 API 키 발급 방법

### OpenAI API Key
1. [OpenAI Platform](https://platform.openai.com) 접속
2. API Keys 섹션에서 새 키 생성
3. `.env.local`에 `OPENAI_API_KEY` 추가

### Supabase (선택사항)
1. [Supabase](https://supabase.com) 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사
3. `.env.local`에 추가

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요!

## 📄 라이선스

MIT License

## 👨‍💻 개발자

AI Recipe Generator - Powered by OpenAI & Supabase

---

Made with ❤️ and 🤖 AI
