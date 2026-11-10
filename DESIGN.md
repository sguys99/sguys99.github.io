# DESIGN.md

sguys99.github.io의 디자인 명세. 구현은 이 문서를 따르고, 여기에 없는 디자인 결정은 시안을 제시해 선택받은 뒤 추가한다 (CLAUDE.md 규칙 1).

| 항목 | 내용 |
|---|---|
| 콘셉트 | Quiet Dossier: 차가운 무채색 바탕, 얇은 선, 포인트 색 1개, 기록표 같은 행 문법 |
| 기준 시안 | 홈 `docs/design-drafts/g4/base.html`, 케이스 스터디 `g4/case.html` + 3차 확정안 `331-c`·`332-a2`·`333-a`·`334-d`·`335-a` |
| 토큰 파일 | `src/styles/tokens.css` (이 문서의 3장과 값이 같아야 함) |
| 결정 기록 | 11장 Decision Log |

시안과 이 문서가 다르면 이 문서가 우선한다. 이 문서가 비어 있거나 모호하면 구현 전에 사용자에게 묻는다.

## 목차

1. Brand & Tone
2. Principles
3. Tokens
4. Layout & Breakpoints
5. Components
6. Page Templates
7. Bilingual Typography
8. Dark Mode
9. Accessibility
10. Print
11. Decision Log

## 1. Brand & Tone

### 사이트 목적과 독자

처음 온 사람이 **30초 안에 어떤 사람인지** 파악하고, **3분 안에 근거(프로젝트·특허·저술)를 확인**하게 한다 (basic-plan 1.1).

| 독자 | 찾는 것 | 주로 보는 곳 |
|---|---|---|
| 채용 담당자·리크루터 | 직무 적합성, 리더십 범위, 최근 실적 | 사이드바, About, Experience, CV PDF |
| 컨설팅·강의·자문 의뢰자 | 분야별 수행 사례, 강의 이력, 연락 방법 | Selected Work, Teaching · Books · Advisory, Contact |
| 동료·커뮤니티 | 전체 실적, 저술, 개인 작업 | 전체 프로젝트 원장, IP & Publications, Personal Projects |

핵심 과제: **많은 실적을 minimal하게 보이게 하는 밀도 조절**, 그리고 영문·국문 모두에서 균형 잡힌 타이포그래피 (basic-plan 2.4).

### 콘셉트: Quiet Dossier

정리된 인사 기록철처럼, 장식 없이 사실이 행 단위로 정돈된 인상 (G1 A).

| 키워드 | 뜻 |
|---|---|
| Quiet | 차가운 무채색 바탕, 포인트 색은 현재 위치·상태에만 |
| Composed | 모든 목록이 같은 행 문법, 같은 간격 |
| Factual | 수식어 대신 기간·건수·역할·성과 |
| Engineered | Geist Mono 메타 정보, 번호 매긴 목록, 표로 쓴 아키텍처 |
| Bilingual | 영문·국문이 같은 레이아웃, 같은 완성도 |

### 시각 언어 요약

| 요소 | 규칙 | 근거 |
|---|---|---|
| 색 | 무채색 + 포인트 1색(Slate Ink, `--accent`). `--accent-soft`는 같은 색의 옅은 바탕일 뿐 별도 색이 아니다 | 3.1.2 A |
| 선 | 1px 헤어라인과 여백으로 구분. 그림자로 띄우지 않는다 | G1 A, 3.2.1 A |
| 행 문법 | 왼쪽 열(기간·번호) \| 오른쪽 내용(제목 / 부제 / 메타) | 3.2.1 A, 3.2.6 A |
| 서체 | Geist(본문·제목) + Geist Mono(메타·숫자) + Pretendard(국문) | 3.1.1 A |
| 로고 | 경력 6곳만 공식 로고를 글자색 단색으로. 고객사는 텍스트만 | 3.2.7 C |
| 모노그램 | "KM" 타일 (파비콘·OG), 사진은 사이드바에만 | 3.3.4 D |
| 모션 | 첫 등장 1회의 조용한 순서 등장, 모션 줄이기 설정이면 모두 끔 | 3.3.1 C |

### UI 문구 어조

콘텐츠(`src/content/`)와 UI 문구(`src/i18n/`)는 어조가 다르다. 둘 다 아래를 따른다.

| 구분 | 영문 | 국문 |
|---|---|---|
| 경력·프로젝트 문장 | 동사로 시작, 과거형, 결과 중심 1~2줄 (`Developed a Model Predictive Control (MPC) program that runs on ...`). 현재 역할만 현재형 (`Lead the Physical AI humanoid product ...`) | 명사형 종결, 마침표 없음 (`... 프로그램 개발`, `... 서비스 총괄`) |
| 한 줄 소개·요약 | 주어 없는 구 (`Building industrial AI, from control rooms to humanoid robots.`) | 명사형 종결 (`제어실에서 휴머노이드 로봇까지, 산업 현장의 AI 구현.`) |
| 섹션 제목 | 명사구, Title Case (`Selected Work`, `All Projects`, `IP & Publications`) | 명사구 (`대표 프로젝트`, `전체 프로젝트`, `지식재산 · 출판물`) |
| 버튼·라벨 | 짧은 명사구·동사구, sentence case (`Show all`, `Clear filters`, `Open to`, `At a glance`) | 짧은 명사구 (`모두 보기`, `필터 해제`, `의뢰 가능 분야`, `숫자로 보기`) |
| 상태 배지 | 1~2단어 (`Lead`, `In progress`, `Registered`, `Pending`) | 1~2단어 (`총괄`, `진행 중`, `등록`, `등록 진행 중`) |
| 안내·빈 상태 문장 | 완결 문장 (`No projects match these filters.`) | 합니다체 (`조건에 맞는 프로젝트가 없습니다.`) |
| 보조 기술용 라벨 | 동작을 명시 (`Copy email address`, `Open menu`) | 동작을 명시 (`이메일 주소 복사`, `메뉴 열기`) |

- 영문이 원본이다. 국문은 직역하지 않고 위 형식에 맞춘다 (CLAUDE.md 규칙 2).
- 용어 표기는 `docs/glossary.md`를 따른다. 직함 `AI Engineer`, `Director`, 분야명 `Physical AI`는 국문 화면에서도 영문 그대로 쓴다.
- 1인칭 구호, 감탄문, 과장 수식어(passionate, cutting-edge, 혁신적인 등)는 쓰지 않는다.

### 피할 인상

| 피할 인상 | 이렇게 보이는 원인 |
|---|---|
| 테크 스타트업 랜딩 페이지 | 그라디언트 글로우, 큰 CTA 버튼, 화려한 히어로 |
| 대시보드·SaaS 템플릿 | 카드 안의 카드, 그림자 쌓기, 아이콘 남발 |
| 로고 월(로고 자랑) | 고객사 로고, 색 있는 회사 로고 |
| 과장된 자기소개 | 경력 연수 강조, "50+" 같은 근사치, 수식어 |
| 흩어진 포트폴리오 | 섹션마다 다른 목록 형식, 영문·국문 완성도 차이 |

## 2. Principles

1. **Content first**: 장식보다 문장과 위계. 장식은 정보를 전달할 때만 쓴다 (G1 A, basic-plan 6.4).
2. **One accent, line over shadow**: 무채색 바탕에 포인트 색 1개, 구분은 1px 선과 여백으로 한다 (G1 A, 3.1.2 A).
3. **One row grammar**: 홈의 모든 목록은 `기간·번호 | 내용` 한 가지 문법을 쓴다. 대표작, 경력, 강의, 수상이 같은 행 구조다 (3.2.1 A, 3.2.6 A).
4. **Progressive disclosure**: 첫 화면은 짧게, 긴 목록은 접힘·필터·서랍으로 연다. 상세는 케이스 스터디와 CV로 보낸다 (3.2.2 B, 3.2.5 B, 3.2.3 C).
5. **Facts only, counted from content**: 숫자는 콘텐츠에서 계산하고, 근사치·연수는 쓰지 않는다. 고객사는 승인된 2곳 외 익명이다 (3.2.8 A, G4 + G5 함께 정한 것, CLAUDE.md 규칙 3).
6. **Bilingual and light/dark parity**: 영문·국문, 라이트·다크 네 조합 모두 1급으로 설계한다. 언어·테마 전환은 같은 위치를 유지한다 (3.1.1 A, 3.1.2 A, 3.3.2 A2).
7. **Expressive once, then quiet**: 모션은 첫 등장에 한 번만 재생하고, 앵커 이동과 `prefers-reduced-motion`에서는 건너뛴다 (3.3.1 C).

### Do

- 포인트 색(`--accent`)은 현재 탭 밑줄, 현재 궤적 단계, 상태 점, 링크·포커스, 복사 완료 상태에만 쓴다 (3.1.5, 3.3.2 A2).
- 목록 행은 왼쪽 열에 기간(경력·강의·수상) 또는 2자리 번호(대표작 01–06, 개인 프로젝트)를 둔다 (3.2.1 A, 3.2.4 B, 3.2.6 A).
- 날짜·번호·건수·배지는 Geist Mono로 쓴다 (3.1.1 A).
- 숫자 표 4칸(Projects, Patents, Software, Books)은 콘텐츠 건수에서 계산한다 (3.2.8 A).
- 전체 프로젝트·특허·프로그램·보고서는 기본 접힘으로 두고 "Show all / 모두 보기"로 연다 (3.2.2 B, 3.2.5 B).
- 경력 6곳의 회사 로고는 글자색 단색(`currentColor` SVG)으로 쓴다 (3.2.7 C).
- 케이스 스터디가 없는 대표작은 링크 없이 같은 행으로 표시한다 (G4 + G5 함께 정한 것).
- 진행 중 항목은 홈·CV 모두 "In progress / 진행 중"으로 통일한다 (G6 구현 시 처리할 것).
- 사이드바는 기록표(키/값)로 연락처를 바로 보여준다 (3.1.3 C).
- 360px에서도 잘리는 요소 없이 얇은 고정 바 + 메뉴 시트로 전환한다 (3.1.6 C).

### Don't

- 카드 안에 카드를 넣지 않는다 (이중 테두리 금지, G1 → 3.2.1 A에서 해소).
- 포인트 색을 두 번째 색과 섞지 않는다. 대표 행의 왼쪽 포인트 색 선도 쓰지 않는다 (3.1.2 A, 3.2.2 B 사용자 요청).
- 그림자·그라디언트로 카드를 띄우거나 배경을 칠하지 않는다. 시안의 그라디언트는 궤적 마지막 구간의 페이드, 넘침 마스크, 선택 상자 화살표뿐이다 (G1 A).
- 고객사 로고, 이니셜 배지를 쓰지 않는다. 로고는 경력 6곳만 (3.2.7 C).
- 경력 연수("16+ years")와 보고서 총량("50+")을 표기하지 않는다 (1.1.4, G4 + G5 함께 정한 것).
- 승인된 실명 2곳(Samsung Electronics, LOTTE Fine Chemical) 외 고객사 실명을 쓰지 않는다 (CLAUDE.md 규칙 3).
- 특허·프로그램 등록번호를 CV에 싣지 않고, `10-140515`는 사이트에서도 숨긴다 (basic-plan 5.4 ④, G6 함께 정한 것).
- 전화번호를 싣지 않는다. 이메일은 mailto 링크와 복사 버튼으로만 제공한다 (basic-plan 5.5).
- 사이드바에 섹션 목차를 두지 않는다. 섹션 이동은 상단 메뉴가 맡는다 (G1 A).
- 모션을 반복 재생하거나, 탭으로 이동한 섹션에 등장 효과를 다시 걸지 않는다 (3.3.1 C).

## 3. Tokens

`src/styles/tokens.css`의 원본. 값의 출처는 `g4/base.html`의 `:root`와 다크 블록이고, 3차 확정안에서 추가된 토큰(331-c 모션, 333-a CV)을 합쳤다. 시안 본문에 직접 쓰여 반복되던 값도 토큰으로 정리했다(정리 내역은 각 하위 섹션의 "정리 이력" 표).

| 표기 | 뜻 |
|---|---|
| (값만) | 확정 토큰. 이름과 값을 그대로 쓴다 |
| 미정 | 시안에 없음. 구현 시 시안 제시 |

토큰 수집 범위: base, case, 331-c, 332-a2, 332-a2-case, 333-a, 334-d, 335-a의 `:root`·다크 블록을 diff. base에 없는 토큰은 331-c(모션 12개 + `--row-tint`), 333-a(`--cv-*` 14개)뿐이다. 332-a2·335-a·334-d는 새 토큰이 없다(335-a·334-d는 이전 기준안 복사본이라 로고 토큰이 빠져 있을 뿐, 값 충돌은 없음).

### Color

라이트는 `:root`, 다크는 `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`와 `:root[data-theme="dark"]` 두 곳에 **같은 값**을 둔다. 두 블록이 어긋나지 않게 구현 시 한 목록에서 생성하거나 나란히 둔다.

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `color-scheme` | `light` | `dark` | 폼 컨트롤·스크롤바 |
| `--bg` | `#f3f5f8` | `#0d1117` | 페이지 바탕, 사이드바 바탕 |
| `--surface` | `#ffffff` | `#151b23` | 카드, 메뉴 시트, 버튼·선택 상자 바탕 |
| `--line` | `#dfe3ea` | `#252d38` | 카드 테두리, 행 구분 헤어라인 |
| `--line-strong` | `#c5ccd6` | `#364150` | 목록 머리 선, 배지 테두리, 링크 밑줄, 궤적 선·점 |
| `--text` | `#141a22` | `#e6eaf0` | 본문, 제목 |
| `--text-2` | `#475260` | `#b1bac6` | 요약, 설명, 보조 본문 |
| `--text-3` | `#5f6a78` | `#8b95a3` | 메타(날짜·번호·라벨), 비활성 탭 |
| `--chip` | `#eef1f5` | `#1d2530` | 태그 바탕, 사진 자리 바탕 |
| `--accent` | `#2b5a8a` | `#8db3e2` | 포인트 색 1개: 현재 탭 밑줄, 직함, 현재 경력, 링크 hover |
| `--accent-soft` | `#e6edf6` | `#1a283b` | 선택된 토글·태그·필터 바탕, 상태 점 후광 |
| `--focus` | `var(--accent)` | (상속) | 포커스 링 |
| `--row-tint` | `var(--accent-soft)` | (상속) | 링크 있는 대표작 행 hover 바탕 (331-c) |
| `--header-bg` | `rgba(243, 245, 248, 0.9)` | `rgba(13, 17, 23, 0.9)` | 고정 상단 메뉴 바탕 (`--bg`의 90%) |
| `--scrim` | `rgba(22, 25, 29, 0.32)` | `rgba(0, 0, 0, 0.6)` | 메뉴 시트 `::backdrop` |
| `--photo-ring` | `var(--line)` | `var(--line-strong)` | 프로필 사진 테두리 |
| `--photo-filter` | `none` | `brightness(0.86)` | 다크에서 사진 흰 배경 낮춤 |
| `--logo-filter` | `brightness(0)` | `brightness(0) invert(1)` | 경력 로고 단색화 |
| `--logo-op` | `0.62` | `0.6` | 로고 기본 농도 |
| `--logo-op-cur` | `0.92` | `0.9` | 현재 소속·hover 로고 농도 |
| `--mask-solid` | `#000` | (같음) | 마스크 알파 전용. 보이는 색 아님 |

인쇄(333-a `@media print`): 화면 테마와 관계없이 라이트 팔레트로 고정하고 `--bg`만 `#ffffff`로 바꾼다.

**대비비 (WCAG 2.x, 직접 계산)** — 모두 4.5:1 이상. 경고 없음.

| 전경 | 테마 | on `--bg` | on `--surface` | on `--chip` | on `--accent-soft` |
|---|---|---|---|---|---|
| `--text` | 라이트 | 16.01 | 17.49 | 15.44 | 14.83 |
| `--text-2` | 라이트 | 7.27 | 7.94 | 7.01 | 6.74 |
| `--text-3` | 라이트 | 5.03 | 5.50 | 4.85 | 4.66 |
| `--accent` | 라이트 | 6.56 | 7.16 | 6.32 | 6.07 |
| `--text` | 다크 | 15.67 | 14.34 | 12.79 | 12.33 |
| `--text-2` | 다크 | 9.65 | 8.83 | 7.88 | 7.59 |
| `--text-3` | 다크 | 6.24 | 5.71 | 5.09 | 4.91 |
| `--accent` | 다크 | 8.72 | 7.98 | 7.12 | 6.86 |

- 여유가 가장 적은 쌍: 라이트 `--text-3` on `--accent-soft` 4.66. `--text-3`·`--accent-soft`를 바꿀 때 다시 계산한다.
- `--line` 1.29, `--line-strong` 1.62 (on surface)는 장식선이라 기준 대상 아님. 선만으로 정보를 전달하지 않는다(필터 선택 상태는 색+바탕+글자색 변화).
- 로고(근사): 라이트 0.62 농도 ≈ 6.2:1, 다크 0.6 ≈ 6.8:1 on surface.
- `--header-bg`는 90% 불투명이라 위 `--bg` 값과 사실상 같다.

**자산 고정색 (334-d)** — SVG 파비콘·OG PNG는 CSS 변수를 못 쓰므로 hex를 직접 쓴다. 값은 토큰과 같아야 한다.

| 자산 | 요소 | 값 | 대응 토큰 |
|---|---|---|---|
| favicon.svg 라이트 | 타일 / 글자 | `#141a22` / `#f3f5f8` | `--text` / `--bg` (라이트) |
| favicon.svg 다크 (`prefers-color-scheme`) | 타일 / 글자 | `#e6eaf0` / `#0d1117` | `--text` / `--bg` (다크) |
| apple-touch-icon | 바탕 | `#f3f5f8` (다크 없음) | `--bg` 라이트 |
| OG 1200×630 | 바탕 / 이름 / 직함 / 한 줄 소개 / URL | `#f3f5f8` / `#141a22` / `#2b5a8a` / `#475260` / `#5f6a78` | `--bg` / `--text` / `--accent` / `--text-2` / `--text-3` |
| CV `@page` 쪽 하단 | 글자 | `#5f6a78` | `--text-3` 라이트 (`@page`에서 변수 미해석) |

### Typography

**패밀리**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--font` | `"Geist", "Pretendard Variable", system-ui, -apple-system, "Segoe UI", sans-serif` | 영문 본문·제목 |
| `--font-ko` | `"Pretendard Variable", "Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif` | 국문 페이지 전체 (`:lang(ko)`) |
| `--font-display` | `var(--font)`, `html:lang(ko)`에서 `var(--font-ko)` | 이름, 한 줄 소개, 프로젝트 제목, 404 제목 |
| `--font-meta` | `"Geist Mono", "Pretendard Variable", ui-monospace, "SFMono-Regular", monospace` | 날짜, 번호, 건수, 배지, 섹션 라벨(영문), 푸터 |

시안 로드: Geist 400/500/600, Geist Mono 400/500 (Google Fonts), Pretendard Variable v1.3.9 dynamic subset (jsDelivr). Geist Mono에는 600이 없으므로 `--font-meta`에 600을 쓰지 않는다. 자체 호스팅 여부·서브셋은 미정(구현 시 결정).

**크기 스케일** (1rem = 16px)

| 토큰 | rem | px | 주 용도 |
|---|---|---|---|
| `--fs-2xs` | 0.6875 | 11 | 배지, 영문 대문자 키 라벨(사이드바 키, `.lg-label`, `.rec dt`, `.sel-k`, `.out .k`), 숫자 표 보조줄 |
| `--fs-xs` | 0.75 | 12 | 메타(날짜·번호), 태그, 영문 섹션 제목(`.sec-head h2`), 토글 버튼, 푸터 |
| `--fs-sm` | 0.8125 | 13 | 보조 본문(요약·설명), 탭, 사이드바 값, 원장 행 |
| `--fs-md` | 0.9375 | 15 | 본문 기준(`body`), 경력 행 제목, 궤적 제목 |
| `--fs-lg` | 1.0625 | 17 | 대표작 제목, 서랍 유형명, Contact 이메일, 모바일 이름 |
| `--fs-xl` | 1.375 | 22 | 사이드바 이름, 서랍 건수, 케이스 제목, 모바일 한 줄 소개 (메뉴 시트 항목은 `--fs-lg`/`--fs-sm`, 5.3) |
| `--fs-2xl` | 1.875 | 30 | 한 줄 소개, 숫자 표, 404 제목 |

국문 크기 규칙: 영문 대문자 라벨은 국문에서 한 단계 올린다. `--fs-2xs` → `--fs-xs` (키·라벨·배지 보조), `--fs-xs` → `--fs-sm` (섹션 제목, eyebrow, 시트 라벨). 국문에는 `text-transform`·넓은 자간이 의미 없기 때문.

**굵기**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--fw-regular` | 400 | 건수 숫자, 시트 하위 항목 등 기본 굵기를 명시해야 하는 곳 |
| `--fw-medium` | 500 | 탭, 버튼, 배지, 메타 강조 |
| `--fw-name` | 600 | 사이드바 이름 |
| `--fw-tagline` | 500 | 한 줄 소개, 404 제목 (영문) |
| `--fw-tagline-ko` | 600 | 같은 요소 국문 |
| `--fw-title` | 600 | 프로젝트·케이스 제목 |
| `--fw-strong` | 600 | 행 제목(h3/h4), `dt`, 국문 섹션 제목 |
| `--fw-eyebrow` | 500 | 영문 섹션 제목·eyebrow |

**행간**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--lh-body` | 1.6 | 영문 본문 |
| `--lh-body-ko` | 1.75 | 국문 본문 |
| `--lh-tagline` | 1.22 | 한 줄 소개·404 제목 영문 |
| `--lh-tagline-ko` | 1.4 | 같은 요소 국문 |
| `--lh-title` | 1.35 | 대표작·궤적 제목(h3) |
| `--lh-row` | 1.45 | 행 제목(h3/h4), 원장 제목, 사이드바 값 |

토큰이 없는 행간(`1.25` 이름, `1.1` 숫자, `1` 건수, `1.5`·`1.55` 촘촘한 목록)은 해당 컴포넌트 값으로 둔다.

**자간**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ls-body` | -0.005em | 영문 본문 |
| `--ls-body-ko` | -0.01em | 국문 본문 |
| `--ls-name` | -0.02em | 이름, 숫자 표 숫자 |
| `--ls-tagline` | -0.03em | 한 줄 소개 영문 |
| `--ls-tagline-ko` | -0.035em | 한 줄 소개 국문 |
| `--ls-title` | -0.012em | 프로젝트·케이스 제목 영문 |
| `--ls-title-ko` | -0.02em | 같은 요소 국문 |
| `--ls-eyebrow` | 0.06em | 12px 영문 대문자 섹션 제목·eyebrow·선택 상자 키·`.out .k`·`.sel-mark` |
| `--ls-eyebrow-ko` | 0 | 국문 섹션 제목 |
| `--ls-label` | 0.1em | 11px 영문 대문자 키 라벨(사이드바 키, `.lg-label`, `.rec dt`), 메뉴 시트 제목 |
| `--ls-label-ko` | 0.02em | 국문 키 라벨, 토글 버튼 글자 |

**정리 이력: 시안 값 → 확정 값 (Typography)**

| 대상 | 시안 값 | 확정 값 | 이유 |
|---|---|---|---|
| `.sheet-head h2`, `.sheet-label` 자간 | 0.12em | `--ls-label` 0.1em | 대문자 라벨 자간을 두 단계로 정리 |
| `.out .k` 자간 | 0.08em | `--ls-eyebrow` 0.06em | 〃 |
| `.sel-mark` 자간 | 0.04em | `--ls-eyebrow` 0.06em | 〃 |
| 대표작·궤적 h3 행간 | 1.35 | `--lh-title` 1.35 | 반복값 토큰화 |
| 행 h3/h4 행간 | 1.4 | `--lh-row` 1.45 | 1.4와 1.45를 하나로 |
| 원장 제목·사이드바 값 행간 | 1.45 | `--lh-row` 1.45 | 반복값 토큰화 |
| 직접 쓴 `font-weight: 500` / `400` | 500 / 400 | `--fw-medium` / `--fw-regular` | 반복값 토큰화 |

**구현 시 삭제 (base 안에서 앞 규칙을 뒤의 TYPE ROLES 규칙이 덮어 무효인 값)** → 화면에 적용되는 토큰 값만 남긴다.

| 대상 | 무효인 앞의 값 | 적용되는 토큰 |
|---|---|---|
| 영문 `body` 자간 | -0.003em | `--ls-body` -0.005em |
| 국문 `body` 자간 | -0.005em | `--ls-body-ko` -0.01em |
| `.name` 자간 | -0.015em | `--ls-name` -0.02em |
| `.tagline` 행간·자간 | 1.3 / -0.02em (국문 1.45 / -0.03em) | 1.22 / -0.03em (국문 1.4 / -0.035em) |
| `.sec-head h2` 굵기·자간 | 600 / 0.12em (국문 0.04em) | `--fw-eyebrow` 500 / `--ls-eyebrow` 0.06em (국문 `--fw-strong` / 0) |

### Spacing

| 토큰 | 값 | 용도 |
|---|---|---|
| `--sp-0` | 2px | 행 안 제목-부제 사이, 모바일 1열 행 간격, 기준선 맞춤 |
| `--sp-1` | 4px | 제목-부제 사이, 칩 간 세로 간격 |
| `--sp-1h` | 6px | 아이콘-글자 간격(`.copy`, `.chip-lnk`, `.btn`, `.status`), 태그 간격, 대표작 본문 간격 |
| `--sp-2` | 8px | 아이콘-글자, 작은 목록 간격 |
| `--sp-3` | 12px | 촘촘한 행 상하 패딩, 키-값 열 간격 |
| `--sp-4` | 16px | 기본 행 패딩, 열 간격, 모바일 좌우 여백 |
| `--sp-5` | 24px | 카드 사이, 섹션 머리 아래, 기간 열 간격 |
| `--sp-6` | 32px | 카드 안쪽 패딩, 데스크톱 탭 간격(332-a2) |
| `--sp-7` | 48px | 본문 좌우 패딩, 사이드바 상단 |
| `--sp-8` | 64px | 본문 하단 여백 |

3px·5px(기준선 맞춤 `padding-top`, `.st` gap)은 정렬 보정값이라 토큰으로 만들지 않는다.

### Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius` | 10px | 카드, 데스크톱 기본 사진 |
| `--radius-sm` | 6px | 사이드바 사진(861px 이상), CV 다운로드 자리, 링크 행 hover 영역, CV 종이 |
| `--radius-xs` | 4px | 배지, 포커스 링 |
| `--radius-bar` | 2px | 탭 밑줄 막대(`2px 2px 0 0` 포함) |
| `--radius-pill` | 999px | 버튼, 토글, 선택 상자, 태그, 모든 점(상태 점·궤적 점·시트 메뉴 점) |

