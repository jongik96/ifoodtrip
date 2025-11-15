# 🌍 블로그 시스템 설정 가이드

## 데이터베이스 스키마 생성

### 1. Supabase SQL Editor에서 실행

1. Supabase Dashboard 접속
2. 왼쪽 메뉴에서 "SQL Editor" 클릭
3. "New query" 버튼 클릭
4. `database/blog_schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
5. "Run" 버튼 클릭하여 실행

### 2. 생성되는 테이블

- `blog_ja` - 일본어 블로그 포스트
- `blog_en` - 영어 블로그 포스트
- `blog_ko` - 한국어 블로그 포스트
- `blog_fr` - 프랑스어 블로그 포스트

### 3. 자동 기능

- ✅ `published_at`이 현재 시간보다 이전이면 자동으로 `status`가 'posted'로 변경
- ✅ 매일 자정에 자동으로 status 동기화
- ✅ 이전/다음 포스트 참조 관계 유지

## 테스트 데이터 삽입

### 예시: 한국어 블로그 포스트

```sql
-- 첫 번째 포스트
INSERT INTO blog_ko (title, description, content, published_at, tags, status)
VALUES (
  '김치의 역사와 세계적 인기',
  '한국의 대표 발효식품 김치의 전통적인 제조 방법부터 최근 세계 각국에서 인기를 끌고 있는 신한류 현상까지 알아봅니다.',
  '# 김치의 역사

김치는 한국을 대표하는 전통 발효식품입니다.

## 재료
- 배추
- 고춧가루
- 마늘
- 생강
- 젓갈

## 만드는 방법
1. 배추를 소금에 절입니다
2. 양념을 만들고 배추에 발라냅니다
3. 발효시킵니다

김치는 세계 각국에서 인기를 끌고 있습니다!',
  NOW() - INTERVAL '1 day',  -- 어제 게시
  ARRAY['김치', '한국요리', '발효식품'],
  'posted'
);

-- 두 번째 포스트
INSERT INTO blog_ko (title, description, content, published_at, tags, status)
VALUES (
  '떡볶이의 진화',
  '길거리 음식에서 세계적인 푸드 트렌드로 떠오른 떡볶이의 변신사를 소개합니다.',
  '# 떡볶이의 진화

떡볶이는 한국의 대표적인 길거리 음식입니다.

## 재료
- 가래떡
- 오뚜기 떡볶이 양념
- 어묵
- 계란
- 대파

## 만드는 방법
1. 떡을 미리 불립니다
2. 양념을 끓입니다
3. 떡과 어묵을 넣고 볶습니다
4. 계란을 넣고 완성합니다

최근에는 다양한 변형 떡볶이가 등장하고 있습니다!',
  NOW(),  -- 오늘 게시
  ARRAY['떡볶이', '한국요리', '길거리음식'],
  'posted'
);

-- 이전/다음 포스트 연결
UPDATE blog_ko 
SET previous_post = (SELECT id FROM blog_ko WHERE title = '김치의 역사와 세계적 인기'),
    next_post = (SELECT id FROM blog_ko WHERE title = '떡볶이의 진화')
WHERE title = '떡볶이의 진화';

UPDATE blog_ko 
SET previous_post = (SELECT id FROM blog_ko WHERE title = '떡볶이의 진화')
WHERE title = '김치의 역사와 세계적 인기';
```

### 예시: 영어 블로그 포스트

```sql
INSERT INTO blog_en (title, description, content, published_at, tags, status)
VALUES (
  'The History of Kimchi and Its Global Popularity',
  'Learn about Korea''s representative fermented food, from traditional manufacturing methods to the recent Hallyu phenomenon gaining popularity around the world.',
  '# The History of Kimchi

Kimchi is Korea''s representative traditional fermented food.

## Ingredients
- Cabbage
- Red pepper powder
- Garlic
- Ginger
- Fish sauce

## How to Make
1. Salt the cabbage
2. Make seasoning and rub it on cabbage
3. Ferment

Kimchi is gaining popularity around the world!',
  NOW(),
  ARRAY['kimchi', 'korean food', 'fermented food'],
  'posted'
);
```

## 예약 게시 테스트

```sql
-- 내일 게시될 포스트 (자동으로 status가 'draft'로 유지됨)
INSERT INTO blog_ko (title, description, content, published_at, tags, status)
VALUES (
  '비빔밥의 세계화',
  '한국의 밥 요리 비빔밥이 어떻게 세계 각국에서 사랑받게 되었는지 알아봅니다.',
  '# 비빔밥의 세계화

비빔밥은 한국의 건강식입니다...',
  NOW() + INTERVAL '1 day',  -- 내일 게시 예정
  ARRAY['비빔밥', '한국요리', '건강식'],
  'draft'
);
```

이렇게 설정하면 내일 자정에 자동으로 status가 'posted'로 변경됩니다!

## 확인 방법

1. Supabase Table Editor에서 `blog_ko` 테이블 확인
2. 웹사이트에서 `/blog` 또는 `/ko/blog` 접속
3. 게시된 포스트가 목록에 표시되는지 확인
4. 포스트 클릭하여 상세 페이지 확인

## 주요 기능

✅ **언어별 분리** - 각 언어별로 독립적인 테이블 관리
✅ **자동 게시** - `published_at`에 도달하면 자동 게시
✅ **태그 필터** - 블로그 목록에서 태그별 필터링 가능
✅ **네비게이션** - 이전/다음 포스트 쉽게 이동
✅ **ISR** - 60초마다 자동 재검증으로 최신 데이터 유지
✅ **반응형** - 모바일/데스크톱 모두 최적화

---

설정이 완료되면 블로그를 시작하세요! 🎉






