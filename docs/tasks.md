# tasks.md — 상세 작업 계획서

`basic-plan.md`(무엇을, 왜)와 `CLAUDE.md`(어떻게)를 실행 단위로 풀어 쓴 문서입니다.
작업을 끝내면 `[x]`로 바꾸고, 새로 생긴 작업은 해당 단계에 추가합니다.

## 표기

| 표기 | 뜻 |
|---|---|
| `[ ]` / `[x]` | 미완료 / 완료 |
| **[시안]** | 디자인 결정. 시안 2~3개를 제시하고 선택받은 뒤 진행 (CLAUDE.md 규칙 1) |
| **[확인]** | 사용자의 검토·승인·답변이 있어야 다음으로 넘어감 |
| **[자료]** | 사용자가 제공할 자료가 필요함 |

## 진행 현황

| 단계 | 내용 | 상태 |
|---|---|---|
| 0 | 저장소와 개발 환경 준비 | 완료 |
| 1 | 콘텐츠 작성 (영문 → 국문) | 작성 완료, 사용자 검토·자료 대기 (1.2.11, 1.3.2, 1.5.2~1.5.3 그린소재, 1.5.6) |
| 2 | 디자인 콘셉트 선정 (G1) | 완료 (A + 상단 메뉴 + 중앙 정렬) |
| 3 | 세부 디자인 (G2~G6) | 완료 |
| 4 | DESIGN.md 작성 | 완료 |
| 5 | 구현: 기반 | 완료 |
| 6 | 구현: 섹션과 페이지 | 다음 작업 |
| 7 | 검수 | 대기 |
| 8 | 배포와 공개 | 대기 |
| 9 | 운영 준비 | 대기 |

## 사용자에게 필요한 것

한 번에 전체 공개하기로 했으므로, 아래 자료가 늦어지면 공개도 그만큼 늦어집니다.

| 필요한 것 | 필요한 시점 | 받기 전 처리 |
|---|---|---|
| 색·분위기 선호, 좋아하는 다른 사이트 (basic-plan 10.3) | 단계 2 시작 전 | 답이 없으면 시안에서 폭넓게 제시 |
| 대표 프로젝트 5~6건 확정 | 단계 1.5 | 임시 선정안(basic-plan 5.6)으로 진행 |
| 대표 프로젝트별 상세 내용 (문제, 접근, 성과) | 단계 1.5 | 케이스 스터디 작성 불가 |
| 개인 프로젝트 목록과 설명 | 단계 1.5 | 섹션 틀만 준비 |
| GoatCounter 계정 생성, GitHub Pages 설정 | 단계 8 | 안내에 따라 직접 진행 |

---

## 단계 0. 저장소와 개발 환경 준비

- [x] 0.1 `sguys99/sguys99.github.io` 저장소를 받아 비어 있는지 확인 (origin과 동기화, 사이트 코드 없음, 문서·사진만 존재)
- [x] 0.2 ~~`dev` 브랜치 생성~~ 취소: `master`에서 작업, 브랜치는 사용자가 필요할 때 생성
- [x] 0.3 문서 배치: `CLAUDE.md`는 루트, `basic-plan.md`·`tasks.md`는 `docs/`, 원본 자료는 `docs/private/`(gitignore)
- [x] 0.4 Node LTS 확인 후 Astro 프로젝트 초기화 (최소 템플릿, TypeScript strict) — Node 24 LTS(`.nvmrc`), Astro 7.4.7
- [x] 0.5 CLAUDE.md의 디렉터리 구조 생성
- [x] 0.6 `astro.config`에 사이트 주소와 i18n 설정 (`en` 기본, `ko`는 `/ko/`) — `trailingSlash: always`, 빈 `/`·`/ko/` 페이지
- [x] 0.7 `.gitignore`(Astro용으로 교체 완료), 코드 포맷 설정(Prettier) 추가 — `npm run format` / `format:check`
- [x] 0.8 `npm run dev / build / preview` 동작 확인, CLAUDE.md의 명령어와 다르면 수정 — format 명령 추가, 링크 검사는 7.7로 명시
- [x] 0.9 첫 커밋 — 작업 단위별 커밋으로 대체 (f91afcc~)

**완료 기준**: 빈 영문·국문 페이지가 로컬에서 열리고 빌드가 통과한다.

---

## 단계 1. 콘텐츠 작성

실제 문장이 있어야 시안이 정확해지므로 디자인보다 먼저 합니다. 영문이 원본입니다.

### 1.1 준비
- [x] 1.1.1 `docs/glossary.md` 작성: 회사명, 직함, 기술 용어, 익명 고객사 표기 문구의 영문/국문 — 기관 영문명 12건 [확인 필요]는 1.2.11 검토에서 확인
- [x] 1.1.2 콘텐츠 스키마 정의: 영문·국문 필수, 기간, 역할, domain, capability, featured, `client.public` — `src/content.config.ts`, 단일 파일 컬렉션은 id 키 맵 형식
- [x] 1.1.3 실명 필드는 `client.public: true`인 항목에만 존재하도록 스키마로 강제 — 실명은 허용 목록(Samsung Electronics, LOTTE Fine Chemical)만 통과
- [x] 1.1.4 **[확인]** 이력서 확인 사항 질문 (basic-plan 5.4): 기간 겹침, 특허 등록번호 `10-140515`, 프로그램 등록 2건의 현재 상태, "16년" 기준 — 기간 이력서 그대로, 번호 숨김, pending 표기, 연수 표기 안 함, 지아이비타 소속명 표기

### 1.2 영문 작성
- [x] 1.2.1 Profile: About 문단, 기술 스택 군별 요약
- [x] 1.2.2 경력 궤적 4단계 문안 (Control & Automation → Data Science & ML → Generative AI & Agents → Physical AI)
- [x] 1.2.3 한 줄 소개 후보 3개 정리 (선택은 G3) — B안은 연수 표기를 빼고 수정
- [x] 1.2.4 Experience 6곳: 직함, 기간, 역할 2~3줄 (Awards·Education도 함께 작성. GPA·교육 이수 2건은 스키마에 자리가 없어 미포함, 1.2.11에서 확인)
- [x] 1.2.5 Projects 18건: 한 줄 요약, 핵심 2~3줄, 스택, 분류 태그, Lead 여부 — featured는 1.5.1 선정 후 지정
- [x] 1.2.6 Patents 15건(등록 7, 출원 8), Software 10건: 영문 제목 + 원제
- [x] 1.2.7 Publications: 논문 3편, 보고서 대표작 선정안 — 보고서 19건 중 6건 featured 제안
- [x] 1.2.8 Teaching · Books · Advisory, Awards, Education
- [x] 1.2.9 Contact 문안: 의뢰 가능 분야 포함 (`profile.yaml`의 availability)
- [x] 1.2.10 외부 링크 수집: 논문, 저서 출판사 페이지, 강의 관련 페이지 (논문 DOI 3, 저서 링크 2. 강의 페이지는 확인 가능한 공개 페이지 없음)
- [ ] 1.2.11 **[확인]** 영문 전체 검토 — 검토본 전달 완료, 사용자가 나중에 검토하기로 함 (수정 시 국문까지 함께 반영)