### Layout sizes

| 토큰 | 값 | 바뀌는 조건 | 용도 |
|---|---|---|---|
| `--sidebar` | 320px | 홈 ≤1100px: 280px | 사이드바 폭 |
| `--sidebar` (케이스 스터디) | 340px | ≤1000px: 280px (332-a2-case) | 케이스 기록표 사이드바 |
| `--main` | 960px | — | 본문 최대 폭 (`.shell` 최대 = sidebar + main) |
| `--header-h` | 56px | ≤860px: 52px | 상단 메뉴·모바일 바 높이, `scroll-margin-top` 계산 |
| `--header-blur` | `saturate(1.2) blur(8px)` | — | 상단 메뉴 `backdrop-filter` |
| `--sb-photo-w` | 132px | ≥861px | 사이드바 사진 폭 (4:5) |
| `--sb-photo-w-sm` | 64px | ≤860px | 모바일 상단 프로필 사진 폭 |
| `--sb-key` | 64px | — | 사이드바 키 열 |
| `--sheet-w` | 340px | `min(var(--sheet-w), 88vw)` | 모바일 메뉴 시트 폭 |
| `--row-when` | 148px | ≤560px: 1열 | 경력·강의·수상 기간 열 |
| `--col-idx` | 48px | ≤560px: `--col-idx-sm` | 대표작 번호 열 |
| `--col-idx-sm` | 28px | — | 모바일 번호 열, Contact 번호 열 |
| `--col-year` | 56px | ≤560px: 1열 | 특허·출판 연도 열, 연도 묶음 머리 |
| `--col-year-wide` | 88px (`calc(var(--sp-8) + var(--sp-5))`) | ≤560px: 1열 | 전체 프로젝트 원장 연도 열 |
| `--measure` | 68ch | — | 설명·본문 읽기 폭 |
| `--measure-sm` | 64ch | — | 대표작·개인 프로젝트 요약 폭 |
| `--logo-h` | 22px | 로고별 `--s` 배율, ≤560px ×0.85 | 경력 로고 높이 |
| `--logo-w` | 124px | — | 로고 최대 폭 (기간 열 안) |
| `--logo-h-sm` | 14px | — | 프로젝트 메타 안 로고 |

**컨트롤·아이콘·장식**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ctl-h-sm` | 28px | 언어·테마 토글 버튼 |
| `--ctl-h` | 32px | 선택 상자, 복사 버튼, 저장소·데모 칩 링크 |
| `--ctl-h-lg` | 36px | 아이콘 버튼(테마·메뉴), 404 버튼 |
| `--icon-xs` | 12px | 외부 링크 아이콘 |
| `--icon-sm` | 14px | 복사·chev·버튼·칩 링크 아이콘 |
| `--icon` | 16px | 연락처·토글 아이콘 |
| `--icon-lg` | 18px | 대표작 화살표 |
| `--icon-stroke` | 1.5 | `--icon` 이상 아이콘 선 굵기 |
| `--icon-stroke-sm` | 1.6 | `--icon-sm` 이하 아이콘 선 굵기 |
| `--dot` | 6px | 상태 점, 시트 메뉴 현재 점 |
| `--dot-lg` | 9px | 경력 궤적 점 |
| `--halo` | 3px | 상태 점 후광 (`box-shadow: 0 0 0 var(--halo) var(--accent-soft)`) |
| `--halo-lg` | 4px | 궤적 현재 점 후광 |
| `--focus-w` | 2px | 포커스 링 두께, 탭 밑줄 두께 |
| `--focus-offset` | 2px | 포커스 링 간격 (안쪽 링은 `calc(-1 * var(--focus-offset))`) |
| `--underline-offset` | 3px | 링크 밑줄 간격 (`.mail` 포함) |

모든 컨트롤 높이는 WCAG 2.2 최소 터치 크기 24px을 넘는다.

**정리 이력: 시안 값 → 확정 값 (Spacing · Radius · Layout)**

| 대상 | 시안 값 | 확정 값 | 이유 |
|---|---|---|---|
| 행 안 `gap`·`margin` | 2px | `--sp-0` | 반복값 토큰화 |
| 아이콘-글자·태그 `gap` | 6px | `--sp-1h` | 반복값 토큰화 |
| 점 모서리 | `50%` | `--radius-pill` | 정사각형 점이라 결과 같음, 시트 점과 통일 |
| 탭 밑줄 모서리 | 2px | `--radius-bar` | 반복값 토큰화 |
| `.chip-lnk` 높이 | 30px | `--ctl-h` 32px | 컨트롤 높이 세 단계로 정리 |
| `.icon-btn` 크기 | 34px | `--ctl-h-lg` 36px | 〃 |
| `.chip-lnk` 아이콘 | 13px | `--icon-sm` 14px | 아이콘 크기 단계 정리 |
| `.mail` 밑줄 간격 | 4px | `--underline-offset` 3px | 링크 밑줄 통일 |
| 원장 연도 열 | `calc(var(--sp-8) + var(--sp-5))` | `--col-year-wide` 88px | 계산식 대신 이름으로 |

**구현 시 삭제**
- `.photo { width: 112px }`: ≥861px에서 `--sb-photo-w`, ≤860px에서 `--sb-photo-w-sm`이 덮어 무효.
- `case.html`의 `--sidebar` ≤1100px 280px: 그 뒤의 `:root { --sidebar: 340px }`에 덮여 무효. 케이스는 332-a2-case 기준(>1000px 340px, 861–1000px 280px)만 둔다.

`--s`(로고 배율), `--i`(순서 등장 순번), `--ink-w`·`--ink-x`(탭 밑줄 위치)는 요소별·JS가 넣는 값이라 토큰 파일에 두지 않는다. 한 줄 소개 최대 폭(30ch/24ch), 케이스 기록표 키 열(96px), Skills 키 열(180px), 개인 프로젝트 번호 열(40px), 케이스 본문 폭(60ch), 404 본문 폭(52ch)은 한 곳에서만 쓰여 컴포넌트 값으로 둔다.

**브레이크포인트** (CSS 변수로 미디어 쿼리를 못 쓰므로 표로만 고정. 구현 시 이 값만 사용)

| 이름 | 조건 | 바뀌는 것 |
|---|---|---|
| wide | `min-width: 1101px` | 기본 |
| narrow-desktop | `max-width: 1100px` | 홈 사이드바 280px, 본문 패딩 `--sp-6`, 궤적 2열 |
| tight-desktop | `max-width: 1000px` | 탭 간격 `--sp-6`→`--sp-4` (32→16px), 케이스 사이드바 340→280px (3.3.2) |
| mobile | `max-width: 860px` / `min-width: 861px` | 사이드바가 상단 프로필로, 모바일 바·메뉴 시트, `--header-h` 52px, Contact 1열 |
| small | `max-width: 560px` | 행이 1열로, 궤적 세로, 숫자 표 2열, 번호 열 `--col-idx-sm` |
| cv-screen | `max-width: 720px` | CV 화면 보기에서만 1열 (333-a) |

### Motion

331-c 토큰. 이 외의 시간·easing 값은 쓰지 않는다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--dur` | 180ms | hover 색, 밑줄, chev 회전, 버튼 테두리 (`ease`) |
| `--ease-out` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | 등장, 궤적 그리기, 탭 밑줄, 시트, 시트 backdrop |
| `--m-rise` | 8px | 섹션 등장 이동 거리 |
| `--m-rise-row` | 6px | 행 등장 이동 거리 |
| `--m-reveal` | 480ms | 섹션 fade/rise, 섹션당 1회 |
| `--m-row` | 420ms | 행 하나의 fade/rise |
| `--m-stagger` | 60ms | 행 사이 지연 |
| `--m-draw-seg` | 260ms | 경력 궤적 한 구간 그리기 |
| `--m-count` | 900ms | 숫자 4개 카운트업, 1회 |
| `--m-nav` | 260ms | 탭 밑줄 이동 |
| `--m-theme` | 320ms | 테마 크로스페이드 (View Transitions) |
| `--m-lang` | 240ms | 언어 전환 크로스페이드 (cross-document `@view-transition`) |
| `--m-sheet` | 300ms | 메뉴 시트 슬라이드 |

**순서와 계산**

| 항목 | 규칙 |
|---|---|
| 첫 행 지연 | `--m-reveal / 3` = 160ms 뒤 시작 |
| 행 지연 | `--m-reveal / 3 + --i × --m-stagger`, `--i`는 0~7 (8행째부터 7로 고정 → 최대 8단계) |
| 섹션 하나의 최대 길이 | 160 + 7×60 + 420 = 1000ms |
| 대상 행 | `.work > li`, `.lg > .lg-row`, `.pidx > li`, `.ledger > li`, `.drawers > details`, `.figs > .fig`, `.skills > div`, `.ct > *` |
| 등장 조건 | 처음 화면 아래에 있는 섹션만 `m-wait` (JS). 첫 화면과 JS 없는 페이지는 바로 완성 상태. 관찰 `rootMargin: 0px 0px -8% 0px` |
| 앵커 이동 | 탭·앵커로 들어온 섹션은 등장 효과를 건너뛴다 (decision-log 3.3 구현 시 처리) |
| 궤적 그리기 | 로드 시 1회, 구간 `i`마다 `i × --m-draw-seg` 지연, 점은 같은 시점에 `scale(0.4)→1`. ≤560px는 세로(`scaleY`) |
| 카운트업 | `--m-count` 동안 ease-out cubic (`1-(1-p)^3`, JS). 진행 중 숫자는 `aria-hidden`, 최종값을 읽게 함 |
| 테마·언어 전환 | 전환 중에는 개별 색 transition을 끈다(`m-notx`) |
| 인쇄 | 등장 상태를 강제로 완성 (`opacity: 1; transform: none`) |
| `prefers-reduced-motion: reduce` | 모든 transition·animation 끔, View Transitions 미사용, 카운트업 없이 최종값. `scroll-behavior: smooth`는 `no-preference`에서만 |

**정리 이력: 시안 값 → 확정 값 (Motion)** — 모션 값은 3.3.1 결정(331-c)이 우선한다. 332-a2는 메뉴 구성 결정이다.

| 대상 | 시안 값 | 확정 값 | 이유 |
|---|---|---|---|
| 탭 밑줄 | base: 탭별 `scaleX`, `--dur ease` / 332-a2: 미끄러지는 `.ink`, `--dur ease` | 미끄러지는 막대, `--m-nav` `--ease-out` | 331-c 채택 |
| 메뉴 시트 | base: `translateX(24px)` + fade, `--dur ease-out` | `translateX(100%)`, `--m-sheet` `--ease-out` | 331-c 채택 |
| 시트 backdrop | 키워드 `ease-out` | `--m-sheet` `--ease-out` | easing을 토큰 하나로 통일 |

시안 전용 `.m-replay` 버튼은 구현하지 않는다.

### Z-index

시안에서 쓰는 층은 상단 메뉴 하나뿐이다. 메뉴 시트는 `<dialog>`의 top layer라 z-index가 필요 없다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--z-header` | 10 | `.topbar` |
| `--z-skip` | 20 | 본문 바로가기 링크(포커스 시 상단 메뉴 위에 표시, 9장 접근성) |

`.m-replay`의 60은 시안 전용이라 제외.

### Print (CV)

333-a 전용 토큰. 화면 토큰과 섞지 않도록 `--cv-` 접두어.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--cv-paper-w` | 210mm | A4 폭 (화면 미리보기) |
| `--cv-margin` | 15mm 16mm 16mm | `@page` 여백 (`@page`에서 변수 미해석이라 같은 값을 직접 한 번 더 씀) |
| `--cv-pad` | 15mm 16mm | 화면 미리보기 종이 패딩 |
| `--cv-base` | 13px (인쇄 8.4pt) | 기준 글자 크기 |
| `--cv-fs-name` / `--cv-fs-title` / `--cv-fs-meta` / `--cv-fs-label` | 2.1em / 1.08em / 0.84em / 0.76em | 이름 / 직함 / 메타 / 섹션 라벨 |
| `--cv-lh` / `--cv-lh-ko` | 1.5 / 1.62 | 행간 영문 / 국문 |
| `--cv-gutter` | 24mm | 섹션 라벨 열 |
| `--cv-date` | 24mm | 행 안 기간 열 |
| `--cv-key` | 31mm | Skills 키 열 |
| `--cv-gap` | 5mm | 열 간격 |

쪽 하단 글자 7pt Geist Mono, 색 `#5f6a78`(= `--text-3` 라이트). 333-a 본문의 mm 단위 직접 값(2.6mm, 2.4mm 등)은 CV 컴포넌트 명세(10장)에서 다룬다.

### Naming rules

| 접두어 | 범주 | 예 |
|---|---|---|
| (없음) `--bg`, `--surface`, `--line*`, `--text*`, `--accent*`, `--chip`, `--focus`, `--scrim`, `--header-bg`, `--row-tint` | 색 (역할 이름, 색 이름 금지) | `--text-2` |
| `--font-` / `--fs-` / `--fw-` / `--lh-` / `--ls-` | 패밀리 / 크기 / 굵기 / 행간 / 자간 | `--fs-sm`, `--ls-title` |
| `-ko` 접미 | 국문 변형. 영문 토큰과 짝으로 둔다 | `--lh-body-ko` |
| `--sp-` | 간격 (숫자 단계, 사이 값은 `0`·`1h`) | `--sp-4`, `--sp-1h` |
| `--radius` | 모서리 (`-sm`, `-xs`, `-bar`, `-pill`) | `--radius-sm` |
| `--sb-`, `--sheet-`, `--row-`, `--col-`, `--logo-`, `--header-`, `--measure`, `--sidebar`, `--main` | 레이아웃 크기 (영역 이름) | `--col-idx` |
| `--ctl-`, `--icon`, `--dot`, `--halo`, `--focus-`, `--underline-` | 컨트롤·아이콘·장식 크기 | `--ctl-h` |
| `--dur`, `--ease-`, `--m-` | 모션 (기본 hover 시간 / easing / 모션 레이어) | `--m-stagger` |
| `--photo-`, `--logo-` (filter·op) | 이미지 처리 | `--logo-op-cur` |
| `--z-` | 쌓임 순서 | `--z-header` |
| `--cv-` | 인쇄 CV 전용 | `--cv-gutter` |

크기 단계는 `2xs < xs < sm < (기본) < md < lg < xl < 2xl` 순서를 따른다.

**새 토큰 추가 절차**
1. 같은 값이 컴포넌트 2곳 이상에 쓰이거나 테마·언어에 따라 바뀌면 토큰으로 만든다. 한 곳에만 쓰이는 값은 컴포넌트 명세에 둔다.
2. 이 장의 표에 이름·값(라이트/다크)·용도를 먼저 적고, 디자인 값 자체가 새로 생기면 시안을 제시해 선택받는다(규칙 1). 색이면 대비비를 다시 계산한다.
3. 그 뒤 `tokens.css`에 같은 이름·값으로 추가한다. 다크 값은 두 다크 블록에 모두 넣는다.

## 4. Layout & Breakpoints

출처: `g4/base.html`(홈 골격), `g4/332-a2.html`(상단 메뉴), `g4/332-a2-case.html`(케이스 스터디 골격, `case.html` 위에 얹은 변경), `g4/331-c.html`(등장 효과와 앵커), `g4/335-a.html`(404·푸터). 크기 값은 모두 3장 토큰 이름으로 적는다.

### 페이지 골격 (홈)

```html
<div class="shell">
  <aside class="sidebar">…</aside>          <!-- 왼쪽 열: 프로필 -->
  <div class="col">                          <!-- 오른쪽 열 -->
    <header class="topbar"><div class="bar">…</div></header>
    <main id="main">
      <section class="card" id="about">…</section> … <section class="card" id="contact">…</section>
      <footer class="foot-a">…</footer>
    </main>
  </div>
</div>
<dialog class="sheet">…</dialog>             <!-- 모바일 메뉴 시트, top layer -->
```

| 요소 | 규칙 |
|---|---|
| `.shell` | `display: grid; grid-template-columns: var(--sidebar) minmax(0, 1fr); min-height: 100vh; max-width: calc(var(--sidebar) + var(--main)); margin: 0 auto` |
| 중앙 정렬 | 넓은 화면에서 사이드바와 본문이 한 덩어리로 가운데 온다. 양옆 빈 곳은 `body`의 `--bg`. 최대 폭 = 320 + 960 = 1280px |
| `aside.sidebar` | `position: sticky; top: 0; height: 100vh; overflow-y: auto; border-right: 1px solid var(--line); padding: var(--sp-7) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-5)`. 바탕은 `--bg` (카드가 아님). 내부 → 5장 |
| `.col` | `min-width: 0` (긴 내용이 그리드 열을 넓히지 않게) |
| `.topbar` | 오른쪽 열(`.col`) 안에 있다. 사이드바 위로 걸치지 않는다. `position: sticky; top: 0; z-index: var(--z-header); background: var(--header-bg); backdrop-filter: var(--header-blur); border-bottom: 1px solid var(--line)` |
| `.topbar .bar` | `max-width: var(--main); height: var(--header-h); padding: 0 var(--sp-7)`. 좌우 패딩은 항상 `main`의 좌우 패딩과 같게 둔다(탭 왼쪽 끝 = 카드 왼쪽 끝). 탭·토글 내부 → 5장 |
| `main` | `max-width: var(--main); width: 100%; padding: var(--sp-6) var(--sp-7) var(--sp-8)` |
| 푸터 | `main` 안, 마지막 카드 다음. 별도 열·전폭 띠가 아니다 → 5장 |

### 세로 리듬

| 대상 | >1100px | ≤1100px | ≤860px |
|---|---|---|---|
| `main` 패딩 (상 / 좌우 / 하) | `--sp-6` / `--sp-7` / `--sp-8` | `--sp-6` / `--sp-6` / `--sp-6` | `--sp-4` / `--sp-4` / `--sp-7` |
| `.topbar .bar` 좌우 패딩 | `--sp-7` | `--sp-6` | `--sp-4` |
| 카드 안쪽 패딩 (`.card`) | `--sp-6` | `--sp-6` | `--sp-5` (상하) / `--sp-4` (좌우) |
| 카드 사이 (`.card` `margin-bottom`) | `--sp-5` | `--sp-5` | `--sp-4` |
| 섹션 머리 아래 (`.sec-head` `margin-bottom`) | `--sp-5` | `--sp-5` | `--sp-5` |
| 카드 안 큰 블록 사이 (궤적·Skills·원장 등 `margin-top`) | `--sp-6` | `--sp-6` | `--sp-6` |
| 마지막 카드 → 푸터 | 카드 `margin-bottom` + 푸터 `margin-top: var(--sp-6)` | 같음 | 같음 |
| 사이드바 블록 사이 (`gap`) | `--sp-5` | `--sp-5` | 모바일 프로필 → 아래 표 |

- 리듬은 "카드 사이 < 카드 안쪽 패딩 < 본문 좌우 여백" 순서를 지킨다(24 < 32 < 48, 모바일 16 = 16 < 20).
- ≤1100px에서 `main` 하단이 `--sp-8`→`--sp-6`으로 줄어드는 것은 시안 그대로다(`main { padding: var(--sp-6) }`가 세 방향을 모두 덮음). 의도인지 확인 필요(아래 "확인할 점").

### 카드형 섹션 컨테이너

| 규칙 | 값 |
|---|---|
| 마크업 | 홈 섹션 하나 = `<section class="card" id="…" aria-labelledby="h-…">` 하나. 첫 자식은 `.sec-head`(h2 + 선택 meta) → 5장 |
| 겉모양 | `background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius)`. 그림자 없음 |
| 패딩·간격 | 위 "세로 리듬" 표 |
| 앵커 | `scroll-margin-top: calc(var(--header-h) + var(--sp-5))` (아래 "앵커 스크롤") |
| 중첩 | 카드 안에 카드를 두지 않는다. 카드 안 구분은 헤어라인(`--line`, 강한 구분은 `--line-strong`)과 행 패딩으로만 한다 |
| 폭 | 카드는 `main` 폭을 꽉 채운다. 읽기 폭 제한은 카드가 아니라 안쪽 문단에 `--measure`/`--measure-sm`으로 건다 |
| 등장 효과 대상 | `main > section.card` (331-c, 3장 Motion) |

### 앵커 스크롤 오프셋

| 대상 | 값 | 출처 |
|---|---|---|
| `.card` (홈 섹션) | `scroll-margin-top: calc(var(--header-h) + var(--sp-5))` | base |
| `.dr` (IP 서랍, 개별 앵커) | 같은 값 | base |
| `.d-sec` (케이스 스터디 문서 절) | 같은 값 | 332-a2-case (case.html의 `var(--sp-5)`를 덮음. 케이스에도 상단 메뉴가 생겼기 때문) |
| `html` | `scroll-behavior: smooth`는 `prefers-reduced-motion: no-preference`에서만 | base |

- 오프셋은 `--header-h`를 따라 자동으로 바뀐다: 데스크톱 56 + 24 = 80px, ≤860px 52 + 24 = 76px. 상단 메뉴가 모바일에서도 sticky이므로 같은 식을 쓴다.
- 시안은 `html { scroll-padding-top }`을 쓰지 않고 요소별 `scroll-margin-top`을 쓴다. 구현도 요소별로 둔다. 새로 앵커가 되는 요소(`id`로 링크되는 것)는 같은 값을 반드시 붙인다.
  - 구현: 요소별 scroll-margin 대신 `html { scroll-padding-top: calc(var(--header-h) + var(--sp-5)) }` 하나로 둔다. 결과 위치는 시안과 같고 앵커 누락을 막는다.
- 앵커·탭으로 들어온 섹션은 등장 효과(`m-wait`)를 건너뛴다 (decision-log 3.3 "구현 시 처리할 것"). 이동 직후 카드가 비어 보이지 않게 하기 위함 → 3장 Motion.

### 브레이크포인트

미디어 쿼리 값은 이 표의 값만 쓴다(3장 "브레이크포인트"와 같은 이름). 수집 범위: base, case, 332-a2, 332-a2-case, 331-c, 335-a의 모든 `@media`.

| 폭 | 범위 | 바뀌는 것 | 파일 |
|---|---|---|---|
| `min-width: 1101px` (wide) | 기본 | 기본 골격. `--sidebar` 320px (케이스 340px) | — |
| `max-width: 1100px` (narrow-desktop) | 861–1100 | 홈 `--sidebar` 280px · `main` 패딩 `--sp-6` 사방 · `.bar` 좌우 `--sp-6` · 궤적 4열→2열(→5장) · 케이스 `.doc` 패딩 `--sp-7`→`--sp-6` | base, case |
| `max-width: 1000px` (tight-desktop) | 861–1000 | 탭 간격 `--sp-6`→`--sp-4` · 케이스 `--sidebar` 340→280px (탭 6개 + 토글이 들어가게) | 332-a2, 332-a2-case |
| `min-width: 861px` | 데스크톱 전체 | 사이드바 기록표형(사진 `--sb-photo-w`, 키-값 행, CV 자리) → 5장 · 케이스: 메뉴 시트 숨김, 사이드바 `top: 0` | base, case, 332-a2-case |
| `max-width: 860px` (mobile) | ≤860 | 2열 그리드 해제(아래 "모바일 골격") · `--header-h` 52px · 탭·토글 숨김, 이름 + 메뉴·언어 버튼 · 메뉴 시트 사용 · 카드 패딩·간격 축소 · 한 줄 소개 `--fs-xl` · Contact 2단→1열 · 케이스: 기록표 축약, 문서 끝 이전·다음 표시 | base, case, 332-a2-case |
| `max-width: 720px` (cv-screen) | ≤720 | CV 화면 보기만 1열 → 10장 | 333-a |
| `max-width: 560px` (small) | ≤560 | 행 그리드가 1열로(경력·강의·수상 기간 열, 특허·출판 연도 열, 원장, Skills, 서랍) · 대표작·개인 프로젝트 번호 열 `--col-idx-sm`, 화살표 숨김 · 궤적 세로 · 숫자 표 2열 · 로고 ×0.85 · 필터·선택 상자 전폭 · 케이스: `.d-sec` 번호 열 해제, 표가 쌓인 기록으로 · 404 바로가기 열 140→56px · 푸터 세로 쌓기 | base, case, 331-c, 335-a |

**기능 쿼리 (폭과 무관, 다른 장 담당)**

| 쿼리 | 용도 | 참조 |
|---|---|---|
| `prefers-color-scheme: dark` | 다크 토큰 | 3장 Color |
| `prefers-reduced-motion: reduce` / `no-preference` | 모션 끔 / smooth 스크롤·등장 효과 | 3장 Motion |
| `hover: hover` | 대표작 행 `--row-tint` hover (331-c) | 5장 |
| `print` | 등장 상태 강제 완성, CV | 10장 |

**구현 시 삭제**: base·332-a2의 `≤860px` `.tabs { overflow-x; mask-image; padding-right }` 규칙. 같은 구간에서 `.topbar nav`가 `display: none`이라 적용될 곳이 없다.

### 모바일 골격 (≤860px)

| 요소 | 규칙 |
|---|---|
| `.shell` | `display: flex; flex-direction: column` (그리드 해제, 중앙 정렬 폭 제한은 의미 없어짐) |
| `.col` | `display: contents` → 상단 메뉴·`main`이 `.shell`의 직접 자식처럼 배치 |
| `.topbar` | `order: -1`로 사이드바 **위**로 올라간다. sticky 유지. 내용: `.bar-id`(이름 / 현재 섹션) + 언어 버튼 + 메뉴 버튼 → 5장 |
| `aside.sidebar` | `position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--line); padding: var(--sp-4) var(--sp-4) var(--sp-4)`. `display: grid; grid-template-columns: var(--sb-photo-w-sm) minmax(0, 1fr); gap: var(--sp-2) var(--sp-4)`. 연락처는 `grid-column: 1 / -1`로 아래 한 줄 → 5장 |
| `main` | 위 "세로 리듬" 표 |
| 메뉴 시트 | `<dialog>` 오른쪽에서 열림, 폭 `min(var(--sheet-w), 88vw)`, 높이 `100dvh` → 5장 |

### 와이어프레임

데스크톱 (≥1101px, 홈)

```
        |<------------------ max 1280 (sidebar 320 + main 960), 가운데 ------------------>|
        +---------------------+-----------------------------------------------------------+
        | aside.sidebar       | .topbar  sticky, h 56  [About Work Exp Personal Pub Cont] [EN|KO][◐]
        | sticky, 100vh       +-----------------------------------------------------------+
        | pad 48 / 32         |  main  pad 32 / 48 / 64                                   |
        |                     |  +-----------------------------------------------------+  |
        | [photo 132]         |  | .card #about        pad 32                           |  |
        | Name                |  |  SEC-HEAD                                            |  |
        | AI Engineer         |  |  …                                                   |  |
        | ─────────────────── |  +-----------------------------------------------------+  |
        | KEY  value          |            ↕ 24                                          |
        | KEY  value          |  +-----------------------------------------------------+  |
        | KEY  value          |  | .card #work                                          |  |
        | [CV]                |  +-----------------------------------------------------+  |
        |                     |   …                                                       |
        |                     |  ─────────────────────────────────────── (↕ 24 + 32)     |
        |                     |  footer.foot-a  © · updated · source        top ↑         |
        +---------------------+-----------------------------------------------------------+
```

