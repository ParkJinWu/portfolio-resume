# components/ — 컴포넌트 가이드

## 네이밍 규칙
- 파일명: PascalCase (`ProjectCard.tsx`, `HeroSection.tsx`)
- 컴포넌트 함수명: 파일명과 동일
- 이벤트 핸들러 props: `on` 접두사 (`onDelete`, `onReorder`)

## Props 타입 정의
```ts
// 파일 내 컴포넌트 바로 위에 선언
interface ProjectCardProps {
  id: string
  title: string
  onDelete?: (id: string) => void
}
export function ProjectCard({ id, title, onDelete }: ProjectCardProps) { ... }
```
- `type` 대신 `interface` 사용 (확장 가능성).
- `export default` 금지 — named export만 사용.

## sections/ vs ui/ 구분
| 디렉토리 | 기준 | 예시 |
|---|---|---|
| `ui/` | 도메인 무관 원자 컴포넌트 | `Button`, `Card`, `Badge`, `IconButton` |
| `sections/` | 포트폴리오 특정 섹션 | `HeroSection`, `ProjectsSection`, `ExperienceSection` |

- `sections/` 컴포넌트는 API 데이터에 의존 가능 (`useQuery` 허용).
- `ui/` 컴포넌트는 순수 UI만. API 호출·전역 상태 접근 금지.
