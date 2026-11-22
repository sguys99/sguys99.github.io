# Codex 작업 지침

작업을 시작할 때 저장소 루트의 [CLAUDE.md](CLAUDE.md) 전체를 읽고 같은 프로젝트 규칙을 적용한다. [프로젝트 메모](.claude/memory/MEMORY.md)에 연결된 사용자 결정도 함께 읽는다. 특히 커밋과 푸시는 각각 사용자가 명시적으로 요청했을 때만 한다.

## 스킬과 명령

- Codex의 `.agents/skills/`는 Claude Code의 `.claude/skills/`를 가리킨다. 스킬을 추가하거나 수정할 때는 원본을 고친다. 같은 이름의 스킬이 여럿이면 이 저장소의 `SKILL.md`를 사용한다.
- 스킬 머리말에 `disable-model-invocation: true`가 있으면 사용자가 해당 스킬을 요청했을 때만 실행한다.
- 스킬에서 `${CLAUDE_SKILL_DIR}`를 쓰면 지금 읽는 `SKILL.md`가 들어 있는 디렉터리의 절대경로로 해석한다. 예를 들어 `$humanize`가 `humanize-korean` 절차를 호출하면 그 절차의 스크립트와 참고 자료는 `.claude/skills/humanize-korean/`에서 읽는다.
- Claude 명령을 요청받으면 [.claude/commands/](.claude/commands/)에서 해당 마크다운을 읽고 사용자가 준 인자를 `$ARGUMENTS`, `$1` 등에 대응시킨다. 예를 들어 프로젝트 추가는 `add-project.md`, 커밋은 `git/commit.md`를 따른다. 문서의 도구명은 현재 세션에서 사용 가능한 도구에 대응시킨다. 프로젝트의 Git 규칙과 [.claude/settings.json](.claude/settings.json)의 금지 명령을 지킨다.
- 스킬이 역할 에이전트를 지정하면 [.claude/agents/](.claude/agents/) 아래에서 해당 역할 문서를 찾아 그 지침과 입출력 형식을 적용한다. 위임 도구가 없으면 현재 세션에서 각 역할의 단계를 순서대로 수행한다.

## 다른 세션과 함께 작업할 때

먼저 `git status --short`로 기존 변경을 확인한다. 편집할 파일이 이미 바뀌었다면 최신 내용을 읽고 요청받은 부분만 고친다. 다른 세션의 변경이나 스테이징을 보존한다. 윤문 중간 파일은 스킬의 실행별 작업 폴더에 두고, 재작업 시에는 이번 요청에 해당하는 원문과 실행 폴더를 확인한다.
