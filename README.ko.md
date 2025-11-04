# 🍳 AI 레시피 생성기

OpenAI와 Supabase를 활용한 AI 기반 맞춤형 요리 레시피 추천 서비스

## ✨ 프로젝트 소개

이 프로젝트는 최신 AI 기술을 활용하여 사용자 맞춤형 레시피를 실시간으로 생성하는 웹 애플리케이션입니다. OpenAI GPT-4를 활용하여 재료, 영양 목표, 요리 선호도에 따라 개인화된 레시피를 제공합니다.

### 🎯 프로젝트 목표

- ✅ 보유 재료로 만들 수 있는 요리 추천
- ✅ 전통 한식/일식 레시피 탐색
- ✅ 개인 건강 목표에 맞는 식단 제공
- ✅ 무한 재추천으로 다양한 레시피 발견
- ✅ 다국어 지원으로 글로벌 사용자 접근성

## 🎨 주요 기능

### 1️⃣ 재료 기반 AI 추천 레시피

**냉장고에 있는 재료만으로 요리를!**

- 📝 재료 입력 및 관리
- 👥 인분 설정 (1~10인분)
- ⏱️ 조리 시간 제한 (15분~3시간)
- 🎚️ 난이도 선택 (쉬움/보통/어려움)
- 🚫 알레르기 및 제외 재료 설정
- 🔄 무한 재추천 기능

**활용 시나리오:**
> "냉장고에 닭가슴살, 양파, 마늘이 있는데 30분 안에 2인분 요리를 만들고 싶어요. 땅콩 알레르기가 있어요."

### 2️⃣ 오늘의 추천 요리

**매일 새로운 전통 요리 발견!**

- 🇰🇷 한식 전통 요리 10종
- 🇯🇵 일식 전통 요리 10종
- 📖 문화적 배경 설명 포함
- 🎲 랜덤 추천으로 새로운 요리 탐색
- 🔄 다른 요리 추천 기능

**한식 메뉴:**
김치찌개, 비빔밥, 불고기, 삼계탕, 잡채, 된장찌개, 갈비찜, 떡볶이, 순두부찌개, 해물파전

**일식 메뉴:**
とんかつ, ラーメン, 親子丼, 天ぷら, カレーライス, すき焼き, お好み焼き, 焼き鳥, うどん, 寿司

### 3️⃣ 맞춤형 식단 레시피

**당신의 건강 목표를 위한 식단!**

#### 다이어트 모드 🥗
- 저칼로리, 고영양 레시피
- 목표 칼로리: 800~2000 kcal
- 포만감을 주는 건강한 식단

#### 근육 증강 모드 🏋️
- 고단백, 균형 잡힌 영양
- 목표 칼로리: 2000~4000 kcal
- 근육 회복과 성장을 위한 식단

**영양 정보 제공:**
- 칼로리, 단백질, 탄수화물, 지방 상세 표시
- 알레르기 고려한 맞춤형 레시피
- 목표 달성을 위한 최적 식단

## 🏗️ 기술 아키텍처

### 프론트엔드
- **Next.js 14**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안정성 보장
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **next-i18next**: 다국어 지원

### 백엔드
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **OpenAI GPT-4**: 레시피 생성 AI 엔진
- **Supabase**: PostgreSQL 데이터베이스 및 인증

### 배포
- **Vercel**: 자동 배포 및 CDN
- **환경변수 관리**: 보안 키 관리

## 🔄 '다른 음식 추천받기' 구현 상세

### 핵심 알고리즘

```typescript
// 1. 이전 레시피 추적
const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);

// 2. 재추천 요청 시
const handleRegenerate = async () => {
  // 이전 레시피 제목을 API에 전달
  const response = await fetch('/api/generate-recipe', {
    method: 'POST',
    body: JSON.stringify({
      ...filters,
      previousRecipes, // 제외할 레시피 목록
    }),
  });
};

// 3. API에서 프롬프트 생성 시
if (previousRecipes.length > 0) {
  prompt += `
    ⚠️ IMPORTANT: DO NOT generate any of these recipes: 
    ${previousRecipes.join(', ')}. 
    You must create a completely different recipe.
  `;
}
```

### 중복 방지 메커니즘

1. **프론트엔드**: 생성된 레시피 제목을 배열에 저장 (최대 5개)
2. **API**: 프롬프트에 제외 조건 명시
3. **AI**: 이전과 다른 레시피 생성 보장

## 🌍 다국어 지원 구조

### 번역 파일 위치
```
public/locales/
├── en/common.json  # 영어
└── ja/common.json  # 일본어
```

