# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

개인 포트폴리오/이력서 웹사이트. Next.js App Router 기반 단일 프로젝트 (별도 백엔드 없음).

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel (main 브랜치 → 자동 프로덕션 배포)

## Directory Structure

```
portfolio-resume/          # 루트 = Next.js 앱 (frontend/ 서브디렉토리 없음)
├── app/                   # App Router 페이지 및 레이아웃
│   ├── layout.tsx         # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx           # 홈 (랜딩/히어로)
│   └── ...                # 추가 라우트 세그먼트
├── components/            # 재사용 UI 컴포넌트
│   ├── ui/                # 원자 단위 컴포넌트 (Button, Card 등)
│   └── sections/          # 페이지 섹션 단위 컴포넌트
├── lib/                   # 유틸리티, 상수, 타입 정의
├── public/                # 정적 에셋 (이미지, 폰트 등)
├── styles/                # 글로벌 CSS (Tailwind 진입점)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md
```

## Key Commands

```bash
# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 로컬 실행
npm run start

# 타입 체크
npx tsc --noEmit

# 린트
npm run lint
```

## Tech Stack Details

### Next.js App Router
- `app/` 디렉토리 사용. `pages/` 디렉토리 사용 금지.
- Server Component 기본 원칙: 클라이언트 상태/이벤트가 필요한 경우에만 `'use client'` 추가.
- 메타데이터는 각 `page.tsx` 또는 `layout.tsx`의 `export const metadata` 로 정의.

### TypeScript
- `tsconfig.json`의 `strict: true` 유지.
- `any` 타입 사용 금지. 불가피할 경우 `unknown` 사용 후 타입 가드 적용.

### Tailwind CSS
- 인라인 스타일(`style={}`) 대신 Tailwind 유틸리티 클래스 사용.
- 커스텀 색상/폰트는 `tailwind.config.ts`의 `theme.extend`에 정의.
- 반응형은 모바일 퍼스트 (`sm:`, `md:`, `lg:` 순서로 오버라이드).

### 추가 기술 스택
- **DB:** Neon (PostgreSQL)
- **ORM:** Prisma
- **상태관리:** @tanstack/react-query
- **관리자 순서변경:** @dnd-kit
- **테마:** next-themes (라이트/다크 토글)
- **아이콘:** lucide-react
- 콘텐츠는 DB에서 관리. 컴포넌트 내 하드코딩 금지.

## Deployment

- **플랫폼:** Vercel
- **트리거:** `main` 브랜치 push → 자동 프로덕션 배포
- **환경변수:** Vercel 대시보드에서 관리. `.env.local`은 로컬 전용이며 절대 커밋하지 않음.
- `vercel.json` 수정 시 반드시 사용자에게 확인 후 진행.

## Agent Instructions

각 작업 영역별 상세 규칙은 해당 CLAUDE.md를 참조할 것.

- 프론트엔드 (컴포넌트, 페이지): @components/CLAUDE.md, @app/CLAUDE.md
- API Route (백엔드): @app/api/CLAUDE.md
- DB/ORM: @prisma/CLAUDE.md

## Commit Convention

- 형식: `type: 한국어 설명`
- type 목록:
  - `feat`: 새 기능/섹션 추가
  - `style`: 디자인/스타일 변경
  - `fix`: 버그 수정
  - `content`: 텍스트/콘텐츠 수정
  - `refactor`: 코드 리팩토링
  - `chore`: 설정, MEMORY.md 등 기타
  - `deploy`: 배포 설정 변경
- Co-Authored-By 줄 추가 금지.
- 커밋 메시지는 한국어로 작성.

## Workflow Rules

- 섹션 작업 완료 시 `/Users/zinu/.claude/projects/-Users-zinu/memory/MEMORY.md`의 해당 체크박스를 `[ ]` → `[x]`로 업데이트할 것.
- 커밋 메시지: 위 Commit Convention 섹션 참조.
- 모든 답변은 한국어로 작성할 것.

## Absolute Prohibitions

- `.env`, `.env.local`, `.env.production` 등 환경변수 파일을 생성하거나 수정하지 않음.
- `next.config.ts`의 `experimental` 플래그를 무단으로 변경하지 않음.
- `package.json`의 의존성을 사용자 확인 없이 추가/삭제하지 않음.
- `pages/` 디렉토리를 생성하거나 App Router와 혼용하지 않음.
- `public/` 내 파일을 삭제하지 않음 (에셋 손실 위험).
- Vercel 배포 설정(`vercel.json`, 프로젝트 설정)을 무단으로 변경하지 않음.