### 1.3 국문 작성
- [x] 1.3.1 영문 구조에 맞춰 국문 작성 (이력서 원문 기반) — 명사형 종결로 통일, 국문에만 있던 이력서 사실은 영문에 복원
- [ ] 1.3.2 **[확인]** 국문 전체 검토

### 1.4 점검
- [x] 1.4.1 실명 표기 3건 외 모든 고객사가 익명인지 확인 — 실명은 삼성전자·롯데정밀화학(승인 범위)만, `src/`에 이니셜 없음
- [x] 1.4.2 전화번호, 이력서에 없는 소속·구간이 들어가지 않았는지 확인
- [x] 1.4.3 빌드에서 스키마 검증 통과
- [x] 1.4.4 YAML 문법 오류 시 해당 컬렉션이 빈 채로 빌드가 통과하는 문제 막기 — file 로더가 오류를 기록하면 빌드 실패 (캐시된 옛 데이터로 통과하던 문제 포함)

### 1.5 사용자 자료가 필요한 콘텐츠
- [x] 1.5.1 **[자료]** 대표 프로젝트 5~6건 지정 — 지정 받음: GenP, 도슨트 휴머노이드, 삼성전자 SCM, 삼성전자 상담·추천 어시스턴트, 롯데정밀화학 원자재 가격 예측, 롯데정밀화학 그린소재 재고 조합 최적화 (롯데 PoC 2건은 별도 항목으로 추가, 프로젝트 18 → 20)
- [ ] 1.5.2 **[확인]** 대표 프로젝트별 질문 (배경, 문제, 본인 역할, 접근, 성과, 공개 가능 범위). 자료에 없는 수치는 만들지 않음
  - 답변(2026-11-09): SCM SQL 정확도 "95% 이상 달성" 표기 / SCM 모델은 경력기술서 기준(Text-to-SQL Qwen 8B 파인튜닝 + 생성 Llama 3.1 70B) / 공개 범위: 성과 수치와 개념 아키텍처는 싣고, 고객 내부 용어·인프라 사양·운영 정책은 일반화 / 그린소재 재고 조합 최적화는 자료 대기(자리만) / GenP·도슨트는 진행 중이라 성과 없이 작성
- [ ] 1.5.3 케이스 스터디 영문·국문 작성 (Context → Problem → My role → Approach & Architecture → Stack → Outcome) — 5건 작성(`caseStudy` 필드), 그린소재 재고 조합 최적화만 자료 대기
- [x] 1.5.4 케이스 스터디용 개념 아키텍처 다이어그램 초안 (기밀이 아닌 수준) — 그림이 아닌 데이터(layers/flows)로 작성, 그리는 방식은 G4 시안에서 결정
- [x] 1.5.5 **[자료]** 개인 프로젝트 목록 수령 후 영문·국문 작성 — 공개 저장소 README 기준 초안 8건 (승인은 1.5.6)
- [ ] 1.5.6 **[확인]** 케이스 스터디, 개인 프로젝트 문안 검토 — 사실 확인 3건 모두 맞음(2026-11-09), 개인 프로젝트 oathkeeper·lunchmate 추가와 데모 링크 3건 추가 요청. 문안 전체 검토는 1.2.11·1.3.2와 함께 나중에. 개인 프로젝트 `in-progress` 국문은 "진행 중"으로 통일(사용자 결정 2026-11-11, DESIGN.md 11.8)

**완료 기준**: 모든 콘텐츠가 `src/content/`에 영문·국문으로 있고 사용자 검토를 마쳤다. (1.5는 자료 수령 시점에 따라 단계 2~4와 병행 가능)

---

## 단계 2. 디자인 콘셉트 선정 (G1)

- [x] 2.1 **[확인]** 색·분위기 선호와 참고하고 싶은 다른 사이트 질문 — 시안별로 폭넓게, 기본 테마는 시스템 설정 따름, 참고 사이트 없음, 검토는 로컬 비교 페이지 + claude.ai 비공개 링크
- [x] 2.2 콘셉트 시안 3종 제작: A. Quiet Dossier / B. Editorial Dossier / C. Blueprint Dossier
  - 공통 골격: 고정 사이드바 + 카드형 섹션 + 타이포 위계
  - 범위: 사이드바, About, Selected Work, Experience, 고밀도 목록 1개 (실제 영문 콘텐츠 사용)
  - 결과: `docs/design-drafts/g1/{a,b,c}.html`, 콘텐츠는 `src/content`에서 생성한 `content.js`(`node docs/design-drafts/export-content.mjs <폴더>`)
- [x] 2.3 시안별로 데스크톱/모바일, 라이트/다크, 영문/국문 화면 준비 — `?theme=`·`?lang=` 파라미터와 화면 내 전환, 비교 페이지 `g1/index.html`(1440/390 폭), 스크린샷 `g1/shots/`
- [x] 2.4 **[시안]** 시안별 의도와 장단점을 붙여 제시 → 선택 또는 조합 — 참고 사이트 반영안 A′(`a2.html`), A + 상단 메뉴(`a3.html`) 추가 제작 후 "A + 상단 메뉴 + A′의 중앙 정렬"로 확정
- [x] 2.5 선택 결과를 Decision Log 초안에 기록, 시안을 `docs/design-drafts/g1/`에 보관 — `docs/design-drafts/decision-log.md` (4.8에서 DESIGN.md로 이전)

**완료 기준**: 콘셉트 하나(또는 조합)가 확정되었다.

---

## 단계 3. 세부 디자인 (G2~G6)

검토 횟수를 줄이기 위해 6개 결정 지점을 3회로 묶어 제시합니다. 모든 항목은 2~3안으로 제시합니다.

### 3.1 1차 검토: 기본 인상 (G2 + G3)
시안: `docs/design-drafts/g2/` (비교 페이지 `g2/index.html`, 저장소 루트에서 서버를 띄워 열기). 선택 결과는 `decision-log.md`의 G2 + G3.
- [x] 3.1.1 **[시안]** 서체 조합: 영문 제목·본문·메타 + 국문 서체, 타입 스케일 — A. Geist + Geist Mono + Pretendard
- [x] 3.1.2 **[시안]** 색 체계: 라이트/다크 팔레트, 포인트 색 (대비 4.5:1 검증 포함) — A. Slate Ink
- [x] 3.1.3 **[시안]** 사이드바 구성: 사진, 이름, 직함, 소속, 연락처, 언어·테마 전환의 배치 — C. Dossier Record
- [x] 3.1.4 **[시안]** 한 줄 소개 문구 선택 (후보 3개를 실제 화면에 적용) — A. "from control rooms to humanoid robots" (About 첫 문장과의 중복은 1.2.11에서 조정)
- [x] 3.1.5 **[시안]** 경력 궤적 4단계의 시각화 방식 — 새 시안 3개 미채택, G1 기준안의 가로 타임라인 유지
- [x] 3.1.6 **[시안]** 모바일에서 사이드바를 전환하는 방식 — C. 얇은 바 + 메뉴 시트, 언어 버튼만 바에 노출
- [x] 3.1.7 프로필 사진 적용 (`public/images/profile.jpg` 수령 완료) (라이트/다크에서 확인, 필요하면 보정 방향 제안) — 흑백이라 팔레트와 충돌 없음, 크롭 유지. 다크에서만 CSS 보정(`brightness(0.86)` + 진한 테두리), 원본 수정 없음. 공통 기준안 `docs/design-drafts/g2/base.html`(G1 확정안 = a3 + 중앙 정렬)

