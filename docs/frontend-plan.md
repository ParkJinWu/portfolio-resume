# 프론트엔드 섹션 구현 계획

## 현황 (2026-03-25 기준)

### 완료된 인프라
- `@tanstack/react-query` 설치 ✅
- `app/providers.tsx` 생성 (QueryClientProvider) ✅
- `app/layout.tsx`에 Providers 적용 ✅
- `lib/api.ts` — `apiFetch<T>()` 헬퍼 구현 ✅
- `lib/types.ts` — 전체 타입 정의 (`About`, `Experience`, `Project`, `Skill`, `Education`, `Contact`) ✅
- `app/api/*/route.ts` — 전체 리소스 CRUD API ✅
- 관리자 페이지 CRUD UI ✅

### 남은 작업
`components/sections/` 하위 섹션 파일들이 모두 정적 placeholder 상태. API 연동 필요.

---

## 섹션 구현 순서

### 1. Hero 섹션 (`components/sections/Hero.tsx`)

- **데이터 소스:** `GET /api/about` → `{ name, title, bio, imageUrl, resumeUrl }`
- **컴포넌트 타입:** Client Component (`'use client'`, useQuery)
- **표시 항목:**
  - name (큰 제목)
  - title (직책/역할)
  - bio (소개 문구)
  - resumeUrl (이력서 다운로드 버튼)
  - imageUrl (프로필 이미지, 있을 경우)
- **CTA 버튼:** Contact 섹션으로 스크롤, Projects 섹션으로 스크롤

### 2. About 섹션 (`components/sections/About.tsx`)

- **데이터 소스:** `GET /api/about` (Hero와 동일 queryKey 공유 → 캐시 재사용)
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - bio (더 자세한 소개)
  - 스킬 요약 또는 간단한 자기소개 텍스트

### 3. Experience 섹션 (`components/sections/Experience.tsx`)

- **데이터 소스:** `GET /api/experience` → `[{ company, position, startDate, endDate, description, order }]`
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - company (회사명)
  - position (직책)
  - startDate ~ endDate (기간, endDate null이면 "현재")
  - description (업무 설명)
- **정렬:** order asc (API가 이미 처리)

### 4. Skills 섹션 (`components/sections/Skills.tsx`)

- **데이터 소스:** `GET /api/skills` → `[{ name, category, iconUrl, order }]`
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - category별 그룹핑: Frontend / Backend / DevOps / Tool
  - name (기술 이름)
  - iconUrl (아이콘, 있을 경우)

### 5. Projects 섹션 (`components/sections/Projects.tsx`)

- **데이터 소스:** `GET /api/projects` → `[{ title, description, imageUrl, siteUrl, githubUrl, tags, order }]`
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - title (프로젝트명)
  - description (설명)
  - tags (기술 태그 배열)
  - siteUrl (배포 링크, 있을 경우)
  - githubUrl (GitHub 링크, 있을 경우)
  - imageUrl (썸네일, 있을 경우)

### 6. Blog 섹션 (`components/sections/Blog.tsx`)

- **데이터 소스:** 없음 (DB 모델 없음) → 정적 콘텐츠
- **컴포넌트 타입:** Server Component (useQuery 불필요)
- **표시 항목:**
  - 외부 블로그 URL 링크 (환경변수 또는 About 데이터에서 추후 통합)
  - "블로그 바로가기" CTA

### 7. Education 섹션 (`components/sections/Education.tsx`)

- **데이터 소스:** `GET /api/education` → `[{ institution, degree, startDate, endDate, description, order }]`
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - institution (학교/기관명)
  - degree (학위/자격증명)
  - startDate ~ endDate (기간)
  - description (세부사항, 있을 경우)

### 8. Contact 섹션 (`components/sections/Contact.tsx`)

- **데이터 소스:** `GET /api/contact` → `[{ type, label, value, order }]`
- **컴포넌트 타입:** Client Component
- **표시 항목:**
  - type별 아이콘 (`lucide-react` 사용): email, github, linkedin, blog
  - label (표시 이름)
  - value (URL 또는 이메일)
  - 클릭 시 외부 링크

---

## react-query 데이터 페칭 패턴

### 기본 패턴

```ts
'use client'
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, isError } = useQuery({
  queryKey: ['섹션명'],
  queryFn: () =>
    fetch('/api/섹션명')
      .then(r => r.json())
      .then(r => r.data),
})
```

### queryKey 목록

| 섹션 | queryKey |
|------|---------|
| Hero, About | `['about']` |
| Experience | `['experience']` |
| Skills | `['skills']` |
| Projects | `['projects']` |
| Education | `['education']` |
| Contact | `['contact']` |

Hero와 About이 동일한 `['about']` key를 사용하면 fetch 1회로 양쪽 캐시 공유.

---

## 로딩 / 에러 상태 처리

### 로딩 상태 (Skeleton)

```tsx
if (isLoading) {
  return (
    <section id="섹션id" className="...">
      <div className="animate-pulse">
        <div className="h-4 bg-muted/30 rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted/30 rounded w-2/3 mb-2" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
      </div>
    </section>
  )
}
```

### 에러 상태

```tsx
if (isError) {
  return (
    <section id="섹션id" className="...">
      <p className="text-muted text-sm">데이터를 불러오지 못했습니다.</p>
    </section>
  )
}
```

### 데이터 없음 상태

```tsx
if (!data || data.length === 0) {
  return null  // 섹션 자체를 숨김 (또는 준비 중 메시지)
}
```

---

## 스타일 가이드 (기존 globals.css 기준)

- **배경:** `bg-background`
- **표면:** `bg-surface`
- **테두리:** `border-border border-dashed`
- **본문 텍스트:** `text-foreground`
- **보조 텍스트:** `text-muted`
- **섹션 레이블:** `font-mono text-xs uppercase tracking-widest text-muted`
- **섹션 패딩:** `max-w-2xl mx-auto px-6 py-16 border-b border-dashed border-border`

---

## 구현 후 체크리스트

- [x] `@tanstack/react-query` 설치
- [x] `app/providers.tsx` 생성 (QueryClientProvider)
- [x] `app/layout.tsx`에 Providers 적용
- [ ] Hero 섹션 구현 및 /api/about 연결
- [ ] About 섹션 구현 (캐시 공유)
- [ ] Experience 섹션 구현
- [ ] Skills 섹션 구현 (category 그룹핑)
- [ ] Projects 섹션 구현
- [ ] Blog 섹션 구현 (정적)
- [ ] Education 섹션 구현
- [ ] Contact 섹션 구현
- [ ] 로딩/에러 상태 전 섹션 확인
- [ ] 다크모드에서 모든 섹션 색상 확인
