# 관리자 페이지 구현 계획

> 작성일: 2026-03-25
> 대상 브랜치: main

---

## 현재 상태 파악

### 이미 구현된 것
- `app/admin/page.tsx` — 스텁 (로그인 세션 표시만, CRUD 없음)
- `app/admin/login/page.tsx` + `LoginForm.tsx` — 로그인 페이지 완비
- `app/api/*/route.ts` — 전체 리소스 CRUD API 완비
- `next-auth` v5 beta — 인증 완비
- `auth.ts` — `auth()`, `signOut()` 익스포트

### 미설치 패키지 (구현 전 설치 필요)
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-hook-form
```

### 없는 파일 (신규 생성 필요)
- `app/providers.tsx` — QueryClientProvider 선언 위치
- `components/admin/` — 관리자 전용 UI 컴포넌트 디렉토리

---

## 1. 디렉토리 구조

```
app/
├── providers.tsx                       # QueryClientProvider (신규)
├── admin/
│   ├── layout.tsx                      # 관리자 공통 레이아웃 (신규)
│   ├── page.tsx                        # 대시보드 (기존 → 교체)
│   ├── login/
│   │   ├── page.tsx                    # 기존 유지
│   │   └── LoginForm.tsx               # 기존 유지
│   ├── about/
│   │   └── page.tsx                    # About 단일 레코드 편집 (신규)
│   ├── experience/
│   │   └── page.tsx                    # Experience 목록 CRUD + 순서변경 (신규)
│   ├── projects/
│   │   └── page.tsx                    # Projects 목록 CRUD + 순서변경 (신규)
│   ├── skills/
│   │   └── page.tsx                    # Skills 목록 CRUD + 순서변경 (신규)
│   ├── education/
│   │   └── page.tsx                    # Education 목록 CRUD + 순서변경 (신규)
│   └── contact/
│       └── page.tsx                    # Contact 목록 CRUD + 순서변경 (신규)

components/
└── admin/                              # 관리자 전용 컴포넌트 (신규 디렉토리)
    ├── AdminSidebar.tsx                # 섹션 네비게이션
    ├── SortableList.tsx                # dnd-kit 공용 드래그 목록
    ├── SortableItem.tsx                # 드래그 가능한 단일 행
    ├── ConfirmDialog.tsx               # 삭제 확인 다이얼로그
    ├── FormModal.tsx                   # 생성/수정 폼 모달 (공용 껍데기)
    └── forms/
        ├── AboutForm.tsx
        ├── ExperienceForm.tsx
        ├── ProjectForm.tsx
        ├── SkillForm.tsx
        ├── EducationForm.tsx
        └── ContactForm.tsx
```

---

## 2. 각 페이지/컴포넌트 역할

### 레이아웃 및 인프라

| 파일 | 역할 |
|---|---|
| `app/providers.tsx` | `QueryClientProvider` 단일 선언. `app/layout.tsx`에서 감싸기 |
| `app/admin/layout.tsx` | Server Component. `auth()`로 세션 확인 → 미인증 시 `/admin/login` 리다이렉트. 좌측 `AdminSidebar` + 우측 콘텐츠 2단 레이아웃 |

### 관리자 공통 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `AdminSidebar.tsx` | 6개 섹션(About / Experience / Projects / Skills / Education / Contact) 링크. 현재 경로 하이라이트 |
| `SortableList.tsx` | `@dnd-kit/sortable`의 `SortableContext` + `DndContext` 래퍼. 드래그 종료 시 `onReorder(newIds: string[])` 콜백 호출 |
| `SortableItem.tsx` | 드래그 핸들(⠿ 아이콘) + 콘텐츠 슬롯 + 편집/삭제 버튼 |
| `ConfirmDialog.tsx` | "삭제하시겠습니까?" 모달. 확인 시 `onConfirm()` 호출 |
| `FormModal.tsx` | 공용 모달 껍데기(제목 + 닫기 버튼). 내부에 각 `*Form.tsx`를 children으로 주입 |

### 폼 컴포넌트

모두 `react-hook-form` 사용. `mode: 'onSubmit'`. `onSubmit(data)` 콜백을 prop으로 받아 실제 API 호출은 상위(page)에서 처리.

| 폼 | 주요 필드 |
|---|---|
| `AboutForm` | name, title, bio, imageUrl, resumeUrl |
| `ExperienceForm` | company, position, startDate, endDate, description |
| `ProjectForm` | title, description, imageUrl, siteUrl, githubUrl, tags(콤마 구분 입력) |
| `SkillForm` | name, category, iconUrl |
| `EducationForm` | institution, degree, startDate, endDate, description |
| `ContactForm` | type, label, value |

### 섹션 페이지

모두 `'use client'` 선언. react-query로 데이터 로드.

| 페이지 | 특이사항 |
|---|---|
| `admin/page.tsx` | 6개 섹션 카드 링크 + 각 섹션 레코드 수 표시 |
| `admin/about/page.tsx` | 단일 레코드. 목록/순서변경 없음. 편집 폼만 |
| `admin/experience/page.tsx` | 목록 + `SortableList` + 추가/편집/삭제 |
| `admin/projects/page.tsx` | 목록 + `SortableList` + 추가/편집/삭제 |
| `admin/skills/page.tsx` | 목록 + `SortableList` + 추가/편집/삭제. category별 그룹 표시 고려 |
| `admin/education/page.tsx` | 목록 + `SortableList` + 추가/편집/삭제 |
| `admin/contact/page.tsx` | 목록 + `SortableList` + 추가/편집/삭제 |

---

## 3. 데이터 흐름

### 조회 (READ)
```
[섹션 page.tsx]
  useQuery({ queryKey: ['experience'], queryFn: () => fetch('/api/experience').then(r => r.json()) })
  ↓
  GET /api/experience/route.ts
  ↓
  prisma.experience.findMany({ orderBy: { order: 'asc' } })
  ↓
  Neon PostgreSQL
  ↓
  { data: Experience[] } → 화면 렌더링
