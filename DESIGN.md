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
| `--fs-xl` | 1.375 | 22 | 사이드바 이름, 서랍 건수, 케이스 제목, 메뉴 시트 항목, 모바일 한 줄 소개 |
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
