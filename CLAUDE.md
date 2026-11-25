# CLAUDE.md

Kwang Myung Yu(유광명)의 경력·프로젝트 실적을 소개하는 개인 웹사이트. 영문 주력 + 국문 전체 전환.
Astro 정적 사이트, GitHub Pages(`https://sguys99.github.io`). 2026-11-12 공개, 운영 단계.
다음 작업은 `docs/tasks.md`의 "대기 중"·"Backlog"에서 고른다.

## 문서 읽기 (토큰 절약)

긴 문서는 통째로 읽지 않는다. 목차를 보고 필요한 절만 읽는다.

```bash
node scripts/doc-section.mjs DESIGN.md                 # 목차 (## ~ ###, 시작 줄과 길이)
node scripts/doc-section.mjs DESIGN.md 5.24 --outline  # 그 절의 하위 목차
node scripts/doc-section.mjs DESIGN.md 5.24.6          # 그 절 본문만
grep -n '검색어' docs/glossary.md                        # 용어집은 grep으로만
```

| 문서 | 역할 | 읽는 법 |
|---|---|---|
| `DESIGN.md` (3,400줄) | 3장 토큰, 4장 레이아웃, 5장 컴포넌트(5.24 케이스 스터디), 6장 페이지, 7장 국/영 타이포, 8장 다크, 9장 접근성, 11장 Decision Log | 목차 → 해당 절만. 전체 읽기 금지. 새 결정 기록은 마지막 항목 하나만 형식 참고 |
| `docs/tasks.md` | 운영 체크리스트, 대기 작업, Backlog | 필요한 절만 |
| `docs/glossary.md` | 영문/국문 표기 | grep으로 해당 용어만 |
| `docs/basic-plan.md` | 목적, 범위, 정보 구조, 결정 사항 | 해당 절만 |
| `docs/tasks-archive.md` | 공개까지의 구축 기록 (`tasks N.N` 번호가 가리키는 곳) | grep만. 수정 금지 |
| `docs/anti-ai-slop-*.md` | "AI 흔적 제거" 작업 계획과 진단 | 그 작업을 할 때 해당 절만 |
- `basic-plan.md`는 내용이 바뀌어도 **버전 1.0 유지** (사용자가 요청할 때만 올림).
- `docs/references/`는 형식 참고용이다. 이 프로젝트의 규칙이 아니다.
- 코드·콘텐츠 파일도 같다. 큰 파일은 `grep -n`으로 위치를 찾고 그 범위만 읽는다.
- 문서끼리 내용이 어긋나면 임의로 판단하지 말고 사용자에게 확인한다.

## 화면 확인 (스크린샷 최소화)

이미지는 장당 약 1.5K 토큰이다. 지난 작업에서 토큰을 가장 많이 쓴 원인이다.

- 숫자로 잴 수 있는 것은 이미지 대신 Playwright `browser_evaluate`로 확인한다:
  가로 스크롤(`scrollWidth > clientWidth`), 넘침, 계산된 색·대비, 요소 존재·순서, `lang`, `aria-*`.
- 직접 보는 이미지는 작업당 **2장**: 영문 데스크톱 라이트 + 국문 모바일(360px) 다크. 뷰포트만 찍고 전체 페이지는 찍지 않는다.
  2장에서 문제가 보이거나 사용자가 요청하면 그 조합만 더 본다.
- 나머지 조합(데스크톱/모바일 × 라이트/다크 × 영문/국문)과 시안 캡처는 파일로 저장해 경로만 사용자에게 알리고, Claude가 읽지 않는다.
- 같은 화면을 수정하면서 다시 볼 때는 바뀐 부분만 `clip`이나 요소 스크린샷으로 찍는다.

## 기술 스택과 명령어

- Astro (정적 출력), Content Collections, 순수 CSS + CSS 변수 토큰. Node 24 LTS (`.nvmrc`)
- 다국어: `/` 영문, `/ko/` 국문. URL은 끝에 `/` (`trailingSlash: 'always'`)
- 배포: `master` push → GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages. **`master` push = 공개**

