---
description: 자료를 바탕으로 프로젝트 1건을 src/content/projects/에 안내형으로 추가합니다
argument-hint: '[자료 경로나 설명]'
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

프로젝트 1건을 `src/content/projects/<slug>.md`로 추가한다. 입력: `$ARGUMENTS`

먼저 읽는다: `CLAUDE.md`의 규칙 2·3과 "콘텐츠 갱신 절차", `src/content.config.ts`의 `projects` 스키마·`DOMAINS`·`CAPABILITIES`·`APPROVED_CLIENTS`, 기존 프로젝트 파일 하나(익명 예: `src/content/projects/petrochemical-reactor-prediction.md`, 대표 예: `src/content/projects/samsung-scm-agent.md`).

## 원칙

- 질문은 한국어로, 한 번에 한 단계씩. 값이 정해진 항목은 AskUserQuestion 선택지로 묻는다.
- **자료에 있는 사실만 쓴다.** 기간·역할·기술 스택·성과 수치가 자료에 없으면 추측하지 말고 묻는다. 모르면 비워 두거나(선택 필드) 추가를 멈춘다.
- 선택지는 실행 시점에 `src/content.config.ts`에서 읽는다. 이 문서에 값을 적어 두지 않는다.

## 단계

1. **자료**: `$ARGUMENTS`가 비었으면 자료 경로나 붙여 넣을 내용을 묻는다. 읽은 뒤 확인된 사실과 빠진 항목(기간, 역할, 스택, 수치)을 나눠 보여 주고, 빠진 항목을 묻는다.
2. **영문 원본**: `title`, `summary`, `highlights`(스키마 개수 범위)를 영문 이력서 관례(동사로 시작, 결과 중심, 1~2줄)로 쓴다. 그다음 국문을 영문에 맞춰 쓴다. 두 언어를 나란히 보여 주고 확인받는다.
3. **분류**: `domain`(하나)은 `DOMAINS`에서, `capability`(1개 이상, 다중 선택)는 `CAPABILITIES`에서 고르게 한다.
4. **고객사** (규칙 3): 기본은 익명 `client: { public: false, label: { en, ko } }`, 업종 표기로 쓴다(예: "a global F&B company"). 실명은 `APPROVED_CLIENTS`에 있는 이름만 가능하다. 새 실명은 사용자의 명시적 승인을 받은 경우에만 쓰고, 이때 `CLAUDE.md` 규칙 3 표와 `APPROVED_CLIENTS`를 함께 고친다. 익명 항목의 파일명·slug·문구에도 실명이나 이니셜을 넣지 않는다.
5. **소속·역할**: `org`(수행 회사), `lead`(총괄 여부), `role`(선택). 6곳 경력(`src/content/experience.yaml`) 중 하나인지 확인한다.
6. **기간**: `period`의 `start`/`end`(YYYY-MM), 진행 중이면 `status: present`, 종료 예정이면 `status: planned` + `end`.
7. **대표 여부**: 기본 `featured: false`. 대표로 지정하려면 사용자 승인을 받고 `caseStudy`(context, problem, role, approach, outcome)도 자료에서 채운다. 자료가 부족하면 대표로 두지 않는다. `order`는 대표일 때 기존 대표 프로젝트의 순서를 보여 주고 묻는다.
8. **용어집**: 새 기술명·기관명·용어가 있으면 `docs/glossary.md`에서 확인하고, 없으면 추가안을 보여 주고 승인받아 먼저 추가한다.
9. **slug**: 영문 소문자-하이픈으로 제안하고 확인받는다. 기존 파일과 겹치지 않게 한다.

## 마무리

1. 기존 파일 형식(키 순서, 인라인 `{ }` 표기)을 본떠 파일을 쓴다.
2. `npm run build`를 실행한다. 실패하면 원인을 고치고 다시 실행한다. 결과를 보고한다.
3. 브라우저 확인 대상(`/`, `/ko/`, `/cv/`, 대표면 `/work/<slug>/`)을 안내한다.
4. 바뀐 파일 목록과 diff 요약을 보여 주고, **커밋할지 묻는다.** 승인 시 작은 단위로 커밋한다 (`/git:commit` 형식).
5. **push는 하지 않는다.** `master` push는 곧 공개이므로 사용자가 따로 요청할 때만 한다.