### 사용 예시
```typescript
import { useTranslation } from 'next-i18next';

const { t, i18n } = useTranslation('common');

// 번역 사용
<h1>{t('home.title')}</h1>

// 언어 전환
i18n.changeLanguage('ja');
```

## 📊 데이터베이스 스키마 상세

### recipes 테이블
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),  -- 사용자 연결 (선택)
  title TEXT NOT NULL,                     -- 레시피 제목
  description TEXT,                        -- 설명
  ingredients JSONB NOT NULL,              -- 재료 목록 (JSON 배열)
  instructions JSONB NOT NULL,             -- 조리 순서 (JSON 배열)
  cooking_time INTEGER NOT NULL,           -- 조리 시간 (분)
  servings INTEGER NOT NULL,               -- 인분
  difficulty TEXT NOT NULL,                -- 난이도
  calories INTEGER,                        -- 칼로리
  recipe_type TEXT NOT NULL,               -- 레시피 유형
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_type ON recipes(recipe_type);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
```

### ingredients JSONB 구조 예시
```json
[
  { "name": "닭가슴살", "amount": "200", "unit": "g" },
  { "name": "양파", "amount": "1", "unit": "개" },
  { "name": "마늘", "amount": "3", "unit": "쪽" }
]
```

## 🚀 빠른 시작 가이드

### 1단계: 프로젝트 준비
```bash
# 패키지 설치
npm install

# 환경변수 파일 생성
cp .env.example .env.local
```

### 2단계: OpenAI API 키 발급
1. https://platform.openai.com 방문
2. 로그인 후 API Keys 메뉴 접속
3. "Create new secret key" 클릭
4. 생성된 키를 복사하여 `.env.local`에 추가

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
```

### 3단계: Supabase 설정 (선택사항)

**레시피 저장 기능을 사용하지 않는다면 이 단계는 건너뛰어도 됩니다.**

1. https://supabase.com 방문 후 프로젝트 생성
2. SQL Editor에서 위의 스키마 실행
3. Settings > API에서 URL과 anon key 복사
4. `.env.local`에 추가

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4단계: 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 앱 확인!

## 📦 프로덕션 빌드 및 배포

### 로컬 빌드 테스트
```bash
npm run build
npm start
```

### Vercel 배포 (1-Click Deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/word-food-ai)

**배포 단계:**
1. Vercel 계정 연결
2. 환경변수 설정 (OPENAI_API_KEY 필수)
3. Deploy 클릭
4. 완료! 🎉

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **직관적 인터페이스**: 사용자 친화적 폼과 버튼
- **실시간 피드백**: 로딩 애니메이션 및 상태 표시
- **접근성**: 시맨틱 HTML 및 ARIA 레이블
- **모던 디자인**: Gradient, Shadow, Smooth Transition

## 🔒 보안 고려사항

- ✅ API 키는 서버사이드에서만 사용 (`.env` 파일)
- ✅ 클라이언트에 노출되지 않도록 Next.js API Routes 활용
- ✅ Supabase RLS (Row Level Security) 설정 권장
- ✅ 환경변수는 절대 Git에 커밋하지 않음

## 🐛 문제 해결 (Troubleshooting)

### OpenAI API 오류
```
Error: Failed to generate recipe
```
**해결 방법:**
- API 키가 올바른지 확인
- OpenAI 계정에 크레딧이 있는지 확인
- 네트워크 연결 상태 확인

### Supabase 연결 오류
```
Error: Failed to save recipe
```
**해결 방법:**
- Supabase URL과 키가 올바른지 확인
- 테이블이 생성되었는지 확인
- Row Level Security 정책 확인

### 빌드 오류
```
Module not found
```
**해결 방법:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
rm package-lock.json
npm install
```

## 📈 향후 개선 계획

- [ ] 사용자 인증 및 로그인 기능
- [ ] 레시피 북마크 및 즐겨찾기
- [ ] 장바구니 기능 (재료 구매 목록)
- [ ] 레시피 공유 및 소셜 기능
- [ ] 음성 인식 재료 입력
- [ ] 이미지 업로드로 요리 분석
- [ ] 주간 식단 플래너
- [ ] 영양 통계 대시보드
- [ ] 더 많은 언어 지원 (중국어, 스페인어 등)

## 🤝 기여하기

프로젝트에 기여하고 싶으신가요?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

- 이슈: GitHub Issues
- 이메일: your-email@example.com

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

**Made with ❤️ by Developers, Powered by 🤖 AI**

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!








