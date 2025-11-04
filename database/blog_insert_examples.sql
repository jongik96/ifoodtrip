-- ============================================
-- 블로그 글 작성 예제 (Supabase SQL Editor용)
-- ============================================

-- ============================================
-- 한국어 블로그 글 예제 (blog_ko)
-- ============================================

-- 예제 1: 한국 요리 소개
INSERT INTO blog_ko (
  title,
  description,
  content,
  published_at,
  tags,
  status
) VALUES (
  '김치의 세계: 한국 대표 발효식품의 모든 것',
  '김치의 역사, 영양가, 다양한 종류와 집에서 만드는 방법까지 알아봅니다.',
  '# 김치의 세계: 한국 대표 발효식품의 모든 것

## 김치란?

김치는 한국의 전통 발효식품으로, 배추나 무를 주재료로 하여 고춧가루, 마늘, 생강 등의 양념과 함께 발효시킨 음식입니다. 세계보건기구(WHO)에서 선정한 세계 5대 건강식품 중 하나로 선정되기도 했습니다.

## 김치의 역사

김치는 삼국시대부터 존재했다고 알려져 있으며, 조선시대에 들어서 본격적으로 발전했습니다. 당시 저장 기술이 부족했던 환경에서 채소를 보관하는 중요한 방법이었습니다.

## 김치의 영양가

- **비타민**: 비타민 A, B, C가 풍부
- **유산균**: 발효 과정에서 생성되는 유익한 박테리아
- **섬유질**: 소화를 돕는 식이섬유가 풍부
- **저칼로리**: 다이어트에 좋은 저칼로리 식품

## 김치의 종류

### 배추김치
가장 대표적인 김치로, 배추를 주재료로 합니다.

### 총각김치
작은 무를 통째로 발효시킨 김치입니다.

### 깍두기
무를 깍둑썰기하여 만든 김치로, 바삭한 식감이 특징입니다.

### 열무김치
봄에 나는 열무로 만든 시원하고 아삭한 김치입니다.

## 집에서 김치 담그기

### 기본 재료
- 배추 1포기
- 소금 1컵
- 고춧가루 3큰술
- 마늘 5쪽
- 생강 1톨
- 파 3대
- 멸치젓 2큰술

### 만드는 방법

1. 배추를 4등분하고 소금에 절인다.
2. 멸치젓에 고춧가루, 마늘, 생강을 넣고 양념을 만든다.
3. 배추의 물기를 제거하고 양념을 발라준다.
4. 항아리에 담아 실온에서 1-2일 발효시킨다.
5. 냉장고에 보관하며 드신다.

## 김치 활용 요리

- **김치찌개**: 대표적인 김치 요리
- **김치볶음밥**: 간단하고 맛있는 한식
- **김치전**: 바삭하게 구운 전

## 마무리

김치는 한국 문화의 중요한 부분이며, 건강에도 좋은 음식입니다. 집에서 직접 만들어보시면 더욱 건강하고 맛있는 김치를 드실 수 있습니다.',
  NOW(),
  ARRAY['한국요리', '김치', '발효식품', '건강식품'],
  'posted'
);

-- 예제 2: 일식 소개
INSERT INTO blog_ko (
  title,
  description,
  content,
  published_at,
  tags,
  status
) VALUES (
  '스시의 예술: 일본 요리의 정수',
  '스시의 종류, 올바른 먹는 방법, 그리고 집에서 만들어보는 스시 레시피를 소개합니다.',
  '# 스시의 예술: 일본 요리의 정수

## 스시란?

스시는 밥에 식초를 넣어 만든 초밥에 신선한 생선회나 해산물을 올린 일본의 대표적인 요리입니다.

## 스시의 종류

### 니기리즈시
가장 전통적인 스시로, 손으로 직접 만들어 올리는 방식입니다.

### 마키즈시
김에 밥과 재료를 말아서 만드는 롤 스시입니다.

### 사시미
생선회만을 담아내는 방식으로, 밥 없이 먹습니다.

## 스시 먹는 법

1. 손으로 먹는 것이 전통이지만, 젓가락도 사용 가능합니다.
2. 와사비는 간장에 타지 말고 직접 올려서 드세요.
3. 생선 부분을 간장에 살짝 담그세요 (밥 부분은 담그지 마세요).
4. 한 입에 먹는 것이 원칙입니다.',
  NOW(),
  ARRAY['일본요리', '스시', '일식'],
  'posted'
);


-- ============================================
-- 일본어 블로그 글 예제 (blog_ja)
-- ============================================