### 3.2 2차 검토: 콘텐츠 표현 (G4 + G5)
시안: `docs/design-drafts/g3/` (비교 페이지 `g3/index.html`). 선택 결과는 `decision-log.md`의 G4 + G5.
- [x] 3.2.1 **[시안]** 대표작(Selected Work) 카드 형태 — A. 번호 매긴 목록
- [x] 3.2.2 **[시안]** 전체 프로젝트 목록과 필터 (Domain, Capability) — B. 대표작 아래 원장 (대표 행 왼쪽 선 삭제)
- [x] 3.2.3 **[시안]** 케이스 스터디 상세 페이지 레이아웃 — C. 케이스 파일
- [x] 3.2.4 **[시안]** Personal Projects 표현 (회사 프로젝트와 구분되는 형태) — B. 번호 목록
- [x] 3.2.5 **[시안]** 고밀도 목록: 특허, 프로그램, 논문, 보고서의 접힘·그룹 방식 — B. 색인 서랍
- [x] 3.2.6 **[시안]** Experience, Teaching · Books, Awards 항목 행 형태 — A. 기간 원장
- [x] 3.2.7 **[시안]** 회사·기관 표기: 텍스트 / 이니셜 배지 / 로고 — C. 경력 6곳 단색 공식 로고 (고객사 로고 없음)
- [x] 3.2.8 **[시안]** Contact 섹션(의뢰 가능 분야 포함)과 About 숫자 요약 (단계 3 목록에서 빠져 있어 추가) — A. 숫자 표 + 2단 Contact

### 3.3 3차 검토: 마감 (G6 + 부가 요소)
시안: `docs/design-drafts/g4/` (비교 페이지 `g4/index.html`, 확정 수정안 `332-a2`, `334-d`). 선택 결과는 `decision-log.md`의 G6.
- [x] 3.3.1 **[시안]** 모션: 등장 효과 강도, 호버, 테마·언어 전환 — C. 표현적 (행 순차 등장, 궤적 선 그리기, 숫자 카운트업, reduced-motion 시 끔)
- [x] 3.3.2 **[시안]** 상단 내비게이션과 현재 위치 표시 (G1에서 구조 확정: 본문 위 고정 메뉴 + 밑줄 + 오른쪽 끝 언어·테마 전환. 여기서는 세부 형태만) — A 수정안: 탭 About · Work · Experience · Personal · Publications · Contact, 미끄러지는 밑줄. 섹션 순서 변경(basic-plan 4.1 반영)
- [x] 3.3.3 **[시안]** 인쇄용 CV(`/cv`) 조판 — A. 장부형 4쪽 (라벨 겹침·기간 줄바꿈 수정)
- [x] 3.3.4 **[시안]** 파비콘(이니셜 모노그램)과 OG 공유 이미지 — D. KM 타일 (사용자 지정 모노그램)
- [x] 3.3.5 **[시안]** 404 페이지, 푸터 — A. 콜로폰 한 줄 푸터 + 사이드바 유지 404

**완료 기준**: 모든 결정이 Decision Log에 기록되었고 시안이 `docs/design-drafts/`에 보관되었다.

---

## 단계 4. DESIGN.md 작성

- [x] 4.1 Brand & Tone, Principles — Do/Don't, UI 문구 어조 포함
- [x] 4.2 Tokens: color(라이트/다크), type, spacing, radius, motion — 대비비 실측, 직접 쓴 값 토큰화·단계 정리(사용자 승인), z-index·CV 토큰 포함
- [x] 4.3 Layout & Breakpoints — 와이어프레임, 브레이크포인트 표, 앵커 오프셋. 하단 여백 2건은 4.10에서 확인
- [x] 4.4 Components: 컴포넌트별 구조, 상태(hover, focus, active), 반응형 동작 — 24개(5.1~5.24), 콘텐츠 출처 필드·접근성·모션 포함. genon 로고 PNG 처리는 4.10에서 확인
- [x] 4.5 Page Templates: 홈, 케이스 스터디, CV, 404 — 라우트 표, 섹션·앵커·탭 매핑, head·OG·hreflang·JSON-LD. CV 링크 위치·PDF 경로는 4.10에서 확인
- [x] 4.6 Bilingual Typography: 언어별 서체, 행간, 자간 조정값 — 역할별 영/국 비교, 줄바꿈, 연도 범위 표기 통일, 웹폰트 방침(세부는 5.2)
- [x] 4.7 Dark Mode, Accessibility, Print — 테마 결정 순서·깜빡임 방지, WCAG 2.2 AA 항목별 규칙, CV 조판·PDF 관계
- [x] 4.8 Decision Log: Gate별 시안, 선택, 이유 (`docs/design-drafts/decision-log.md` 초안 이전) — 11장, 단계 4 결정 추가, 이관 항목 추적표로 통합. 초안 파일은 안내만 남김
- [x] 4.9 `src/styles/tokens.css`를 DESIGN.md의 토큰과 일치하게 생성 — 134개 + 다크 2블록 + 인쇄 덮어쓰기. 문서 표와 대조 스크립트로 불일치 0건 확인. 브레이크포인트별 값은 5.3에서
- [x] 4.10 **[확인]** DESIGN.md 검토 — 사용자 승인(2026-11-11), [구현 기본값] 포함. 검토 전 결정 4건 반영(모션 세션 첫 방문만, GenON 로고 마스크, 대표 배지 통일, 하단 여백 정리). 남은 결정 8건은 11.6에 해당 tasks 번호로 이관

**완료 기준**: DESIGN.md만 보고 구현할 수 있고, 이후 구현 작업은 모두 이 문서를 따른다.

---

## 단계 5. 구현: 기반

각 작업의 공통 완료 기준: DESIGN.md의 해당 명세와 일치하고, 토큰 변수만 사용하며, 빌드가 통과한다.

