# prisma/ — 스키마 & 마이그레이션 가이드

## 스키마 네이밍 규칙
- 모델명: PascalCase 단수형 (`Project`, `Experience`, `Skill`)
- 필드명: camelCase (`createdAt`, `sortOrder`)
- DB 컬럼명: `@map("snake_case")` 으로 명시적 매핑
- 테이블명: `@@map("snake_case_plural")` 명시

## 필수 공통 필드
```prisma
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
order     Int      @default(0)   // 정렬용
```

## 마이그레이션 규칙
- 스키마 변경 후 반드시 `npx prisma migrate dev --name 설명` 실행.
- 마이그레이션 이름은 영문 소문자 + 언더스코어 (`add_projects_table`).
- 프로덕션 배포 전 `npx prisma migrate deploy` 실행 확인.
- 컬럼 삭제·이름 변경은 데이터 손실 위험 — 사용자 확인 후 진행.
- `prisma/schema.prisma` 외 파일을 임의 수정하지 않음.