```bash
npm run dev       # 개발 서버
npm run build     # 스키마 검사 → 정적 빌드 → CV PDF 생성 → 내부 링크 검사 → 문구 검사(scripts/check-text.mjs)
                  # 처음 한 번: npx playwright install chromium
npm run preview   # 빌드 결과 확인
npm run format    # Prettier (format:check는 검사만)
```

## 디렉터리 (코드에서 바로 안 보이는 것만)

```
src/content/            콘텐츠 원본. 모든 이력 문장은 여기에만 (규칙 2)
src/content.config.ts   스키마, DOMAINS·CAPABILITIES·APPROVED_CLIENTS
src/i18n/ui.ts          UI 문구 { en, ko } 사전
src/styles/tokens.css   디자인 토큰
src/cv-pdf.mjs          CV PDF 경로 상수 (사이드바 링크와 scripts/cv-pdf.mjs가 공유)
scripts/                빌드 후처리(cv-pdf, check-links, check-text), doc-section(문서 절 읽기)
.claude/commands/       add-project, add-entry (안내형 콘텐츠 추가)
docs/design-drafts/     Gate별 시안 보관
docs/private/           원본 자료: 이력서, 경력기술서, 사진 원본 (.gitignore, 커밋 금지)
```

## 규칙 1. 디자인은 시안 2~3개를 제시하고 선택받는다

디자인 결정은 혼자 정해서 구현하지 않는다.

1. 실제 콘텐츠를 넣은 시안을 2~3개 만든다. 캡처는 위 "화면 확인" 기준을 따른다.
2. 시안마다 의도와 장단점을 1~2줄로 적어 제시한다.
3. 사용자의 선택(또는 조합)을 받은 뒤 구현한다.
4. 선택 결과와 이유를 `DESIGN.md` 11장 Decision Log에 기록하고, 시안은 `docs/design-drafts/`에 둔다.

대상: 레이아웃, 서체, 색, 여백, 컴포넌트 형태, 모션, 문구의 어조, 아이콘·이미지 사용.
제외: `DESIGN.md`에 이미 정해진 것을 그대로 적용하는 일, 버그 수정.
방향: 세련되고 minimal하게. 고정 사이드바 + 카드형 섹션 + 타이포 위계. 홈은 대표작만 상세히, 전체 목록은 접힘과 필터로.

## 규칙 2. 콘텐츠는 한 곳에서만 관리한다

- 모든 이력 내용은 `src/content/`에만 둔다. 컴포넌트나 페이지에 문장을 직접 쓰지 않는다.
- 한 항목에 영문(`en`)과 국문(`ko`)을 함께 둔다. 둘 중 하나가 비면 빌드가 실패해야 한다.
- **영문이 원본**이다. 영문을 먼저 확정하고 국문을 맞춘다.
- 영문은 직역하지 않고 영문 이력서 관례로 쓴다 (동사로 시작, 결과 중심, 1~2줄).
- 표기는 `docs/glossary.md`를 따른다. 없는 용어는 추가한 뒤 사용한다.
- 영문과 국문 모두 em dash(`—`)를 쓰지 않는다. 기간과 수치 범위의 en dash(`–`)는 유지한다.
- 나열용 중간점(`·`)은 문맥에 맞게 풀어 쓴다. 국문 본문에서 두 항목은 ‘와/과’, 세 항목 이상은 쉼표로 잇고, 라벨 안의 병렬은 `/`로 적는다. 예외는 단위 `N·m`, 수식 `Kd·ω`, 법령 단위 `조·항`과 `조·항·호`, 기존 강의 제목의 `학부·석사`다. 구분자 용례는 용어집 9.6절을 따른다.
- 국문 이력 문장은 ‘설계’, ‘호출 증가’처럼 사실을 담은 명사로 끝낸다. 한 문장이면 마침표를 생략하고 두 문장 이상이면 문장마다 찍는다. 한 줄 소개와 경력 요약은 한 문장이어도 마침표를 찍는다. UI 안내는 합니다체, 직접 인용은 원문을 유지한다. 표와 다이어그램의 짧은 상태 라벨은 `docs/anti-ai-slop-plan.md` 5.5절을 따른다.
- **없는 사실을 만들지 않는다.** 성과 수치, 기간, 역할, 기술 스택은 사용자가 준 자료에 있는 것만 쓴다.
  비어 있는 정보는 추측으로 채우지 말고 질문한다. 아직 받지 못한 자료는 `docs/tasks.md` "대기 중"에 있다.
