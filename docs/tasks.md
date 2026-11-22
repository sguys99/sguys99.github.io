# tasks.md — 운영 체크리스트

공개(2026-11-12) 이후의 반복 점검, 대기 중인 작업, Backlog를 관리합니다.
단계 0~9의 구축 기록은 [`tasks-archive.md`](tasks-archive.md), 목적·범위는 [`basic-plan.md`](basic-plan.md), 항목 추가 방법은 `CLAUDE.md`의 "콘텐츠 갱신 절차"를 봅니다.
작업을 끝내면 `[x]`로 바꾸고, 새 작업은 Backlog에 추가합니다.

## 진행 현황

| 단계 | 내용 | 상태 |
|---|---|---|
| 0 | 저장소와 개발 환경 준비 | 완료 |
| 1 | 콘텐츠 작성 (영문 → 국문) | 작성 완료, 사용자 검토·자료 대기 (아래 "대기 중") |
| 2 | 디자인 콘셉트 선정 (G1) | 완료 (A + 상단 메뉴 + 중앙 정렬) |
| 3 | 세부 디자인 (G2~G6) | 완료 |
| 4 | DESIGN.md 작성 | 완료 |
| 5 | 구현: 기반 | 완료 |
| 6 | 구현: 섹션과 페이지 | 완료 (2026-11-12) |
| 7 | 검수 | 완료 (2026-11-12) |
| 8 | 배포와 공개 | 완료 (2026-11-12) |
| 9 | 운영 준비 | 완료 (2026-11-12) |

---

## 운영 체크리스트

### 콘텐츠 추가·수정 시

1. 안내형 명령으로 추가: `/add-project` (프로젝트), `/add-entry` (경력·특허·SW·논문·강의·수상·학력·개인 프로젝트). 직접 고칠 때는 CLAUDE.md "콘텐츠 갱신 절차"의 파일 표를 따름
2. 영문 먼저, 국문을 맞춤. 고객사는 기본 익명, 새 용어는 `docs/glossary.md`에 먼저 추가
3. `npm run build` 통과 (스키마 검사 → CV PDF 재생성 → 내부 링크 검사)
4. `npm run preview`로 `/`·`/ko/`, 해당 섹션, `/work/<slug>/`, `/cv/` 확인 (라이트/다크, 데스크톱/모바일)
5. `npm run format:check`
6. 작업 단위로 커밋. `master` push는 사용자가 요청할 때만 (push = 공개)

### 배포 후 확인 (`master` push마다)

- [ ] GitHub Actions `Deploy to GitHub Pages`(`.github/workflows/deploy.yml`) 성공
- [ ] `https://sguys99.github.io/`와 `/ko/`에서 바뀐 부분 확인
- [ ] CV PDF 2건이 새로 받아짐: `/cv/kwang-myung-yu-cv.pdf`, `/ko/cv/yu-kwang-myung-cv-ko.pdf`
- [ ] 케이스 스터디를 추가·수정했다면 `/work/<slug>/`와 국문 경로

### 정기 점검 (분기 1회 정도)

- [ ] GoatCounter(사이트 코드 `sguys99`, `src/layouts/Base.astro`) 집계가 들어오는지
- [ ] Google Search Console: 색인 범위, sitemap 상태 (확인 파일 `public/googlee85bfe6a00318f16.html` 유지)
- [ ] 의존성 갱신: `npm outdated` → Astro·Playwright·Prettier 업데이트 후 `npm run build`
- [ ] Node LTS(`.nvmrc`, 현재 24)와 워크플로 액션 버전 확인
- [ ] Lighthouse 재측정 (성능·접근성·SEO 95 이상, basic-plan 1.2). 저장소에 측정 스크립트는 없음

---

## 대기 중 (사용자 자료)

단계 1에서 넘어온 미완료 항목입니다. 번호는 `tasks-archive.md` 단계 1과 같습니다.

- [ ] 1.2.11 **[확인]** 영문 전체 검토 — 검토본 전달 완료, 사용자가 나중에 검토하기로 함 (수정 시 국문까지 함께 반영)
- [ ] 1.3.2 **[확인]** 국문 전체 검토
- [ ] 1.5.2 **[확인]** 대표 프로젝트별 질문 (배경, 문제, 본인 역할, 접근, 성과, 공개 가능 범위). 자료에 없는 수치는 만들지 않음
  - 답변(2026-11-09): SCM SQL 정확도 "95% 이상 달성" 표기 / SCM 모델은 경력기술서 기준(Text-to-SQL Qwen 8B 파인튜닝 + 생성 Llama 3.1 70B) / 공개 범위: 성과 수치와 개념 아키텍처는 싣고, 고객 내부 용어·인프라 사양·운영 정책은 일반화 / 그린소재 재고 조합 최적화는 자료 대기(자리만) / GenP·도슨트는 진행 중이라 성과 없이 작성
