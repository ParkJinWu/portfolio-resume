# app/ — 프론트엔드 에이전트 가이드

## 컴포넌트 기본 원칙
- 기본은 Server Component. 브라우저 API, 이벤트 핸들러, useState/useEffect가 필요할 때만 `'use client'` 추가.
- `'use client'`는 파일 최상단 첫 줄에 선언.
- Server Component에서 직접 DB 접근 금지 — 반드시 `app/api/` Route를 통해 데이터 수신.

## 데이터 페칭 패턴 (react-query)
- 서버 데이터 조회: `useQuery({ queryKey: ['섹션명'], queryFn: () => fetch('/api/섹션명').then(r => r.json()) })`
- 뮤테이션: `useMutation` + `onSuccess`에서 `queryClient.invalidateQueries` 호출.
- `queryKey`는 `['리소스', id?]` 형태로 계층 구조 유지.
- `QueryClientProvider`는 `app/providers.tsx`에 한 곳만 선언.

## 페이지 / 레이아웃 규칙
- 각 `page.tsx`에 `export const metadata` 정의 (SEO).
- 레이아웃 중첩은 최소화. 루트 레이아웃(`app/layout.tsx`)에서 폰트·테마 Provider만 처리.
- 동적 라우트: `[id]` 폴더명, params 타입은 `{ params: Promise<{ id: string }> }` (Next.js 15).

## 테마
- `next-themes`의 `ThemeProvider`는 `app/providers.tsx`에서 관리.
- 다크모드 클래스: `dark:` Tailwind 변형 사용. 인라인 스타일 금지.