- [x] 5.1 전역 스타일과 리셋, 토큰 적용 — `src/styles/global.css` + `src/layouts/Base.astro`(lang·title, head 슬롯). 국문은 body 상속(`html:lang(ko) body`), `.sr-only`는 감싼 요소를 `:where(:has(> .sr-only))`로 기준 요소화. 360px 가로 스크롤 없음. `::selection`은 명세에 없어 브라우저 기본 유지
- [x] 5.2 웹폰트 셀프 호스팅 (국문 서브셋 분할, 라이선스 확인, `font-display` 설정) — `src/styles/fonts.css` + `public/fonts/`. Geist·Geist Mono는 Latin·사용 굵기로 잘라 각 약 24KB, Pretendard는 배포본 dynamic subset 그대로. 전부 `swap`, 영문만 Geist 프리로드, Geist 폴백 메트릭 보정(`Geist Fallback`). 라이선스 OFL 1.1 파일 동봉. Astro Fonts API는 패밀리 이름 해시화로 미채택
- [x] 5.3 기본 레이아웃: 사이드바 + 본문, 모바일 전환 — `src/layouts/Page.astro`(본문 바로가기, `.shell`, `main#main`) + `src/components/`(Sidebar, Topbar, MenuSheet, Icon, Home) + `src/i18n/ui.ts`(최소 UI 문구, 5.7에서 확장). 홈은 섹션 8개 빈 카드. 시트는 네이티브 `<dialog>`(Esc·backdrop·링크 클릭 닫힘, 861px 이상이면 닫힘, 열린 동안 스크롤 잠금). 탭(5.4)·언어/테마 토글(5.5, 5.6)·푸터(5.9)·이메일 복사(5.10)는 자리만. 모바일 언어 버튼은 상대 언어 홈으로 가는 임시 링크. 360px 가로 스크롤 없음(시트 열림 포함)
- [x] 5.4 상단 내비게이션, 앵커 스크롤, 현재 위치 표시 — `Topbar.astro`에 탭 6개 + 미끄러지는 `.ink`(`--m-nav` `--ease-out`, 첫 배치는 transition 없이) + 위치 기반 scroll-spy(판정선 바 아래 + 25%, 페이지 끝은 Contact, 탭·시트 클릭 후 손 스크롤 전까지 고정). 탭·시트 링크 `aria-current`, 모바일 바는 섹션 이름 표시. 케이스 변형은 `current` prop(홈 앵커 링크 + 고정 표시)만. DOM 순서를 내비게이션 먼저로 바꾸고 그리드 자리 지정으로 배치 유지(`.col` 제거, 11.7 사용자 결정). 시트 링크가 앵커 스크롤을 취소하던 5.3 버그 수정. 앵커 오프셋: 카드 위 = 바 아래 23px(데스크톱·모바일). JS 없으면 탭은 앵커, 막대 없음. 11.6 '상단 메뉴 흔적'은 반투명 바 뒤 본문으로 확인
- [x] 5.5 테마 전환: 시스템 설정 따름 + 수동 전환 기억, 로딩 시 깜빡임 없음 — `Base.astro` head 맨 앞(charset 다음) `is:inline` 스크립트가 `localStorage.theme`(`light`/`dark`만, try/catch)을 `data-theme`에 넣음. 저장값 없으면 속성 없이 OS 설정을 따르고 OS 변경도 실시간 반영. `ThemeToggle.astro`(달/해 아이콘, `aria-pressed`, View Transitions `--m-theme` 크로스페이드 + `m-notx`, 모션 줄이기·미지원 시 즉시)를 데스크톱 `.controls`와 시트 테마 줄에 배치. 아이콘 표시 규칙은 두 다크 조건에 나란히. 언어 세그먼트 `LangSwitch.astro`(`.seg`, 링크 + `aria-current`)도 두 곳에 배치, 링크는 상대 언어 홈(5.6에서 같은 위치로). Playwright 확인: 모듈 스크립트를 빼고 인라인만 남겨도 저장값(OS 반대)대로 첫 페인트 배경·아이콘 일치, 로드 시 테마 관련 transition 0건, 저장 차단 시 오류 없음, 360px 가로 스크롤 없음
- [x] 5.5.1 861~약 900px 영문에서 탭 6개 + `.controls`가 겨우 들어감(Contact와 언어 세그먼트 사이 약 5px, 탭 목록이 nav 폭을 약 11px 넘음). 탭 간격·바 패딩 조정 여부 결정 필요(3.3.2 "한 줄에 들어가게") — 사용자 결정 "좁은 폭에서만 간격 축소"(11.7). `Topbar.astro` ≤1000px 탭 간격 `--sp-4`→`--sp-3`, 1001px 이상 그대로. 바 패딩은 탭·컨트롤 끝과 카드 끝 정렬을 지키려고 유지(탭 간격만으로 충분). Playwright 861/880/900/930/960/1000/1001/1100/1101/1440px 영·국: 탭 목록 넘침 없음, 마지막 탭↔언어 세그먼트 최소 25px(영문 861)·31px(국문 861), 가로 스크롤 없음
- [x] 5.6 언어 전환: 같은 위치의 반대 언어 페이지로 이동 — `src/i18n/ui.ts` `langPath(path, to)`(`/x/` ↔ `/ko/x/`, 404는 그 언어 홈, 5.8 hreflang에서 재사용)로 세 곳(데스크톱·시트 세그먼트, 모바일 바 언어 버튼)의 `href`를 빌드 시 반대 언어 같은 경로로. 반대 언어 링크에 `data-lang-alt`, 홈 scroll-spy가 현재 섹션을 `hash`로 붙임(주소창 hash 아님, 페이지 맨 위면 없음). JS 없으면 반대 언어 페이지 맨 위. 덤: 시트를 닫을 때 메뉴 버튼 포커스 복귀가 sticky 바 때문에 페이지를 약 400px 위로 올리던 문제 수정(`focus({ preventScroll: true })`). Playwright 확인: 세 컨트롤 모두 `/#experience` ↔ `/ko/#experience` 이동·`lang`·도착 섹션 일치, 스크롤만 한 경우 spy 섹션(`#ip`), 맨 위는 앵커 없음, JS 끔 → `/ko/`·`/`, 360px 가로 스크롤 없음
- [x] 5.7 UI 문구 번역 파일 (`src/i18n/`) — Domain·Capability 태그 국문 표기 포함 (콘텐츠에는 영문 값만 있음, 용어집에 추가) — `src/i18n/ui.ts`에 사이트 전체 UI 문구(5장 컴포넌트, 6장 케이스·CV·404, 9장 보조 기술·알림)를 `{ en, ko }` 사전으로 모음. `{n}` 같은 자리는 `t(lang, key, vars)`가 채움. 태그는 `tag(lang, value)`(영문은 콘텐츠 값 그대로, 국문은 용어집 6절), 이를 위해 `content.config.ts`의 `DOMAINS`·`CAPABILITIES`를 export. 빌드는 타입 검사를 안 하므로 값 누락·빈 값·en/ko 자리 불일치·태그 국문 누락이면 모듈 로드 시 오류로 빌드 실패(확인함). `astro check`는 의존성 추가가 필요해 쓰지 않음. 용어집 7절을 절별로 재정리하고 "Show all" 국문을 DESIGN.md대로 "모두 보기"로 고침. 개인 프로젝트 `in-progress` 국문은 5.20 값 "개발 중"에 `TODO(1.5.6)`
- [x] 5.8 공통 head: 메타, OG, canonical, `hreflang`, `Person` JSON-LD, 파비콘 — `src/components/Head.astro`(Base `head` 슬롯: description, canonical·hreflang en/ko/x-default·`og:url`, OG·`twitter:card`, 파비콘 링크, 홈만 JSON-LD `Person`. 404는 `canonical={false}`로 생략). 홈 `<title>` = `이름 · 직함`, description = `taglines[0]`. `worksFor`는 `experience`의 `status: present` 항목 회사명(GenON). OG는 명함 A에서 현 소속 줄을 빼고 직함을 선 아래로 옮겨 다시 렌더(`public/og-en.png`·`og-ko.png`, 라이트, 수동 갱신 `docs/design-drafts/og/render.mjs --site`, 명령은 DESIGN.md 6.6). 파비콘 `favicon.svg`(334-d 그대로)·`favicon.ico`(16+32)·`apple-touch-icon.png`(180). 확인: 빌드 후 `dist/index.html`·`dist/ko/index.html` head 검사(JSON-LD 파싱, hreflang 쌍, og:image 절대 URL), 자산 7개 200. 케이스 스터디·CV·404 연결은 각 페이지 작업(6.x, 7.x)에서
- [x] 5.9 푸터: 최종 수정일 자동 표기 — `src/components/Footer.astro`(335-a 콜로폰: © 연도·이름, 최종 수정 `<time>`, 사이트 소스, 맨 위로 → `#main`). 날짜는 빌드 시 `git log -1 --format=%cs -- src/content`, 실패 시 빌드 날짜로 대체. 1440/1100/390/360 × 라이트/다크 × en/ko 확인
- [x] 5.10 공통 컴포넌트: 카드, 항목 행, 태그, 배지, 접힘, 버튼·링크 — `src/components/`에 Card(+ 등장 모션), SectionHead, Tags(`tag()` 국문), Badge(lead·selected·in-progress·placeholder), Status(`.status`·`.st` 점), ExtLink, ChipLink(`sr-only` 프로젝트 이름), CopyButton(클립보드 → 실패 시 textarea, 1800ms, 라이브 영역, JS 없으면 숨김), Disclosure(`<details>` + chev), ToggleAll(앞 N행 + 모두 보기/접기, JS 없으면 전체 표시·버튼 숨김), Select(`.sel`, `.on` 모양만), Logo, LedgerRow·LedgerGroup(5.22 공통 행). Icon에 arrow·back·ext·chev·copy·ok와 `size`(xs/sm/lg) 추가. `.btn`·`.btn.pri`·`.linkish`와 등장 모션 CSS(`.m-wait`/`.m-in`, 5.14 대상 행 `--i` 0~7, 인쇄 강제 완성)는 `global.css`. 등장 모션: 첫 화면 아래 카드만 `m-wait`, `IntersectionObserver`(-8%)로 1회, 앵커·탭 클릭과 해시 로드 시 대상 카드와 그 위 카드 즉시 완성, 세션 플래그 `sessionStorage.motion-played`(`src/scripts/motion.ts`, 6.1 궤적·카운트업도 이 값을 씀), 모션 줄이기면 없음. 로고: 시안 SVG 5개를 채움 `currentColor`로 정리(semco·kepco는 휘도 마스크 유지, id 접두어), genon PNG는 `mask-image` — `src/assets/logos/`(SOURCES.txt 승인 문구 갱신). Home·Sidebar의 임시 `.card`·`.sec-head`·`.badge` 스타일을 공통 컴포넌트로 교체. 임시 쇼케이스(커밋 안 함)로 1440/360 × 라이트/다크 × en/ko, hover·키보드 포커스·서랍 열림·모두 보기·복사됨·JS 끔 확인, 홈 1440/390/360 회귀 없음, 360px 가로 스크롤 없음. 복사 버튼은 명세상 Contact(5.23)에만 있어 사이드바에는 넣지 않음(질문 남김)