- 실적 건수의 기준은 이력서(`docs/private/resume_ko_20261018.docx`)와 `docs/basic-plan.md`다.
  `work_experience*` 파일은 케이스 스터디 내용 참고용이고, 그 안의 건수(특허 14, SW 9 등)는 이전 버전이라 쓰지 않는다.

## 규칙 3. 공개 저장소다. 기밀과 개인정보를 지킨다

저장소와 사이트는 모두 공개된다. 아래는 파일, 주석, 커밋 메시지 어디에도 적지 않는다.

- **고객사 실명**은 아래만 허용한다. 나머지는 업종 표기로 익명 처리한다 (예: "a global F&B company").

| 프로젝트 | 표기 |
|---|---|
| SCM 데이터 분석 및 업무 지원 서비스 (PwC) | Samsung Electronics |
| 온라인 상담 지원 및 제품 추천 어시스턴트 (PwC) | Samsung Electronics |
| AI 과제 추진 로드맵 수립 컨설팅 및 PoC 수행 (PwC, 옛 이름: AI 프로젝트 마스터플랜 및 LLM 서비스 PoC) | LOTTE Fine Chemical |
| ├ 원자재 가격 예측 (마스터플랜 PoC, PwC) | LOTTE Fine Chemical |
| └ 그린소재 재고 조합 최적화 (마스터플랜 PoC, PwC) | LOTTE Fine Chemical |
| 보고서: AI 과제 MP 수립 및 Gen AI PoC 수행사례 (PwC, 2025) | LOTTE Fine Chemical |

- 새 프로젝트는 기본 익명이다. 실명은 건별로 사용자 승인을 받는다 (`APPROVED_CLIENTS`와 위 표를 함께 고침).
- **전화번호**는 싣지 않는다. 원본 자료는 `docs/private/`에만 두고 커밋하지 않는다.
- **경력**은 사용자가 제공한 6곳만 싣는다. 그 사이 구간이나 다른 소속은 표기하지 않는다.
- 회사 로고는 경력 6곳만 승인됨(`src/assets/logos/`, DESIGN.md 5.11). 고객사 로고는 쓰지 않는다. 그 밖의 로고는 승인을 받는다.

## 확정된 프로필 정보

원본은 `src/content/profile.yaml`. 이름 Kwang Myung Yu / 유광명, 대표 직함 AI Engineer, 현재 소속 Director, R&D Group, GenON.
이메일 sguys99@naver.com, GitHub `sguys99`, LinkedIn `kmyu99`.
프로필 사진(4:5, 1200×1500)은 `src/assets/profile.jpg`(화면)와 사본 `public/images/profile.jpg`(OG·JSON-LD). 바꿀 때 둘 다 교체한다.

## 콘텐츠 갱신 절차

필드와 허용값은 `src/content.config.ts`가 기준이다. 기존 항목 하나를 본떠 쓴다.
안내형 추가: `/add-project` (프로젝트), `/add-entry` (그 외 항목).