모바일 (≤860px, 360px 기준)

```
+------------------------------------+
| .topbar sticky, h 52               |
| Name / Work            [KO] [≡]    |
+------------------------------------+
| aside.sidebar (static) pad 16      |
| [64] Name                          |
|      AI Engineer                   |
| ✉ mail   GitHub   LinkedIn        |
+------------------------------------+
| main pad 16 / 16 / 48              |
| +--------------------------------+ |
| | .card  pad 20 / 16             | |
| | SEC-HEAD                       | |
| | …                              | |
| +--------------------------------+ |
|            ↕ 16                    |
| +--------------------------------+ |
| | .card                          | |
| +--------------------------------+ |
| ────────────────────────────────── |
| footer (≤560px 세로 쌓기)          |
+------------------------------------+
```

### 360px 가로 스크롤 방지

| 규칙 | 적용 |
|---|---|
| 그리드 가변 열은 항상 `minmax(0, 1fr)` | `.shell`, 모든 행 그리드. `1fr` 단독 금지 |
| 그리드·플렉스 자식 중 글이 긴 것은 `min-width: 0` | `.col`, `.body`, `.bar-id`, `.topbar nav`, `.proj-meta .org`, `.fig`, `.pidx .acts` |
| 고정 폭 열은 ≤560px에서 해제하거나 줄인다 | `--row-when`, `--col-year`, `--col-year-wide`, Skills 180px → 1열 / `--col-idx` → `--col-idx-sm` / 404 바로가기 140 → 56px |
| 한 줄로 두는 긴 글은 말줄임 | `.contact .lbl`, `.bar-cur`, `.pn-t`, 사이드바 `.h`: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| 국문 줄바꿈 | `html:lang(ko) body { word-break: keep-all; overflow-wrap: anywhere }` (keep-all이 긴 어절로 넘치지 않게 anywhere를 같이 둔다) |
| 가로 스크롤을 허용하는 곳은 요소 안에서만 | 탭 목록(`.tabs`)은 자기 안에서만 넘칠 수 있다(데스크톱 `overflow: visible`은 861–1000px 간격 축소로 보장). 페이지 전체에 넘치면 안 된다 |
| 뷰포트 폭 단위 | `100vw` 쓰지 않는다(스크롤바 폭만큼 넘침). 시트만 `88vw`를 `min()` 안에서 쓴다 |
| 절대 배치 숨김 요소 | `.sr-only`가 위치 기준 없이 절대 배치되어 넘칠 수 있음 → 5.1 전역 스타일에서 해결 (decision-log 3.2 이후로 넘긴 것) |
| 검사 | 구현 후 360px에서 `document.documentElement.scrollWidth <= innerWidth`를 홈·케이스·404, 영문·국문, 메뉴 시트 열림/닫힘으로 확인 |

시안에서 확인이 필요한 곳: 케이스 아키텍처 표의 `.flow`(`white-space: nowrap`)는 ≤560px에서 표가 쌓인 기록으로 바뀐 뒤에도 nowrap이 남는다. 흐름 문구가 길면 360px에서 넘칠 수 있으므로 구현 시 실제 콘텐츠로 확인한다.

### 케이스 스터디 페이지 골격

골격(`.shell` 그리드, 중앙 정렬, sticky 사이드바, 오른쪽 열 안 상단 메뉴)은 홈과 같다. 다른 점만 적는다.

| 항목 | 홈 | 케이스 스터디 (332-a2-case) |
|---|---|---|
| `--sidebar` | 320 / ≤1100: 280 | 340 / ≤1000: 280 (861–1000에서 탭 6개 + 토글이 들어가게) |
| 사이드바 내용 | 프로필 기록 | 프로젝트 기록표: `.who`(작은 사진 + 이름) → 경로(`← Work` + `01 / 07`) + 제목 h1 → `.rec`(키-값) → `.toc`(번호 목차) → `.side-foot`(이전·다음, `margin-top: auto`로 바닥에 붙음). 내부 → 5장 |
| 사이드바 패딩 | `--sp-7` `--sp-6` | `--sp-6` `--sp-6` `--sp-5` |
| 상단 메뉴 | 홈 섹션 탭 | 같은 탭 6개, Work 표시, 링크는 홈 섹션으로. 언어·테마 토글은 상단 메뉴에만 (사이드바에 없음) |
| `main` 내용 | 섹션별 카드 여러 개 | `article.card.doc` **하나**. 안에 요약(`.lede`) + 번호 붙은 절(`.d-sec`)들 |
| 카드 패딩 | `--sp-6` | `.doc` `--sp-7` / ≤1100: `--sp-6` / ≤860: `--sp-5` `--sp-4` |
| 절 구분 | 카드 사이 간격 | `.d-sec`: `padding: var(--sp-6) 0; border-top: 1px solid var(--line)`, `grid-template-columns: var(--col-idx) minmax(0, 1fr)` (≤560 1열) |
| 앵커 | `.card` | `.d-sec` (값은 같음) |
| ≥861px 메뉴 시트 | 숨김(메뉴 버튼 없음) | `display: none` 명시 |

**케이스 모바일 (≤860px)**: 사이드바가 `display: block`이 되고 `.who`·`.toc`·`.side-foot`을 숨긴다. 경로·제목·기록표만 남고 자식 사이 `margin-top: var(--sp-4)`. 목차는 메뉴 시트로(맨 위 `← Work` + 절 목록), 이전·다음은 문서 끝 `.pn-end`로 옮긴다.

### 404 골격 (335-a)

| 항목 | 규칙 |
|---|---|
| 골격 | 홈과 같은 `.shell`. 사이드바 유지 |
| 상단 메뉴 | 탭(`nav`) 숨김, 토글만 오른쪽(`margin-left: auto`). 모바일은 홈과 같은 바 |
| `main` | 카드 하나(`article.card.nf`) + 푸터. 다른 섹션 없음 |
| 카드 내용 | 코드 · 제목 · 설명(`max-width: 52ch`) · 버튼 · 섹션 바로가기 목록 → 5장 |
| 언어 | 경로(`/ko/`)로 판별 (decision-log 3.3) |
| 제목 단계 | 사이드바 이름이 h1, 404 제목이 h2인 시안 구조를 정리해야 한다 (decision-log 3.3). 어느 쪽을 h1로 할지 미정 → 9장 |

시안의 `html[data-view="404"]`로 섹션을 숨기는 방식은 시안 전용이다. 구현은 404 페이지가 처음부터 카드 하나만 렌더한다.

### 확인할 점

- ≤1100px에서 `main` 하단 패딩이 `--sp-8`(64) → `--sp-6`(32)으로 줄어드는 것이 의도인지. 시안의 `main { padding: var(--sp-6) }` 한 줄이 하단까지 덮은 결과로 보인다.
- 마지막 카드 → 푸터 간격이 카드 `margin-bottom`(24) + 푸터 `margin-top`(32) = 56px로 겹쳐 더해진다. 시안 그대로 둘지.
- `aside.sidebar`·`.shell`은 `100vh`, 메뉴 시트는 `100dvh`. 모바일에서는 사이드바가 static이라 문제없지만 단위를 맞출지 구현 시 결정.

## 5. Components

컴포넌트마다 **구조**(HTML 골격) / **토큰** / **상태** / **반응형** / **접근성** / **모션** / **콘텐츠 출처** 순서로 적는다. 값은 3장 토큰 이름으로만 쓰고, 토큰이 없는 값은 "컴포넌트 값"으로 표시한다. 출처 시안: 홈 `g4/base.html` + 3차 확정안(`331-c`, `332-a2`, `332-a2-case`, `335-a`). 클래스 이름은 시안 그대로이며 구현에서 바꿔도 된다(역할 대응만 유지).
5.1~5.12는 틀·내비게이션·기본 요소, 이후 번호는 콘텐츠 컴포넌트다.

공통 규칙

| 항목 | 규칙 |
|---|---|
| 포커스 | 전역 `:focus-visible { outline: var(--focus-w) solid var(--focus); outline-offset: var(--focus-offset); border-radius: var(--radius-xs) }`. 예외는 각 컴포넌트에 적는다 |
| hover 전환 | 색·테두리·밑줄은 `var(--dur) ease`. 다른 시간·easing 금지 |
| 테마·언어 전환 중 | 루트에 `m-notx`를 붙여 개별 transition을 끈다 (3장 Motion) |
| `prefers-reduced-motion: reduce` | 모든 transition·animation 끔. 아래 "모션" 줄은 `no-preference`일 때만 |
| 아이콘 | 모두 `aria-hidden="true"`. 의미는 옆 글자나 `aria-label`이 전달 (5.12) |
| UI 문구 | `src/i18n/`(메뉴·버튼·aria-label). 이력 내용은 `src/content/` |

### 5.1 Sidebar (프로필 기록표, 3.1.3 C)

**구조**

```html
<aside class="sidebar" aria-label="Profile">
  <img class="photo" src="/images/profile.jpg" alt="" width="132" height="165">
  <div>
    <h1 class="name">Kwang Myung Yu</h1>
    <p class="headline">AI Engineer</p>
    <p class="role">Director, R&D Group, GenON</p>        <!-- ≤860에서만 보임 -->
  </div>
  <ul class="contact" id="side-contact">                    <!-- id: Contact 섹션(#contact)과 충돌 방지 -->
    <li class="now"><span class="k">Now</span><span class="v">Director, R&D Group, GenON</span></li>
    <li class="em"><span class="k" aria-hidden="true">Email</span><a class="v" href="mailto:…">{icon mail}<span class="lbl">sguys99@naver.com</span></a></li>
    <li><span class="k" aria-hidden="true">GitHub</span><a class="v" href="…">{icon gh}<span class="lbl">GitHub</span><span class="h">github.com/sguys99</span></a></li>
    <li><span class="k" aria-hidden="true">LinkedIn</span><a class="v" href="…">{icon in}<span class="lbl">LinkedIn</span><span class="h">in/kmyu99</span></a></li>
  </ul>
  <a class="cv" aria-disabled="true" role="link">Download CV <span class="badge">Placeholder</span></a>
</aside>
```

**토큰 (≥861px)**

| 요소 | 속성 → 토큰 |
|---|---|
| `aside.sidebar` | `position: sticky; top: 0; height: 100vh; overflow-y: auto`, 폭 `--sidebar`, 패딩 `--sp-7` `--sp-6`, 세로 간격 `--sp-5`, 오른쪽 선 1px `--line`, 바탕 `--bg` |
| `.photo` | 폭 `--sb-photo-w`, `aspect-ratio: 4/5; object-fit: cover`, 모서리 `--radius-sm`, 테두리 1px `--photo-ring`, 바탕 `--chip`, `filter: var(--photo-filter)` |
| `.name` | `--font-display`, `--fs-xl`, `--fw-name`, `--ls-name`, 행간 1.25(컴포넌트 값) |
| `.headline` | `--accent`, `--fw-medium`, `--fs-md`, 위 여백 `--sp-1` |
| `.role` | 숨김 (기록표의 Now 행이 대신함) |
| 기록표 `ul` | 위 선 1px `--line-strong`, 행 `grid: var(--sb-key) 1fr`, 열 간격 `--sp-3`, 행 패딩 `--sp-3` 0, 행 아래 선 1px `--line`, `align-items: baseline` |
| `.k` | `--fs-2xs`, `--fw-strong`, `--ls-label`, 대문자, `--text-3`. 국문 `--fs-xs` + `--ls-label-ko` |
| `.v` | `--fs-sm`, `--text`, `--lh-row`. GitHub·LinkedIn은 `.h`(주소 축약)만 보이고 넘치면 말줄임 |
| 기록표 링크 | 밑줄 `--line-strong`, `text-underline-offset: var(--underline-offset)` |
| `.cv` 자리 | 1px **dashed** `--line-strong`, 모서리 `--radius-sm`, 패딩 `--sp-2` `--sp-3`, `--fs-sm` `--fw-medium` `--text-2`, 배지 `--text-3` |

**상태**

| 상태 | 처리 |
|---|---|
| 링크 hover | 글자·밑줄 `--accent` |
| focus-visible | 전역 링 |
| CV disabled | 6.12(PDF 생성) 전까지 `aria-disabled="true"`, `cursor: not-allowed`, "Placeholder / 자리 표시" 배지. 활성 상태의 모양은 **미정(구현 시 시안 제시)**: 시안에 활성 CV 버튼이 없음 |

**반응형**

| 폭 | 동작 |
|---|---|
| ≤1100 | `--sidebar` 280px |
| ≤860 | 고정 해제(`position: static; height: auto`), 상단 프로필로 전환: 모바일 바(5.3) 아래, 아래 선 1px `--line`, 패딩 `--sp-4`, `grid: var(--sb-photo-w-sm) 1fr`, 간격 `--sp-2` `--sp-4`. 사진 `--sb-photo-w-sm`·모서리 `--radius`. 이름 `--fs-lg`, 직함 `--fs-sm`, `.role` 보임(`--fs-xs` `--text-2`). 기록표 대신 아이콘 + 글자 한 줄(`flex-wrap`, 간격 `--sp-2` `--sp-4`, 위 선 `--line`, 패딩 위 `--sp-3`), 글자 `--fs-sm` `--text-2`, hover `--accent`. Now 행·키·CV 자리 숨김 |
| ≤560 | 이메일 라벨 `max-width: 100%` (긴 주소 줄바꿈 대비) |

**접근성**
- 이름 `h1`은 홈의 유일한 h1. 사이드바는 `aside` + `aria-label`(국문 "프로필").
- **시안 버그**: ≥861에서 GitHub·LinkedIn 링크의 이름이 사라진다(`.lbl`은 `display: none`, `.h`·`.k`는 `aria-hidden`). 구현 시 `.h`의 `aria-hidden`을 빼거나 링크에 `aria-label="GitHub: github.com/sguys99"`를 준다.
- 사진은 바로 옆에 이름 h1이 있어 시안대로 `alt=""`(장식)로 둔다. [제안] 사진이 단독으로 쓰이는 곳(OG 등)은 해당 없음.
- 외부 링크는 시안대로 같은 탭에서 열고 `rel="noopener"`.

**모션**: hover 색만 (`--dur`). 등장 효과 없음 (첫 화면).
**콘텐츠 출처**: 이름·직함·현재 소속·연락처 = `src/content/profile`. 키 라벨(Now/Email)·CV 문구 = `src/i18n`. GitHub·LinkedIn 축약 주소는 URL에서 계산.

### 5.2 Top navigation (332-a2, 케이스 변형 332-a2-case)

**구조 (홈)**

```html
<header class="topbar">
  <div class="bar">
    <a class="bar-id" href="#about">…</a>                    <!-- 5.3, ≤860에서만 -->
    <nav aria-label="Sections">
      <ul class="tabs" data-nav>
        <li><a href="#about" data-for="about">About</a></li>
        <li><a href="#work" data-for="work">Work</a></li>
        <li><a href="#experience" data-for="experience teaching awards">Experience</a></li>
        <li><a href="#personal" data-for="personal">Personal</a></li>
        <li><a href="#ip" data-for="ip">Publications</a></li>
        <li><a href="#contact" data-for="contact">Contact</a></li>
      </ul>
      <span class="ink" aria-hidden="true"></span>
    </nav>
    <div class="controls">{5.4 언어 전환}{5.4 테마 전환}</div>
    {5.3 lang-btn, menu-btn}                                    <!-- ≤860에서만 -->
  </div>
</header>
```

**탭 문구**

| 탭 | 영문 | 국문 | 앵커 | 현재 표시되는 섹션(`data-for`) |
|---|---|---|---|---|
| 1 | About | 소개 | `#about` | about |
| 2 | Work | 대표 프로젝트 | `#work` | work (전체 프로젝트 원장 포함) |
| 3 | Experience | 경력 | `#experience` | experience, teaching, awards |
| 4 | Personal | 개인 프로젝트 | `#personal` | personal |
| 5 | Publications | 지식재산 · 출판물 | `#ip` | ip |
| 6 | Contact | 연락처 | `#contact` | contact |

**토큰**

| 요소 | 속성 → 토큰 |
|---|---|
| `.topbar` | `position: sticky; top: 0; z-index: var(--z-header)`, 바탕 `--header-bg`, `backdrop-filter: var(--header-blur)`, 아래 선 1px `--line` |
| `.bar` | 높이 `--header-h`, 최대 폭 `--main`, 좌우 패딩 `--sp-7`, 간격 `--sp-4`, `align-items: center` |
| `nav` | `flex: 1; min-width: 0; align-self: stretch; position: relative` |
| `.tabs` | 간격 `--sp-6`, `overflow: visible` |
| `.tabs a` | `--fs-sm`, `--fw-medium`, `--text-3`, 밑줄 없음, 높이는 바 전체(`align-self: stretch`) |
| `.ink` (현재 막대) | 하나뿐인 막대. `position: absolute; bottom: -1px`(바 아래 선 위에 겹침), 높이 `--focus-w`, 색 `--accent`, 모서리 `var(--radius-bar) var(--radius-bar) 0 0`, 위치·폭은 JS가 `--ink-x`·`--ink-w`로 넣음 |
| hover 선 (`a::before`) | 탭 아래 1px `--line-strong`, `opacity` 0→1 |

**상태**

| 상태 | 처리 |
|---|---|
| 기본 | `--text-3` |
| hover | 글자 `--text`, 아래 1px `--line-strong` 선 (현재 탭에는 안 그림) |
| current | `aria-current="true"`, 글자 `--text`, `.ink`가 그 탭 아래로 이동. 아닌 탭은 속성을 지운다 |
| focus-visible | 링을 안쪽으로: `outline-offset: -6px`(컴포넌트 값, 바 높이 안에 링이 들어가게) |

**현재 섹션 판정 (scroll-spy, 332-a2)**

| 규칙 | 값 |
|---|---|
| 판정선 | 상단 메뉴 아래 + 화면 높이 25%. 위쪽 끝이 판정선을 지난 마지막 섹션이 현재 |
| 페이지 끝 | 끝까지 스크롤하면 마지막 섹션(Contact) |
| 탭 클릭 후 | 클릭한 섹션을 고정(hold). `wheel`·`touchstart`·`keydown`이 오면 해제 (짧은 Awards가 덮어쓰이지 않게) |
| 갱신 | `scroll`(rAF로 묶음), `resize`, `load` |
| 막대 재측정 | `ResizeObserver`(탭 목록), 글꼴 로드 후, 언어별 문구 길이 차이 |
| 앵커 이동 | `scroll-margin-top: calc(var(--header-h) + var(--sp-5))` (카드). 앵커로 들어온 섹션은 등장 효과를 건너뜀 (3장 Motion) |

**반응형**

| 폭 | 동작 |
|---|---|
| ≤1100 | 바 좌우 패딩 `--sp-6` |
| ≤1000 (861~1000) | 탭 간격 `--sp-6` → `--sp-4` (6탭 + 전환 버튼이 한 줄에 들어가게, 3.3.2) |
| ≤860 | `nav`·`.controls` 숨김 → 5.3 모바일 바. `--header-h` 52px, 바 패딩 `--sp-4`, 간격 `--sp-3`, 상단 메뉴가 사이드바 위로(`order: -1`) |

- 구현 시 삭제: base의 ≤860 `.tabs` 가로 스크롤·`mask-image`(그 폭에서 `nav`가 숨겨져 무효)와 탭별 `::after scaleX` 밑줄(`.ink`로 대체).

**접근성**
- `nav`에 `aria-label`("Sections" / "섹션"). 케이스 시안은 JS로 넣지만(`data-ui-label`) 구현은 빌드 시 정적으로 넣는다.
- JS 없음: 탭은 앵커로 동작하고 `.ink`는 폭 0(현재 표시 없음). 허용.
- 본문 바로가기 링크: 시안에 없음. 9장 접근성 규칙에 따라 `<body>` 첫 요소로 두고 포커스 시 `z-index: var(--z-skip)`로 상단 메뉴 위에 보인다. 모양은 **미정(구현 시 시안 제시)**.
- "상단 메뉴 위쪽의 정체 모를 흔적"(decision-log 3.3): `332-a2-desktop-light-en.png` 상단 About~Experience 위에 흐린 사각형이 보인다. 반투명 바(`--header-bg` 90%) 뒤로 비친 본문으로 추정. 구현 후 브라우저에서 확인.

**모션 (331-c)**: `.ink` 이동 `transform`·`width` `var(--m-nav) var(--ease-out)`. 첫 배치는 transition 없이(`ready` 클래스를 2프레임 뒤에 붙임). hover 선·글자색 `--dur`. 모션 줄이기: 막대가 즉시 이동.

**케이스 스터디 변형 (332-a2-case)**

| 항목 | 홈과 다른 점 |
|---|---|
| 표시 | 데스크톱에도 상단 메뉴를 보인다 (3.2.3 C에서는 숨김이었음) |
| 탭 링크 | 홈 섹션으로 이동: 영문 `/#about`…, 국문 `/ko/#about`… |
| current | 항상 Work에 `aria-current="true"` 고정, `.ink`는 Work 아래 정지 (scroll-spy 없음, 재측정만) |
| 전환 버튼 | 언어·테마를 상단 메뉴 `.controls`로 (기록표 하단 `.side-foot`에서 뺌) |
| 사이드바 | 케이스 기록표 `--sidebar` 340px, ≤1000에서 280px (3장 Layout) |
| 모바일 바 | `.bar-id`는 홈 `#work`로, `.bar-cur`는 현재 케이스 섹션 이름 |
| 메뉴 시트 | 그룹 없음. 첫 행 "← Work / ← 대표 프로젝트"(홈 `#work`) + 케이스 섹션 목록 |

### 5.3 Mobile bar + menu sheet (3.1.6 C + 332-a2, ≤860)

**구조**

```html
<!-- .topbar .bar 안 (5.2와 같은 header) -->
<a class="bar-id" href="#about"><span class="bar-name">Kwang Myung Yu</span><span class="bar-cur">Experience</span></a>
<a class="icon-btn lang-btn" href="/ko/" lang="ko" hreflang="ko" aria-label="한국어로 보기">KO</a>
<button class="icon-btn menu-btn" aria-haspopup="dialog" aria-expanded="false" aria-controls="sheet" aria-label="Open menu">{icon menu}</button>

<dialog class="sheet" id="sheet" aria-labelledby="sheet-title">
  <div class="sheet-in">
    <div class="sheet-head"><h2 id="sheet-title">Menu</h2><button class="icon-btn" aria-label="Close menu">{icon close}</button></div>
    <nav aria-label="Sections"><ul class="sheet-nav grouped" data-nav>
      <li><a href="#about" data-for="about">About</a></li> …
      <li><a href="#experience" data-for="experience teaching awards">Experience</a>
        <ul class="sheet-sub"><li><a href="#experience">Experience</a></li><li><a href="#teaching">Teaching · Books · Advisory</a></li><li><a href="#awards">Awards & Education</a></li></ul></li>
      …
    </ul></nav>
    <ul class="contact">{mail, GitHub, LinkedIn: 아이콘 + 글자}</ul>
    <div class="sheet-prefs">
      <div><span class="sheet-label">Language</span>{5.4 언어 전환}</div>
      <div><span class="sheet-label">Theme</span>{5.4 테마 전환}</div>
    </div>
  </div>
</dialog>
```

**토큰**

| 요소 | 속성 → 토큰 |
|---|---|
| `.bar-id` | `flex: 1; min-width: 0; white-space: nowrap`, 간격 `--sp-2`, 밑줄 없음 |
| `.bar-name` | `--fs-md`, `--fw-strong`, 자간 -0.01em(컴포넌트 값) |
| `.bar-cur` | `--fs-sm`, `--text-3`, 말줄임. 앞에 `/` 구분자(`--line-strong`, 오른쪽 `--sp-2`) |
| `.lang-btn` | `.icon-btn`(5.6)에 폭 auto, 좌우 패딩 `--sp-3`, `--font-meta` `--fs-xs` `--fw-medium` `--ls-label-ko` |
| `.sheet` | 오른쪽 붙임(`margin-left: auto`), 폭 `min(var(--sheet-w), 88vw)`, 높이 `100dvh`, 바탕 `--surface`, 왼쪽 선 1px `--line`, `::backdrop` `--scrim` |
| `.sheet-in` | 세로 flex, 간격 `--sp-6`, 패딩 `--sp-3` `--sp-5` `--sp-6` |
| `.sheet-head` | 높이 `--header-h`, 양 끝 정렬 |
| `.sheet-head h2`, `.sheet-label` | `--fs-xs`, `--fw-strong`, `--ls-label`, 대문자, `--text-3`. 국문 `--fs-sm` + `--ls-label-ko` |
| `.sheet-nav` | 위 선 1px `--line`, 그룹 행마다 아래 선 1px `--line` |
| 그룹 행 `> li > a` | `--fs-lg`, `--fw-medium`, `--text-2`, 패딩 `--sp-3` 0, 오른쪽 끝에 현재 점 `--dot` |
| `.sheet-sub` | 왼쪽 선 1px `--line`, 패딩 0 0 `--sp-3` `--sp-4`, 위 여백 `calc(-1 * var(--sp-2))` |
| 하위 행 `a` | `--fs-sm`, `--fw-regular`, 자간 0, `--text-3`, 패딩 `--sp-1` 0 |
| `.contact` (시트) | 아이콘 + 글자, 세로 간격 `--sp-3` |
| `.sheet-prefs` | `margin-top: auto`(바닥 고정), 위 선 1px `--line`, 패딩 위 `--sp-4`, 행 간격 `--sp-3`, 행은 라벨 ↔ 컨트롤 양 끝 정렬 |

- 3장 Typography 표의 "`--fs-xl` 메뉴 시트 항목"은 base의 평면 목록 값이다. 확정안 332-a2는 그룹 목록이라 그룹 행 `--fs-lg`, 하위 행 `--fs-sm`을 쓴다.

**상태**

| 대상 | 상태 | 처리 |
|---|---|---|
| 그룹 행 | current | `aria-current="true"`, 글자 `--text`, 오른쪽 점 `--accent` (`--radius-pill`) |
| 그룹 행 (하위 있음) | current | 글자만 `--text`, 점은 하위 행이 대신하므로 투명 |
| 하위 행 | current | 글자 `--accent` |
| `.bar-cur` | — | 현재 섹션 이름(탭 이름이 아니라 섹션 이름: "Teaching · Books · Advisory" 등) |
| `menu-btn` | open | `aria-expanded="true"`, 닫히면 `false` (`close` 이벤트) |
| 시트 행 | hover / focus-visible | hover 색 규칙 없음(시안). 포커스는 전역 링 |