```

### 생성 (CREATE)
```
[FormModal → ExperienceForm → onSubmit(data)]
  ↓
  useMutation({ mutationFn: (data) => fetch('/api/experience', { method: 'POST', body: JSON.stringify(data) }) })
  ↓
  POST /api/experience/route.ts (세션 검증 후 처리)
  ↓
  prisma.experience.create({ data })
  ↓
  onSuccess: queryClient.invalidateQueries({ queryKey: ['experience'] })
  → 목록 자동 갱신
```

### 수정 (UPDATE)
```
[SortableItem 편집 버튼 → FormModal(기존 데이터 채움) → onSubmit(data)]
  ↓
  useMutation({ mutationFn: (data) => fetch(`/api/experience?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }) })
  ↓
  PUT /api/experience/route.ts
  ↓
  prisma.experience.update({ where: { id }, data })
  ↓
  onSuccess: queryClient.invalidateQueries({ queryKey: ['experience'] })
```

### 삭제 (DELETE)
```
[SortableItem 삭제 버튼 → ConfirmDialog 확인]
  ↓
  useMutation({ mutationFn: (id) => fetch(`/api/experience?id=${id}`, { method: 'DELETE' }) })
  ↓
  DELETE /api/experience/route.ts
  ↓
  prisma.experience.delete({ where: { id } })
  ↓
  onSuccess: queryClient.invalidateQueries({ queryKey: ['experience'] })
```

### 순서 변경 (REORDER)
```
[SortableList onDragEnd → 새 순서 배열 계산]
  ↓
  변경된 아이템들에 대해 Promise.all([
    fetch(`/api/experience?id=A`, { method: 'PUT', body: { order: 0 } }),
    fetch(`/api/experience?id=B`, { method: 'PUT', body: { order: 1 } }),
    ...
  ])
  ↓
  병렬 PUT 처리
  ↓
  onSuccess: queryClient.invalidateQueries({ queryKey: ['experience'] })
```

> **전략 근거:** 별도 bulk-update 엔드포인트 없이 기존 PUT을 재활용. 레코드 수가 많지 않아 병렬 n건 요청으로 충분.

---

## 4. 작업 순서

| # | 작업 | 파일 | 의존성 |
|---|---|---|---|
| 1 | 패키지 설치 | — | 없음 |
| 2 | QueryClientProvider 세팅 | `app/providers.tsx`, `app/layout.tsx` 수정 | 1 |
| 3 | 관리자 레이아웃 | `app/admin/layout.tsx` | 2 |
| 4 | AdminSidebar | `components/admin/AdminSidebar.tsx` | 없음 |
| 5 | SortableList + SortableItem | `components/admin/SortableList.tsx`, `SortableItem.tsx` | 1 |
| 6 | ConfirmDialog + FormModal | `components/admin/ConfirmDialog.tsx`, `FormModal.tsx` | 없음 |
| 7 | 폼 컴포넌트 6개 | `components/admin/forms/*.tsx` | 1, 6 |
| 8 | 대시보드 | `app/admin/page.tsx` | 3, 4 |
| 9 | About 페이지 | `app/admin/about/page.tsx` | 3, 7 |
| 10 | Experience 페이지 | `app/admin/experience/page.tsx` | 3, 5, 6, 7 |
| 11 | Projects 페이지 | `app/admin/projects/page.tsx` | 3, 5, 6, 7 |
| 12 | Skills 페이지 | `app/admin/skills/page.tsx` | 3, 5, 6, 7 |
| 13 | Education 페이지 | `app/admin/education/page.tsx` | 3, 5, 6, 7 |
| 14 | Contact 페이지 | `app/admin/contact/page.tsx` | 3, 5, 6, 7 |

---

## 스타일 원칙

- 배경: `bg-white` / 텍스트: `text-[#111111]` / 보조: `text-[#666666]`
- 구분선: `border border-[#e5e5e5]`
- 버튼: 테두리형(`border`) 기본, 위험 동작(삭제)만 `text-red-500`
- 폰트: Geist (루트 레이아웃 상속)
- 반응형 불필요 — 고정 레이아웃 (`min-w-[900px]` 기준)
- 다크모드: `dark:` 변형 적용 (기존 패턴 유지)