- [ ] 1.5.3 케이스 스터디 영문·국문 작성 (Context → Problem → My role → Approach & Architecture → Stack → Outcome) — 6건 작성(`caseStudy` 필드). 그린소재 재고 조합 최적화는 2026-11-21 자료 받아 작성(11.14)
- [ ] 1.5.6 **[확인]** 케이스 스터디, 개인 프로젝트 문안 검토 — 사실 확인 3건 모두 맞음(2026-11-09), 개인 프로젝트 oathkeeper·lunchmate 추가와 데모 링크 3건 추가 요청. 문안 전체 검토는 1.2.11·1.3.2와 함께 나중에. 개인 프로젝트 `in-progress` 국문은 "진행 중"으로 통일(사용자 결정 2026-11-11, DESIGN.md 11.8)

---

## Backlog (공개 이후 검토)

- [x] Codex 작업 환경 연결 (2026-11-22). `AGENTS.md`에서 프로젝트 규칙·메모·명령을 안내하고, Claude Code와 스킬 원본 및 MCP 서버 구성을 맞춤
- [x] SCM 케이스 스터디 다이어그램 (2026-11-21, DESIGN.md 11.10): 시안 3개(g9) 중 A 회로도 선택. Architecture에 서비스 구성도, 새 섹션 Service flow에 흐름도. 공통 컴포넌트 `Diagram.astro` + `src/content/diagrams/<slug>.yaml`
- [x] 고객 상담 어시스턴트 케이스 스터디 다이어그램 (2026-11-21, DESIGN.md 11.11): 시안 g11에서 여정 B·진화 A·아키텍처 B·흐름 A 조합. 영문 제목 "AI Assistant for Customer Service". `Diagram.astro`에 `focus`·`new` 종류, 단계 띠·경로·접점·고충 말풍선·영역 메모, 자리 `problem`·`approach` 추가
- [x] 원자재 가격 예측 케이스 스터디 다이어그램 (2026-11-21, DESIGN.md 11.12): 시안 g10에서 아키텍처 A·서비스 흐름 C·실험 B 조합. 실험 결과 차트 `ResultsChart.astro` + `results` 필드(5.24.6). 영문 제목 "Raw-Material Price Forecasting and Market Dashboard", 결정 2 벤치마크 문구를 자료에 맞춤
- [x] 그린소재 재고 조합 최적화 케이스 스터디 + 다이어그램 (2026-11-21, DESIGN.md 11.14): 자료 3건으로 `caseStudy` 영문·국문 작성(기간 2024-03 – 09, Lead, 파일럿 완료). 시안 g12에서 Before → After A(Problem)·아키텍처 A·서비스 흐름 A. `Diagram.astro`에 `step`·`decision` 종류 추가
- [x] 도슨트 휴머노이드 케이스 스터디 + 다이어그램 (2026-11-21, DESIGN.md 11.13): 착수보고서·포커스 세미나로 본문 영문·국문 보강(주요 결정 4건, 검수 기준(안)). 시안 g13에서 관람 동선 A·아키텍처 A·안전 A·기종 비교 C·단계 확장 B. 새 섹션 Visitor journey·Safety, `Comparison.astro`·`RoleShift.astro`, `Diagram.astro`에 정차 지점·걷는 구간·거리 원·`ghost`·`acc` 추가
- [ ] 기종 비교 제품 사진(Unitree, AgiBot) 공개 사이트 이용 조건 확인 (11.13). 문제가 있으면 시안 B(선화)로 교체. G1 사진은 GenP 표준 구성(11.15)에도 쓰임
- [x] GenP 휴머노이드 제품 케이스 스터디 + 다이어그램 (2026-11-21, DESIGN.md 11.15): 자료 6건(`docs/project-references/genp/`)으로 본문 영문·국문 재작성(주요 결정 4건, 기술 스택 사양서 기준). 시안 g14에서 코어+프로파일 A·도메인 표 B·아키텍처 C(Phase 2·3 목표 구조)·명령에서 토크까지 A·학습 루프 C·표준 구성 C(+A 로봇 사양). 새 섹션 2개, 컴포넌트 `LayerStack`·`EpisodeLoop`·`DomainTable`·`StandardSet`, `Diagram.astro`에 `divider`·`dash`·`remote`
- [x] 법령 검색 Agentic RAG 케이스 스터디 + 다이어그램 (2026-11-22, DESIGN.md 11.16): Selected Work 3번째로 추가(소속 행 없음, Seahorse·legalQ 링크 게재 승인), 본문 영문·국문 작성(성과 정성). 시안 g15에서 실서비스 화면 C·이전 vs 이후·프롬프트 구조 B·저장소 지도 A·지식원 비교표·계층 스택·의도 6행. 새 섹션 System prompt, `RepoMap.astro`·`Screens.astro`, `Comparison.astro` 이미지 선택, `Diagram.astro`에 행 이름·척추(`texts.style`·`bullet`, `line`). Selected Work 카드 소속 없는 경우 버그 수정
- [x] AI 과제 추진 로드맵 케이스 스터디 + 다이어그램 (2026-11-22, DESIGN.md 11.17): 기존 항목 `lotte-ai-masterplan`을 대표 프로젝트 6번(원자재 가격 예측 위)으로 올리고 제목을 "AI Roadmap Consulting and PoC Delivery / AI 과제 추진 로드맵 수립 컨설팅 및 PoC 수행"으로 바꿈. 자료 3건(`docs/project-references/ai-roadmap/`)으로 본문 영문·국문 작성(역할 PM 총괄 + PoC 3건 리드, LLM 플랫폼은 한 줄). 시안 g16에서 과제 선별 B·분류 매트릭스 A·로드맵 C. 새 섹션 Roadmap, `TaskSelection`·`Quadrant`·`RoadmapGantt`
- [x] 소개·기술 문구 수정 (2026-11-22): About 영문·국문에서 GenON·GenP 이름 제외, 프로그래밍에 C#(윈도우 프로그래밍) 추가. 용어집에 Windows programming
- [ ] **AI 흔적 제거** (2026-11-22 시작. 단계 4.4 진행 중. 영문과 국문 본문을 사례별로 검수하고 공개): 화면에 보이는 영문과 국문 문구에서 AI가 쓴 흔적(em dash, 나열용 중간점, 국문 종결 혼용, 대구 같은 문형)을 걷어냄. 계획과 단계별 체크리스트는 [`anti-ai-slop-plan.md`](anti-ai-slop-plan.md), 진단 보고서는 `anti-ai-slop-report.md`(단계 1에서 작성)
- [ ] legalQ 화면 캡처 갱신: 서비스 화면이 바뀌면 `docs/design-drafts/g15/capture.mjs`로 다시 찍어 `src/assets/legalq/` 교체 (실서비스 질문 1회 = 일일 제한 1회)
- [ ] CV 섹션 제목 복사 텍스트 붙음 (2026-11-22 발견, 단계 3 이전부터): `/cv/` 360px에서 `h2` 안 `<small>` 건수가 inline이라 innerText와 복사가 `PATENTS7 registered, 8 filed`, `특허등록 7, 출원 8`로 붙음. 원인 `Cv.astro` 모바일 규칙 `.sec > h2 small { display: inline; margin-left }`. 원장의 같은 결함은 3.2에서 고침 (`docs/anti-ai-slop-plan.md` 3.5)
- [ ] 라틴 글자 간격 불균일 (2026-11-22 발견, 원인 미확인): 국문 CV PDF와 국문 화면에서 `S enior Data S cientist`, `Gen ON`, `Tele op`처럼 벌어지고 일부는 붙음 (기준 커밋에도 같음, `docs/anti-ai-slop-plan.md` 3.4). Pretendard 동적 서브셋의 라틴 조판 문제로 추정. Linux Chromium 캡처의 영문 다이어그램 글자(`Persisten ce`)도 같은 원인인지 함께 확인
- [ ] 국문 글꼴 빌드 서브셋 검토 (국문 홈 Pretendard 분할 441KB, 7.5)
- [ ] WebKit 글꼴 중복 요청: 영문 페이지에서 Geist를 preload(cors)와 `@font-face`로 두 번 받음(24.5KB), Pretendard 라틴 분할 1개 추가 요청(원인 미확인) (7.6)
- [ ] WebKit 국문 기간 줄바꿈: `2026.10 – 2027.01 [진행 중]`이 대시 뒤에서 꺾임(`<wbr>` 앞 여백), 넘침 없음 (7.6)
- [ ] 국문 홈 인쇄: "개인 프로젝트" 카드 머리가 5쪽 끝에 홀로 남음(Chromium이 그리드 첫 행 앞 `break-after: avoid` 무시) (7.11)
- [ ] 블로그 또는 글 목록 연결 (basic-plan 10.3 Q5: 블로그 계획 여부 결정 포함)
- [ ] 강연 자료·발표 영상 섹션
- [ ] 프로젝트 필터 상태를 주소에 반영 (공유 가능한 링크)
- [ ] 개인 도메인 연결
- [ ] Search Console 재확인: sitemap 발견 페이지 12건, 예전 블로그 주소 색인 정리, `/cv/` 색인 여부
- [ ] 저장소 About 설명 "personal blog" 교체 (문구 미정)
- [ ] Lighthouse를 실제 GitHub Pages 주소에서 재측정 (지금 값은 로컬, basic-plan 1.2)
- [ ] Lighthouse 정기 측정 자동화: GitHub Actions로 라이브 주소(`/`, `/ko/`, `/cv/`)를 매달 측정하고 95 미만이면 실패 처리 (현재 측정 스크립트 없음)
