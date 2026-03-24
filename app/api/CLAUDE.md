# app/api/ — 백엔드 에이전트 가이드

## 네이밍 규칙
- 리소스 중심 경로: `app/api/[리소스]/route.ts` (복수형, 소문자)
- 단일 리소스: `app/api/[리소스]/[id]/route.ts`
- 예: `app/api/projects/route.ts`, `app/api/projects/[id]/route.ts`

## Prisma 사용 패턴
```ts
import { prisma } from '@/lib/prisma' // 싱글턴 클라이언트
// 조회
const items = await prisma.project.findMany({ orderBy: { order: 'asc' } })
// 생성/수정/삭제는 try-catch로 감싸고 에러 응답 반환
```
- `lib/prisma.ts`에 싱글턴 인스턴스 선언. Route마다 `new PrismaClient()` 금지.

## 응답 형식
```ts
// 성공
return Response.json({ data: result }, { status: 200 })
// 에러
return Response.json({ error: '설명' }, { status: 400 | 401 | 404 | 500 })
```
- 항상 `{ data }` 또는 `{ error }` 래퍼 사용. 원시값 직접 반환 금지.

## 인증 규칙
- 관리자 전용 엔드포인트(POST/PUT/DELETE)는 핸들러 최상단에서 세션 검증 후 미인증 시 즉시 `401` 반환.
- GET(공개 조회)은 인증 불필요.