**동작**
- 열기: `menu-btn` → `sheet.showModal()`. 배경은 inert, 포커스는 시트 안, Esc로 닫힘 (네이티브 `<dialog>`).
- 닫기: 닫기 버튼, backdrop 클릭(`e.target === sheet`), 시트 안 섹션 링크 클릭.
- [제안] 시트가 열린 채 861px 이상으로 넓어지면 닫는다 (`matchMedia` 변경 시 `close()`). 시안에 처리 없음.

**반응형**: 861px 이상에서는 `.bar-id`, `.lang-btn`, `.menu-btn`, 시트 모두 숨김. 360px에서 바 = 이름 + 현재 섹션(말줄임) + 언어 + 메뉴, 가로 스크롤 없음.

**접근성**: 메뉴 버튼·닫기 버튼 `aria-label` ("Open menu / 메뉴 열기", "Close menu / 메뉴 닫기"). 시트 `aria-labelledby` = 제목. 시트 안 `nav`에도 `aria-label`. 언어 버튼은 다른 언어 이름을 읽게 하고 `lang`을 그 언어로 둔다.

**모션 (331-c)**: 시트 `translateX(100%)→0` `var(--m-sheet) var(--ease-out)`, backdrop fade `var(--m-sheet) var(--ease-out)` (base의 `translateX(24px)`+fade, 키워드 `ease-out`은 쓰지 않음). 모션 줄이기: 즉시 표시.

### 5.4 Language switch & Theme toggle

**언어 전환 (세그먼트, `.seg`)**

```html
<div class="seg" role="group" aria-label="Language">
  <a href="/" lang="en" hreflang="en" aria-current="true">EN</a>
  <a href="/ko/" lang="ko" hreflang="ko">KO</a>
</div>
```

- 시안은 같은 페이지를 다시 그리는 `<button aria-pressed>`다. 실제 사이트는 `/`와 `/ko/`가 별개 페이지라 **링크**로 바꾼다. [제안] 현재 언어 표시는 `aria-current="true"`, 이동 대상은 같은 경로의 상대 언어 페이지(케이스 스터디는 같은 slug, 404는 언어 홈).
- 같은 `.seg` 모양을 개인 프로젝트 상태 필터(`aria-pressed` 버튼)도 쓴다. 필터 동작은 해당 콘텐츠 컴포넌트 명세를 따른다.

| 요소 | 속성 → 토큰 |
|---|---|
| `.seg` | `inline-flex`, 테두리 1px `--line`, 모서리 `--radius-pill`, 안쪽 여백 2px(컴포넌트 값), 바탕 `--surface` |
| 항목 | `--fs-xs`, `--fw-medium`, `--ls-label-ko`, `--text-3`, 패딩 `--sp-1` 10px(컴포넌트 값), 최소 높이 `--ctl-h-sm`, 모서리 `--radius-pill` |
| 선택됨 (`aria-current` / `aria-pressed="true"`) | 바탕 `--accent-soft`, 글자 `--accent` |

**테마 전환**

```html
<button type="button" class="icon-btn" id="theme" aria-label="Toggle dark mode">
  <svg class="i-moon" …/><svg class="i-sun" …/>
</button>
```

| 항목 | 규칙 |
|---|---|
| 기본값 | 시스템 설정(`prefers-color-scheme`). 수동 전환은 기억 (G1 결정). [제안] `localStorage`에 `light`/`dark` 저장, `<head>` 인라인 스크립트로 첫 페인트 전에 `data-theme` 적용(시안은 같은 방식을 URL 인자로 대신함) |
| 아이콘 | 라이트에서 달(→ 다크로), 다크에서 해. 시안 CSS는 `data-theme`이 있을 때만 하나를 숨겨, 속성이 없으면 둘 다 보인다. 구현은 `data-theme`을 항상 넣거나 `prefers-color-scheme`에도 같은 숨김 규칙을 둔다 |
| 이름 | `aria-label` "Toggle dark mode / 다크 모드 전환" (고정). [제안] `aria-pressed`를 다크일 때 `true`로 두어 현재 상태를 읽게 한다 (시안에 없음) |
| 모양 | `.icon-btn` (5.6) |

**접근성**: 세그먼트 `role="group"` + `aria-label`("Language / 언어"). 각 언어 항목에 `lang`(EN은 `en`, KO는 `ko`) — 화면 읽기 프로그램이 올바른 발음으로 읽게. 키보드는 Tab으로 각 항목.
**모션 (331-c)**: 테마 = View Transitions 크로스페이드 `--m-theme`(`data-vt="theme"`), 언어 = 문서 간 `@view-transition { navigation: auto }` `--m-lang`. 지원하지 않는 브라우저와 모션 줄이기에서는 즉시 바뀜. 세그먼트 바탕·글자 `--dur`.
**콘텐츠 출처**: 라벨·aria-label = `src/i18n`.

### 5.5 Footer (335-a 콜로폰 한 줄)

**구조**

```html
<footer class="foot">
  <p>© <span class="num">2026</span> Kwang Myung Yu</p>
  <ul>
    <li>Last updated <time datetime="2026-11-10" class="num">Nov 10, 2026</time></li>
    <li><a href="https://github.com/sguys99/sguys99.github.io" rel="noopener">Site source</a></li>
    <li><a href="#main">Back to top ↑</a></li>
  </ul>
</footer>
```

| 요소 | 속성 → 토큰 |
|---|---|
| `footer` | `--font-meta`, `--fs-xs`, `--text-3`. `flex-wrap`, 양 끝 정렬, `align-items: baseline`, 간격 `--sp-2` `--sp-5`, 위 여백 `--sp-6`, 패딩 `--sp-4` `--sp-1` 0, 위 헤어라인 1px `--line` |
| `ul` | `flex-wrap`, 간격 `--sp-2` `--sp-5`, 목록 기호 없음 |
| 링크 | `--text-2`, 밑줄 `--line-strong`, `--underline-offset`. hover 글자·밑줄 `--accent` |

| 항목 | 규칙 |
|---|---|
| 연도 | 최종 수정일의 연도 |
| 최종 수정일 | 빌드 시 `git log -1 --format=%cs -- src/content`. 영문 `Nov 10, 2026`, 국문 `2026.11.10`. 시안의 "sample date / 예시 날짜" 배지는 시안 전용이라 넣지 않음 |
| 국문 | "최종 수정", "사이트 소스", "맨 위로" (용어집 등록 → 5.7) |
| 위치 | 홈과 404의 마지막 카드 아래. 케이스 스터디 적용 여부는 4.5에서 정함 |

**반응형**: ≤560에서 세로 1열(`flex-direction: column`).
**접근성**: 시안은 `footer`가 `<main>` 안에 있어 contentinfo 랜드마크가 되지 않는다. [제안] `<main>` 바로 뒤(본문 열 안)로 옮긴다. "Back to top"은 `#main`으로 이동하므로 `<main id="main" tabindex="-1">`로 포커스도 옮긴다. `↑`는 장식이라 `aria-hidden` span으로.
**모션**: hover 색만.
**콘텐츠 출처**: 이름 = `profile`, 저장소 주소·문구 = `src/i18n`/사이트 설정, 날짜 = 빌드.

### 5.6 Buttons & links

**링크**

| 종류 | 클래스 (시안) | 토큰 | hover |
|---|---|---|---|
| 본문 외부 링크 | `.ext` | 글자 상속, 밑줄 `--line-strong`, `--underline-offset`, 뒤에 외부 아이콘 `--icon-xs`(왼쪽 `--sp-1`, `vertical-align: -1px`, `--icon-stroke-sm`) | 글자·밑줄 `--accent` |
| 메타 링크 (DOI 등) | `.it .mt a` | `--accent`, `--font-meta`, 밑줄 투명, `overflow-wrap: anywhere` | 밑줄 `currentColor` |
| 사이드바 기록 링크 | 5.1 | `--text`, 밑줄 `--line-strong` | `--accent` |
| 머리 링크 (GitHub 주소) | `.pp-head-link` | `--font-meta`, `--fs-xs`, `--text-3`, 밑줄 `--line-strong` | `--accent` |
| 이메일 강조 | `.mail` | `--fs-lg`, `--fw-medium`, `--accent`, 밑줄 `--line-strong`, `--underline-offset`(시안 4px → 3px 확정) | 밑줄 `--accent` |
| 아이콘 + 글자 링크 | `.links a`, 모바일 `.contact a` | 아이콘 `--icon`, 간격 `--sp-2`, `--fs-sm`, `--text-2`, 밑줄 없음 | `--accent` |
| 글자 버튼 | `.linkish` (Clear filters) | `<button>`, `--fs-sm`, `--accent`, 밑줄, `--underline-offset` | — |
| 푸터 링크 | 5.5 | | |

- 외부 링크는 모두 `rel="noopener"`, 같은 탭 (시안에 `target` 없음).

**버튼·칩**

| 종류 | 클래스 | 크기 | 토큰 | hover | 사용처 |
|---|---|---|---|---|---|
| 아이콘 버튼 | `.icon-btn` | `--ctl-h-lg` 정사각 (시안 34px → 36px 확정) | 테두리 1px `--line`, `--radius-pill`, 바탕 `--surface`, 아이콘 `--icon` `--icon-stroke`, `--text-2` | 아이콘 `--accent`, 테두리 `--line-strong` | 테마, 메뉴, 시트 닫기, 모바일 언어 |
| 칩 링크 | `.chip-lnk` | 최소 높이 `--ctl-h` (시안 30px → 32px) | 패딩 0 `--sp-3`, 테두리 1px `--line`, `--radius-pill`, `--font-meta` `--fs-xs` `--text-2`, 아이콘 `--icon-sm`(시안 13px → 14px) `--icon-stroke-sm`, 간격 `--sp-1h` | 글자·테두리 `--accent` | 개인 프로젝트 저장소·데모 |
| 펼침 버튼 | `.toggle-all` | 패딩 6px 14px(컴포넌트 값) | `--fs-sm` `--fw-medium` `--text-2`, 바탕 없음, 테두리 1px `--line`, `--radius-pill`, 위 여백 `--sp-4` | 글자 `--accent`, 테두리 `--line-strong` | 전체 프로젝트·개인 프로젝트 "모두 보기" (5.9) |
| 복사 버튼 | `.copy` | 5.8 | | | Contact |
| 404 버튼 (보조) | `.btn` | 최소 높이 `--ctl-h-lg` | 패딩 0 `--sp-4`, 테두리 1px `--line`, `--radius-pill`, `--fs-sm` `--fw-medium` `--text-2`, 아이콘 `--icon-sm`, 간격 `--sp-1h` | 글자 `--accent`, 테두리 `--line-strong` | 404 "한국어 홈 / English home" |
| 404 버튼 (주) | `.btn.pri` | 같음 | 바탕 `--accent-soft`, 테두리 투명, 글자 `--accent`, 뒤에 화살표 아이콘 | (같은 규칙) | 404 "Go to home / 홈으로" |

**상태 공통**

| 상태 | 처리 |
|---|---|
| focus-visible | 전역 링 (`--focus-w`, `--focus-offset`, `--radius-xs`) |
| active | 시안에 별도 스타일 없음. 추가하지 않는다 |
| disabled | 사이드바 CV 자리만 (`aria-disabled`, 5.1). 그 밖의 버튼은 비활성 상태 대신 숨김(`hidden`) |

- `.toggle-all` 패딩 6px 14px는 `--ctl-h`와 높이가 맞지 않는다. [제안] 구현 시 `min-height: var(--ctl-h); padding: 0 var(--sp-4)`로 맞추면 컨트롤 높이 단계에 들어간다. 시각 차이가 2px 안팎이라 확인만 받는다.

**반응형**: ≤560에서 칩 링크는 행 아래 가로로 줄바꿈 배치(해당 콘텐츠 컴포넌트). 버튼 크기는 바뀌지 않는다.
**접근성**: 아이콘 버튼은 `aria-label` 필수. 칩 링크는 같은 문구("Repository")가 여러 번 나오므로 `<span class="sr-only">: {프로젝트 이름}</span>`을 붙인다. 404 보조 버튼에 그 언어의 `lang`. 모든 컨트롤 24px 이상.
**모션**: 색·테두리 `--dur`. `.btn`·`.chip-lnk` 화살표 이동 없음.

### 5.7 Tags & badges

| 종류 | 클래스 | 문구 (영/국) | 토큰 | 사용처 |
|---|---|---|---|---|
| 도메인 태그 | `.tag` | 콘텐츠 값 (예: Manufacturing) | `--fs-xs`, 패딩 `--sp-0` `--sp-2`, `--radius-pill`, 바탕 `--chip`, `--text-2`, 행간 1.6 | 대표작 태그 첫 칸 |
| 역량 태그 | `.tag.k` | 콘텐츠 값 (예: LLM Agents) | 바탕 `--accent-soft`, 글자 `--accent` | 대표작 태그 둘째 칸부터 |
| 태그 목록 | `.tags` | — | `<ul>`, `flex-wrap`, 간격 `--sp-1h` | |
| 총괄 배지 | `.badge` | Lead / 총괄 | `--font-meta`, `--fs-2xs`, `--fw-medium`, 패딩 0 `--sp-1h`, 테두리 1px `--line-strong`, `--radius-xs`, `--text-2` | 전체 프로젝트 원장 제목 뒤 |
| 대표 배지 | `.badge.f` | Selected / 대표 | 테두리·글자 `--accent` | 원장의 대표작 행 |
| 진행 배지 | `.badge.live` | In progress / 진행 중 | 테두리·글자 `--accent`, 왼쪽 `--sp-2` | 케이스 스터디 Outcome 제목 (진행 중 건) |
| 자리 표시 배지 | `.badge` | Placeholder / 자리 표시 | 글자 `--text-3` | 사이드바 CV 자리 |
| 진행 상태 (점) | `.status` | In progress / 진행 중 | `--fs-xs` `--fw-medium` `--accent`, 앞 점 `--dot` `--accent` + 후광 `0 0 0 var(--halo) var(--accent-soft)`, 간격 `--sp-1h` | 대표작 메타 (현재·예정 건) |
| 상태 점 | `.st` | 아래 표 | 앞 점 `--dot`, 테두리 1px `--text-3`, 간격 5px(정렬 보정값) | 개인 프로젝트, 특허·SW |
| 선택 표시 | `.sel-mark` | Selected / 대표 | `--font-meta` `--fs-2xs` `--ls-eyebrow` 대문자 `--accent`. 국문 `--font-ko` `--fs-xs` 자간 0 | IP 보고서 대표 건 |

**상태 점 (`.st`)**

| 변형 | 점 | 글자 | 의미 |
|---|---|---|---|
| `.st.reg` | 채움 `--accent` | `--text-2` | Active / 운영 중, Registered / 등록 |
| `.st` | 빈 원 (실선 `--text-3`) | `--text-3` | Filed / 출원, In progress / 진행 중(개인), Archived / 보관 |
| `.st.pen` | 빈 원 (점선) | `--text-3` | Filing in progress / 출원 진행 중, Pending / 등록 진행 중 |

- 국문 배지·라벨은 3장 규칙대로 한 단계 크게(`--fs-2xs` → `--fs-xs`) 하고 대문자·자간을 끈다.
- "Selected / 대표"가 원장(`.badge.f`, 테두리 배지)과 IP 보고서(`.sel-mark`, 글자만) 두 모양으로 나뉜다. 시안 그대로 두되 하나로 합칠지는 사용자 확인.
- CV의 "Planned" 배지는 "In progress / 진행 중"으로 맞춘다 (decision-log 3.3).

**상태**: 태그·배지는 상호작용 없음(hover·focus 없음).
**반응형**: 태그 목록은 줄바꿈. 배지는 제목 줄 끝에 붙어 함께 줄바꿈.
**접근성**: 상태는 점 색만이 아니라 항상 글자로 표시 (색만으로 정보 전달 금지). 점은 `::before` 장식. 태그 목록은 `<ul>`.
**모션**: 없음.
**콘텐츠 출처**: 도메인·역량·Lead·featured·status = `src/content/projects`·`personal`·`patents`. 배지 문구 = `src/i18n` (용어집: Lead → 총괄).

### 5.8 Copy button (이메일 복사)

```html
<div class="mail-row">
  <a class="mail" href="mailto:sguys99@naver.com">sguys99@naver.com</a>
  <button type="button" class="copy" aria-label="Copy email address: sguys99@naver.com">
    <svg class="i-copy" aria-hidden="true">…</svg><svg class="i-ok" aria-hidden="true">…</svg><span class="copy-l">Copy</span>
  </button>
</div>
<span class="sr-only" aria-live="polite" id="copy-status"></span>
```

| 요소 | 속성 → 토큰 |
|---|---|
| `.copy` | 최소 높이 `--ctl-h`, 패딩 `--sp-1` `--sp-3`, 테두리 1px `--line`, `--radius-pill`, 바탕 `--surface`, `--fs-xs` `--fw-medium` `--text-2`, 아이콘 `--icon-sm` `--icon-stroke-sm`, 간격 `--sp-1h` |
| `.mail-row` | `flex-wrap`, 간격 `--sp-2` `--sp-3` |

| 상태 | 처리 |
|---|---|
| 기본 | 복사 아이콘 + "Copy / 복사" |
| hover | 글자 `--accent`, 테두리 `--line-strong` |
| focus-visible | 전역 링 |
| 복사됨 (`data-state="ok"`) | 체크 아이콘 + "Copied / 복사됨", 글자·테두리 `--accent`. 라이브 영역에 "Email address copied / 이메일 주소를 복사했습니다". 1800ms(컴포넌트 값, 모션이 아닌 표시 시간) 뒤 기본으로 |
| 연속 클릭 | 타이머를 다시 시작 |

- 복사: `navigator.clipboard.writeText`, 실패하거나 없으면 임시 `textarea` + `execCommand('copy')` 후 버튼으로 포커스 복귀.
- JS 없음: 버튼을 숨기고 `mailto` 링크만 남긴다. [제안] 시안은 JS 없을 때도 버튼이 보임.
- 접근성: `aria-label`에 보이는 글자 "Copy"가 포함(이름-라벨 일치). 결과는 라이브 영역으로 알림. `.sr-only`는 위치 기준 요소를 갖게 고친다 (decision-log, 5.1 전역 스타일).
- 모션: 색·테두리 `--dur`. 아이콘 교체는 즉시.
- 콘텐츠 출처: 이메일 = `profile`, 문구 = `src/i18n`.

### 5.9 Disclosure (접힘 공통 동작)

시안에는 접힘이 두 종류 있다. 목적에 따라 구분해 쓴다.

| 종류 | 마크업 | 쓰는 곳 | 고른 이유 |
|---|---|---|---|
| A. 서랍 | 네이티브 `<details><summary>` | IP & Publications 유형별 서랍 | 전체가 접히고 펼쳐지는 단순 구조. JS 없이 동작, Enter/Space, 펼침 상태 낭독이 기본 제공 |
| B. 일부 보기 | `<button class="toggle-all" aria-expanded aria-controls>` + 목록 행 `hidden` | 전체 프로젝트 원장, 개인 프로젝트 | 앞의 N행은 늘 보이고 나머지만 접힘 + 필터와 연동. `<details>`로는 일부 노출이 안 됨 |

**A. 서랍 (`details`)**

| 항목 | 규칙 |
|---|---|
| summary | `list-style: none`, `::-webkit-details-marker { display: none }`, `cursor: pointer`, `--text-2` |
| chev 아이콘 | `--icon-sm`, `--icon-stroke-sm`, 기본 `--text-3`, 열림 시 `rotate(180deg)` |
| hover | summary 글자 `--text`, chev `--accent` |
| open | chev `--accent` + 회전 |
| focus-visible | 링을 안쪽으로 `outline-offset: calc(-1 * var(--focus-offset))` |
| 앵커 | `scroll-margin-top: calc(var(--header-h) + var(--sp-5))` |
| JS 없음 | 그대로 동작 (모두 닫힌 상태로 시작) |

**B. 일부 보기 (버튼)**

| 항목 | 규칙 |
|---|---|
| 문구 | 닫힘 "Show all (N) / 모두 보기 (N)", 열림 "Show less / 접기" |
| 상태 | `aria-expanded` true/false, `aria-controls` = 목록 id. 숨긴 행은 `hidden` 속성 |
| 모양 | `.toggle-all` (5.6) |
| 버튼 숨김 | 보일 행이 N 이하이면 `hidden` |
| 필터와 함께 | 필터를 바꾸면 접힘으로 되돌린다(개인 프로젝트). 결과 건수는 `role="status"` 줄로 알림 |
| 포커스 | 버튼은 다시 그리지 않아 포커스 유지. 필터 변경 후에는 바꾼 컨트롤로 포커스 복귀 |
| JS 없음 | 모든 행을 보이고 버튼은 숨김 |

**반응형**: 두 종류 모두 폭과 관계없이 같은 동작. 서랍 summary 배치(≤560 2줄 격자)는 콘텐츠 명세.
**모션 (331-c)**: chev 회전 `--dur ease`. 펼침 높이 애니메이션 없음 (331-c에 없음). 섹션 첫 등장 시 서랍 행은 순서 등장 대상(`.drawers > details`).

### 5.10 Select (필터 선택 상자)

```html
<label class="sel">
  <span class="sel-k">Domain</span>
  <select id="pl-d"><option value="">All (24)</option><option value="manufacturing">Manufacturing (9)</option>…</select>
</label>
<button type="button" class="linkish" hidden>Clear filters</button>
```

| 요소 | 속성 → 토큰 |
|---|---|
| `.sel` | `inline-flex`, 테두리 1px `--line`, `--radius-pill`, 바탕 `--surface` |
| `.sel-k` (키) | 왼쪽 패딩 `--sp-3`, `--font-meta` `--fs-2xs` `--ls-eyebrow` 대문자 `--text-3`, `pointer-events: none`. 국문 `--font-ko` `--fs-xs` 자간 0 |
| `select` | `appearance: none`, `--fs-sm` `--text`, 바탕 없음, 테두리 없음, 최소 높이 `--ctl-h`, 패딩 5px `calc(var(--sp-3) + 14px)` 5px `--sp-2`, 최대 폭 220px(컴포넌트 값), 말줄임 |
| 화살표 | 배경 그라디언트 두 개로 그린 5px 꺾쇠, 색 `--text-3` (컴포넌트 값). [제안] chev 아이콘(5.12)과 모양이 다르지만 `select` 안이라 시안대로 둔다 |
| `option` | 글자 `--text`, 바탕 `--surface` (다크에서 OS 목록 색 맞춤, `color-scheme` 함께) |

| 상태 | 처리 |
|---|---|
| hover | 테두리 `--line-strong` |
| focus | `.sel:focus-within` 테두리 `--accent` + 링 `--focus-w` `--focus` `--focus-offset`. `select` 자체 링은 끔 |
| 값 선택됨 (`.on`) | 테두리 `--accent`, 바탕 `--accent-soft`, 글자 `--accent` |
| 옵션 disabled | 다른 필터와 조합해 0건이면 `disabled` (건수는 옵션 글자에 `(n)`) |
| 해제 버튼 | 필터가 하나라도 걸리면 보임(`.linkish`), 누르면 모두 해제 후 첫 선택 상자로 포커스 |

**반응형**: ≤560에서 도구 영역 1열 격자, `.sel` 폭 100%, `select`는 `flex: 1; max-width: none`.
**접근성**: `label`이 감싸 키 글자가 이름이 된다. 네이티브 `select`라 키보드·낭독 기본 제공. 결과 건수는 `role="status"`. JS 없음: 선택 상자 영역 `hidden`, 모든 행 표시.
**모션**: 테두리 `--dur`.
**콘텐츠 출처**: 옵션 = 프로젝트 콘텐츠의 domain·capability 값에서 계산, 라벨 = `src/i18n`.

### 5.11 Logos (경력 회사 로고, 3.2.7 C)

경력 6곳에만 공식 로고를 글자색 단색으로 쓴다. 고객사 로고는 쓰지 않는다. 출처: `docs/design-drafts/g3/327-logos/SOURCES.txt` (구현 파일은 `g4/logos/`와 같음).

| 키 | 파일 (시안) | 배율 `--s` | 형식 |
|---|---|---|---|
| genon | `genon.png` | 0.9 | PNG (래스터) |
| pwc | `pwc.svg` | 1.5 | SVG |
| makinarocks | `makinarocks.svg` | 0.78 | SVG |
| semco | `semco-mono.svg` | 1.05 | SVG (흰 글자를 휘도 마스크로 뚫음) |
| kepco | `kepco-mono.svg` | 0.95 | SVG (흰 선을 휘도 마스크로 뚫음) |
| posco-enc | `posco-enc.svg` | 1.45 | SVG |

`--s`는 로고마다 그림 여백이 달라 눈으로 맞춘 배율이다. 토큰 파일이 아니라 로고 데이터에 둔다.

**색 처리 (구현 규칙)**
- 시안은 `<img>` + `filter: var(--logo-filter)`라 다크에서 글자색과 정확히 같지 않다. 구현은 **SVG를 `currentColor`로 정리**한다 (decision-log 3.2): 채움을 모두 `fill="currentColor"`로, 흰 knockout(semco·kepco)은 마스크나 `fill-rule`로 투명하게 유지. 모양은 바꾸지 않는다.
- 색은 `color: var(--text)`, 농도는 `opacity: var(--logo-op)` / 현재 소속 `var(--logo-op-cur)`. 이렇게 하면 `--logo-filter`는 쓰이지 않는다 → 3장에서 삭제 후보 (사용자 확인).
- genon은 PNG라 `currentColor`가 안 된다. **미정**: (a) 공식 SVG를 구하거나 (b) PNG를 CSS `mask-image`로 쓰고 `background: currentColor`. 결정 필요.
- 인라인 SVG로 넣을 때 파일마다 `id`(마스크 등)가 겹치지 않게 접두어를 붙인다.

| 위치 | 높이 | 최대 폭 | 농도 | 대체 텍스트 |
|---|---|---|---|---|
| 경력 행 기간 아래 (`.lg-row .logo`) | `calc(var(--logo-h) * var(--s))`, 위 여백 `--sp-3` | `--logo-w` | 기본 `--logo-op`, 현재 소속(`.cur`)·행 hover `--logo-op-cur` | 장식: `alt=""` / `aria-hidden` (행 제목 h3에 회사 이름) |
| 대표작 메타 (`.proj-meta .logo`) | `calc(var(--logo-h-sm) * var(--s))` | `--logo-w` | 항상 `--logo-op-cur` | 회사 이름 (글자 대신 로고가 이름 역할). SVG면 `role="img"` + `aria-label` |

공통: `object-fit: contain; object-position: left center` 상당(왼쪽 정렬), `display: block`(메타 안에서는 `inline-block`, 간격 `--sp-2`).