**완료 기준**: 빈 섹션으로 구성된 홈이 영문/국문, 라이트/다크, 데스크톱/모바일에서 명세대로 보인다.

---

## 단계 6. 구현: 섹션과 페이지

- [x] 6.1 About: 소개, 경력 궤적, 숫자 요약 — `src/components/About.astro`(Home에 끼움): 한 줄 소개·About 문단, 4단계 궤적(마지막 `aria-current="step"`, 세션 첫 방문만 선 그리기, 마지막 점 `animationend`에서 `m-draw` 제거, ≤1100 2열·≤560 세로), 숫자 표 4칸(프로젝트·특허·프로그램·저서 건수와 보조줄을 빌드 시 콘텐츠에서 셈, 연수 없음, 보이는 숫자 `aria-hidden` + `.sr-only` 최종값, 세션 첫 방문만 카운트업, 모션 줄이기·JS 없음·재방문은 최종값, 인쇄 시 완성), 역량 표. 구현 기본값 3건은 DESIGN.md 11.8. 1440/1000/390/360 × 라이트/다크 × en/ko 확인, 360px 가로 스크롤 없음, 콘솔 오류 없음. 맨 위에서 현재 탭이 About으로 잡힘(6.17 메모 해소, Topbar 수정 불필요)
- [x] 6.2 Selected Work: 대표작 카드, 케이스 스터디 링크 — `src/components/SelectedWork.astro`(Home에 끼움): 섹션 머리 `6 / 20 projects`, `featured`·`order` 순 01–06 번호 목록, 소속 로고(이름은 `aria-label`) · 고객, 기간(`fmtPeriod`, ui.ts), 진행 중(`present`·`planned`)은 상태 점 + 성과 줄 없음, 완료 건은 `caseStudy.outcome[0]`, 태그. `caseStudy`가 있는 5건만 제목 링크 `/work/<slug>/`·`/ko/work/<slug>/` + 화살표 + 행 hover(링크는 6.10 전까지 404), 그린소재 재고 조합 최적화는 링크·화살표·hover 없음. 구현 기본값 4건은 DESIGN.md 11.8. 1440/390/360 × 라이트/다크 × en/ko, 360px 가로 스크롤 없음, 콘솔 오류 없음, 포커스 링, JS 꺼짐 6행 확인
- [x] 6.3 Experience — `src/components/Experience.astro`(Home에 끼움): 섹션 머리 `6 organizations` / `6 곳`(`orgCount`), `LedgerRow` 6행(기간 `fmtPeriod`, `status: present`면 `cur`, `experience` 키 = 로고 키라 `logo={id}`), 제목 `org`·직함 `.lg-sub`(경력만 `--accent` `--fw-medium`)·`summary`. 데이터 로더가 키 순(알파벳)으로 돌려줘 `period.start` 내림차순으로 정렬. pwc 로고 그림이 위쪽 16/53이 비어 글자보다 2.5–3.4px 낮던 것을 `Logo.astro` 로고별 `dy`(자기 높이의 −12%, `translate`)로 보정(배율 그대로, 대표작 메타·≤560 경력 칸 모두 잉크 중심 = 글자 중심 0.0px). 구현 기본값 2건은 DESIGN.md 11.8. 1440/390/360 × 라이트/다크 × en/ko, 360px 가로 스크롤 없음, 콘솔 오류 없음
- [x] 6.4 Projects: 전체 목록, 접힘, Domain/Capability 필터 — `src/components/ProjectLedger.astro`(`SelectedWork.astro`의 `</ol>` 뒤, 같은 카드): 20행 `period.start` 내림차순(같으면 slug), 연도 `fmtYears`(ui.ts, `2024 – 2025`·`2026 – Present`), 제목 + Lead·Selected 배지, `org · 고객`(글자), Domain/Capability. `Select` 2개(항목 건수 = 다른 상자 값과 겹친 수, 0건 `disabled`, 고르면 `.on`), `.linkish` 필터 해제(→ Domain 상자 포커스), `role="status"` 결과 줄, `.pl-none`. `ToggleAll`은 `data-out` 행을 빼고 세며 `rows-change` 이벤트로 접힘 복귀(`detail.all`이면 맞는 행 전부·버튼 숨김) — 6.5도 이 이벤트를 쓰면 됨. JS 없음: 20행 모두, 도구·상태·버튼 숨김. 연도 열 `--col-year-wide` 88→104px 등 구현 기본값 5건 DESIGN.md 11.8. 1440/390/360 × 라이트/다크 × en/ko, 360px 가로 스크롤 없음, 콘솔 오류 없음, 키보드(선택→Tab→해제 Enter→모두 보기 Enter) 확인, 렌더 결과 실명 고객은 Samsung Electronics·LOTTE Fine Chemical만
- [x] 6.5 Personal Projects — `src/components/PersonalProjects.astro`(Home에서 `personal` 자리): 10행 번호 목록, 정렬 `active` → `in-progress` → `archived`(같은 상태는 파일 이름순), 이름 + 상태(`Status`), 요약, 스택(` / `), `ChipLink` 저장소·데모(데모는 `demo` 있는 6건만, sr-only 이름 `Repository: AI Wiki`, 같은 탭 `rel=noopener`). 머리 오른쪽 `github.com/sguys99` 링크(`profile.contact.github`). 상태 필터 `.seg`(`aria-pressed`, 건수 1 이상만), 바꾸면 `data-out` + 01부터 다시 번호 + `rows-change`로 접힘 복귀(처음 5행), 포커스는 누른 버튼. JS 없음: 10행 모두, 필터·버튼 숨김. 구현 기본값 5건 DESIGN.md 11.8(≤560 필터 간격, 국문 상태 `--font-ko` 등). 1440/390/360 × 라이트/다크 × en/ko, 360px 가로 스크롤 없음, 콘솔 오류 없음, 키보드(모두 보기 Enter → 필터 Enter/Shift+Tab) 확인
- [x] 6.6 IP: Patents, Software, Publications, Reports — `src/components/IpIndex.astro`(Home `ip` 자리): 머리 `47 records` / `총 47건`, `Disclosure` 서랍 4개(`#ip-pat`·`#ip-sw`·`#ip-paper`·`#ip-report`, 유형·건수·내역·연도 범위), 열면 연도별 목록(`h3` 연도, 미등록 SW는 맨 위 "Pending / 등록 진행 중"). 특허 상태는 번호 유무로 Filed / Filing in progress, **번호는 렌더하지 않음**(빌드 결과에서 콘텐츠의 번호 21개(특허 13·SW 8) 모두 0건 확인). 영문 페이지만 국문 원제 `.og`, 논문 저자 본인 이름 굵게(3건 형식 모두), DOI 링크, 보고서 `featured` 6건 `Badge selected`. "50+" 없음, 실명 고객은 보고서 1건 LOTTE Fine Chemical(롯데정밀화학)만. DOI 없이 `url`만 있는 논문은 콘텐츠에 없어 11.6 그대로. 구현 기본값 6건 DESIGN.md 11.8. 1440/390/360 × 라이트/다크 × en/ko(닫힘·모두 열림), 360px 가로 스크롤 없음, 콘솔 오류 없음, 키보드 Enter/Space 열고 닫기·안쪽 포커스 링, JS 꺼짐에서 닫힌 채 시작·클릭으로 열림 확인
- [x] 6.7 Teaching · Books · Advisory — `Teaching.astro`: `LedgerGroup`(book → teaching → advisory) + `LedgerRow`, 저서 `url`은 `ExtLink`, `details[]`는 `.dl-list`. 행 정렬은 `years`의 마지막 연도 → 첫 연도 내림차순 → id (5.22). 머리 건수 `Books 2 · Teaching 6 · Advisory 2`. scroll-spy는 기존 `TABS` covers로 Experience 탭 유지 확인. 1440/390/360 × 라이트/다크 × en/ko, 가로 스크롤·콘솔 오류 없음
- [x] 6.8 Awards & Education — `Awards.astro`: 한 카드(`#awards`)에 `LedgerGroup` 두 개(Awards 4 → Education 2) + `LedgerRow`. Awards는 Teaching과 같은 `years` 정렬, Education은 `period.start` 내림차순(`fmtPeriod`). 섹션 머리 건수 없음(5.14 표). GPA·교육 이수는 스키마에 없어 미포함. scroll-spy: Awards 구간·`#awards` 진입 시 Experience 탭 + 시트 하위 링크 Awards & Education 현재, Personal 진입 시 Personal, 페이지 끝 Contact 확인(1440×900/1400, 390). 1440/390/360 × 라이트/다크 × en/ko, 가로 스크롤·콘솔 오류 없음
- [x] 6.9 Contact: 이메일(mailto), GitHub, LinkedIn, 의뢰 가능 분야 — `Contact.astro`: 2단(의뢰 가능 분야 01–05 | 이메일·`CopyButton`·GitHub·LinkedIn), `.mail`·`.links a`·`.eyebrow`는 컴포넌트 안. 모든 섹션이 채워져 `Home.astro`는 섹션을 순서대로 나열(빈 카드 분기 삭제). 복사(허용·권한 거부 시 textarea 대체 + 포커스 복귀), "Copied"·라이브 알림 1.8초 뒤 복귀, JS 꺼짐 버튼 숨김·mailto 동작, 페이지 끝 Contact 탭(1440×900/1400, 390), 마지막 카드→푸터 32px, 1440/390/360 × 라이트/다크 × en/ko 가로 스크롤·콘솔 오류 없음
- [x] 6.10 케이스 스터디 템플릿과 페이지 (`/work/<slug>/`) — 목차 scroll-spy가 `[data-lang-alt]` 링크의 `hash`도 현재 절로 갱신해야 함 (6.1, 5.6) — `CaseStudy.astro`(기록표 사이드바·번호 문서·결정 표·아키텍처 표) + `CasePager.astro`, 라우트 `src/pages/work/[slug].astro`·`ko/work/[slug].astro`(`caseList()`: `featured` + `caseStudy`, `order` 순 5건 × en/ko, 그린소재 없음). `Page`에 `current`·`sidebar` 슬롯·`sheet` 링크, `Topbar`는 케이스에서 탭을 spy에서 빼고 Work 고정, 홈 spy를 판정선 20%로 재사용(목차·시트·모바일 바·언어 링크 hash), `MenuSheet` `links`(← 대표 프로젝트 + 절). head는 `Head` 재사용(제목 · 이름, `summary`, canonical·hreflang). 11.6 두 건 해결(행간 토큰 병합, `.flow` 넘침 → 대상만 nowrap + 칸 폭 container query로 쌓인 표), 사이드바 280px 경계 ≤1100 등 구현 기본값 8건 11.8. 360–1440px 13개 폭 × en/ko × 5건 카드·가로 넘침 0, 1440/900/390/360 × 라이트/다크 스크린샷, 콘솔 오류 없음, 홈 링크 → 케이스 → `← Selected Work`(`/#work`)·탭 복귀, 목차 클릭·스크롤·페이지 끝 Outcome, 언어 전환 `#problem` 유지, 키보드 순서, JS 꺼짐(탭 Work 표시·앵커·이전/다음) 확인. 홈 spy 회귀 없음
- [x] 6.11 인쇄용 CV 페이지 (`/cv/`, `/ko/cv/`): A4 조판, 페이지 나눔 — `src/components/Cv.astro`(Base 직접, 사이드바·메뉴·푸터 없음, 사이트 링크 없음) + `src/pages/cv.astro`·`ko/cv.astro`: 도구 막대(반대 언어 링크, `ThemeToggle` 글자 모드, 인쇄 버튼은 JS 있을 때만), 머리, 섹션 13개(333-a 순서, 연도만, 등록번호·"50+" 없음, 진행 중 배지), `@page` A4 여백·하단 이름/쪽 번호(`counter(pages)`, 하단 왼쪽 글자는 라우트별 인라인). 구현 기본값 8건 DESIGN.md 11.8(라벨 `break-after` 제거, 인쇄 팔레트 선택자 버그 수정 등). 1440/390/360 × 라이트/다크 × en/ko 가로 스크롤 0·콘솔 오류 없음, Playwright `page.pdf` A4로 영·국 각 4쪽, 쪽 번호 n / 4, 라벨만 남는 쪽 끝·행 쪼개짐 없음 확인
- [x] 6.12 PDF 자동 생성: 빌드 후 CV 페이지를 영문/국문 PDF로 출력, 다운로드 링크 연결 — devDependency `playwright` 추가, `scripts/cv-pdf.mjs`(`dist/`를 `node:http`로 띄워 `/cv/`·`/ko/cv/`를 `page.pdf` A4·`preferCSSPageSize`·배경 없음·라이트로 출력), `npm run build` = `astro build && node scripts/cv-pdf.mjs`. 파일 `/cv/kwang-myung-yu-cv.pdf`·`/ko/cv/yu-kwang-myung-cv-ko.pdf`(`dist/`에만, 경로는 `src/cv-pdf.mjs`). 사이드바 Download CV → 현재 언어 PDF(`download`), Placeholder 배지 제거. 활성 모양은 임시, 시안 A·B·C `docs/design-drafts/g5/cv-button/` 사용자 선택 대기(DESIGN.md 11.8). 깨끗한 빌드로 영·국 각 4쪽(약 210KB·730KB), Title 메타 확인(Author 없음), 링크 200·국문 페이지는 국문 PDF, 키보드 포커스, 360px 가로 스크롤 없음, `git status`에 PDF 없음. **후속(2026-11-11)**: 사이드바 B안 + 현재 소속 행 제거, 시트 CV 링크(사용자 결정) — 기록표 Email·GitHub·LinkedIn·CV(`CV │ Download PDF ↓`, `aria-label` "Download CV (PDF)"), 모바일 소속 줄(`.role`)도 제거, 메뉴 시트 연락처 끝에 "Download CV (PDF)"(현재 언어 PDF, `download`; 404·케이스 시트에도 나옴). `ui.ts` `now`·`placeholder` 키와 `Badge` `placeholder` 종류 삭제, DESIGN.md 5.1·5.3·6.2·9장·11.6·11.8, 용어집 7.3. 확인: 홈·404 1440/390/360 × 라이트/다크 × en/ko, 값 열 왼쪽 끝 4행 모두 188px(키 열 64px 안에 LinkedIn 맞음), 시트 CV 200 `application/pdf`, 키보드 순서(탭 → 토글 → 이메일 → GitHub → LinkedIn → CV → 본문), 가로 스크롤 0
- [x] 6.13 404 페이지 — `src/pages/404.astro` → `dist/404.html` 하나(국문 404 파일 없음). `NotFound.astro`(335-a 카드: 코드·h1 제목·설명 52ch·주/보조 버튼·sr-only h2 + 섹션 바로 가기 01–04 `/#ip`·`/ko/#ip`), `Card`에 `as="article"`, `Topbar` `notFound`(탭 `nav` 없음, 토글 오른쪽 끝, 모바일 바 `이름 / 404` → 그 언어 홈, spy 없음). `Page.astro` = `Base` + 새 `Shell.astro`로 나누고 404는 영문 셸 + 국문 셸 `<template>`을 경로 `/ko`로 바꿔 끼움(첫 그리기 전 `lang`·`title`, JS 꺼짐은 영문). `Head` `canonical={false}`. 구현 기본값 3건 DESIGN.md 11.8. 확인: preview(4400, 없는 주소 404 응답 + 404.html)에서 `/nope/`·`/ko/nope/`·`/ko/work/old/` 1440/390/360 × 라이트/다크, 가로 스크롤 0, 콘솔 오류 없음, 키보드 순서(건너뛰기 → 언어 → 테마 → 사이드바 → 버튼 → 바로 가기), 테마 토글·메뉴 시트 열고 닫기(국문 교체 후에도 동작), JS 꺼짐 영문, 홈·케이스 회귀 없음. ~~**남음**: 사이드바 이름이 404에서도 `h1`(h1 두 개)~~ → 해소(2026-11-11): `Sidebar` `nameTag?: 'h1' | 'p'`(기본 h1), `Shell.astro`가 404면 `'p'`. 404 영·국 모두 h1 1개(카드 제목) 확인
- [x] 6.14 국문 라우트 전체 (`/ko/…`)가 영문과 같은 구성인지 확인 — 빌드 결과 7쌍(홈, CV, 케이스 스터디 5)과 PDF 2개, 404를 일회성 스크립트로 비교. id·제목 단계·섹션별 행/링크/이미지 수, lang·title·description·canonical·hreflang(x-default)·og:locale/url/image, 언어 전환 대상, 내부 링크의 언어 경계 모두 일치. 고칠 것 없음. ui.ts 영문 문구가 국문 페이지에 섞인 경우 없음(의심 항목은 기술명 "Next.js"와 수상명 "Best People Awards"뿐). 영문 페이지에만 Geist 폰트 preload가 있는 것은 의도된 차이로 봄
- [x] 6.15 이미지 최적화 (프로필 사진, 프로젝트 이미지: AVIF/WebP, 크기별 제공) — 프로젝트 이미지는 없음. 사진 원본을 `src/assets/profile.jpg`로 복사하고 `Sidebar`(132/64px, `widths`·`sizes`, eager·`fetchpriority=high`)와 `CaseStudy` `.who`(28px 정사각, 1x–3x)를 `astro:assets` `<Picture>`(AVIF·WebP·JPEG 폴백, `width`/`height`)로, genon 로고 마스크는 `getImage` 320px. `public/images/profile.jpg`는 JSON-LD용으로 유지. 첫 화면 사진 204KB → AVIF 4.6KB(데스크톱 2x)·1.5KB(모바일 2x)·0.6KB(케이스), 로고 11.4→6.5KB. 구현 기본값 3건 DESIGN.md 11.8. 홈·케이스 en/ko 1440/390/360 × 라이트/다크에서 응답 `image/avif`, 표시 132×165·64×80·28×28, 다크 `brightness(0.86)`, CLS 0, 가로 스크롤·콘솔 오류 없음
- [x] 6.16 sitemap, robots.txt — 의존성 없이 `src/pages/sitemap.xml.ts`·`robots.txt.ts` 엔드포인트. 홈 + `caseList()` × en/ko = 12 URL, 각각 en/ko/x-default `xhtml:link`(Head와 같은 `langPath`), `lastmod`는 푸터와 같은 git 날짜(`Footer.astro`에서 `contentDate()`로 꺼내 공유, 실패 시 생략). CV(HTML)·PDF·404 제외, CV `noindex`는 걸지 않음(DESIGN.md 11.8에 2건 기록, 6.11 행 갱신). `xmllint` 통과, 모든 loc·href가 `dist/`에 존재, 케이스 head hreflang과 일치, robots.txt `Sitemap: https://sguys99.github.io/sitemap.xml`
- [ ] 6.17 **[확인]** 로컬 미리보기로 중간 검토
  - ~~국문 고정폭 글자의 넓은 공백: 배지 "진행 중", 푸터 "최종 수정" (6.5·6.10은 `--font-ko`로 처리, 공통 컴포넌트는 미처리. 6.10 보고)~~ → 해소(2026-11-11): 홈·케이스 5건·CV·404 국문 DOM 전수 조사, 한글 단어를 담은 고정폭 요소 8종을 `global.css` 공통 규칙 하나(`html:lang(ko) :is(.badge, .st, .chip-lnk, .pn-k, .foot, .pl-status, .flow, .yh.word)`)로 `--font-ko`, 개별 규칙 4건 흡수. 남은 고정폭 한글은 숫자에 붙은 `현재`·`건`·`곳`뿐(7장 규칙대로 유지). DESIGN.md 7장 표·11.8
  - 6.10이 명세 값을 바꾼 2건 사용자 확인: 케이스 사이드바 폭 경계 ≤1000→≤1100, 아키텍처 표 쌓기 기준을 뷰포트 → 칸 폭(container query). 승인되면 DESIGN.md 4장·5.24 본문 반영
  - ~~콘텐츠가 들어간 뒤 scroll-spy 초기 판정(맨 위에서 About이 아닌 Work로 잡힘, 5.5 보고)과 페이지 끝 Contact 규칙 재확인~~ → 6.1·6.9에서 확인, 2026-11-11 재확인: en/ko × 1440×900·1440×1400·390×844에서 맨 위 About/소개, 맨 끝 Contact/연락처(탭·모바일 바)
  - 마감 점검(2026-11-11): 홈·케이스·CV·404 × 1440/1100/900/390/360 × 라이트/다크 × en/ko 가로 스크롤 0·콘솔 오류 없음, 다크 대비 최소 5.71:1. 고침: 본문 `text-wrap: pretty` 누락(명세 위반)·제목 외톨이 단어 `balance`, 기술 스택 이름 중간 줄바꿈·줄 첫머리 구분자(DESIGN.md 11.8). 사용자 결정 대기: 국문 가운뎃점(`·`) 앞뒤 줄바꿈, 강의·저서·자문 제목과 그룹 순서 불일치, 직함 구분자 영 ` / `·국 ` · `, IP 서랍 내역과 숫자 표 보조줄의 서체 차이, 404 바로 가기 번호 칸 140px, `6 / 20 건`·`6 곳`의 고정폭 공백