| 추가 대상 | 수정할 파일 | 함께 볼 것 |
|---|---|---|
| 경력 | `src/content/experience.yaml` (키 = id) | 6곳 외 추가는 사용자 확인 (규칙 3) |
| 프로젝트 | `src/content/projects/<slug>.md` (frontmatter) | `client` 기본 익명 (`public: false` + `label`). `domain`·`capability`는 config의 `DOMAINS`·`CAPABILITIES` 값만 |
| 대표 프로젝트 | 위 파일의 `featured: true`, `order`, `caseStudy` | `featured` + `caseStudy`가 있어야 `/work/<slug>/` 생성. 지정은 사용자 승인 |
| 케이스 스터디 다이어그램 | `src/content/diagrams/<slug>.yaml` (`legend`, `problem`, `approach`, `arch`, `flow`, `results`) | 배치와 형식은 DESIGN.md 5.24.4·5.24.6 (`doc-section.mjs`로 그 절만) |
| 개인 프로젝트 | `src/content/personal/<slug>.md` | 언어별 `name`, `order`, `site`나 `repo` 중 하나 이상 필수. `status`는 `in-progress`, `active`, `archived` 중 선택 |
| 특허 | `src/content/patents.yaml` | `status` `filed`·`registered`. 파일 머리 주석의 건수 |
| SW 등록 | `src/content/software.yaml` | 파일 머리 주석의 건수 |
| 논문·보고서 | `src/content/publications.yaml` | `type: paper` / `report` |
| 강의·자문·저서 | `src/content/teaching.yaml` | `kind`: `teaching`·`advisory`·`book` |
| 수상 | `src/content/awards.yaml` | |
| 학력 | `src/content/education.yaml` | |

- 건수(IP 서랍, 등록/출원, 카드 머리 `총 n건`)와 CV 집계는 컬렉션에서 자동 계산된다. `profile.yaml`에 건수를 쓰지 않는다.
- 이미지는 `public/images/`(최적화가 필요하면 `src/assets/`)에 두고 대체 텍스트를 단다.

확인 순서: 영문 원본 → 국문 → 익명·실명(규칙 3) → 새 용어는 glossary에 먼저 → `npm run build`(원본과 빌드 결과의 문구 검사 포함) → 화면 확인(`/`, `/ko/`, 해당 섹션, `/work/<slug>/`, `/cv/`) → 커밋.

## 구현 기준

- 색, 서체, 간격, 모서리, 전환 시간은 `tokens.css`의 변수만 쓴다. 값을 직접 쓰지 않는다.
- 시맨틱 HTML, 키보드 탐색, 대비 4.5:1 이상, 이미지 대체 텍스트, 페이지별 `lang` 속성.
- 라이트/다크 모두 지원하고 `prefers-reduced-motion`을 따른다.
- 360px 폭에서 가로 스크롤이 없어야 한다.
- 클라이언트 JS는 필요한 곳(필터, 테마·언어 전환)에만 쓴다.
- 의존성 추가는 최소로 하고, 추가할 때 이유를 알린다.

## antislop 점검

- `antislop` 계열 스킬은 작업 후 점검(`after`) 모드로 쓴다. 기본값은 `~/.config/antislop/settings.json`.
- 점검은 영문에만 적용한다. 국문 문안과 `/ko/` 페이지는 대상에서 뺀다.

## 작업 방식

1. `docs/tasks.md`에서 다음 작업을 확인한다. 작업 범위를 벗어나는 변경은 먼저 묻는다.
2. 구현 후 `npm run build`가 통과하는지 확인한다.
3. 화면이 바뀌는 작업은 "화면 확인" 기준으로 확인한다.
4. `docs/tasks.md`를 갱신하고, 무엇을 했고 무엇이 남았는지 짧게 보고한다.
5. 커밋은 작업 단위로 작게, 작업을 마칠 때마다 한다.
6. 작업은 `master`에서 한다. 브랜치는 만들지 않는다 (필요하면 사용자가 만든다).
7. **push는 사용자가 요청할 때만** 한다. `master` push는 곧 공개다.

요구사항이 불명확하거나 선택지가 여럿이면 추측하지 말고 질문한다. 더 나은 방법이 보이면 구현 전에 제안한다.