**반응형**: ≤560 경력 행에서 기간 칸이 가로 flex(양 끝 정렬, 간격 `--sp-3`, 아래 `--sp-2`)가 되고 로고가 기간 **앞**(`order: -1`), 높이 ×0.85, 위 여백 0.
**접근성**: 로고 농도 근사 대비 라이트 6.2:1, 다크 6.8:1 (3장). 이름 정보는 항상 글자로도 있다(경력 행).
**모션**: 농도 `opacity var(--dur) ease`.
**콘텐츠 출처**: 회사 → 로고 키 대응은 `src/content/experience`(또는 로고 데이터 파일). 로고 파일은 `public/` 또는 컴포넌트 import. SOURCES.txt의 "Not approved for the real site" 문구는 G4 결정(6곳 승인)보다 앞선 것이라 구현 시 갱신한다.

### 5.12 Icons

**세트**: 외부 아이콘 세트·의존성 없음. 시안에 직접 쓴 인라인 SVG(`viewBox="0 0 24 24"`, 선형, `fill: none; stroke: currentColor`). 모양은 Tabler/Lucide 계열과 비슷하지만 path를 직접 쓴 것이다. [제안] 구현은 한 파일(예: `Icon.astro`, 이름 → path)로 모은다.

| 규칙 | 값 |
|---|---|
| 크기 | `--icon-xs` 12 / `--icon-sm` 14 / `--icon` 16 / `--icon-lg` 18 |
| 선 굵기 | `--icon` 이상 `--icon-stroke` (1.5), `--icon-sm` 이하 `--icon-stroke-sm` (1.6) |
| 색 | `currentColor` (부모 글자색 따라 hover 시 같이 바뀜) |
| 선 끝 | 시안은 기본값(`butt`). 바꾸지 않는다 |
| 접근성 | 항상 `aria-hidden="true"`, `focusable="false"`. 아이콘만 있는 버튼은 `aria-label` |
| `flex: none` | 글자와 나란할 때 줄어들지 않게 |

| 이름 | path 요약 | 크기 | 사용처 |
|---|---|---|---|
| mail | 봉투 (`rect` + V선) | `--icon` | 사이드바(모바일)·시트 연락처 |
| gh | GitHub 고양이 윤곽 | `--icon` / `--icon-sm` | 연락처, Contact 링크 / 저장소 칩 링크 |
| in | LinkedIn 사각 + in | `--icon` | 연락처, Contact 링크 |
| arrow | → (`M5 12h14M13 6l6 6-6 6`) | `--icon-lg` / `--icon-sm` / `--icon-xs` | 대표작 행 끝 / 404 주 버튼 / 케이스 "다음" |
| back | ← | `--icon-sm` / `--icon-xs` | 케이스 이동 경로 / 케이스 "이전" |
| ext | ↗ (`M7 17 17 7M9 7h8v8`) | `--icon-xs` / `--icon-sm` | 본문 외부 링크 / 데모 칩 링크 |
| chev | ∨ (`m6 9 6 6 6-6`) | `--icon-sm` | 서랍 (5.9) |
| copy | 겹친 사각형 | `--icon-sm` | 복사 버튼 |
| ok | ✓ (`m5 12 5 5L20 7`) | `--icon-sm` | 복사됨 |
| moon / sun | 달 / 해 | `--icon` | 테마 전환 |
| menu | 가로줄 2개 (`M4 8h16M4 16h16`) | `--icon` | 모바일 메뉴 버튼 |
| close | × | `--icon` | 시트 닫기 |

- 시안 값과 다른 확정: `.chip-lnk` 아이콘 13px → `--icon-sm` 14px (3장 정리 이력).
- 케이스 이동 경로·이전/다음의 배치는 케이스 스터디 명세(후반부)가 정한다. 여기서는 아이콘 크기만.

### 5.13 Section head

홈 카드마다 맨 위에 두는 줄. 왼쪽은 섹션 제목(eyebrow 모양의 h2), 오른쪽은 건수나 보조 링크.

```html
<div class="sec-head">
  <h2 id="h-work">Selected Work</h2>
  <span class="meta num">6 / 20 projects</span>   <!-- 또는 링크(5.20), 없을 수 있음 -->
</div>
```

| 요소 | 토큰 / 값 |
|---|---|
| `.sec-head` | `display: flex; align-items: baseline; justify-content: space-between; gap: --sp-4; margin-bottom: --sp-5` |
| `h2` 영문 | `--font-meta`, `--fs-xs`, `--fw-eyebrow`, `--ls-eyebrow`, `text-transform: uppercase`, `--text-3` |
| `h2` 국문 | `--font-ko`, `--fs-sm`, `--fw-strong`, `--ls-eyebrow-ko`, 대문자 변환 없음 |
| `.meta` | `--font-meta`, `--fs-xs`, `--text-3`, `tabular-nums` |

| 섹션 | 오른쪽 내용 (콘텐츠에서 계산) | 영문 / 국문 |
|---|---|---|
| About, Awards & Education, Contact | 없음 | — |
| Selected Work | `featured` 건수 / `projects` 전체 건수 | `6 / 20 projects` / `6 / 20 건` |
| Experience | `experience` 항목 수 | `6 organizations` / `6 곳` |
| Teaching · Books · Advisory | `teaching.kind`별 건수 (book, teaching, advisory 순) | `Books 2 · Teaching 6 · Advisory 2` |
| Personal Projects | GitHub 프로필 링크 (5.20) | `github.com/sguys99` |
| IP & Publications | 특허+프로그램+논문+보고서 합계 | `N records` / `총 N건` |

- 반응형: ≤560px에서 `#ip`는 세로 쌓기(`flex-direction: column; align-items: flex-start; gap: --sp-0`), `#teaching`은 `flex-wrap: wrap; row-gap: --sp-1`. [제안] 두 규칙을 `.sec-head` 공통 규칙(≤560px `flex-wrap: wrap`)으로 합친다. 이유: 국문 건수 문구가 길어지는 섹션이 더 생길 수 있음.
- 접근성: `h2`에 id를 두고 카드의 `aria-labelledby`가 가리킨다. 섹션 제목 단계는 h2, 카드 안 소제목은 h3, 그 아래는 h4.
- 모션: 없음 (카드 등장에 포함, 5.14).
- 문구: 섹션 이름·단위(`organizations`, `records` 등)는 `src/i18n/` (5.7). 숫자만 콘텐츠에서 계산.

### 5.14 Card (section container)

홈 섹션 8개와 404, 케이스 스터디 본문이 쓰는 공통 상자. 카드 안에 카드를 두지 않는다(3.2.1 결정). 안쪽 구분은 헤어라인으로만 한다.

```html
<section class="card" id="work" aria-labelledby="h-work">
  <div class="sec-head">…</div>
  …
</section>
```

| 속성 | 값 |
|---|---|
| 바탕 / 테두리 / 모서리 | `--surface` / `1px solid --line` / `--radius` |
| 안쪽 여백 | `--sp-6` (≤860px: `--sp-5 --sp-4`) |
| 카드 사이 | `margin-bottom: --sp-5` (≤860px: `--sp-4`) |
| 앵커 위치 | `scroll-margin-top: calc(--header-h + --sp-5)` |
| 안쪽 구분선 | 목록 머리 `--line-strong`, 행 사이 `--line` |

**섹션 순서와 앵커** (3.3 결정): `#about` → `#work` → `#experience` → `#teaching` → `#awards` → `#personal` → `#ip` → `#contact`. 상단 메뉴 탭과의 대응은 5.2 참조.

**모션 (331-c)**

| 상태 | 규칙 |
|---|---|
| 첫 화면에 걸린 카드, JS 없음 | 완성 상태 그대로. 숨기지 않는다 |
| 첫 화면 아래 카드 | JS가 `m-wait` 부여 → `opacity: 0; transform: translateY(--m-rise)` |
| 화면에 들어옴 (`IntersectionObserver`, `rootMargin: 0px 0px -8% 0px`) | `m-in` 추가 → `--m-reveal` `--ease-out`로 fade/rise, 관찰 해제(1회) |
| 안쪽 행 | 각 컴포넌트의 "대상 행"이 `--m-row`로 순서 등장. 지연 `calc(--m-reveal / 3 + --i × --m-stagger)`, `--i`는 `:nth-child`로 0~7 (8번째부터 7) |
| 앵커·탭 이동으로 들어온 카드 | 등장 효과 없이 바로 완성 상태 (decision-log 3.3). [제안] 이동 대상 카드와 그 위의 `m-wait` 카드를 함께 `m-wait` 해제한다. 이유: 부드러운 스크롤이 지나가는 카드가 이동 직후 비어 보이는 문제가 같은 원인 |
| 인쇄 | `opacity: 1; transform: none` 강제 |
| `prefers-reduced-motion: reduce` | `m-wait`를 붙이지 않는다 |

대상 행 선택자(331-c): `.work > li`, `.lg > .lg-row`, `.pidx > li`, `.ledger > li`, `.drawers > details`, `.figs > .fig`, `.skills > div`, `.ct > *`. 구현에서 클래스 이름이 바뀌면 이 목록도 같이 바꾼다.

### 5.15 Hero / About intro

About 카드의 앞부분. 큰 한 줄 소개, About 문단, 그 아래 경력 궤적(5.16), 숫자 표(5.17), 역량 표가 이어진다. 이름·직함은 사이드바(5.1)에 있고 About 카드는 반복하지 않는다.

```html
<section class="card" id="about" aria-labelledby="h-about">
  <div class="sec-head"><h2 id="h-about">About</h2></div>
  <p class="tagline">Building industrial AI, from control rooms to humanoid robots.</p>
  <p class="about">…</p>
  <ol class="traj">…</ol>      <!-- 5.16 -->
  <dl class="figs">…</dl>      <!-- 5.17 -->
  <dl class="skills">…</dl>
</section>
```

| 요소 | 토큰 / 값 | 콘텐츠 |
|---|---|---|
| `.tagline` | `--font-display`, `--fs-2xl` (≤860px `--fs-xl`), `--fw-tagline`/`-ko`, `--lh-tagline`/`-ko`, `--ls-tagline`/`-ko`, `max-width: 30ch` (국문 24ch), `text-wrap: balance`, `margin: 0 0 --sp-4` | `profile.taglines[0]` |
| `.about` | `--text-2`, 본문 크기, `max-width: --measure` | `profile.about` |
| `.skills` | `margin-top: --sp-6` (숫자 표 바로 뒤면 `--sp-5`), 위 `--line` | `profile.skills[].label`, `.summary` |
| `.skills > div` | `grid: 180px minmax(0,1fr)`, `gap: --sp-4`, `padding: --sp-3 0`, 아래 `--line` (마지막 행 없음) | — |
| `.skills dt` / `dd` | `--fs-sm` `--fw-strong` / `--fs-sm` `--text-2` | — |

- 반응형: ≤560px에서 `.skills > div`는 1열, `gap: --sp-0`.
- 접근성: 한 줄 소개는 `p` (페이지 h1은 사이드바 이름). 영문 페이지에 국문이 섞이지 않는다.
- 모션: 한 줄 소개·문단은 첫 화면이라 등장 효과 없음. `.skills > div`는 대상 행이지만 About이 첫 화면에 있으면 실제로 재생되지 않는다.
- 남은 일: 한 줄 소개와 About 첫 문장의 단어 중복 → 1.2.11.

### 5.16 Career trajectory

4단계 가로 타임라인(G1 기준안 유지, 3.1.5). 점 + 선, 현재 단계(마지막)만 채운 점과 포인트 색.

```html
<ol class="traj">
  <li><span class="yrs num">2008 – 2015</span><h3>Control & Automation</h3><p>…</p></li>
  … (4개, 마지막이 현재)
</ol>
```

| 요소 | 값 |
|---|---|
| `.traj` | `grid-template-columns: repeat(4, minmax(0,1fr))`, `gap: --sp-4`, `margin-top: --sp-6` |
| `li` | `position: relative; padding-top: --sp-5` |
| 선 `li::before` | `top: 4px` (점 중심), `left: 0; right: calc(-1 * --sp-4)` (다음 칸까지 이어짐), `height: 1px`, `--line-strong` |
| 마지막 구간 | `right: 0`, `linear-gradient(to right, --accent, transparent)` — **사용자 승인된 그라디언트 예외** (원칙의 "그라디언트 금지"에서 이 한 곳만 제외). 현재 단계가 계속된다는 뜻 |
| 점 `li::after` | `--dot-lg` 정사각, `--radius-pill`, 바탕 `--surface`, `1px solid --line-strong` |
| 현재 점 | 바탕·테두리 `--accent`, `box-shadow: 0 0 0 --halo-lg --accent-soft` |
| `.yrs` | `--font-meta`, `--fs-xs`, `--text-3` |
| `h3` | `--fs-md`, `--fw-strong`, `--lh-title`, `margin: --sp-0 0 --sp-1`. 현재 단계는 `--accent` |
| `p` | `--fs-sm`, `--text-2`, 행간 1.55 |

| 폭 | 배치 |
|---|---|
| ≥1101px | 4열 |
| ≤1100px | 2열, `row-gap: --sp-5`. 2번째 칸 선은 `right: 0` (줄 끝에서 끊김) |
| ≤560px | 1열 세로. `margin-left: --sp-1`, `li { padding: 0 0 --sp-4 --sp-5 }`. 선은 세로(`left: 4px; top: 4px; bottom: 0; width: 1px`), 마지막 칸 선(그라디언트)은 숨김 |

- 상태: 현재 단계는 위치(마지막 항목)로 정한다. 콘텐츠에 현재 표시 필드는 없다(`trajectory`는 정확히 4개, `.length(4)`).
- 접근성: 순서 있는 목록 `ol`. 선·점은 의사 요소라 읽히지 않는다. 현재 단계를 색만으로 표시하므로 [제안] 마지막 `li`에 `aria-current="step"`을 둔다. 이유: 색 외의 수단으로 현재를 알림.
- 모션 (331-c): 로드 시 1회 선 그리기. 구간 `i`(0~3)마다 `animation-delay: i × --m-draw-seg`, 선은 `scaleX(0)→1` (`transform-origin: left`), 점은 같은 시점에 `scale(0.4)`·투명 → 1. ≤560px는 `scaleY` (`transform-origin: top`). 글자는 숨기지 않는다. `--i`는 `:nth-child`로 주므로 JS가 따로 넣을 필요 없음. 시안은 다시 그리기를 막으려고 4000ms 뒤 `m-draw` 클래스를 지운다 → [제안] 마지막 점의 `animationend`에서 지운다. 이유: 시안 밖 시간값을 두지 않음.
- 콘텐츠: `profile.trajectory[]` → `years`(`.yrs`), `label`(`h3`), `description`(`p`).

### 5.17 Stats table

궤적 아래 4칸 숫자 표 (3.2.8 A). 모든 숫자는 빌드 시 콘텐츠에서 센다. 손으로 쓰지 않는다. 연수(경력 년수)는 싣지 않는다.

```html
<dl class="figs" aria-label="At a glance">
  <div class="fig">
    <dt>Projects</dt>
    <dd class="n"><span aria-hidden="true">20</span><span class="sr-only">20</span></dd>
    <dd class="s">6 featured</dd>
  </div> … (4칸)
</dl>
```

| 칸 | 큰 숫자 | 보조줄 영문 / 국문 | 출처 |
|---|---|---|---|
| Projects / 프로젝트 | `projects` 전체 | `6 featured` / `대표 6건` | `projects.featured` |
| Patents / 특허 | `patents` 전체 | `7 registered · 8 filed` / `등록 7 · 출원 8` | `patents.status` (`filed`는 전체 − `registered`) |
| Software / 프로그램 등록 | `software` 전체 | `8 registered · 2 pending` / `등록 8 · 진행 중 2` | `software.status` |
| Books / 저서 | `teaching` 중 `kind: book` | 없음 | `teaching.kind` |

(예시 숫자는 현재 콘텐츠 기준이며 빌드마다 다시 센다.)

| 요소 | 값 |
|---|---|
| `.figs` | `grid: repeat(4, minmax(0,1fr))`, `margin-top: --sp-6`, 위 `--line` |
| `.fig` | 세로 flex, `padding: --sp-4 --sp-4 0`, 왼쪽 `--line` (첫 칸은 선·왼쪽 여백 없음). 시각 순서: 숫자(`order: 1`) → 이름(2) → 보조줄(3) |
| `.n` | `--font-display`, `--fs-2xl` (≤560px `--fs-xl`), `--fw-medium`, `--text`, 행간 1.1, `--ls-name`, `tabular-nums` |
| `dt` | `--fs-sm`, `--fw-medium`, `--text-2` |
| `.s` | `--font-meta` `--fs-2xs` `--text-3`, `margin-top: --sp-0` (국문 `--font-ko` `--fs-xs`) |

- 반응형: ≤560px 2열. 홀수 칸 왼쪽 선 없음, 3·4번째 칸은 위 `--line` + `margin-top: --sp-4`.
- 접근성: `dl`의 `dt`가 이름, 첫 `dd`가 값. DOM 순서는 이름 → 값이고 화면 순서만 `order`로 바꾼다. **카운트업 중에는 움직이는 숫자를 `aria-hidden`으로 두고 최종값을 읽게 한다** (decision-log 3.3): 보이는 숫자 `span`은 늘 `aria-hidden="true"`, 최종값은 `.sr-only` `span`. JS가 없으면 보이는 숫자도 최종값으로 렌더된다.
- 모션 (331-c): 처음 화면에 보일 때 1회, `--m-count` 동안 0 → 최종값, ease-out cubic `1-(1-p)^3`, 정수 반올림. `.figs > .fig`는 대상 행이라 카드가 아래에 있으면 순서 등장과 겹친다. `prefers-reduced-motion: reduce`면 카운트업 없이 최종값.
- 문구: 칸 이름, `featured`·`registered`·`filed`·`pending` 단어는 `src/i18n/`.

### 5.18 Selected work list

대표작 번호 목록 (3.2.1 A). 01–06 한 열, 가는 선 구분, 안쪽 상자 없음.

```html
<ol class="work">
  <li class="proj">
    <span class="idx num" aria-hidden="true">01</span>
    <div class="body">
      <p class="proj-meta"><span class="org">[logo] <span>· Samsung Electronics</span></span>
        <span class="num">Feb 2025 – Aug 2025</span> [<span class="status">In progress</span>]</p>
      <h3><a href="/work/samsung-scm-agent/">…</a></h3>   <!-- 케이스 없으면 링크 없이 텍스트 -->
      <p class="sum">…</p>
      <p class="out"><span class="k">Outcome</span>…</p>   <!-- 완료 건만 -->
      <ul class="tags">…</ul>
    </div>
    <span class="go" aria-hidden="true">[arrow]</span>       <!-- 케이스 있는 건만 -->
  </li>
</ol>
```

| 요소 | 값 |
|---|---|
| `.proj` | `grid: --col-idx minmax(0,1fr) 24px`, `gap: 0 --sp-4`, `padding: --sp-5 0`, 위 `--line`. 첫 행: 선 없음, `padding-top: --sp-1`. 마지막 행 `padding-bottom: 0` |
| `.idx` | `--font-meta`, `--fs-sm`, `--text-3`, `padding-top: --sp-0` |
| `.body` | `grid; gap: --sp-1h; min-width: 0` |
| `.proj-meta` | flex wrap, `gap: --sp-1 --sp-3`, `--fs-xs`, `--text-3`. `.org`는 `--text-2` `--fw-medium`, 인라인 flex `gap: --sp-2` |
| 상태 `.status` | "In progress" + `--dot` 점(`--accent`, 후광 `--halo`). 5.7 참조 |
| `h3` | `--font-display`, `--fs-lg`, `--fw-title`, `--lh-title`, `--ls-title`/`-ko` |
| `.sum` | `--fs-sm`, `--text-2`, `max-width: --measure-sm` |
| `.out` | `--fs-sm`, `--text`, `--measure-sm`. `.k`: `--font-meta` `--fs-2xs` 대문자 `--ls-eyebrow` `--text-3`, `margin-right: --sp-2` (국문 `--font-ko` `--fs-xs`, 자간 0) |
| `.tags` | `margin-top: --sp-1`. Domain 태그 1개 + Capability 태그(포인트 바탕) → 5.7 |
| `.go` | 화살표 `--icon-lg`, `--text-3`, `padding-top: --sp-1` |

| 상태 | 표현 (케이스 스터디가 있는 행만) |
|---|---|
| 기본 | 위 표 |
| hover (`(hover: hover)`) | 행 바탕 `--row-tint` + 좌우 `box-shadow: ±--sp-3 0 0 --row-tint`로 바탕을 행 밖으로 넓힘, `h3`·`.idx`·`.go` `--accent`, `.go` `translateX(3px)`. 전환 `--dur` |
| focus | 링크는 `h3 a::after`가 행 전체를 덮는다(`position: absolute; inset: 0 calc(-1 * --sp-2)`, `--radius-sm`). 포커스 링은 `::after`에 `--focus-w solid --focus` |
| 케이스 없음 | 링크·화살표·hover 없음. 제목은 텍스트 (현재 그린소재 재고 조합 최적화 1건) |

- 콘텐츠: `projects` 중 `featured: true`, `order` 오름차순.

| 화면 요소 | 필드 |
|---|---|
| 번호 | 정렬 순번 (01부터) |
| 소속 | `org` — 경력 6곳이면 로고(alt = 회사 이름, 5.11), 아니면 텍스트 |
| 고객 | `client.public ? client.name : client.label` (실명은 승인된 2곳만, 스키마가 막음) |
| 기간 | `period` (`start – end`, `status: present`면 "Present") |
| 진행 중 | `period.status`가 `present` 또는 `planned`면 `.status` "In progress / 진행 중"을 붙이고 성과 줄은 뺀다 |
| 제목 / 요약 | `title` / `summary` |
| 성과 첫 줄 | 완료 건의 `caseStudy.outcome[0]`. `caseStudy`가 없으면 줄 없음 |
| 태그 | `domain`, `capability[]` (국문 표기는 `src/i18n/`, 5.7) |
| 링크 | `caseStudy`가 있으면 `/work/<slug>/` (국문 `/ko/work/<slug>/`) |

- 반응형: ≤560px `grid: --col-idx-sm minmax(0,1fr)`, `.idx` `--fs-xs` `padding-top: 3px`, `.go` 숨김.
- 접근성: 번호는 `aria-hidden` (`ol`이 순서를 전달). 행 전체가 클릭 영역이지만 링크는 제목 하나뿐(탭 정지 1회). 로고는 `img alt`로 회사 이름을 읽는다.
- 모션: 대상 행 `.work > li`.

### 5.19 Project ledger + filters

대표작 아래, 같은 Selected Work 카드 안에 이어지는 전체 프로젝트 원장 (3.2.2 B). 한 줄 원장 + Domain·Capability 선택 상자 2개 + "모두 보기" 접힘.

```html
<div class="pl">
  <div class="pl-head">
    <h3 class="pl-title" id="pl-title">All Projects <span class="num">20</span></h3>
    <div class="pl-tools" hidden>   <!-- JS가 hidden 해제 -->
      <label class="sel">…Domain…<select id="pl-d"></select></label>      <!-- 5.10 -->
      <label class="sel">…Capability…<select id="pl-c"></select></label>
      <button type="button" class="linkish" hidden>Clear filters</button>
    </div>
  </div>
  <p class="pl-status" role="status"></p>
  <ol class="ledger" aria-labelledby="pl-title">
    <li class="pl-row">
      <span class="pl-y num">2024–2025</span>
      <div><p class="pl-t">… <span class="badge">Lead</span> <span class="badge f">Selected</span></p>
           <p class="pl-who">PwC Consulting · LOTTE Fine Chemical</p></div>
      <p class="pl-cap"><b>Petrochemical & Steel</b>Forecasting · …</p>
    </li>
  </ol>
  <p class="pl-none" hidden>No projects match these filters.</p>
  <button type="button" class="toggle-all" aria-controls="…" aria-expanded="false" hidden>Show all (20)</button>
</div>
```

| 요소 | 값 |
|---|---|
| `.pl` | `margin-top: --sp-6; padding-top: --sp-5`, 위 `--line-strong` |
| `.pl-head` | flex wrap, `space-between`, `gap: --sp-3 --sp-4`, `margin-bottom: --sp-3` |
| `.pl-title` | `--fs-md` `--fw-strong`. 건수 `.num`: `--font-meta` `--fs-xs` `--fw-regular` `--text-3`, `margin-left: --sp-1` |
| `.pl-tools` | flex wrap, `gap: --sp-2 --sp-3` |
| `.pl-status` | `--font-meta` `--fs-xs` `--text-3`, `margin: 0 0 --sp-2`, 비면 숨김 |
| `.ledger` | 위 `--line` |
| `.pl-row` | `grid: --col-year-wide minmax(0,1fr) auto`, `gap: --sp-1 --sp-4`, `padding: --sp-3 0`, 아래 `--line` |
| `.pl-y` | `--font-meta` `--fs-xs` `--text-3`, `padding-top: --sp-0`, 줄바꿈 없음 |
| `.pl-t` | `--fs-sm` `--fw-medium` `--lh-row`. 배지는 5.7 (`.badge.f`는 테두리·글자 `--accent`) |
| `.pl-who` | `--fs-xs` `--text-3`, `margin-top: --sp-0` |
| `.pl-cap` | 오른쪽 정렬, `--font-meta` `--fs-2xs` `--text-3`, `padding-top: 3px`. `b`(Domain)는 블록, `--fw-medium` `--text-2` (국문 `--font-ko` `--fs-xs`) |
| `.pl-none` | `--fs-sm` `--text-2`, `margin-top: --sp-3` |
| `.linkish` (필터 해제) | 글자 버튼 `--fs-sm` `--accent`, 밑줄 `--underline-offset` → 5.6 |
| `.toggle-all` | → 5.6. `margin-top: --sp-4` |

**동작과 상태**

| 상태 | 규칙 |
|---|---|
| JS 없음 | 전체 행을 그대로 보인다. 선택 상자·필터 해제·상태 줄·모두 보기 버튼은 숨김. 빌드 HTML에 모든 행이 들어 있어야 한다 |
| JS 기본 | 처음 6행만 보이고 나머지는 `hidden`. 모두 보기 버튼에 전체 건수 `Show all (20)` |
| 펼침 | 모두 보이고 버튼은 `Show less / 접기`, `aria-expanded="true"` |
| 필터 선택 | 하나라도 고르면 접힘을 무시하고 맞는 행을 모두 보인다. 모두 보기 버튼 숨김, 필터 해제 버튼 표시, 고른 선택 상자는 `.on` (5.10) |
| 선택 항목 | 첫 항목 `All domains (N)` / `All capabilities (N)`. 각 항목 뒤 건수는 **다른 선택 상자의 현재 값과 겹친 건수**. 0건 항목은 `disabled` |
| 상태 줄 | `Showing n of 20 projects` / `전체 20건 중 n건 표시` (`role="status"`로 읽힘) |
| 빈 결과 | `.pl-none` "No projects match these filters. / 조건에 맞는 프로젝트가 없습니다." 0건 항목을 막으므로 실제로는 거의 생기지 않지만 남겨 둔다 |
| 필터 해제 | 두 값을 비우고 Domain 선택 상자로 포커스 |
| 포커스 | 필터를 바꿔도 포커스는 그 선택 상자에 남는다. 시안은 목록을 다시 그려 포커스를 되돌리지만, 구현은 행의 `hidden`만 바꾸고 선택 상자는 다시 만들지 않는다 |