**완료 기준**: 모든 섹션과 페이지가 실제 콘텐츠로 채워져 있고 두 언어에서 동작한다.

---

## 단계 7. 검수

- [ ] 7.1 반응형: 360 / 768 / 1024 / 1440px, 가로 스크롤 없음
- [ ] 7.2 조합 확인: 라이트/다크 × 영문/국문 × 주요 페이지
- [ ] 7.3 접근성: 키보드 탐색, 포커스 표시, 대비, 대체 텍스트, 제목 구조, `lang` 속성
- [ ] 7.4 `prefers-reduced-motion`에서 모션이 꺼지는지 확인
- [ ] 7.5 성능: Lighthouse 성능/접근성/SEO 95 이상, 초기 전송량 확인
- [ ] 7.6 브라우저: Chrome, Safari, Firefox, 모바일 Safari·Chrome
- [ ] 7.7 링크 검사: 내부 앵커, 외부 링크, 언어 전환 경로
- [ ] 7.8 교정: 영문 문법·표기 일관성, 국문 맞춤법, 용어집과 일치
- [ ] 7.9 기밀 점검: 저장소 전체에서 실명 3건 외 고객사명, 전화번호 검색
- [ ] 7.10 PDF 확인: 영문/국문 CV의 내용과 조판
- [ ] 7.11 인쇄 확인, 링크 공유 미리보기(OG) 확인
- [ ] 7.12 사실 대조: 사이트의 기간·건수·직함이 원본 자료와 일치하는지 확인
- [ ] 7.13 **[확인]** 최종 검토와 공개 승인