INSERT INTO blog_ja (
  title,
  description,
  content,
  published_at,
  tags,
  status
) VALUES (
  '味噌汁の基本：日本の伝統的なスープ',
  '味噌汁の作り方、種類、健康効果について詳しく解説します。',
  '# 味噌汁の基本：日本の伝統的なスープ

## 味噌汁とは

味噌汁は、日本の食卓に欠かせない伝統的なスープです。味噌を出汁で溶かして作り、豆腐やわかめなどの具材を入れて食べます。

## 味噌汁の歴史

味噌汁は飛鳥時代から食べられてきたと言われています。日本料理の基本中の基本です。

## 味噌汁の健康効果

- **整腸作用**: 味噌に含まれる乳酸菌が腸内環境を整えます
- **抗酸化作用**: イソフラボンなどの成分が健康に良い
- **低カロリー**: ダイエットにも最適

## 基本の作り方

### 材料
- だし汁 400ml
- 味噌 大さじ2
- 豆腐 100g
- わかめ 適量
- ねぎ 適量

### 手順
1. だし汁を温める
2. 豆腐をさいの目に切る
3. 味噌を溶かし入れる
4. 豆腐とわかめを加える
5. 沸騰直前に火を止める',
  NOW(),
  ARRAY['日本料理', '味噌汁', '伝統', '健康'],
  'posted'
);


-- ============================================
-- 영어 블로그 글 예제 (blog_en)
-- ============================================

INSERT INTO blog_en (
  title,
  description,
  content,
  published_at,
  tags,
  status
) VALUES (
  'The Art of Korean BBQ: A Complete Guide',
  'Learn about Korean BBQ, different types of meat, marinades, and how to grill the perfect piece of meat at home.',
  '# The Art of Korean BBQ: A Complete Guide

## What is Korean BBQ?

Korean BBQ, or "Gogi-gui", is a popular Korean dining experience where diners grill meat at their table. It''s a social and interactive way to enjoy a meal.

## Popular Cuts of Meat

### Galbi (Short Ribs)
Marinated beef short ribs that are tender and flavorful.

### Bulgogi (Thinly Sliced Beef)
Sweet and savory marinated beef that cooks quickly on the grill.

### Samgyeopsal (Pork Belly)
Unmarinated pork belly, served with various side dishes.

## Essential Side Dishes

- **Kimchi**: Fermented vegetables
- **Ssamjang**: Korean dipping sauce
- **Lettuce leaves**: For wrapping
- **Garlic and peppers**: For additional flavor

## Grilling Tips

1. Heat the grill to medium-high
2. Don''t overcook - Korean BBQ should be juicy
3. Flip frequently for even cooking
4. Cut into bite-sized pieces with scissors

## Marinade Recipe

### Ingredients
- 1/2 cup soy sauce
- 3 tbsp brown sugar
- 2 tbsp sesame oil
- 4 cloves minced garlic
- 1 tsp grated ginger
- 1/4 cup pear puree

Mix all ingredients and marinate meat for at least 4 hours.',
  NOW(),
  ARRAY['Korean Food', 'BBQ', 'Grilling', 'Recipe'],
  'posted'
);


-- ============================================
-- 프랑스어 블로그 글 예제 (blog_fr)
-- ============================================

INSERT INTO blog_fr (
  title,
  description,
  content,
  published_at,
  tags,
  status
) VALUES (
  'La Cuisine Japonaise: Les Bases du Ramen',
  'Découvrez l''histoire du ramen, ses différents types et comment préparer un bol de ramen authentique à la maison.',
  '# La Cuisine Japonaise: Les Bases du Ramen

## Qu''est-ce que le Ramen?

Le ramen est un plat de nouilles japonais populaire, composé de nouilles de blé servies dans un bouillon aromatique.

## Types de Ramen

### Shoyu Ramen
Bouillon à base de sauce soja, clair et léger.

### Miso Ramen
Bouillon à base de pâte miso, riche et savoureux.

### Tonkotsu Ramen
Bouillon à base de porc, crémeux et riche.

## Ingrédients Essentiels

- **Nouilles**: Fraîches ou séchées
- **Bouillon**: Base de poulet, porc ou légumes
- **Tare**: Sauce assaisonnée
- **Garnitures**: Œuf, nori, porc, algues

## Recette de Base

1. Préparer le bouillon
2. Cuire les nouilles
3. Ajouter le tare
4. Garnir et servir chaud',
  NOW(),
  ARRAY['Cuisine Japonaise', 'Ramen', 'Nouilles', 'Recette'],
  'posted'
);


-- ============================================
-- 블로그 글 업데이트 예제
-- ============================================

-- 특정 블로그 글의 상태를 'posted'로 변경
-- UPDATE blog_ko 
-- SET status = 'posted', published_at = NOW()
-- WHERE id = 'your-post-id-here';

-- 블로그 글 수정 예제
-- UPDATE blog_ko 
-- SET 
--   title = '수정된 제목',
--   description = '수정된 설명',
--   content = '수정된 내용',
--   tags = ARRAY['태그1', '태그2']
-- WHERE id = 'your-post-id-here';


-- ============================================
-- 블로그 글 간 이전/다음 게시물 연결하기
-- ============================================

-- 두 번째 글 작성 후 첫 번째 글의 next_post 업데이트
-- UPDATE blog_ko 
-- SET next_post = 'second-post-id'
-- WHERE id = 'first-post-id';

-- 두 번째 글의 previous_post 업데이트
-- UPDATE blog_ko 
-- SET previous_post = 'first-post-id'
-- WHERE id = 'second-post-id';