- 정렬: `period.start` 내림차순, 같으면 slug 오름차순.
- 콘텐츠

| 화면 요소 | 필드 |
|---|---|
| 연도 | `period.start` 연도 – `end` 연도 (같으면 한 번, `present`면 "Present") |
| 제목 | `title` |
| 배지 | `lead: true` → Lead/총괄, `featured: true` → Selected/대표 |
| 소속 · 고객 | `org` · (`client.name` 또는 `client.label`) |
| Domain / Capability | `domain` / `capability[]` (선택지 목록은 `content.config.ts`의 `DOMAINS`·`CAPABILITIES` 순서) |

- 반응형: ≤560px `.pl-tools`는 1열 grid로 폭 전체, `.sel` 폭 100%. `.pl-row`는 1열 `gap: --sp-0`, `.pl-cap` 왼쪽 정렬·줄바꿈 허용·`padding-top: --sp-1`, Domain은 인라인 + 뒤에 " · ".
- 접근성: 선택 상자는 `label`로 감싼 네이티브 `select`. 원장 행은 링크가 아니다(시안 그대로. 대표작은 위 목록에서 링크). 접힌 행은 `hidden`이라 읽히지 않는다.
- 모션: 대상 행 `.ledger > li`. 필터·펼침에는 모션 없음.

### 5.20 Personal projects index

개인 프로젝트 번호 목록 (3.2.4 B). 고정폭 번호 + 상태 필터 + 오른쪽 저장소·데모 버튼.

```html
<section class="card" id="personal" aria-labelledby="h-personal">
  <div class="sec-head"><h2 …>Personal Projects</h2>
    <a class="pp-head-link" href="https://github.com/sguys99" rel="noopener">github.com/sguys99</a></div>
  <div class="filters seg" role="group" aria-label="Personal Projects">   <!-- JS 있을 때만 -->
    <button type="button" aria-pressed="true">All <span class="num">10</span></button> …
  </div>
  <ol class="pidx">
    <li><span class="n num" aria-hidden="true">01</span>
      <div><div class="ttl"><h3>AI Wiki</h3><span class="st reg">Active</span></div>
        <p class="sum">…</p><p class="stk">Python / Claude Code / …</p></div>
      <div class="acts"><a class="chip-lnk" href="…">[gh] Repository<span class="sr-only">: AI Wiki</span></a>
        <a class="chip-lnk" href="…">[ext] Live demo<span class="sr-only">: AI Wiki</span></a></div>
    </li>
  </ol>
  <button type="button" class="toggle-all" aria-controls="…" aria-expanded="false">Show all (10)</button>
</section>
```

| 요소 | 값 |
|---|---|
| `.pp-head-link` | `--font-meta` `--fs-xs` `--text-3`, 밑줄 `--line-strong` `--underline-offset`. hover 글자·밑줄 `--accent` |
| 필터 | 세그먼트 토글 → 5.4와 같은 `.seg` 모양, `margin-bottom: --sp-4`, 버튼 사이 `gap: --sp-2`. 선택은 `aria-pressed="true"` (바탕 `--accent-soft`, 글자 `--accent`) |
| `.pidx` | 위 `--line-strong` |
| `li` | `grid: 40px minmax(0,1fr) auto`, `gap: --sp-4`, `padding: --sp-4 0`, 아래 `--line` |
| `.n` | `--font-meta` `--fs-xs` `--text-3`, `padding-top: 3px` |
| `.ttl` | flex wrap baseline, `gap: --sp-1 --sp-3` |
| `h3` | `--fs-md` `--fw-strong` `--lh-row` |
| 상태 `.st` | `--font-meta` `--fs-xs` `--text-3`, 앞에 `--dot` 빈 점(`1px solid --text-3`). `active`는 점을 `--accent`로 채우고 글자 `--text-2` |
| `.sum` | `--fs-sm` `--text-2`, `--measure-sm`, `margin-top: --sp-1` |
| `.stk` | `--font-meta` `--fs-xs` `--text-3`, `margin-top: --sp-2`, " / "로 연결 |
| `.acts` | 세로 flex, `gap: --sp-2`, 폭 맞춤(`align-items: stretch`), `min-width: 112px` |
| `.chip-lnk` | `--ctl-h`, `padding: 0 --sp-3`, `1px solid --line`, `--radius-pill`, `--font-meta` `--fs-xs` `--text-2`, 아이콘 `--icon-sm` `--icon-stroke-sm`, `gap: --sp-1h`. hover 글자·테두리 `--accent` (전환 `--dur`) |

**동작과 상태**

| 상태 | 규칙 |
|---|---|
| 정렬 | `active` → `in-progress` → `archived`, 같은 상태 안은 콘텐츠 순서 |
| 필터 | `All` + 건수가 1 이상인 상태만 버튼으로. 버튼 글자에 건수 |
| 필터 변경 | 접힘을 다시 닫고(처음 5행), 번호는 걸러진 목록 기준으로 01부터 다시 매긴다. 포커스는 누른 버튼에 남는다 |
| 접힘 | 처음 5행. 넘치면 `Show all (n)` / `Show less`, `aria-expanded` |
| JS 없음 | 필터·모두 보기 버튼 숨김, 전체 행 표시 |
| 데모 없음 | 저장소 버튼만 |

| 상태 값 | 영문 / 국문 (시안) |
|---|---|
| `active` | Active / 운영 중 |
| `in-progress` | In progress / 개발 중 |
| `archived` | Archived / 보관 |

- 콘텐츠: `personal` 컬렉션 → `name`(h3, 언어 공통), `summary`(`.sum`), `stack[]`(`.stk`), `status`, `repo`, `demo?`. 머리 링크는 `profile.contact.github`.
- 반응형: ≤560px `grid: --col-idx-sm minmax(0,1fr)`, `gap: --sp-1 --sp-3`. `.acts`는 2열째 아래로 내려와 가로 배치(`flex-wrap`), `min-width: 0`, `margin-top: --sp-2`.
- 접근성: 버튼에 보이는 글자는 짧게 두고 `.sr-only`로 프로젝트 이름을 붙여 링크 이름을 구분한다 (`Repository: AI Wiki`). 필터는 `role="group"` + `aria-label`. 번호는 `aria-hidden`. 외부 링크는 `rel="noopener"`.
- 모션: 대상 행 `.pidx > li`.
- 남은 일: 상태 문구와 정렬 순서(콘텐츠에 순서 필드 없음) → 1.5.6. glob 로더의 "콘텐츠 순서"는 파일 이름순이므로, 순서를 정하려면 필드가 필요하다.

### 5.21 Index drawer

특허·프로그램·논문·보고서 색인 서랍 (3.2.5 B). 유형별 한 줄(건수·내역·연도 범위), 열면 연도별 목록. 섹션 이름 IP & Publications / 지식재산 · 출판물, 앵커 `#ip`.

```html
<div class="drawers">
  <details class="dr" id="ip-pat">
    <summary>
      <span class="dn">Patents</span><span class="dc">15</span>
      <span class="db">7 registered · 8 filed</span><span class="dy">YYYY–YYYY</span>[chev]
    </summary>
    <div class="dbody">
      <ol class="yg">
        <li><h4 class="yh">2025</h4>
          <ol class="ip-list">
            <li class="it"><div>
              <span class="tt">English title</span>
              <span class="og" lang="ko">국문 원제</span>        <!-- 영문 페이지만 -->
              <p class="au">…<b>K. M. Yu</b>…</p>                 <!-- 논문만 -->
              <p class="mt"><span class="st reg">Registered</span><span>venue</span><a href="https://doi.org/…">DOI …</a></p>
            </div></li>
          </ol></li>
      </ol>
    </div>
  </details> … (pat, sw, paper, report)
</div>
```

| 요소 | 값 |
|---|---|
| `.drawers` | 위 `--line-strong` |
| `.dr` | 아래 `--line`, `scroll-margin-top: calc(--header-h + --sp-5)` |
| `summary` | `grid: minmax(0,1.4fr) 64px minmax(0,2fr) 96px 20px`, `align-items: baseline`, `gap: --sp-4`, `padding: --sp-4 0`, `--text-2`. 기본 표식 제거(`list-style: none`, `::-webkit-details-marker`) |
| `.dn` 유형 | `--fs-lg` `--fw-strong` `--text`, 자간 -0.01em |
| `.dc` 건수 | `--font-meta` `--fs-xl` `--fw-medium` `--text`, 오른쪽 정렬, 행간 1 |
| `.db` 내역 | `--fs-sm` `--text-2` |
| `.dy` 연도 범위 | `--font-meta` `--fs-xs` `--text-3`, 오른쪽 정렬 |
| `.chev` | `--icon-sm`, `--icon-stroke-sm`, `--text-3`, `align-self: center` |
| `.dbody` | `padding: 0 0 --sp-5` |
| `.yg > li` | `grid: --col-year minmax(0,1fr)`, `gap: --sp-4`, 위 `--line` |
| `.yh` | `--font-meta` `--fs-xs` `--fw-medium` `--text-3`, `padding-top: calc(--sp-3 + --sp-0)` (국문 `--font-ko`) |
| `.it` | `padding: --sp-3 0`, 위 `--line` (연도 묶음의 첫 항목은 선 없음) |
| `.tt` | 블록, `--fs-sm` `--fw-medium` 행간 1.5 `--text` |
| `.og` | 블록, `margin-top: --sp-0`, `--font-ko` `--fs-xs` 행간 1.55 `--text-3`, `word-break: keep-all` |
| `.au` | `--fs-xs` `--text-2`, `margin-top: --sp-1`. 본인 이름 `b`는 `--fw-strong` `--text` |
| `.mt` | flex wrap, `gap: --sp-1 --sp-3`, `--fs-xs` `--text-3`, `margin-top: --sp-1`. DOI 링크 `--accent` `--font-meta`, 밑줄은 hover 때만(`--underline-offset`), `overflow-wrap: anywhere` |
| 상태 `.st` | `--dot` 점 + 글자. `registered` 채운 점 `--accent`·글자 `--text-2` / `filed` 빈 점 / `filing`·`pending` 점선 빈 점 |
| `.sel-mark` | 대표 보고서 표시. `--font-meta` `--fs-2xs` 대문자 `--ls-eyebrow` `--accent` (국문 `--font-ko` `--fs-xs` 자간 0) |

| 상태 | 표현 |
|---|---|
| 닫힘 (기본) | 한 줄만 |
| hover | `summary` 글자 `--text`, chev `--accent` (`--dur`) |
| 열림 | chev `--accent` + `rotate(180deg)` (`--dur`), `summary` `padding-bottom: --sp-2` |
| focus | `summary`에 포커스 링, `outline-offset: calc(-1 * --focus-offset)` (안쪽) |
| 언어 전환 | 별도 페이지라 열린 상태는 유지하지 않는다 (시안은 같은 페이지 다시 그리기라 유지했음) |

**유형별 내용과 콘텐츠**

| 유형 | 컬렉션 | 내역 (`.db`) | 정렬 · 연도 | 항목 메타 |
|---|---|---|---|---|
| Patents / 특허 | `patents` | `N registered · N filed` (`filed` = `filed` 전체) | `date` 내림차순, 연도 = `date` 앞 4자리 | 상태: `registered` → Registered/등록, `filed`이고 `number` 있음 → Filed/출원, `number` 없음 → Filing in progress/출원 진행 중. **`number`는 표시하지 않는다** |
| Software / 프로그램 등록 | `software` | `N registered · N pending` | `date` 내림차순. `date` 없는 `pending`은 맨 위, 연도 칸에 "Pending / 등록 진행 중" | 상태 `registered` / `pending`. `number` 표시 안 함 |
| Papers / 논문 | `publications` `type: paper` | `with DOI / DOI 연결` | `year` 내림차순 | `authors`(본인 이름 굵게), `venue`, `doi` → `https://doi.org/<doi>` 링크 |
| Reports / 연구보고서 | `publications` `type: report` | `N selected / 대표 N` (`featured` 건수) | `year` 내림차순 | `publisher?`, `featured`면 `.sel-mark` Selected/대표 |

- 공통: 제목 `title.en`(영문 페이지) + 원제 `title.ko`(`.og`, `lang="ko"`, 영문 페이지에서 두 값이 다를 때만). 국문 페이지는 `title.ko`만.
- 보고서 총량("50+")은 쓰지 않는다. 콘텐츠 건수(현재 19건) 그대로.
- 반응형: ≤560px `summary`는 `grid-template-columns: minmax(0,1fr) auto 20px`, 영역 `"n c v" "b y ."`, `row-gap: --sp-0`, `.db` `--fs-xs`, `.dy` 줄바꿈 없음. `.yg > li` 1열 `gap: 0`, `.yh` `padding-top: --sp-3`, 묶음 첫 항목 `padding-top: --sp-1`. `.it` 1열.
- 접근성: 네이티브 `details`/`summary` (JS 없이 열고 닫힘, Enter/Space, 펼침 상태 전달). 유형 서랍마다 `id` (`#ip-pat` 등)로 직접 이동 가능. chev `aria-hidden`.
- 모션: 대상 행 `.drawers > details`. 열고 닫기에는 높이 애니메이션 없음 (chev 회전만).
- 남은 일: `publications.url`(논문)은 시안에서 쓰지 않는다. DOI가 없고 `url`만 있는 논문이 생기면 표시 방법 미정(구현 시 시안 제시).

### 5.22 Period ledger row

경력·강의·수상·학력이 함께 쓰는 "기간 | 항목" 행 (3.2.6 A). 세 섹션이 같은 문법.

```html
<!-- Experience: 그룹 없이 바로 -->
<ol class="lg">
  <li class="lg-row cur">
    <span class="lg-when mono"><span class="when-cell"><span>Jul 2026 – Present</span><img class="logo" alt=""></span></span>
    <div><h3>GenON, R&D Group</h3><p class="lg-sub">Director / AI Product Engineer</p><p class="lg-desc">…</p></div>
  </li>
</ol>
<!-- Teaching, Awards & Education: 그룹 머리 + 행 -->
<div class="lg-group">
  <h3 class="lg-label"><span>Books</span><span class="mono">2</span></h3>
  <ol class="lg"><li class="lg-row"><span class="lg-when mono">2023, 2024</span>
    <div><h4><a class="ext" href="…">Title[ext]</a></h4><p class="lg-sub">Org</p><ul class="dl-list">…</ul></div></li></ol>
</div>
```

| 요소 | 값 |
|---|---|
| `.lg-row` | `grid: --row-when minmax(0,1fr)`, `gap: --sp-5`, `padding: --sp-4 0`, 위 `--line` (첫 행 선 없음, 그룹 없는 목록의 첫 행 `padding-top: 0`) |
| 그룹 안 행 | `padding: --sp-3 0` |
| `.lg-when` | `--font-meta` `--fs-xs` `--text-3` `tabular-nums`, `padding-top: 3px` |
| `h3` / `h4` | `--fs-md` `--fw-strong` `--lh-row`. 그룹 안 `h4`는 `--fs-sm` 행간 1.5 |
| `.lg-sub` | `--fs-sm` `--text-2`, `margin-top: --sp-0`. 경력은 `--accent` `--fw-medium` (직함). 그룹 안은 `--fs-xs` `--text-3` |
| `.lg-desc` | `--fs-sm` `--text-2`, `--measure`, `margin-top: --sp-2` |
| `.dl-list` | 강의 세부. `--fs-sm` `--text-2`, `--measure`, `padding-left: --sp-4`, 항목 간 `--sp-0`, 표식 `--text-3` |
| `.ext` (제목 링크) | 밑줄 `--line-strong` `--underline-offset`, 외부 아이콘 `--icon-xs` (`margin-left: --sp-1`). hover 글자·밑줄 `--accent` → 5.6 |
| `.lg-group + .lg-group` | `margin-top: --sp-6` |
| `.lg-label` | flex baseline `space-between`, `padding-bottom: --sp-2`, `margin-bottom: --sp-1`, 아래 `--line-strong`, `--fs-2xs` `--fw-strong` `--ls-label` 대문자 `--text-3` (국문 `--fs-xs` `--ls-label-ko`). 건수 `.mono`는 `--fw-regular` |

**로고 위치** (3.2.7 C, 경력 6곳만): 기간 글자 아래, 기간 열 안. `margin-top: --sp-3`, 높이 `calc(--logo-h * --s)`, 최대 폭 `--logo-w`, 왼쪽 정렬. 단색·농도·`--s` 배율은 5.11. 현재 소속과 hover 행은 `--logo-op-cur`. 로고는 장식(`alt=""`) — 회사 이름은 `h3`가 읽힌다.

| 상태 | 표현 |
|---|---|
| 현재 (`.cur`) | `period.status: present`인 경력. 기간 글자 `--accent`, 로고 `--logo-op-cur` |
| hover | 로고만 `--logo-op-cur` (`--dur`). 행 자체는 링크가 아니다 |

| 섹션 | 그룹 | 행 정렬 | 기간 열 | 제목 | 부제 | 본문 |
|---|---|---|---|---|---|---|
| Experience | 없음 (`h3`) | 콘텐츠 순서 (최신 먼저) | `experience.period` + 로고 | `org` | `role` | `summary` |
| Teaching · Books · Advisory | `teaching.kind`: book → teaching → advisory | `years`의 마지막 연도 내림차순, 같으면 첫 연도 | `years` (자유 표기 그대로) | `title` (`url` 있으면 `.ext` 링크) | `org` | `details[]` → `.dl-list` |
| Awards & Education — Awards | `awards` | `years` 같은 규칙 | `years` | `title` | `org` | — |
| Awards & Education — Education | `education` | 콘텐츠 순서 | `period` | `school` | `degree` | — |

- 그룹 머리 건수는 그룹 항목 수. 그룹 이름(Books/Teaching/Advisory/Awards/Education)은 `src/i18n/`.
- 반응형: ≤560px 1열(`gap: --sp-0`), `.lg-when` `padding-top: 0`. 로고가 있는 칸(`.when-cell`)은 가로 flex `space-between`, `gap: --sp-3`, `margin-bottom: --sp-2`, 로고가 왼쪽(`order: -1`)·`margin-top: 0`·높이 ×0.85, 기간은 오른쪽.
- 접근성: 행은 `ol > li`. 외부 링크 아이콘 `aria-hidden`, `rel="noopener"`.
- 모션: 대상 행 `.lg > .lg-row`. 그룹이 여러 개면 그룹마다 `--i`가 0부터 다시 시작한다 (`:nth-child` 기준).
- 남은 일: 용어집 [확인 필요] 영문 기관명이 Teaching에 그대로 노출됨 → 1.2.11.

### 5.23 Contact

2단 Contact (3.2.8 A): 왼쪽 의뢰 가능 분야 번호 목록 | 오른쪽 이메일·복사·링크.

```html
<section class="card" id="contact" aria-labelledby="h-contact">
  <div class="sec-head"><h2 id="h-contact">Contact</h2></div>
  <div class="ct">
    <div><h3 class="eyebrow">Open to</h3><ul class="avail"><li>…</li></ul></div>
    <div><h3 class="eyebrow">Reach me</h3>
      <div class="reach">
        <div class="mail-row"><a class="mail" href="mailto:…">sguys99@naver.com</a><button class="copy">…</button></div>
        <ul class="links"><li><a href="…">[gh] GitHub</a></li><li><a href="…">[in] LinkedIn</a></li></ul>
      </div></div>
  </div>
  <span class="sr-only" aria-live="polite"></span>   <!-- 복사 알림, 5.8 -->
</section>
```

| 요소 | 값 |
|---|---|
| `.ct` | `grid: minmax(0,1.35fr) minmax(0,1fr)`, `gap: --sp-7` |
| `.eyebrow` | `margin: 0 0 --sp-3`, `--font-meta` `--fs-xs` `--fw-medium` `--ls-eyebrow` 대문자 `--text-3` (국문 `--font-ko` `--fs-sm` `--fw-strong` `--ls-eyebrow-ko`) |
| `.avail` | 위 `--line`, CSS counter |
| `.avail li` | `grid: --col-idx-sm minmax(0,1fr)`, `gap: --sp-2`, `padding: --sp-3 0`, 아래 `--line`, `--fs-sm` `--text`. 번호 `::before` `decimal-leading-zero`, `--font-meta` `--fs-xs` `--text-3`, `padding-top: --sp-0` |
| `.reach` | 위 `--line`, `padding-top: --sp-4`, grid `gap: --sp-4` |
| `.mail-row` | flex wrap, `gap: --sp-2 --sp-3` |
| `.mail` | `--fs-lg` `--fw-medium` `--accent`, 밑줄 `--line-strong` `--underline-offset`, `overflow-wrap: anywhere`. hover 밑줄 `--accent` |
| 복사 버튼 | → 5.8 |
| `.links` | 세로, `gap: --sp-2`. 링크 `--fs-sm` `--text-2`, 아이콘 `--icon` `--icon-stroke`, `gap: --sp-2`. hover `--accent` |

- 콘텐츠: `profile.availability[]`(3~5개) → `.avail`, `profile.contact.email` / `.github` / `.linkedin`. 전화번호는 두지 않는다.
- 반응형: ≤860px 1열, `gap: --sp-6`.
- 접근성: 의뢰 분야는 `ul`이지만 번호는 CSS counter라 장식. 이메일은 `mailto:` 링크로 글자 그대로 노출(복사 실패에 대비). 복사 버튼 이름에 주소를 포함 (5.8).
- 모션: 대상 행 `.ct > *` (두 열이 차례로).
- 기준안 버그: 사이드바 연락처 목록 id `contact`가 이 섹션 id와 충돌 → 사이드바 쪽을 `side-contact`로 바꾼다 (decision-log 3.3, 5.1).

### 5.24 Case study (323-c 케이스 파일)

기준: `g4/case.html` + `g4/332-a2-case.html`(상단 메뉴 표시, 사이드바 폭). 사이드바가 프로젝트 기록표로 바뀌고, 본문은 번호 붙은 문서 한 장. 상단 메뉴는 홈과 같고 Work 탭이 현재로 고정 (5.2).

**페이지 골격**

```html
<aside class="sidebar" aria-label="Project facts">
  <div class="who"><a href="/#about"><img alt=""> Kwang Myung Yu <span>AI Engineer</span></a></div>
  <div><p class="crumb"><a href="/#work">[back] Selected Work</a><span class="pos">01 / 05</span></p>
       <h1 class="cs-title">…</h1></div>
  <dl class="rec">…</dl>
  <nav class="toc" aria-label="On this page"><ol>…</ol></nav>
  <div class="side-foot"><nav class="pn" aria-label="Case studies">…</nav></div>
</aside>
<header class="topbar">…</header>   <!-- 5.2 -->
<main><article class="card doc">
  <p class="lede">…</p>
  <section class="d-sec" id="context" aria-labelledby="h-context">…</section> …
</article>
<div class="pn-end">…</div>   <!-- ≤860px 이전·다음 -->
<footer>…</footer></main>   <!-- 5.5 -->
```

| 폭 | 사이드바 | 본문 |
|---|---|---|
| >1000px | `--sidebar` 340px, sticky `top: 0`, `padding: --sp-6 --sp-6 --sp-5`, `gap: --sp-5` | `.doc` `padding: --sp-7` (≤1100px `--sp-6`) |
| 861–1000px | 280px (탭 6개 + 토글이 들어가도록, 3.3.2) | 같음 |
| ≤860px | 상단 블록(`display: block`, `padding: --sp-5 --sp-4 --sp-4`, 자식 간 `--sp-4`). `.who`·`.toc`·`.side-foot` 숨김 → 이동 경로·제목·기록표만 | `.doc` `padding: --sp-5 --sp-4`. 끝에 `.pn-end`. 섹션 이동은 메뉴 시트(5.3)의 "← Selected Work" + 목차 |

#### 5.24.1 기록표 사이드바

| 요소 | 값 |
|---|---|
| `.who` 링크 | 인라인 flex `gap: --sp-2`, `--fs-sm` `--fw-strong`, 직함 `span`은 `--text-3` `--fw-regular`. hover `--accent`. 사진 28px 원(`--radius-pill`, `--photo-ring`, `--photo-filter`, `object-position: top`) |
| `.crumb` | flex wrap, `gap: --sp-1 --sp-3`, `margin-bottom: --sp-3`, `--fs-sm`. 링크 `--text-2` `--fw-medium`, 아이콘 `--icon-sm` `gap: --sp-1h`, hover `--accent`. `.pos` `--font-meta` `--fs-xs` `--text-3` |
| `.cs-title` (h1) | `--font-display` `--fs-xl` `--fw-title` `--ls-title`, 행간 1.28, `text-wrap: balance` (국문 `--ls-title-ko`, 행간 1.4) |
| `.rec` | 위 `--line-strong` |
| `.rec > div` | `grid: 96px minmax(0,1fr)`, `gap: --sp-3`, baseline, `padding: --sp-2 0`, 아래 `--line` |
| `dt` | `--fs-2xs` `--fw-strong` `--ls-label` 대문자 `--text-3` (국문 `--fs-xs` `--ls-label-ko`) |
| `dd` | `--fs-sm` `--lh-row`. 스택은 `--font-meta` `--fs-xs` `--text-2` 행간 1.7 |
| `.side-foot` | `margin-top: auto` (사이드바 바닥), `padding-top: --sp-4`, 위 `--line`, grid `gap: --sp-3` |

| 기록 행 | 필드 | 조건 |
|---|---|---|
| Client / 고객 | `client.name` 또는 `client.label` | `client` 있을 때 |
| Organization / 소속 | `org` | `org` 있을 때 |
| Period / 기간 | `period` (+ `planned`면 배지) | 항상 |
| Role / 역할 | `lead: true`면 "Lead / 총괄" | `lead`일 때만. `role` 필드는 쓰지 않는다 (3.2 결정) |
| Stack / 기술 스택 | `stack[]`을 " · "로 | 항상 |

- `.pos`: 케이스 목록 안 순번 / 전체 (두 자리).
- 접근성: 사이드바 `aria-label` "Project facts / 프로젝트 정보". 프로필 사진 `alt=""` (이름이 옆 글자).

#### 5.24.2 번호 목차

