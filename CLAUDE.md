# CLAUDE.md

Kwang Myung Yu(유광명)의 경력·프로젝트 실적을 소개하는 개인 웹사이트.
영문 주력 + 국문 전체 전환, Astro 정적 사이트, GitHub Pages(`https://sguys99.github.io`) 배포.

현재 상태: 2026-11-12 공개, 운영 단계. 구축(단계 0~9)은 끝났고 이후 작업은 `docs/tasks.md`의 대기 중·Backlog에서 고른다.

## 문서

| 문서 | 역할 | 규칙 |
|---|---|---|
| `docs/basic-plan.md` | 목적, 범위, 정보 구조, 결정 사항 | 내용이 바뀌어도 **버전은 1.0 유지** (사용자가 변경을 요청할 때만 올림) |
| `docs/tasks.md` | 운영 체크리스트, 대기 작업, Backlog | 작업을 끝내면 체크하고, 새로 생긴 작업은 추가 |
| `docs/tasks-archive.md` | 공개(2026-11-12)까지의 구축 기록 | 수정하지 않음. DESIGN.md 등의 `tasks N.N` 번호가 가리키는 곳 |
| `DESIGN.md` (루트) | 디자인 토큰, 컴포넌트 명세, 결정 기록 | 구현은 이 문서를 따름. 새 디자인 결정은 11장 Decision Log에 기록 |

`docs/references/`의 문서는 형식 참고용이다. 이 프로젝트의 디자인 규칙으로 쓰지 않는다.

문서끼리 내용이 어긋나면 임의로 판단하지 말고 사용자에게 확인한다.

## 기술 스택과 명령어

- Astro (정적 출력), Content Collections, 순수 CSS + CSS 변수 토큰
- 다국어: `/` 영문, `/ko/` 국문 (Astro i18n 라우팅)
- 배포: `master` push → GitHub Actions → GitHub Pages (`master`가 곧 공개 사이트)

```bash
npm run dev       # 개발 서버
npm run build     # 정적 빌드 + CV PDF 생성 + 내부 링크 검사 (콘텐츠 스키마 검사 포함)
                  # 처음 한 번: npx playwright install chromium (PDF 생성에 필요)
npm run preview   # 빌드 결과 확인
npm run format    # Prettier 정리 (format:check는 검사만)
```

Node 24 LTS (`.nvmrc`). URL은 끝에 `/`를 붙인다 (`trailingSlash: 'always'`, 예: `/ko/`).

## 디렉터리

```
src/content/      콘텐츠 원본 (profile, experience, projects, personal, patents, ...)
src/content.config.ts  콘텐츠 스키마, DOMAINS·CAPABILITIES·APPROVED_CLIENTS
src/components/   UI 컴포넌트
src/layouts/      페이지 레이아웃 (Base: head·GoatCounter, Shell, Page)
src/pages/        영문 라우트(/, /cv/, /work/[slug]/, 404, sitemap.xml, robots.txt), pages/ko/ 국문 라우트
src/i18n/         메뉴·버튼 등 UI 문구
src/styles/       tokens.css (디자인 토큰), fonts.css, global.css
src/assets/       프로필 사진(astro:assets로 AVIF/WebP), 경력 6곳 로고(logos/)
src/scripts/      클라이언트 모션
src/cv-pdf.mjs    CV PDF 경로 상수 (사이드바 링크와 scripts/cv-pdf.mjs가 공유)
public/           OG·JSON-LD용 사진, 파비콘, OG 이미지, 글꼴, Search Console 확인 파일
scripts/          빌드 후처리: cv-pdf.mjs (CV PDF → dist/), check-links.mjs (내부 링크 검사)
.github/workflows/deploy.yml  master push → GitHub Pages 배포
.claude/commands/ 안내형 콘텐츠 추가 명령 (add-project, add-entry)
docs/design-drafts/   Gate별 시안 보관
docs/glossary.md      영문/국문 용어집
docs/references/      외부 참고 자료 (형식 예시 등, 규칙 아님)
docs/private/         원본 자료: 이력서, 경력기술서, 사진 원본 (.gitignore, 커밋 금지)
```

## 규칙 1. 디자인은 시안 2~3개를 제시하고 선택받는다

디자인과 관련된 결정은 혼자 정해서 구현하지 않는다.

1. 실제 콘텐츠를 넣은 시안을 2~3개 만든다 (데스크톱/모바일, 라이트/다크, 영문/국문).
2. 시안마다 의도와 장단점을 1~2줄로 적어 제시한다.
3. 사용자의 선택(또는 조합)을 받은 뒤 구현한다.
4. 선택 결과와 이유를 `DESIGN.md`의 Decision Log에 기록하고, 시안은 `docs/design-drafts/`에 둔다.

