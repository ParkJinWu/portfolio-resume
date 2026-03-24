변경사항을 분석해서 커밋 메시지를 생성하고 사용자 확인 후 push까지 진행하는 스킬입니다.

## 절차

1. `git status`와 `git diff` (스테이징 포함: `git diff HEAD`)로 변경사항 전체를 파악한다.
2. CLAUDE.md의 **Commit Convention** 섹션을 참조해 적절한 type을 선택하고 한국어 커밋 메시지를 작성한다.
   - 형식: `type: 한국어 설명`
   - type 목록: feat / style / fix / content / refactor / chore / deploy
   - Co-Authored-By 줄 절대 포함 금지
3. 생성한 커밋 메시지를 사용자에게 보여주고 확인을 요청한다.
4. 사용자가 승인하면 아래 순서로 실행한다:
   a. `git add -p` 대신 변경된 파일을 명시적으로 스테이징 (`git add <파일>...`)
   b. `git commit -m "메시지"`
   c. `git push`
5. 사용자가 메시지를 수정하면 수정된 메시지로 다시 확인 후 진행한다.

## 주의사항
- `.env`, `.env.local` 등 환경변수 파일은 절대 스테이징하지 않는다.
- push 전 반드시 사용자 최종 확인을 받는다.