| 요소 | 값 |
|---|---|
| `ol` | `list-style: none`, CSS counter |
| `a` | flex `gap: --sp-3`, `padding: 3px 0`, `--fs-sm` `--text-3`. hover `--text` |
| 번호 `a::before` | `decimal-leading-zero`, `--font-meta` `--fs-xs`, `padding-top: 1px`. 색은 아래 버그 참조 |
| 현재 (`aria-current="true"`) | 글자 `--text` `--fw-medium`, 번호 `--accent` |

- 현재 표시: 홈과 같은 스크롤 위치 판정(5.2)으로 `aria-current`를 `.d-sec`에 맞춘다. 상단 메뉴 탭은 Work 고정이고 목차만 움직인다.
- **시안 버그**: 비현재 번호 색이 `--line-strong`(라이트 1.62:1)이라 4.5:1 미달 → `--text-3`으로 바꾼다 (번호가 글자로 읽힐 수 있으므로).

#### 5.24.3 본문 섹션

| 요소 | 값 |
|---|---|
| `.lede` | `--fs-lg` `--text`, 행간 1.55, `max-width: 60ch`, `margin-bottom: --sp-6`. 내용 `summary` |
| `.d-sec` | `grid: --col-idx minmax(0,1fr)`, `gap: 0 --sp-3`, `padding: --sp-6 0`, 위 `--line`, `scroll-margin-top: calc(--header-h + --sp-5)` |
| `.no` | 두 자리 번호, `--font-meta` `--fs-sm` `--accent`, 행간 1.75, `aria-hidden` |
| `h2` | `--fs-lg` `--fw-title` `--ls-title`/`-ko`, 행간 1.4, `margin-bottom: --sp-3` |
| `h3` (Key decisions) | `margin: --sp-5 0 --sp-2`, `--fs-xs` `--fw-strong` `--ls-label` 대문자 `--text-3` (국문 `--fs-sm` `--ls-label-ko`) |
| `.bl` 목록 | grid `gap: --sp-2`. `li` `padding-left: --sp-4` `--text-2` `--measure`. 표식 `::before` 가로선 7×1px `--text-3`, `top: 0.8em` |
| 성과 `.oc` | `li` `--text` `--fw-medium`. 표식 `--dot` 정사각 `--accent`, 모서리 1px, `top: 0.6em` |
| 진행 중 배지 | 성과 제목 옆 `.badge.live`(테두리·글자 `--accent`, `margin-left: --sp-2`) "In progress / 진행 중" → 5.7 |

| 순서 | id | 제목 영문 / 국문 | 필드 | 조건 |
|---|---|---|---|---|
| 01 | `context` | Context / 배경 | `caseStudy.context[]` | 항상 |
| 02 | `problem` | Problem / 문제 | `caseStudy.problem[]` | 항상 |
| 03 | `role` | My role / 역할 | `caseStudy.role[]` | 항상 |
| 04 | `approach` | Approach / 접근 | `caseStudy.approach[]` + `decisions[]` 표 | 결정 표는 `decisions` 있을 때 |
| 05 | `arch` | Architecture / 아키텍처 | `caseStudy.architecture` | 있을 때만. 없으면 번호가 당겨진다 |
| 06 | `outcome` | Outcome / 성과 | `caseStudy.outcome[]` | 항상. `period.status`가 `present`/`planned`면 진행 중 배지 |

결정 표(`.tbl`): 열 Decision / Why / Trade-off (결정 / 이유 / 트레이드오프) ← `decisions[].title` / `.rationale` / `.tradeoff`. 시안은 "Decision"·"Why"를 코드에 직접 썼다 → `src/i18n/`로.

#### 5.24.4 아키텍처 표 (layers / flows)

그림 대신 표 (3.2.3 C). 계층 한 줄 = 행.

```html
<table class="tbl ledger">
  <thead><tr><th scope="col">Layer</th><th scope="col">Components</th><th scope="col">Flows</th></tr></thead>
  <tbody><tr>
    <td><span class="n">01</span> Data</td>
    <td data-l="Components"><ul><li>…</li></ul></td>
    <td data-l="Flows"><span class="flow-col"><span class="flow">→ 02 Agent <em>· query</em></span>
                                              <span class="flow back">↩ 01 Data</span></span></td>
  </tr></tbody>
</table>
```

| 요소 | 값 |
|---|---|
| `.tbl` | 폭 100%, `border-collapse: collapse`, `--fs-sm` |
| `th` | 왼쪽 정렬, `--fw-medium` `--fs-2xs` `--ls-eyebrow` 대문자 `--text-3`, `padding: 0 --sp-3 --sp-2 0`, 아래 `--line-strong` (국문 `--fs-xs` 자간 0) |
| `td` | 위 정렬, `padding: --sp-3 --sp-3 --sp-3 0`, 아래 `--line`(마지막 행 없음), `--text-2` 행간 1.5. 첫 열 `--text` `--fw-medium`, 아키텍처 표에서는 `width: 1%; white-space: nowrap` |
| `.n` 계층 번호 | `--font-meta` `--fs-xs` `--accent` `--fw-regular` |
| `td ul` | 표식 없음, grid `gap: --sp-0` |
| `.flow` | `--font-meta` `--fs-xs` `--text-2`, 줄바꿈 없음. 앞으로 가는 흐름 `→ NN 계층명`, 뒤로 돌아가는 흐름(대상 순번 < 현재) `↩`·`--text-3`. 흐름 라벨 `em`은 기울임 없이 `--text-3`, 앞에 " · " |
| 결정 표의 3열 `.to` | `--text-3` |

- 콘텐츠: `caseStudy.architecture.layers[]`(`id`, `label`, `nodes[]`) → 행 순서·번호·구성 요소. `flows[]`(`from`, `to`, `label?`) → `from` 계층 행의 흐름 칸. 스키마가 `from`/`to`가 있는 `id`인지 검사한다.
- 반응형: ≤560px 표를 쌓인 기록으로 (`table`·`tr`·`td` `display: block`). `thead`는 시각적으로 숨김(`.sr-only`와 같은 규칙), `tr` `padding: --sp-3 0` + 아래 `--line`, `td` `padding: 0 0 --sp-1`. 라벨은 `td[data-l]::before`(`--fs-2xs` `--ls-eyebrow` 대문자 `--text-3`, `margin-top: --sp-1`; 국문 `--fs-xs` 자간 0). 첫 열 `nowrap` 해제.
- 접근성: 진짜 `table` + `th scope="col"`. 쌓인 모양에서도 `thead`는 남아 있어 읽힌다. 화살표 글자(→ ↩)는 [제안] `aria-hidden` + `.sr-only` "to / back to"로 바꾼다. 이유: 화면 낭독기가 기호를 다르게 읽음.
- 클래스 이름: 시안의 `.ledger`(아키텍처 표)는 홈 전체 프로젝트 원장(`.ledger`, 5.19)과 이름이 겹치고 `.n`·`.stk`·`.sum`도 여러 컴포넌트가 다르게 쓴다. 구현은 Astro 컴포넌트 범위 스타일로 분리한다.

#### 5.24.5 이전·다음

| 요소 | 값 |
|---|---|
| `.pn` | grid `gap: --sp-1`, `nav aria-label="Case studies / 케이스 스터디 목록"` |
| `.pn-a` | `grid: auto minmax(0,1fr)`, `gap: --sp-2`, baseline, `padding: 3px 0`, `--fs-sm` `--text-2`. hover `--accent` |
| `.pn-k` | 인라인 flex `gap: --sp-1`, `--font-meta` `--fs-xs` `--text-3`, `min-width: 64px`. 아이콘 `--icon-xs` `--icon-stroke-sm`: Previous 앞에 ←, Next 뒤에 → |
| `.pn-t` | 제목 한 줄 말줄임 (`ellipsis`) |
| 끝 항목 | 첫 케이스는 Previous, 마지막은 Next를 그리지 않는다 (순환 없음) |
| ≤860px `.pn-end` | 본문 아래, `margin-top: --sp-2`. 링크마다 `padding: --sp-3 0` + 위 `--line`, 제목 줄바꿈 허용 |

- 순서: `featured: true`이고 `caseStudy`가 있는 프로젝트, `order` 오름차순 (현재 5건). 링크 `rel="prev"`/`"next"`.
- 접근성: 링크 이름 = "Previous" + 제목 전체(말줄임은 시각만).

**케이스 스터디 모션**: 331-c 시안은 홈만 다룬다. 케이스 페이지는 등장·순서 효과 없이 hover 전환(`--dur`)과 상단 메뉴·메뉴 시트 모션(5.2, 5.3)만 둔다 [제안]. 이유: 한 장짜리 문서라 앵커 이동이 많고, 시안에 기준이 없음.

**미정·확인**
- 기간 옆 "Planned / 예정" 배지: 홈과 CV는 `planned`를 "In progress / 진행 중"으로 표시한다(3.3 결정은 CV만 명시). 케이스 기록표도 같은 문구로 맞출지 확인 필요.
- 시안의 UI 문구 `domain`(분야)은 정의만 있고 기록표에 쓰이지 않는다 → 기록표에 Domain을 넣지 않는다(시안 그대로).

## 6. Page Templates

페이지별 구성, 섹션 순서, 라우트, 언어 전환, head 메타. 컴포넌트 내부는 5장, 치수·브레이크포인트는 4장, 인쇄 조판은 10장을 따른다.

기준 시안: 홈 `g4/332-a2.html`(기준안 `base.html` + 탭 확정안), 케이스 스터디 `g4/332-a2-case.html`, CV `g4/333-a.html`, 404·푸터 `g4/335-a.html`, 파비콘·OG `g4/334-d.html`.

**표기**
- 컴포넌트 이름은 5장 이름을 쓴다 (→ 5장). 5장과 합칠 때 이름이 다르면 5장에 맞춘다.
- **[구현 기본값]**: 시안에 없어 일반 관례로 정한 값. 디자인 결정이 아니므로 시안 없이 구현하되, 바꾸려면 사용자에게 묻는다.
- **미정**: 결정이 필요하다. 해당 단계에서 사용자에게 묻는다.

**공통 규칙**
- 모든 내부 링크와 자산 경로는 루트 기준 절대 경로(`/…`)이고 끝에 `/`를 붙인다 (`trailingSlash: 'always'`). 404는 임의 경로에서 서비스되므로 상대 경로를 쓰면 깨진다.
- 앵커 id는 영문·국문이 같다 (영문 소문자). 언어 전환 시 앵커를 그대로 붙일 수 있게 하기 위해서다.
- `<html lang>`은 `/ko/` 아래면 `ko`, 그 밖은 `en`.
- 페이지 문장은 `src/content/`와 `src/i18n/`에서만 가져온다 (CLAUDE.md 규칙 2).

### 6.1 Routes

| 페이지 | 영문 | 국문 | 레이아웃 | 비고 |
|---|---|---|---|---|
| 홈 | `/` | `/ko/` | 사이트 셸: 프로필 사이드바 + 상단 메뉴 + 본문 + 푸터 | 단일 스크롤, 섹션 앵커는 6.2 |
| 케이스 스터디 | `/work/<slug>/` | `/ko/work/<slug>/` | 케이스 셸: 기록표 사이드바 + 상단 메뉴(Work 표시) + 문서 + 푸터 | `featured: true`이고 `caseStudy`가 있는 프로젝트만 생성. 현재 5건 (6.3) |
| CV (화면·인쇄) | `/cv/` | `/ko/cv/` | 종이 셸: 도구 막대 + A4 용지 한 장 | 사이드바·상단 메뉴 없음 (6.4) |
| CV PDF | 미정 | 미정 | — | 6.12(PDF 생성)에서 파일 경로·이름 결정. 그때 사이드바 "Download CV"에 연결 |
| 404 | `/404.html` (모든 없는 경로) | 같은 파일 | 사이트 셸에서 섹션 대신 카드 하나 | GitHub Pages는 루트 `404.html` 하나만 쓴다. 국문 404 파일은 따로 만들지 않는다 (6.5) |

- `<slug>` = `src/content/projects/`의 파일 이름 (예: `samsung-scm-agent`). 영문·국문 같은 slug.
- `/work/`(목록 페이지)는 만들지 않는다. 목록은 홈 `#work`가 담당한다 [구현 기본값: 링크가 없으므로 404].
- 저장소 이름과 겹치는 경로(`sguys99.github.io/<repo>/`)가 생기지 않게 최상위 경로는 위 표의 것만 쓴다 (basic-plan 4.1).

**언어 전환 이동 대상**

| 지금 페이지 | 전환 후 | 앵커 |
|---|---|---|
| `/` ↔ `/ko/` | 반대 언어 홈 | 현재 섹션 앵커를 붙인다 (예: `/#ip` → `/ko/#ip`) |
| `/work/<slug>/` ↔ `/ko/work/<slug>/` | 같은 slug의 반대 언어 페이지 | 현재 섹션 앵커를 붙인다 (예: `#approach`) |
| `/cv/` ↔ `/ko/cv/` | 반대 언어 CV | 없음 |
| 404 | 반대 언어 홈 (`/` 또는 `/ko/`) | 없음. 반대 언어의 같은 경로가 있는지 알 수 없으므로 |

- "현재 섹션"은 scroll-spy가 표시 중인 섹션이다 (주소창 hash는 스크롤 후 낡을 수 있음). 페이지 맨 위면 앵커를 붙이지 않는다 [구현 기본값].
- 전환 컨트롤은 `href`가 반대 언어 경로인 링크로 만든다. JS가 꺼져 있어도 같은 페이지로 이동하고, JS는 앵커만 덧붙인다 [구현 기본값]. 시안은 `<button>`으로 제자리 다시 그리기였지만 사이트는 페이지가 언어별로 따로 있다.
- 데스크톱은 상단 메뉴 오른쪽 EN/KO, 모바일은 바의 언어 버튼과 메뉴 시트 Language 항목. 세 곳 모두 같은 대상으로 간다. 언어 선택은 저장하지 않는다 (주소가 곧 상태). 테마는 저장한다 (G1).

### 6.2 Home

**섹션 순서** (decision-log G6 "함께 정한 것")

| 순서 | 섹션 (en / ko 제목) | 앵커 id | 상단 탭 | 사용 컴포넌트 (5장) | 콘텐츠 출처 |
|---|---|---|---|---|---|
| — | 사이드바 | — | — | Sidebar 5.1 (Dossier Record: 사진, 이름 `h1`, 직함, 키/값 표 Now·Email·GitHub·LinkedIn, CV 다운로드 자리) | `profile` (name, headline, currentRole, contact) |
| — | 상단 메뉴 / 모바일 바 | — | — | Top navigation 5.2, Mobile bar + menu sheet 5.3 | `src/i18n/` |
| 1 | About / 소개 | `about` | About / 소개 | Card 5.14, Hero 5.15, Career trajectory 5.16, Stats table 5.17(숫자 표 4칸), Skills(5.15) | `profile` (taglines[0], about, trajectory, skills). Figures는 `projects`·`patents`·`software`·`teaching`(book) 건수를 빌드 시 계산 |
| 2 | Selected Work / 대표 프로젝트 | `work` | Work / 대표 프로젝트 | Card 5.14, Selected work list 5.18(번호 목록 01–06), Project ledger 5.19(전체 원장 + Domain·Capability 선택 상자 + 모두 보기) | `projects` (대표작: `featured`, `order` 순. 원장: 전체 20건) |
| 3 | Experience / 경력 | `experience` | Experience / 경력 | Card 5.14, Period ledger row 5.22(기간 열 + 단색 로고) | `experience` (6곳) + `public/` 로고 |
| 4 | Teaching · Books · Advisory / 강의 · 저서 · 자문 | `teaching` | Experience / 경력 | Card 5.14, Period ledger row 5.22 (Books · Teaching · Advisory 묶음) | `teaching` (`kind` 순서: book, teaching, advisory) |
| 5 | Awards & Education / 수상 · 학력 | `awards` | Experience / 경력 | Card 5.14, Period ledger row 5.22 (Awards, Education 두 묶음) | `awards`, `education` |
| 6 | Personal Projects / 개인 프로젝트 | `personal` | Personal / 개인 프로젝트 | Card 5.14, Personal projects index 5.20(번호 목록 + 상태 필터 + 저장소·데모 링크) | `personal` |
| 7 | IP & Publications / 지식재산 · 출판물 | `ip` | Publications / 지식재산 · 출판물 | Card 5.14, Index drawer 5.21(유형별 서랍: 특허·프로그램·논문·보고서, 서랍 id `ip-<유형>`) | `patents`, `software`, `publications` |
| 8 | Contact / 연락처 | `contact` | Contact / 연락처 | Card 5.14, Contact 5.23(의뢰 가능 분야 \| 이메일·복사·링크) | `profile` (availability, contact) |
| — | 푸터 | — | — | Footer 5.5 (Colophon 한 줄: ©·최종 수정일·사이트 소스·맨 위로) | 최종 수정일은 빌드 시 `src/content` 마지막 커밋 날짜 |

- 제목 단계: 사이드바 이름이 페이지의 `h1`, 섹션 제목 `h2`, 섹션 안 묶음(예: Books, Awards, Education)·대표작 제목 `h3`.
- 각 섹션은 `<section id aria-labelledby>`. `main`의 id는 `main` (푸터 "맨 위로"와 건너뛰기 링크의 대상).
- 예약 id: 위 8개 앵커, `main`, `side-contact`(사이드바 연락처 목록). 기준안의 사이드바 목록 id `contact`가 Contact 섹션과 충돌하므로 `side-contact`로 바꾼다 (decision-log G6 구현 시 처리).

**탭과 섹션 매핑 규칙** (3.3.2 A 수정안)

| 탭 (en / ko) | 링크 | 현재 표시되는 섹션 |
|---|---|---|
| About / 소개 | `#about` | `about` |
| Work / 대표 프로젝트 | `#work` | `work` |
| Experience / 경력 | `#experience` | `experience`, `teaching`, `awards` |
| Personal / 개인 프로젝트 | `#personal` | `personal` |
| Publications / 지식재산 · 출판물 | `#ip` | `ip` |
| Contact / 연락처 | `#contact` | `contact` |

- 탭 순서와 섹션 순서는 같다. Experience 탭은 Teaching·Awards 구간을 지나는 동안에도 현재 상태를 유지한다 (탭이 덮는 섹션 목록을 마크업에 둔다. 시안은 `data-for="experience teaching awards"`).
- 현재 섹션 판정 (시안 그대로): 상단 메뉴 아래 끝 + 화면 높이 25% 선을 지난 마지막 섹션. 페이지 끝에 닿으면 마지막 섹션(Contact). 탭·앵커를 눌러 이동하면 사용자가 직접 스크롤(wheel, touchstart, keydown)할 때까지 누른 섹션을 유지한다 (짧은 Awards가 다음 섹션에 덮이지 않게).
- 현재 탭: `aria-current="true"` + 미끄러지는 밑줄(5.2, 모션은 3장 Motion).
- 모바일 바의 현재 섹션 이름은 탭 이름이 아니라 **섹션** 이름을 보인다 (예: Teaching 구간에서 "Teaching · Books · Advisory").
- 메뉴 시트: 탭 6개, Experience 아래 하위 링크 3개(Experience, Teaching · Books · Advisory, Awards & Education). 하위 링크는 자기 섹션일 때만 현재 표시.
- 앵커 이동으로 들어온 섹션은 등장 효과를 건너뛴다 (decision-log G6, 3장 Motion).

**영문/국문 차이**
- 구성·순서·앵커 같음. 문구만 다르다 (탭·섹션 이름은 위 표).
- 기간 표기: 영문 `Mar 2024 – Jan 2025`, 국문 `2024.03 – 2025.01`. 현재 진행은 `Present` / `현재`.
- 국문의 서체·행간·자간은 7장.

### 6.3 Case study

**구조** (3.2.3 C 케이스 파일 + 3.3.2 케이스 메뉴)

| 영역 | 내용 | 컴포넌트 (5장) |
|---|---|---|
| 사이드바 (기록표) | ① 작은 프로필(사진·이름·직함, 홈 `#about` 링크) ② 경로: "← Selected Work"(홈 `#work`) + 위치 `01 / 05` ③ 프로젝트 제목 `h1` ④ 기록표: Client, Organization, Period, Role, Stack ⑤ "On this page" 번호 목차 ⑥ 이전·다음 | Case study 5.24 (기록표·목차·이전·다음) |
| 상단 메뉴 | 홈과 같은 탭 6개. 링크는 홈 섹션(`/#about` 등, 국문은 `/ko/#about`). **Work 탭을 현재로 고정** (밑줄 정지, 스크롤과 무관). 오른쪽 끝 EN/KO·테마 | Top navigation 5.2 (케이스 변형) |
| 모바일 바 | 이름 + 현재 **케이스 섹션** 이름. 이름 링크는 홈 `#work` | Mobile bar 5.3 |
| 메뉴 시트 | 첫 줄 "← Selected Work"(홈 `#work`), 이어서 케이스 섹션 목록. 언어·테마 | Menu sheet 5.3 |
| 본문 | 리드 문단(프로젝트 `summary`) + 번호 붙은 섹션 | Case study 5.24 (본문 섹션·아키텍처 표) |
| 본문 끝 | 이전·다음 한 번 더 | Case study 5.24 (이전·다음) |
| 푸터 | 홈과 같은 Colophon [구현 기본값: 시안은 임시 한 줄] | Footer 5.5 |

**기록표 항목** (값이 없는 행은 숨김)

| 키 (en / ko) | 출처 | 비고 |
|---|---|---|
| Client / 고객 | `client` (`public`이면 `name`, 아니면 `label`) | 실명은 승인된 2곳만 (CLAUDE.md 규칙 3) |
| Organization / 소속 | `org` | |
| Period / 기간 | `period` | `planned`이면 배지. 배지 문구는 홈과 같은 "In progress / 진행 중" (decision-log G6의 CV 배지 통일과 같은 기준) |
| Role / 역할 | `lead` | Lead일 때만 "Lead / 총괄". 별도 역할 필드 없음 (G4) |
| Stack / 기술 스택 | `stack` | ` · `로 이음 |

**본문 섹션 순서** (basic-plan 4.4: Context → Problem → My role → Approach & Architecture → Stack → Outcome)

| 번호 | 섹션 (en / ko) | 앵커 id | 출처 | 조건 |
|---|---|---|---|---|
| — | 리드 문단 | — | `summary` | 항상 |
| 01 | Context / 배경 | `context` | `caseStudy.context` | 항상 |
| 02 | Problem / 문제 | `problem` | `caseStudy.problem` | 항상 |
| 03 | My role / 역할 | `role` | `caseStudy.role` | 항상 |
| 04 | Approach / 접근 (+ Key decisions / 주요 결정 표) | `approach` | `caseStudy.approach`, `caseStudy.decisions` | 결정 표는 `decisions`가 있을 때만 |
| 05 | Architecture / 아키텍처 | `arch` | `caseStudy.architecture` (계층 \| 구성 요소 \| 흐름 표) | 있을 때만. 없으면 번호를 당긴다 |
| 06 | Outcome / 성과 | `outcome` | `caseStudy.outcome` | 항상. 진행 중(`present`·`planned`)이면 제목 옆 "In progress / 진행 중" 배지 |

- Stack은 본문 섹션이 아니라 기록표의 Stack 행으로 보인다 (시안 그대로). basic-plan 4.4의 Stack 단계는 이 행이 담당한다.
- 섹션 번호는 화면용 장식(`aria-hidden`), 제목은 `h2`. 결정 표 제목은 `h3`.
- 목차·모바일 바의 현재 섹션 판정: 화면 위 20%~아래 70%를 뺀 띠에 들어온 섹션 (시안 `rootMargin: -20% 0px -70% 0px`).

**이전·다음 순서**
- 목록 = `featured: true` **이고** `caseStudy`가 있는 프로젝트, `order` 오름차순. 홈 대표작 목록(5.18)와 같은 순서에서 케이스가 없는 항목만 빠진다.
- 처음 항목은 "이전" 칸, 마지막 항목은 "다음" 칸을 비워 둔다 (돌아가지 않음).
- 각 칸: "Previous / 이전" 또는 "Next / 다음" + 대상 제목. `rel="prev"`/`rel="next"`.
- 위치 표시 `NN / NN`의 분모도 이 목록 길이다 (현재 `/ 05`).

**케이스 스터디가 없는 대표작** (현재 그린소재 재고 조합 최적화)
- 페이지를 만들지 않는다. 홈 대표작 목록(5.18)에서 제목에 링크·화살표가 없고, 전체 원장에서도 링크가 없다 (G4 함께 정한 것).
- `caseStudy`가 채워지면 다음 빌드에서 페이지·이전·다음·위치 표시에 자동으로 들어간다. 따로 손댈 곳이 없어야 한다.

**영문/국문 차이**
- 같은 slug, 같은 섹션 id. 섹션 이름·기록표 키는 위 표. 언어 전환 시 현재 섹션 앵커 유지 (6.1).

### 6.4 CV

화면 보기 구조만 다룬다. A4 조판, 쪽 나눔, 쪽 하단 글자는 10장.

| 영역 | 내용 |
|---|---|
| 도구 막대 (`role="toolbar"`) | 용지 위 오른쪽 정렬, 버튼 3개: 반대 언어("한국어" / "English", 6.1 규칙으로 반대 언어 CV로 이동), 테마("Theme / 테마"), 인쇄("Print / Save PDF" / "인쇄 / PDF 저장", 포인트 색). 인쇄 시 숨김 |
| 용지 (`main`) | 머리 + 섹션 13개. 화면에서는 테두리 있는 용지 한 장, ≤720px에서 테두리 없이 1열 |
| 머리 (`header`) | 이름 `h1`, 직함 줄(`headline · currentRole`), 연락처 열: 이메일, GitHub 호스트, LinkedIn 호스트, 사이트 주소(영문 `sguys99.github.io`, 국문 `sguys99.github.io/ko/`) |

사이드바·상단 메뉴·모바일 바·푸터 없음. 사진 없음 (3.3.3 A).

**섹션 순서** (333-a 그대로. 각 섹션: 왼쪽 칸 `h2`, 오른쪽 칸 행. 행 제목 `h3`)

| 순서 | en / ko | 출처 | 비고 |
|---|---|---|---|
| 1 | Profile / 소개 | `profile.about` | |
| 2 | Skills / 기술 | `profile.skills` | 키/값 표 |
| 3 | Experience / 경력 | `experience` | |
| 4 | Education / 학력 | `education` | |
| 5 | Selected Projects / 대표 프로젝트 | `projects` (`featured`, `order` 순) | 성과·스택 포함. 진행 중 배지는 "In progress / 진행 중" (시안의 "Planned"를 바꿈, decision-log G6) |
| 6 | Other Projects / 기타 프로젝트 | `projects` (나머지, 시작일 내림차순) | 촘촘한 목록 |
| 7 | Patents / 특허 | `patents` (날짜 내림차순) | 제목 옆 "등록 n · 출원 n". 등록번호 없음 (G6) |
| 8 | Software / 프로그램 등록 | `software` | 등록번호 없음 |
| 9 | Papers / 논문 | `publications` (`paper`) | DOI 링크 |
| 10 | Selected Reports / 주요 보고서 | `publications` (`report`, `featured`) | 끝에 나머지 건수와 사이트 주소 한 줄. 총량 "50+"는 쓰지 않는다 (G4) |
| 11 | Teaching & Advisory / 강의·자문 | `teaching` (book 제외) | |
| 12 | Books / 저서 | `teaching` (book) | `url` 있으면 링크 |
| 13 | Awards / 수상 | `awards` | |

