---
description: 경력·특허·SW·논문·강의·수상·학력·개인 프로젝트 항목 1건을 안내형으로 추가합니다
argument-hint: '[종류] [자료]'
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
  - Bash(npm run build:*)
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git add:*)
  - Bash(git commit:*)
---

프로젝트 외 콘텐츠 항목 1건을 추가한다. 입력: `$ARGUMENTS` (첫 단어가 종류, 나머지가 자료 경로나 내용)
프로젝트는 `/add-project`를 쓴다.

먼저 읽는다: `CLAUDE.md`의 규칙 2·3과 "콘텐츠 갱신 절차" 표.

## 원칙

- 질문은 한국어로, 한 번에 한 단계씩. enum 필드는 AskUserQuestion 선택지로 묻는다.
- **필드와 허용값은 `src/content.config.ts`가 기준이다.** 이 문서에 필드 목록을 두지 않는다.
- **자료에 있는 사실만 쓴다.** 번호·날짜·기간·기관명이 자료에 없으면 추측하지 말고 묻는다.

## 단계

1. **종류**: 주어지지 않았으면 고르게 한다: `experience`, `patents`, `software`, `publications`, `teaching`, `awards`, `education`, `personal`.
   - `personal` → `src/content/personal/<slug>.md` (frontmatter)
   - 그 외 → `src/content/<종류>.yaml` (키 = 항목 id, 배열 아님)
2. **스키마와 예시**: `src/content.config.ts`에서 해당 컬렉션 스키마를 읽고, 대상 파일의 기존 항목 하나와 파일 머리 주석을 읽는다. `publications`는 먼저 `type`(`paper`/`report`)을 고르게 한 뒤 그 분기의 필드만 묻는다.
3. **자료**: 자료가 없으면 묻는다. 확인된 사실과 빠진 필수 필드를 나눠 보여 주고, 빠진 것만 묻는다. 선택 필드는 자료에 있을 때만 채운다.
4. **문구**: 다국어 필드(`{ en, ko }`)는 영문을 먼저 쓰고(규칙 2) 국문을 맞춘다. 특허·SW 제목은 기존 항목처럼 `ko`가 원문, `en`이 번역이다. 두 언어를 나란히 보여 주고 확인받는다.
5. **규칙 3 확인**:
   - 전화번호, 승인되지 않은 고객사 실명은 어디에도 쓰지 않는다.
   - `experience`는 사용자가 준 6곳만 싣는다. 새 소속이면 추가 전에 사용자에게 명시적으로 확인받는다.
   - `personal`은 `repo`가 필수다. 공개 저장소 URL인지 사용자에게 확인한다.
6. **id/slug**: 기존 id 규칙(영문 소문자-하이픈)을 따라 제안하고 확인받는다. 겹치지 않게 한다.
7. **위치**: 파일 안의 구획 주석(예: patents의 `# --- Filed ---`)이 있으면 알맞은 구획에, 없으면 기존 순서 규칙을 따라 넣는다.
8. **건수 주석**: `patents.yaml`, `software.yaml`, `publications.yaml`, `teaching.yaml`의 머리·구획 주석에 건수가 있으면 함께 고친다. `profile.yaml`에는 건수를 쓰지 않는다 (자동 집계).
9. **용어집**: 새 기관명·용어가 있으면 `docs/glossary.md`에서 확인하고, 없으면 추가안을 보여 주고 승인받아 먼저 추가한다.

## 마무리

1. 기존 항목 형식을 본떠 쓴다. 날짜(`date`)와 숫자만 있는 `years`는 기존 항목처럼 따옴표로 감싼다 (예: `'2026-10'`, `'2025'`).
2. `npm run build`를 실행한다. 실패하면 원인을 고치고 다시 실행한다. 결과를 보고한다.
3. 브라우저 확인 대상(`/`, `/ko/`의 해당 섹션, `/cv/`)을 안내한다.
4. 바뀐 파일 목록과 diff 요약을 보여 주고, **커밋할지 묻는다.** 승인 시 작은 단위로 커밋한다 (`/git:commit` 형식).
5. **push는 하지 않는다.** 사용자가 따로 요청할 때만 한다.