**완료 기준**: 위 항목이 모두 통과했고 사용자가 공개를 승인했다.

---

## 단계 8. 배포와 공개

- [ ] 8.1 GitHub Actions 워크플로 작성: 빌드 → PDF 생성 → Pages 배포 (`master` 대상) — `actions/checkout`에 `fetch-depth: 0` 필요 (얕은 복제면 푸터 최종 수정일이 매 배포 날짜로 바뀜, 5.9). `npm run build`가 PDF까지 만드므로 빌드 전에 `npx playwright install --with-deps chromium` 필요(6.12)
- [ ] 8.2 **[확인]** 저장소 Settings → Pages의 Source를 GitHub Actions로 설정 (사용자가 직접)
- [ ] 8.3 **[확인]** GoatCounter 계정 생성 후 사이트 코드 전달 (사용자가 직접), 집계 스크립트 적용
- [ ] 8.4 README 작성, 라이선스 표기 결정 (코드와 콘텐츠의 권리 범위) **[확인]**
- [ ] 8.5 **[확인]** `master` push 승인
- [ ] 8.6 배포 확인: `https://sguys99.github.io`, `/ko/`, 케이스 스터디, CV PDF, 404
- [ ] 8.7 공개 후 확인: 실제 주소에서 OG 미리보기, `hreflang`, sitemap, 집계 동작 — sitemap: `/robots.txt`·`/sitemap.xml` 응답 확인 후 Google Search Console에 사이트 등록·sitemap 제출(사용자 계정 필요), 색인 범위에 `/cv/`가 잡히는지 확인
- [ ] 8.8 (선택) Google Search Console 등록, GitHub·LinkedIn 프로필에 주소 추가 (사용자가 직접)

**완료 기준**: 실제 주소에서 사이트 전체가 정상 동작한다.

---

## 단계 9. 운영 준비

- [ ] 9.1 CLAUDE.md에 갱신 절차 추가: 경력·프로젝트·특허를 추가할 때 수정할 파일과 확인 순서
- [ ] 9.2 콘텐츠 추가용 명령 작성 (`.claude/commands/`): 예) 프로젝트 추가 시 영문·국문·분류·익명 여부를 차례로 묻고 파일 생성
- [ ] 9.3 `tasks.md`를 운영용 체크리스트로 정리 (완료된 단계는 접고, 이후 개선 항목을 "Backlog"로)
- [ ] 9.4 basic-plan.md의 [가정] 항목을 실제 결과에 맞게 정리 (버전은 1.0 유지)

---

## Backlog (공개 이후 검토)

- [ ] 블로그 또는 글 목록 연결
- [ ] 강연 자료·발표 영상 섹션
- [ ] 프로젝트 필터 상태를 주소에 반영 (공유 가능한 링크)
- [ ] 개인 도메인 연결