대상: 레이아웃, 서체, 색, 여백, 컴포넌트 형태, 모션, 문구의 어조, 아이콘·이미지 사용.
제외: 이미 `DESIGN.md`에 정해진 것을 그대로 적용하는 일, 버그 수정.

디자인 방향: 세련되고 minimal하게. 고정 사이드바 + 카드형 섹션 + 타이포 위계를 기본 골격으로 한다.
홈은 대표작만 상세히 보여주고, 전체 목록은 접힘과 필터로 처리한다.

## 규칙 2. 콘텐츠는 한 곳에서만 관리한다

- 모든 이력 내용은 `src/content/`에만 둔다. 컴포넌트나 페이지에 문장을 직접 쓰지 않는다.
- 한 항목에 영문(`en`)과 국문(`ko`)을 함께 둔다. 둘 중 하나가 비면 빌드가 실패해야 한다.
- **영문이 원본**이다. 영문을 먼저 확정하고 국문을 맞춘다.
- 영문은 직역하지 않고 영문 이력서 관례로 쓴다 (동사로 시작, 결과 중심, 1~2줄).
- 표기는 `docs/glossary.md`를 따른다. 없는 용어는 추가한 뒤 사용한다.
- **없는 사실을 만들지 않는다.** 성과 수치, 기간, 역할, 기술 스택은 사용자가 준 자료에 있는 것만 쓴다.
  비어 있는 정보는 추측으로 채우지 말고 질문한다.

## 규칙 3. 공개 저장소다. 기밀과 개인정보를 지킨다

저장소와 사이트는 모두 공개된다. 아래는 파일, 주석, 커밋 메시지 어디에도 적지 않는다.

- **고객사 실명**: 아래 3건만 실명. 나머지는 업종 표기로 익명 처리한다.

| 프로젝트 | 표기 |
|---|---|
| SCM 데이터 분석 및 업무 지원 서비스 (PwC) | Samsung Electronics |
| 온라인 상담 지원 및 제품 추천 어시스턴트 (PwC) | Samsung Electronics |
| AI 프로젝트 마스터플랜 및 LLM 서비스 PoC (PwC) | LOTTE Fine Chemical |
| ├ 원자재 가격 예측 (마스터플랜 PoC, PwC) | LOTTE Fine Chemical |
| └ 그린소재 재고 조합 최적화 (마스터플랜 PoC, PwC) | LOTTE Fine Chemical |
| 보고서: AI 과제 MP 수립 및 Gen AI PoC 수행사례 (PwC, 2025) | LOTTE Fine Chemical |
| 그 외 모든 고객사 | 익명 (예: "a global F&B company") |

- 새 프로젝트를 추가할 때 기본은 익명이다. 실명은 건별로 사용자 승인을 받는다.
- **전화번호**는 싣지 않는다. 원본 자료(이력서, 경력기술서, 사진 원본)는 `docs/private/`에만 두고 커밋하지 않는다.
- **경력**은 사용자가 제공한 6곳만 싣는다. 그 사이 구간이나 다른 소속은 표기하지 않는다.
- 회사 로고는 사용자 승인 없이 쓰지 않는다 (기본은 텍스트 표기). 경력 6곳 로고만 승인됨(`src/assets/logos/`, DESIGN.md 5.11). 고객사 로고는 쓰지 않는다.

## 확정된 프로필 정보

| 항목 | 값 |
|---|---|
| 이름 | Kwang Myung Yu / 유광명 |
| 대표 직함 | AI Engineer |
| 현재 소속 | Director, R&D Group, GenON |
| 이메일 | sguys99@naver.com |
| GitHub | https://github.com/sguys99 |
| LinkedIn | https://www.linkedin.com/in/kmyu99/ |

프로필 사진: 원본을 4:5, 1200×1500으로 자른 파일. 화면 표시는 `src/assets/profile.jpg`(astro:assets), OG·JSON-LD는 같은 파일의 사본 `public/images/profile.jpg`. 바꿀 때는 둘 다 교체한다. 원본은 `docs/private/`.

실적 건수의 기준은 이력서(`docs/private/resume_ko_20261018.docx`)와 `docs/basic-plan.md`다. `work_experience*` 파일은 케이스 스터디 내용 참고용이며, 그 안의 건수(특허 14, SW 9 등)는 이전 버전이라 쓰지 않는다.

반영된 자료: 프로젝트 20건(대표 6건, 케이스 스터디 5건), 개인 프로젝트 10건.
아직 받지 못한 자료: 그린소재 재고 조합 최적화(`lotte-inventory-blend-optimization`)의 케이스 스터디 자료, 영문·국문 문안 전체 검토 (`docs/tasks.md` "대기 중").
받기 전에는 자리 표시로 두고, 임의의 내용으로 채우지 않는다.