- 기간 열은 연도만 (`2024 – 2025`, 같은 해면 한 번).
- 개인 프로젝트(`personal`)는 싣지 않는다 (시안 그대로).
- `<title>`: `Kwang Myung Yu · CV` / `유광명 · 이력서` (시안 그대로).
- 진입 경로: 시안에 `/cv/` HTML 페이지로 가는 링크가 없다. 사이드바 "Download CV"는 PDF로 연결한다. HTML CV 링크를 둘지는 **미정** (6.12와 함께 결정).

### 6.5 404

3.3.5 A: 사이트 셸을 유지하고 본문에 카드 하나.

| 영역 | 404에서의 모습 |
|---|---|
| 사이드바 | 홈과 같음 (사진, 이름, 연락처, CV). 단 이름은 `h1`이 아닌 일반 문단으로 낮춘다 (아래 제목 단계) |
| 상단 메뉴 | 탭 목록 숨김, 언어·테마 컨트롤만 오른쪽 끝 |
| 모바일 바 | 이름 + 현재 위치 자리에 `404`. 이름 링크는 그 언어의 홈 |
| 본문 카드 | ① `404` (mono, 작은 글자) ② 제목 ③ 설명 한 줄(최대 52ch) ④ 버튼 2개 ⑤ 섹션 바로 가기 목록 |
| 푸터 | 홈과 같은 Colophon |

컴포넌트: Sidebar 5.1, Top navigation 5.2(탭 숨김 상태), Mobile bar + menu sheet 5.3, Card 5.14(404 카드), Buttons 5.6, Footer 5.5.

**문구** (335-a 그대로, 용어집 등록은 5.7)

| 항목 | en | ko |
|---|---|---|
| 제목 | Page not found | 페이지를 찾을 수 없습니다 |
| 설명 | The page you requested does not exist or has moved. | 요청하신 페이지가 없거나 주소가 바뀌었습니다. |
| 주 버튼 → 같은 언어 홈 | Go to home | 홈으로 |
| 보조 버튼 → 반대 언어 홈 (`lang` 속성 표시) | 한국어 홈 | English home |
| 바로 가기 목록 이름 (화면에는 숨김) | Sections | 섹션 바로 가기 |

**섹션 바로 가기**: 01 About `#about`, 02 Selected Work `#work`, 03 Experience `#experience`, 04 IP & Publications `#ip`. 링크는 그 언어의 홈 기준 (`/#ip`, `/ko/#ip`). 시안의 네 번째 항목 `patents`는 G6 이전 이름이므로 `ip`로 바꾼다.

**언어 판별** (decision-log G6 구현 시 처리)
- 경로 기준: `location.pathname`이 `/ko/` 또는 `/ko`로 시작하면 국문, 아니면 영문.
- 404 파일은 영문으로 빌드하고 국문 문구를 함께 넣어 둔다. 인라인 스크립트가 첫 그리기 전에 `<html lang>`, `<title>`, 카드·사이드바·메뉴 문구, 링크 대상을 국문으로 바꾼다 (깜빡임 없게 테마 스크립트와 같은 위치) [구현 기본값].
- JS가 꺼져 있으면 영문 404가 보인다. 보조 버튼으로 국문 홈에 갈 수 있다.
- 언어 전환 컨트롤은 반대 언어 홈으로 간다 (6.1).

**제목 단계** (decision-log G6 구현 시 처리. 시안은 카드 제목이 `h2`, 바로 가기 이름이 `h3`이고 `h1`이 사이드바 이름)
- 카드 제목 = `h1` (페이지 주제가 "페이지 없음"이므로).
- 사이드바 이름 = `p` (같은 스타일 유지).
- 바로 가기 목록 이름 = `h2` (`sr-only`).

**그 밖** [구현 기본값]
- `<title>`: `Page not found · Kwang Myung Yu` / `페이지를 찾을 수 없습니다 · 유광명` (시안 그대로).
- `<meta name="robots" content="noindex">`. canonical·hreflang·JSON-LD 없음.
- 요청 주소는 보여 주지 않는다 (3.3.5 A에 없음).

### 6.6 Head & sharing

모든 페이지의 `<head>` 공통 항목. 구현 단계 5.8.

**title · description**

| 페이지 | `<title>` | `description` |
|---|---|---|
| 홈 | `Kwang Myung Yu · AI Engineer` / `유광명 · AI Engineer` [구현 기본값: `name · headline`] | `profile.taglines[0]` [구현 기본값] |
| 케이스 스터디 | `<프로젝트 제목> · Kwang Myung Yu` / `<프로젝트 제목> · 유광명` (시안 그대로) | 프로젝트 `summary` [구현 기본값] |
| CV | `Kwang Myung Yu · CV` / `유광명 · 이력서` (시안 그대로) | `name · headline · currentRole` [구현 기본값] |
| 404 | 6.5 | 없음 |

- 구분자는 시안이 쓴 ` · ` 하나로 통일.
- 값은 모두 콘텐츠·i18n에서 조합한다. 페이지에 문장을 직접 쓰지 않는다.

**OG · 공유 카드** (3.3.4 D)

| 항목 | 값 |
|---|---|
| 이미지 | 언어별 PNG 2장 (영문·국문), 1200×630. 밝은 바탕에 KM 타일, URL `sguys99.github.io`, 이름·직함·한 줄 소개(`taglines[0]`). 사진 없음. 색은 3장 "자산 고정색" |
| 파일 경로 | `/og-en.png`, `/og-ko.png` [구현 기본값]. 시안 원본 `g4/334/d-og-en.png`, `d-og-ko.png` |
| 사용 | 모든 페이지가 자기 언어 이미지를 쓴다. 케이스 스터디별 이미지는 만들지 않는다 [구현 기본값: 시안이 사이트 공통 카드만 정함] |
| 메타 | `og:title`·`og:description`(= title·description), `og:url`(= canonical), `og:image`(절대 URL), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`(이름 · 직함), `og:type` `website`, `og:site_name` 이름, `og:locale` `en_US` / `ko_KR`, `og:locale:alternate` 반대 언어, `twitter:card` `summary_large_image` [구현 기본값] |
| 생성 | 텍스트가 콘텐츠에서 오므로 이름·직함·한 줄 소개가 바뀌면 다시 만들어야 한다. 빌드 시 생성할지 수동 갱신할지는 5.8에서 정한다 (미정) |

**파비콘 세트** (3.3.4 D, 파일 생성은 5.8)

| 파일 | 크기 | 내용 | `<link>` |
|---|---|---|---|
| `/favicon.svg` | 16 격자 (`viewBox 0 0 16 16`) | 334-d SVG 원본 그대로. 타일 `rx 3.5`, `prefers-color-scheme: dark`에서 타일·글자 반전 (색은 3장 자산 고정색) | `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` |
| `/favicon.ico` | 32 (16 포함 권장) | 라이트 타일. SVG 미지원 브라우저용 | `<link rel="icon" href="/favicon.ico" sizes="32x32">` |
| `/apple-touch-icon.png` | 180×180 | 불투명, 바탕 = 타일색 `#141a22`, 라이트 마크. 다크 버전 없음 (iOS가 모서리를 둥글게 처리). 시안 원본 `g4/334/d-apple-touch-180.png` | `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` |

- 파일 경로는 [구현 기본값] (루트 관례). 브라우저는 사이트의 테마 토글이 아니라 OS 설정을 따라 파비콘을 바꾼다 (SVG 미디어 쿼리 한계).
- `theme-color`, 웹 매니페스트는 시안에 없어 두지 않는다.

**canonical · hreflang** [구현 기본값]

| 페이지 | canonical | alternate |
|---|---|---|
| 홈 | `https://sguys99.github.io/` / `…/ko/` | `hreflang="en"` → 영문, `hreflang="ko"` → 국문, `hreflang="x-default"` → 영문 |
| 케이스 스터디 | `https://sguys99.github.io/work/<slug>/` / `…/ko/work/<slug>/` | 같은 방식 |
| CV | `…/cv/` / `…/ko/cv/` | 같은 방식 |
| 404 | 없음 | 없음 |

- 절대 URL, 끝에 `/`. Astro `site` 값(`https://sguys99.github.io`)으로 만든다.
- 두 언어 페이지는 서로를 가리키고 자기 자신도 포함한다.

**JSON-LD `Person`** [구현 기본값: 필드 선택] — 홈(`/`, `/ko/`)에만 넣는다. 값은 모두 `profile`에서.

| 필드 | 값 |
|---|---|
| `@context` / `@type` | `https://schema.org` / `Person` |
| `name` | 그 페이지 언어의 이름 (`Kwang Myung Yu` / `유광명`) |
| `alternateName` | 반대 언어 이름 |
| `jobTitle` | `headline` (AI Engineer) |
| `worksFor` | `{"@type": "Organization", "name": "GenON"}` |
| `url` | 그 페이지의 canonical |
| `image` | `https://sguys99.github.io/images/profile.jpg` |
| `email` | `mailto:` + `contact.email` |
| `sameAs` | `contact.github`, `contact.linkedin` |

- 전화번호·주소·생년 등 개인정보 필드는 넣지 않는다 (CLAUDE.md 규칙 3).
- `worksFor`의 회사명은 현재 `currentRole` 문자열 안에 있어 따로 뽑을 필드가 없다. 구현 시 `profile`에 필드를 추가할지 상수로 둘지 정한다 (미정, 콘텐츠 스키마 변경이라 사용자 확인).

## 7. Bilingual Typography

영문(`/`)과 국문(`/ko/`)이 무엇이 다르고 왜 다른지를 정한다. 토큰 값은 "3. Tokens > Typography"를 따르고 여기서 반복하지 않는다. 출처: `g4/base.html`의 TYPE ROLES 블록과 `html:lang(ko)` 규칙, `case.html`, `335-a.html`(404), `333-a.html`(CV), `334-d.html`(OG).

원칙 세 가지.

- 국문은 대문자·넓은 자간으로 위계를 만들 수 없다. 그래서 **한 단계 큰 크기 + 굵기**로 대신한다.
- 한글은 글자 면이 꽉 차 있어 같은 크기에서 더 빽빽해 보인다. 그래서 **행간은 넓히고, 큰 제목의 자간은 조금 더 좁힌다**.
- 숫자·날짜는 언어와 관계없이 같은 모양이어야 목록이 정렬된다. 그래서 **메타는 국문에서도 Geist Mono를 유지**한다.

### 서체 적용과 폴백

| 상황 | 렌더 서체 | 근거 |
|---|---|---|
| 영문 페이지 본문·제목의 라틴 글자 | Geist | `--font` 첫 순위 |
| 영문 페이지 안의 한글 (`lang="ko"` 원제 `.it .og`) | Pretendard | 요소에 `--font-ko` 지정 |
| 영문 페이지에서 `lang` 없이 섞인 한글 | Pretendard (폴백) | Geist에 한글 없음 → `--font` 둘째 순위 |
| 국문 페이지의 한글 | Pretendard | `--font-ko` |
| 국문 페이지의 영문 단어·숫자 (본문·제목) | **Pretendard의 라틴 글리프** (Geist 아님) | `--font-ko`에 Geist가 없다. 한 줄 안에서 굵기·x높이가 어긋나지 않게 하려는 의도 |
| 메타 (`--font-meta`)의 숫자·라틴 | Geist Mono (두 언어 모두) | 정렬·인상 유지 |
| 메타 안의 한글 (`현재`, `총괄`, `진행 중`, 국문 푸터) | Pretendard Variable (폴백) | Geist Mono에 한글 없음 → `--font-meta` 둘째 순위. 크기·굵기는 메타 규칙 그대로 |
| 웹폰트 로드 전·실패 | `system-ui` → Apple SD Gothic Neo 등 | 각 체인 뒤쪽 |

**국문에서 서체가 바뀌는 요소와 유지되는 요소** (시안 기준)

| 국문에서 `--font-ko`로 바꿈 (단어 라벨) | 국문에서도 `--font-meta` 유지 (숫자·날짜·짧은 표식) |
|---|---|
| `.sec-head h2`, `.eyebrow`, `.out .k`, `.sel-k`, `.sel-mark`, `.pl-cap`, `.fig .s`, `.yg .yh`, CV `.sec > h2`·`.row .meta`·`.note` | `.sec-head .meta`, `.traj .yrs`, `.proj-meta .num`, `.row .when`, `.pl-y`, `.idx`, `.badge`, `footer`, `.mono`, `.it .mt a`(DOI) |

규칙: 요소의 내용이 **단어**면 국문에서 `--font-ko`, **숫자·날짜·기호**면 `--font-meta`를 유지한다.
- [확인] `.yg .yh`는 연도 숫자만 담는데(`b.y`) 국문에서 Pretendard로 바뀐다. 위 규칙대로면 Geist Mono 유지가 맞다. 구현 시 유지로 두고 시안과 비교한다.

### 역할별 영/국 비교

토큰 이름으로 적는다. "같음"은 국문에서 따로 덮어쓰지 않는다는 뜻.

| 역할 (선택자) | 영문: 서체 / 크기 / 굵기 / 행간 / 자간 | 국문에서 바뀌는 것 | 이유 |
|---|---|---|---|
| 이름 `.name` | `--font-display` / `--fs-xl` (모바일 `--fs-lg`) / `--fw-name` / 1.25 / `--ls-name` | 서체만 (`--font-display` → `--font-ko`) | 세 글자 이름이라 조정 불필요 |
| 한 줄 소개 `.tagline`, 404 `.nf h2.ttl` | `--font-display` / `--fs-2xl` (모바일 `--fs-xl`) / `--fw-tagline` / `--lh-tagline` / `--ls-tagline`, `max-width: 30ch` | `--fw-tagline-ko` / `--lh-tagline-ko` / `--ls-tagline-ko`, `max-width: 24ch` | 한글 500은 큰 크기에서 가늘어 보임. 줄이 붙어 보여 행간을 넓힘. 한글 1ch가 넓어 폭 제한을 줄임 |
| 프로젝트 제목 `.proj h3` | `--font-display` / `--fs-lg` / `--fw-title` / `--lh-title` / `--ls-title` | `--ls-title-ko` | 한글 제목의 느슨함 보정 |
| 케이스 제목 `.cs-title` | `--font-display` / `--fs-xl` / `--fw-title` / 1.28 / `--ls-title` | 행간 1.4, `--ls-title-ko` | 두 줄로 넘어가는 국문 제목 대비 |
| 케이스 본문 제목 `.d-sec h2` | 상속 / `--fs-lg` / `--fw-title` / 1.4 / `--ls-title` | `--ls-title-ko` | 〃 |
| 섹션 제목 `.sec-head h2`, `.eyebrow` | `--font-meta` / `--fs-xs` / `--fw-eyebrow` / 상속 / `--ls-eyebrow`, 대문자 | `--font-ko` / `--fs-sm` / `--fw-strong` / `--ls-eyebrow-ko`, 변환 없음 | 대문자 위계를 크기·굵기로 대체 |
| 본문 `body` | `--font` / `--fs-md` / 400 / `--lh-body` / `--ls-body` | `--font-ko` / `--lh-body-ko` / `--ls-body-ko`, `word-break: keep-all` | 한글 가독 행간, 어절 단위 줄바꿈 |
| 보조 본문 (요약·설명) | 상속 / `--fs-sm` / 400 / 상속 / 상속 | 행간·자간만 body에서 상속 | 따로 덮어쓰지 않음 |
| 메타 (날짜·번호·건수·푸터) | `--font-meta` / `--fs-xs` / 400 / 상속 / 0 | 같음 (한글만 Pretendard 폴백) | 숫자 정렬 유지 |
| 배지 `.badge` | `--font-meta` / `--fs-2xs` / `--fw-medium` / 상속 / 0 | 같음 (`총괄`, `진행 중` 등 한글은 폴백) | 〃 |
| 키 라벨 (사이드바 `.k`, `.lg-label`, `.rec dt`) | 상속 / `--fs-2xs` / `--fw-strong` / 상속 / `--ls-label`, 대문자 | `--fs-xs` / `--ls-label-ko`, 변환 없음 | 11px 한글은 너무 작음 |
| 케이스 소제목 `.d-sec h3` | 상속 / `--fs-xs` / `--fw-strong` / 상속 / `--ls-label`, 대문자 | `--fs-sm` / `--ls-label-ko` | 〃 |
| 선택 키 (`.sel-k`, `.out .k`, `.sel-mark`) | `--font-meta` / `--fs-2xs` / 상속 / 상속 / `--ls-eyebrow`, 대문자 | `--font-ko` / `--fs-xs` / `--ls-eyebrow-ko` | 〃 |
| 표 머리 `.tbl th`, 모바일 `td[data-l]::before` | 상속 / `--fs-2xs` / `--fw-medium`(th) / 상속 / 0.08em → `--ls-eyebrow`로 정리, 대문자 | `--fs-xs` / 0 | 〃. 0.08em은 `.out .k`와 같은 이유로 정리 대상 |

정리 대상(토큰 후보): `.cs-title` 행간 1.28과 국문 1.4, `.d-sec h2` 1.4가 반복되면 `--lh-row` 또는 `--lh-tagline-ko`와 합칠지 구현 시 확인. CV(333-a)의 국문 조정(`--cv-lh-ko`, 기본 크기, `.sec > h2` 0.86em)은 "3. Tokens > Print (CV)"를 따른다.

### 줄바꿈

| 대상 | 규칙 | 이유 |
|---|---|---|
| 국문 페이지 `body` | `word-break: keep-all; overflow-wrap: anywhere;` | 어절 중간에서 끊지 않음. 긴 영문·URL만 넘칠 때 끊어 360px 가로 스크롤 방지 |
| 영문 페이지의 국문 원제 `.it .og` (`lang="ko"`) | `word-break: keep-all` | 같은 이유 |
| 이메일 `.mail`, DOI 링크 `.it .mt a` (두 언어) | `overflow-wrap: anywhere` | 긴 문자열이 칸을 넘지 않게 |
| 한 줄 소개 `.tagline` (두 언어), `.cs-title`, OG `.tg` | `text-wrap: balance` | G2 결정: 영문 모바일 외톨이 줄 처리. 줄 길이를 고르게 |
| 기간·연도·건수 칸 (`.pl-y`, `.pl-cap` 데스크톱) | `white-space: nowrap` | `2024.03 – 2025.08`이 중간에서 끊기지 않게 |
| 본문 문단 (`.about`, `.desc`, `.sum`) | `text-wrap: pretty` | 마지막 줄 한 단어 방지 (시안에 없던 보완. 미지원 브라우저는 무시) |

`overflow-wrap: anywhere`는 최소 폭 계산에도 들어가므로 grid 칸이 좁아질 수 있다. 칸은 `minmax(0, 1fr)`을 유지한다.

### 대문자 라벨의 국문 처리

| 항목 | 영문 | 국문 |
|---|---|---|
| `text-transform` | `uppercase` | **`none`** (명시) |
| 자간 | `--ls-eyebrow`(0.06em) 또는 `--ls-label`(0.1em) | 각각 `--ls-eyebrow-ko`(0), `--ls-label-ko`(0.02em) |
| 크기 | `--fs-2xs` / `--fs-xs` | 한 단계 위 `--fs-xs` / `--fs-sm` |
| 서체 | 일부 `--font-meta` | `--font-ko` |

- **시안 버그**: base는 국문에서 `text-transform`을 풀지 않는다. 국문 사이드바 키 `GitHub`, `LinkedIn`이 `GITHUB`, `LINKEDIN`으로 보인다. 구현 시 대문자 라벨 선택자마다 `html:lang(ko) … { text-transform: none; }`를 둔다.

### 숫자

| 대상 | 처리 |
|---|---|
| `.num` (기간, 원장 연도, 번호 01–06, 섹션 건수, 필터 건수), `.mono`, 숫자 표 `.fig .n` | `font-variant-numeric: tabular-nums` |
| 그 밖의 본문 숫자 | 기본(비례 숫자) |

- `--font-meta`는 고정폭이라 tnum이 사실상 의미 없다. 실제 효과가 있는 곳은 비례 서체인 `.fig .n`(`--font-display`)과 필터 버튼 건수다.
- **시안 버그**: `body { font-feature-settings: "tnum" 0; }`가 상속되어 자식의 `font-variant-numeric: tabular-nums`를 덮는다(`font-feature-settings`가 나중에 적용됨). 구현에서는 body의 이 선언을 뺀다. 기본값이 이미 비례 숫자라 잃는 것 없음.
- 카운트업(331-c) 중에도 tnum이라 숫자 폭이 흔들리지 않는다.

### 구두점·기호

| 기호 | 용법 | 예 |
|---|---|---|
| en dash `–` 앞뒤 공백 | 기간 (두 언어 같음, glossary 9.1) | `Mar 2024 – Aug 2025` / `2024.03 – 2025.08`, `Jul 2026 – Present` / `2026.07 – 현재`, 궤적 `2023 – 2026` |
| en dash `–` 공백 없음 | 쪽 범위 | `pp. 107–114` |
| 가운뎃점 `·` 붙임 | 한 라벨 안의 병렬 (국문, glossary 9.5) | `에너지·유틸리티`, `제어·최적화` |
| 가운뎃점 ` · ` 앞뒤 공백 | 독립 항목 구분 (두 언어) | 메타 `조직 · 고객`, `등록 n · 출원 n`, 탭 `지식재산 · 출판물`, 섹션 `Teaching · Books · Advisory`, 문서 제목 `이름 · 직함` |
| 쉼표 | 국문 나열 | `RAG, 에이전트, Text-to-SQL` |

- **연도 범위 표기**: 모든 곳에서 glossary 9.1의 `2015 – 2022`(en dash 앞뒤 공백)로 통일한다. 시안의 원장 `yrs()`, IP 서랍 `yearSpan()`, CV `--cv-date` 주석은 공백 없이 `2015–2022`로 만들고 있어 구현할 때 고친다.
- 국문 날짜 월은 두 자리(`2024.03`), 영문은 세 글자 약어(마침표 없음).

### 국문 페이지의 영문 표기

glossary를 따른다. 국문 페이지에서도 영문으로 두는 것:

- 대표 직함 `AI Engineer`, 직함 `Director` (glossary 1, 3)
- 회사·조직명 `GenON`, `Digital & AI`, `PwC` 등 glossary 2에 영문으로 적힌 것
- 약어·제품·라이브러리 (`RAG`, `LLM`, `VLA`, `PyTorch` 등, glossary 5.1)
- 영문 원제 (논문, 저널명, glossary 9.3)

렌더링: 이 영문은 `lang="en"`을 달지 않는다. 주변 국문과 같은 Pretendard로 그려 한 줄의 굵기가 맞게 한다. 영문 약어와 한글 사이는 띄운다(`RAG 기반`).

### `:lang()` 적용 방식

| 대상 | 방식 |
|---|---|
| 페이지 언어 | 레이아웃이 `<html lang="en">` / `<html lang="ko">`를 둔다. 404는 경로(`/ko/`)로 판별 (decision-log G6) |
| 국문 차이 규칙 | `html:lang(ko) .선택자 { … }`로 덮어쓴다. 기본 규칙은 영문 |
| `--font-display` | `:root`에서 `var(--font)`, `html:lang(ko)`에서 `var(--font-ko)`로 교체 |
| 페이지 안 다른 언어 조각 | 요소에 `lang` 속성: 국문 원제 `<span class="og" lang="ko">`, 언어 버튼 `EN`/`KO`에 각자 `lang` |

- **시안 버그**: base의 `:lang(ko) body, :lang(ko) { font-family: var(--font-ko); }`는 국문 페이지의 **모든 요소**에 (0,1,0) 명시도로 서체를 직접 건다. 이보다 앞에 있거나 명시도가 낮은 `--font-meta` 지정(예: 요소 선택자만 쓴 규칙)이 조용히 무시된다. 구현은 `html:lang(ko) body { font-family: var(--font-ko); }`로 상속시키고, 영문 페이지의 한글 조각은 `[lang="ko"] { font-family: var(--font-ko); }`로 따로 잡는다.

### 웹폰트 로딩

**필요한 굵기** (선택 시안 8개에서 수집. 700 이상 없음)

| 패밀리 | 굵기 | 쓰는 곳 |
|---|---|---|
| Geist | 400, 500, 600 | 본문, 메타 강조·탭·배지·한 줄 소개, 이름·제목·키 라벨 |
| Geist Mono | 400, 500 | 메타, 배지·연도 머리·eyebrow. **600 없음** → `--font-meta`에 600을 쓰지 않는다 (3장) |
| Pretendard Variable | 400, 500, 600 (가변 1파일) | 국문 전체. 600은 국문 한 줄 소개·섹션 제목·행 제목 |

**시안의 로딩**: Google Fonts CSS(`display=swap`) + jsDelivr `pretendard@v1.3.9` variable dynamic subset. 구현은 셀프 호스팅(tasks 5.2).

| 항목 | 방침 |
|---|---|
| `font-display` | 세 패밀리 모두 `swap` (시안과 같음). 폴백이 바로 보이고 교체 시 흔들림은 아래 미정 항목으로 줄인다 |
| 프리로드 | 영문 페이지는 Geist 가변(또는 400) 1개만 `preload`. 국문 페이지는 프리로드 없음 (분할 파일 중 어느 것이 필요한지 미리 알 수 없음) |
| 국문 서브셋 | 5.2에서 결정. 후보: (a) Pretendard 배포본의 dynamic subset(유니코드 범위별 분할 파일 그대로 셀프 호스팅), (b) 빌드 시 사이트 텍스트에서 쓰인 글자만 추출한 단일 서브셋. 정적 사이트라 (b)가 작지만 콘텐츠 수정마다 재생성이 필요 |
| 라틴 서브셋 | 5.2에서 결정. Geist·Geist Mono는 Latin만 필요 |
| 폴백 메트릭 보정 (`size-adjust` 등) | 5.2에서 결정 |
| 라이선스 | Geist·Geist Mono·Pretendard 모두 SIL OFL로 알려져 있음. 5.2에서 배포본 라이선스 파일로 확인하고 함께 둔다 |
| 인쇄(CV) | `@page` 여백 상자는 웹폰트·변수를 못 쓸 수 있어 333-a가 서체명을 직접 적었다. 셀프 호스팅 후 같은 이름으로 해석되는지 5.2에서 확인 |
