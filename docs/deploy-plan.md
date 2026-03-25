# Vercel 배포 계획

## 사전 준비

### 체크리스트

- [ ] Neon 콘솔에서 DB Connection String 확인 (Pooled + Direct)
- [ ] NEXTAUTH_SECRET 생성 (`openssl rand -base64 32`)
- [ ] 관리자 이메일/비밀번호 결정
- [ ] GitHub 리포지토리 main 브랜치 최신 상태 확인
- [ ] 로컬에서 `npm run build` 성공 확인

---

## 환경변수 목록

Vercel 대시보드 → Project Settings → Environment Variables에서 설정.

| 변수명 | 설명 | 예시/획득 방법 |
|--------|------|--------------|
| `DATABASE_URL` | Neon pooled connection (런타임용) | Neon 콘솔 → Connection Details → Pooled connection |
| `DIRECT_URL` | Neon direct connection (마이그레이션용) | Neon 콘솔 → Connection Details → Direct connection |
| `NEXTAUTH_SECRET` | NextAuth JWT 서명 키 | `openssl rand -base64 32` 실행 결과 |
| `ADMIN_EMAIL` | 관리자 로그인 이메일 | 직접 지정 |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 | 직접 지정 (충분히 강력하게) |

> **주의:** `NEXTAUTH_URL`은 NextAuth v5 beta에서 Vercel 환경이면 자동 감지되므로 별도 설정 불필요.

---

## Vercel 프로젝트 연결 순서

### 방법 A — Vercel 대시보드 (권장)

1. [vercel.com](https://vercel.com) 로그인
2. "Add New Project" 클릭
3. GitHub 리포지토리 선택 (`portfolio-resume`)
4. Framework Preset: **Next.js** (자동 감지됨)
5. Build & Output Settings → Build Command 수정:
   ```
   npx prisma migrate deploy && npm run build
   ```
6. Environment Variables 탭에서 위 5개 변수 입력
7. "Deploy" 클릭

### 방법 B — Vercel CLI

```bash
# CLI 설치 (미설치 시)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 루트에서 연결
vercel link

# 환경변수 추가
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD production

# 배포
vercel --prod
```

---

## 프로덕션 DB 마이그레이션

Vercel 빌드 시 `prisma migrate deploy`가 실행되도록 Build Command에 포함:

```
npx prisma migrate deploy && npm run build
```

- `migrate deploy`: 프로덕션 환경에서 마이그레이션 적용 (개발용 `migrate dev` 사용 금지)
- `DIRECT_URL`이 설정되어야 Prisma가 Neon에 직접 연결해 마이그레이션 실행 가능 (pooler는 마이그레이션 미지원)

### 마이그레이션 파일 확인

배포 전 `prisma/migrations/` 폴더에 마이그레이션 파일이 있는지 확인:

```bash
ls prisma/migrations/
```

마이그레이션이 없다면 로컬에서 먼저 생성:

```bash
npx prisma migrate dev --name init
```

---

## 도메인 설정

### 기본 도메인 (자동 제공)

Vercel이 자동으로 `프로젝트명.vercel.app` 도메인 부여.

### 커스텀 도메인 연결

1. Vercel 대시보드 → Project → Settings → Domains
2. 도메인 입력 후 "Add"
3. DNS 공급자(가비아, Cloudflare 등)에서 CNAME 또는 A 레코드 설정:
   - CNAME: `cname.vercel-dns.com`
   - A 레코드: Vercel이 제공하는 IP (76.76.21.21)
4. SSL은 자동 발급 (Let's Encrypt)

---

## 배포 후 확인

- [ ] 메인 페이지 접속 (`https://도메인`)
- [ ] 관리자 페이지 접속 (`https://도메인/admin`)
- [ ] 로그인 테스트 (`https://도메인/admin/login`)
- [ ] API 동작 확인 (`GET https://도메인/api/about`)
- [ ] DB 데이터 없는 경우 시드 데이터 입력 (관리자 UI 통해 또는 Neon 콘솔에서 직접)
- [ ] 다크모드 토글 동작 확인
- [ ] 모바일 반응형 확인

---

## 주의 사항

- `.env.local` 파일은 절대 Git에 커밋하지 않음 (`.gitignore`에 포함되어 있는지 확인)
- `ADMIN_PASSWORD`는 평문으로 저장됨 — 충분히 강력한 비밀번호 사용
- Neon free tier는 일정 시간 미사용 시 DB가 슬립 상태로 전환될 수 있음 → 첫 요청 응답이 느릴 수 있음
- `main` 브랜치에 push할 때마다 자동 프로덕션 배포가 트리거됨 (주의)