## 콘텐츠 갱신 절차

필드와 허용값은 `src/content.config.ts`가 기준이다. 아래는 위치 안내이며, 기존 항목 하나를 본떠 쓴다.

| 추가 대상 | 수정할 파일 | 함께 볼 것 |
|---|---|---|
| 경력 | `src/content/experience.yaml` (키 = id) | 6곳 외 추가는 사용자 확인 (규칙 3) |
| 프로젝트 | `src/content/projects/<slug>.md` (frontmatter) | `client` 기본 익명 (`public: false` + `label`). `domain`·`capability`는 config의 `DOMAINS`·`CAPABILITIES` 값만 |
| 대표 프로젝트 | 위 파일의 `featured: true`, `order`, `caseStudy` | `featured` + `caseStudy`가 있어야 `/work/<slug>/` 생성. 지정은 사용자 승인 |
| 개인 프로젝트 | `src/content/personal/<slug>.md` | `repo` 필수, `status`는 `in-progress`·`active`·`archived` |
| 특허 | `src/content/patents.yaml` | `status` `filed`·`registered`. 파일 머리 주석의 건수 |
| SW 등록 | `src/content/software.yaml` | 파일 머리 주석의 건수 |
| 논문·보고서 | `src/content/publications.yaml` | `type: paper` / `report` |
| 강의·자문·저서 | `src/content/teaching.yaml` | `kind`: `teaching`·`advisory`·`book` |
| 수상 | `src/content/awards.yaml` | |
| 학력 | `src/content/education.yaml` | |

- 실명 고객사는 `src/content.config.ts`의 `APPROVED_CLIENTS`에 있어야 빌드된다. 추가는 사용자 승인 후에만, 규칙 3 표도 함께 고친다.
- 건수(IP 서랍의 특허·SW·논문 건수, 등록/출원 구분, 카드 머리 `총 n건`)와 CV 집계는 컬렉션에서 자동 계산된다. `profile.yaml`에는 건수를 쓰지 않는다.
- 이미지는 `public/images/`(또는 최적화가 필요하면 `src/assets/`)에 두고 대체 텍스트를 단다. 회사 로고는 승인 없이 쓰지 않는다 (규칙 3).
- 안내형 추가: `.claude/commands/add-project.md` (프로젝트), `.claude/commands/add-entry.md` (그 외 항목).

확인 순서:

1. 영문 원본 작성 (규칙 2: 동사로 시작, 결과 중심, 자료에 있는 사실만)
2. 국문을 영문에 맞춰 작성
3. 익명·실명 확인: 승인된 고객사 외에는 업종 표기 (규칙 3)
4. 새 용어는 `docs/glossary.md`에 먼저 추가
5. `npm run build`: 스키마 검사 → CV PDF 재생성(`scripts/cv-pdf.mjs`) → 내부 링크 검사(`scripts/check-links.mjs`)
6. 브라우저 확인: `/`와 `/ko/`, 해당 섹션과 `/work/<slug>/`, `/cv/`
7. 커밋. push는 사용자가 요청할 때만

## 구현 기준

- 색, 서체, 간격, 모서리, 전환 시간은 `tokens.css`의 변수만 쓴다. 값을 직접 쓰지 않는다.
- 시맨틱 HTML, 키보드 탐색, 대비 4.5:1 이상, 이미지 대체 텍스트, 페이지별 `lang` 속성.
- 라이트/다크 모두 지원하고 `prefers-reduced-motion`을 따른다.
- 360px 폭에서 가로 스크롤이 없어야 한다.
- 클라이언트 JS는 필요한 곳(필터, 테마·언어 전환)에만 쓴다.
- 의존성 추가는 최소로 하고, 추가할 때 이유를 알린다.

## 작업 방식

1. `docs/tasks.md`에서 다음 작업을 확인하고, 작업 범위를 벗어나는 변경은 먼저 묻는다.
2. 구현 후 `npm run build`가 통과하는지 확인한다.
3. 화면이 바뀌는 작업은 브라우저에서 직접 확인한다 (데스크톱/모바일, 라이트/다크, 영문/국문).
4. `docs/tasks.md`를 갱신하고, 무엇을 했고 무엇이 남았는지 짧게 보고한다.
5. 커밋은 작업 단위로 작게 한다. push와 배포는 사용자가 요청할 때만 한다.
6. 작업은 `master`에서 한다. 브랜치는 만들지 않는다 (필요하면 사용자가 만든다). `master` push는 곧 공개이므로 사용자가 요청할 때만 한다.

요구사항이 불명확하거나 선택지가 여럿이면 추측하지 말고 질문한다.
더 나은 방법이 보이면 구현 전에 제안한다.
