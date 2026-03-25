# API 인증 추가 계획

## 현황

현재 모든 API Route(`app/api/*/route.ts`)는 POST/PUT/DELETE 핸들러에
인증 검증이 없어 누구나 DB 데이터를 수정/삭제할 수 있는 상태.

- `GET` — 공개 조회 (인증 불필요, 현재도 맞음)
- `POST / PUT / DELETE` — 관리자 전용 (인증 필요, **미적용**)

---

## 인증 방식

프로젝트는 `next-auth@^5.0.0-beta.30`를 사용 중.
`auth.ts`에서 export 되는 `auth()` 함수로 서버 사이드 세션 확인 가능.

```ts
// auth.ts에서 이미 export 됨
import { auth } from '@/auth'

// Route Handler 내에서 사용
const session = await auth()
if (!session) {
  return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
}
```

---

## 적용 대상 파일 (6개)

| 파일 | 적용 핸들러 |
|------|------------|
| `app/api/about/route.ts` | POST, PUT, DELETE |
| `app/api/experience/route.ts` | POST, PUT, DELETE |
| `app/api/projects/route.ts` | POST, PUT, DELETE |
| `app/api/skills/route.ts` | POST, PUT, DELETE |
| `app/api/education/route.ts` | POST, PUT, DELETE |
| `app/api/contact/route.ts` | POST, PUT, DELETE |

---

## 적용 패턴

각 POST/PUT/DELETE 핸들러 **첫 줄**에 세션 검증 추가:

```ts
export async function POST(req: NextRequest) {
  // 1. 인증 검증 (항상 최상단)
  const session = await auth()
  if (!session) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  // 2. 기존 로직 (변경 없음)
  try {
    const body = await req.json()
    const result = await prisma.모델.create({ data: body })
    return Response.json({ data: result }, { status: 201 })
  } catch (e) {
    return Response.json({ error: '서버 오류' }, { status: 500 })
  }
}
```

PUT과 DELETE도 동일하게 첫 줄에 세션 검증 삽입.

---

## 에러 응답 형식

기존 `{ error, status }` 패턴 유지:

```json
// 미인증 요청 → 401
{ "error": "인증이 필요합니다." }

// 이미 로그아웃/세션 만료 → 401
{ "error": "인증이 필요합니다." }
```

클라이언트(관리자 UI)에서는 401 응답 수신 시 `/admin/login`으로 리다이렉트 처리 예정.

---

## 테스트 방법

1. 브라우저에서 로그아웃 상태 유지
2. curl로 POST 요청:
   ```bash
   curl -X POST http://localhost:3000/api/about \
     -H "Content-Type: application/json" \
     -d '{"name":"test","title":"test","bio":"test"}'
   ```
3. 응답 확인: `{"error":"인증이 필요합니다."}` + HTTP 401
4. `/admin/login`에서 로그인 후 같은 요청 → 201 응답 확인

---

## 구현 순서

1. `app/api/about/route.ts` — POST, PUT, DELETE에 auth() 추가
2. `app/api/experience/route.ts` — 동일
3. `app/api/projects/route.ts` — 동일
4. `app/api/skills/route.ts` — 동일
5. `app/api/education/route.ts` — 동일
6. `app/api/contact/route.ts` — 동일
7. 로컬에서 curl 테스트 → 모두 401 확인
8. 로그인 후 재테스트 → 정상 동작 확인
