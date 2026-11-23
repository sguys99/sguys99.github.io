# anti-ai-slop-plan.md: AI 흔적 제거 작업 계획

작성 2026-11-22. 사이트에 보이는 영문과 국문 문구에서 AI가 쓴 흔적을 걷어내는 작업의 결정 사항과 단계별 계획이다.
진행하면서 체크박스를 `[x]`로 바꾸고, 결정이 바뀌면 2장에 날짜와 함께 적는다.

- 관련 문서: `CLAUDE.md` 규칙 1~3, `DESIGN.md` 1장 "UI 문구 어조"와 11장 Decision Log, `docs/glossary.md`, `docs/tasks.md`
- 사용할 스킬: `/humanize-korean` (국문 진단과 산문 윤문), `/humanize-scan` (전후 측정), `/antislop-copywriting` (영문 점검, `after` 모드)
- 이 문서 자체는 화면에 나오지 않지만, 새 규칙에 맞춰 em dash와 나열용 중간점을 쓰지 않는다

---

## 1. 목적

- 채용 담당자, 의뢰자, 동료가 사이트를 읽을 때 "AI가 쓴 글"로 느끼지 않게 한다.
- 영문과 국문 모두 사람이 직접 다듬은 이력서 문장처럼 읽히게 한다.
- 다듬은 뒤에도 같은 흔적이 다시 들어오지 않도록 규칙 문서와 빌드 검사에 반영한다.

하지 않는 것:

- 내용을 더하거나 빼지 않는다. 성과 수치, 기간, 역할, 기술 스택, 고유명사는 그대로 둔다 (CLAUDE.md 규칙 2).
- 익명 처리를 바꾸지 않는다 (규칙 3).
- 화면 구조를 새로 설계하지 않는다. 구분자 모양만 시안을 거쳐 바꾼다 (규칙 1).

## 2. 결정 사항

| 날짜 | 결정 | 내용 |
|---|---|---|
| 2026-11-22 | Em dash 금지 | 화면에 보이는 모든 문구에서 `—`를 없앤다 |
| 2026-11-22 | 중간점 대체 | 키워드 나열의 `·`는 쉼표, "와/과", `/` 중에서 문맥에 맞게 바꾼다 |
| 2026-11-22 | 구분자 범위: B | 컴포넌트가 넣는 구분자 ` · `도 모두 바꾼다. 키워드 나열(섹션 제목, 기술 스택 줄, 건수 줄, 분야 태그)과 필드 구분(`소속 · 고객사`, `이름 · 직함`, `직함 · 현재 소속`) 모두 포함. 바꿀 모양은 시안으로 정한다 (단계 2) |
| 2026-11-22 | 국문 종결 통일 | 국문 콘텐츠는 명사형 종결로 통일한다. 한 문장이면 마침표 없음, 두 문장 이상이면 문장마다 마침표. "~함/~음"과 "~한다." 문장은 명사형으로 고친다. UI 안내 문장의 합니다체는 유지 (DESIGN.md 1장) |
| 2026-11-22 | 진행 방식: C (혼합) | 스킬의 진단 기능으로 점검표를 만들고, 짧은 명사형 문장과 라벨은 직접 고치며, 두 문장 이상인 설명만 `/humanize-korean`으로 다듬는다. 파일마다 영문을 먼저 고치고 국문을 맞춘다 |
| 2026-11-22 | 진단 먼저 | 고치기 전에 진단 보고서를 만들어 사용자가 우선순위를 정한다 (단계 1) |
| 2026-11-22 | 제목과 한 줄 소개 | 프로젝트 제목(영문, 국문)은 기호만 바꾸고 문구는 유지한다. 이력서의 프로젝트 이름과 맞추기 위해서다. 제목의 "및", "~를 활용한"은 사업명 형식이라 고치지 않는다. 한 줄 소개(`taglines`)는 G3에서 고른 문장이라 그대로 둔다 |
| 2026-11-22 | 문서 공개 | 이 계획서와 진단 보고서(`docs/anti-ai-slop-report.md`)를 모두 저장소에 커밋한다 |
| 2026-11-22 | 항목마다 push | 단계 0~3은 세부 항목이 끝날 때마다 이 문서에 완료를 적고 커밋한 뒤 push한다 (사용자 요청). `master` push는 곧 공개이므로 화면이 바뀌는 커밋은 빌드가 통과한 뒤에만 push한다 |
| 2026-11-22 | 우선순위와 판단 사항 (1.6) | 진단 보고서 7장 15건과 강도 시안 `docs/design-drafts/g17/tone/README.md` 8장 12건을 작업자 추천대로 확정. 순서는 단계 3, 4.0(높음 9건), 4.1~4.4, 5. 케이스 스터디와 다이어그램 순서는 legal, genp, docent, samsung-consultation, lotte-price, samsung-scm, lotte-ai, lotte-inventory. 원자료 확인이 필요한 문장은 해당 파일 작업 직전에 묻는다. 점검표 반영은 2.6 |
| 2026-11-22 | 구분자: B 조합 (2.3) | 시안 g17. 나열은 쉼표 (국문 두 말은 "와/과": `지식재산과 출판물`, `강의와 자문`). 필드는 소속과 고객 사이 쉼표, 덧붙는 값은 괄호 (`AI Engineer (Director, R&D Group, GenON)`, `AgiBot X2 Ultra (Selected)`). 문서 제목과 CV PDF 바닥글은 ` \| `. 국문 라벨 안 병렬은 `/` (`제어/최적화`). 빈 날짜는 빈칸, og:image:alt는 쉼표, CV 역할은 기호 없이 다음 줄 |
| 2026-11-22 | 윤문 강도: 중간 + 적극 2곳 (2.3) | 시안 `g17/tone/`. 중간을 기본으로 하고, 두 줄을 넘는 긴 영문 문장(보고서 P12)과 비교 결론(`verdict`)만 적극 |
| 2026-11-22 | 원자료 pptx 유지 | 이미 커밋된 `docs/project-references/samsung-scm-agent/`의 pptx 3건은 그대로 둔다 (사용자 결정). 추적하지 않는 나머지 원자료는 `.gitignore`에 `docs/project-references/`를 넣어 막는다 (이미 추적 중인 3건은 계속 추적됨) |
| 2026-11-22 | 본문 짝 표기 | 국문 본문의 `에이전트·RAG`, `Physical AI·휴머노이드` 같은 짝은 영문을 따른다. 영문이 `agent/RAG`처럼 빗금이면 `/`, 그 밖은 "와/과" (`Physical AI와 휴머노이드`) |
| 2026-11-22 | `Vision 판독` | genp 도메인 표 `domains.items[].tech`의 국문 `Vision 판독`은 `Vision AI`로 (사용자 답). 영문 `Vision reading`도 `Vision AI`로 맞춘다 (사용자 답, 4.0 뒤 확인. 원자료 용어는 `Vision 판독`이고 `Vision AI`라는 말은 없음) |
| 2026-11-22 | 원자료 확인 (5.8) | 단계 4 시작 때 11곳을 원자료(`docs/project-references/`)와 대조해 한 번에 물음 (조사 `_workspace/stage4/source-check.md`). 원자료와 같은 4곳은 그대로: lotte-ai `context[0]`, `approach[3]`의 세 항목, genp `decisions[0].rationale`의 세 항목, genp 도메인 표 12칸. 원자료 표현에 맞춰 고칠 5곳 (사용자 답 "추천대로"): lotte-ai `problem[0]`의 `value, readiness, or priority`는 원자료에 없어 `no evaluation criteria yet to rank them` 식으로, `early wins` 3곳은 원자료의 "로드맵 앞쪽 배치"와 "small success"로 (국문 `빠른 성과` 2곳도), docent `roadmap.note`는 주체를 고객과의 협의로, lotte-price `problem[0]`은 주체를 구매 담당자로, samsung-consultation `costing sales`는 `costing sales opportunities`로 (원자료 "매출 기회 감소"). genp `decisions[0].tradeoff`는 원자료의 방어벽 3개 중 지금 쓰는 2개만 두고 표현만 평이하게 (사용자 답, 내용 추가 없음) |
| 2026-11-22 | 4.2, 4.3 사용자 답 | ai-daybook 비용은 1회 실행 전체 비용이라 국문을 `(1회 실행 비용 $0.1 이하)`로 영문에 맞춤. 인천대 방문연구원/기술자문은 진행 중이라 영문 설명 4줄을 현재형으로 (기간 표기 `2020 – 2026`은 그대로). 진행 중 개인 프로젝트 2건(oathkeeper, research-curator)도 `Built a ...` 틀 유지 (10건 모양 통일, 상태 표시가 진행 중을 알림). mcp-connectors 국문의 `같은 방식으로`는 영문에 넣지 않고 둘 다 그대로 |
| 2026-11-22 | 국문이 더 구체적인 곳 (5.8) | legal `decisions[3].title`(`Article-level chunks` / `조·항 단위 청크`)과 비교표 행 라벨(`Revision history` / `개정 이력/과거 원문`)은 둘 다 그대로 둔다 (사용자 답). 항 단위는 같은 사례 `approach[1]` 영문이 `by article and paragraph`로 설명함 |
| 2026-11-22 | 4.4 영문 보완 | 이어서 진행한 7건에서 기존 공개 국문이 더 구체적이면 해당 사실을 영문에도 반영한다 (사용자 답). 예: 도슨트의 감사 로그, 모션 제작과 배포. |
| 2026-11-22 | 문체 규칙 2건 | 결정 표 칸은 한 문장으로 둔다 (칸 안에 마침표가 섞이지 않게). 영문 목록 항목을 두 문장으로 나누면 둘째 문장도 동사로 시작한다. "A는 ~고 B는 ~" 대칭은 실제 역할 분담을 설명할 때만 케이스 스터디당 1회 허용 (강도 시안 8장 10, 11번) |
| 2026-11-22 | CV 1쪽 경력 나뉨 | 역할을 다음 줄로 내린 뒤 영문 CV PDF 1쪽의 마지막 경력 행이 2쪽으로 넘어감 (쪽수와 글자 위치는 그대로). 지금은 그대로 두고 4.1 뒤 다시 확인 (사용자 선택. 다른 안: 인쇄만 역할 같은 줄, 인쇄 간격 축소, 요약 축약). 4.1 뒤에도 POSCO E&C 행(5줄)이 2쪽 첫 줄이고 1쪽 끝 여백은 약 3줄이라 그대로 두기로 함 (사용자 답) |
| 2026-11-22 | 문서 정리 | `CLAUDE.md`의 대표 프로젝트와 케이스 스터디 건수를 현재 상태(8건, 8건)로 고친다. `docs/basic-plan.md`의 `PM·PO`와 용어집 7.3의 낡은 CV 링크 메모는 단계 7에서 정리 (7.5) |

작업자 판단으로 정한 것 (사용자가 바꿀 수 있음):

- 회사 이름, 조직 이름, 직함은 고유명사로 보고 바꾸지 않는다.
- 한 줄 소개는 DESIGN.md 1장의 "한 줄 소개, 요약" 행을 따른다. 국문도 영문과 짝을 맞춰 마침표를 둔다. 2장의 "한 문장이면 마침표 없음"은 경력, 프로젝트, 그림 설명, 결정 근거 문장에 적용한다.
- 논문, 보고서, 특허, 책 제목은 발표된 이름이라 그대로 둔다.
- 단위 `N·m`과 기간 표기의 en dash(–)는 유지한다.
- 홈과 CV의 meta description은 검색 결과에 문장처럼 보이는 자리라 B의 쉼표와 괄호를 쓴다 (`Kwang Myung Yu, AI Engineer (Director, R&D Group, GenON)`). ` | `는 `<title>`, og:title, CV PDF 바닥글에만 쓴다. 홈 description은 한 줄 소개라 구분자가 없다.
- 경력 요약(`experience.yaml`의 `summary`)은 6곳의 모양을 맞추려고 문장 수와 관계없이 마침표를 둔다 (보고서 7장 11번, DESIGN.md 1장).
- 범례처럼 폭이 넉넉한 다이어그램 자리에서는 캡처로 넘침이 없음을 확인하면 1자 증가를 허용한다 (강도 시안 8장 6번).
- 일반 영어를 국문으로 옮겨 `--facts`가 잡는 차이(예: `non-agentic`)는 허용 목록을 두지 않고, 배치마다 사람이 확인해 10장 진행 기록에 적는다 (강도 시안 8장 8번).
- 영문 `had to`는 `must`와 같은 요구 문장으로 보고 국문 `~필요`를 허용한다. 문제 목록에서는 사례마다 1개 이하 (5.5).

아직 정하지 않은 것은 9장 "열린 질문"에 둔다.

### 진행 방식을 C로 고른 이유

| 방식 | 내용 | 판단 |
|---|---|---|
| A. 스킬에 통째로 맡기기 | 국문 전체를 뽑아 `/humanize-korean` 전체 과정에 넣고 다시 삽입 | 이 스킬은 에세이, 보고서 같은 줄글 기준이다. "문장을 길게 이어라", "종결어미를 다양하게" 같은 규칙이 명사형 통일과 충돌하고, 짝 영문과 다이어그램 크기를 보지 못한다 |
| B. 직접 고치기 | 두 스킬 규칙으로 점검표를 만들어 파일마다 직접 수정 | 구조와 크기 제약은 지키지만 스킬의 진단 능력을 쓰지 못한다 |
| **C. 혼합 (선택)** | 진단은 스킬, 짧은 문장은 직접, 두 문장 이상 설명은 스킬 윤문 | 스킬이 잘하는 진단과 산문 다듬기에만 스킬을 쓴다 |

---

## 3. 범위

| 대상 | 위치 |
|---|---|
| 콘텐츠 문구 (영문, 국문) | `src/content/` 전체: profile, experience, projects, personal, patents, software, publications, teaching, awards, education, diagrams |
| UI 문구 | `src/i18n/ui.ts` (섹션 제목, 버튼, 건수 줄, 분야와 역량 이름, 스크린 리더 라벨) |
| 컴포넌트가 넣는 구분자와 조합 문구 | `ProjectLedger`, `CaseStudy`, `Cv`, `Home`, `Head`, `About`, `Teaching`, `SelectedWork`, `Comparison`, `Screens`, `StandardSet`, `Diagram`, `pages/404` |
| 메타 정보 | 페이지 제목, description, OG 대체 텍스트, JSON-LD (콘텐츠와 `Head.astro`에서 조합) |
| 대체 텍스트 | 이미지, 그림, 화면 캡처의 `alt` (콘텐츠와 컴포넌트) |
| CV PDF | 빌드 때 `Cv.astro`에서 다시 생성되므로 위 수정이 자동 반영됨. 결과 PDF만 검수 |
| 규칙 문서 | `CLAUDE.md`, `DESIGN.md`, `docs/glossary.md`, `.claude/commands/add-project.md`, `add-entry.md`에 새 표기 규칙 추가 |

제외:

- 코드 주석, `docs/`의 기록 문서 (`tasks-archive.md`, 시안, 참고 자료). 화면에 나오지 않는다.
- OG 이미지(`docs/design-drafts/og/og-a.html`): 구분자나 em dash가 없다 (2026-11-22 확인).
- 논문, 보고서, 특허, 책의 **제목**: 발표된 고유 명칭이라 원문 그대로 둔다. 설명 문구만 대상.
- 프로젝트 **제목의 문구**: 기호만 바꾼다. `·`가 있는 제목은 `power-plant-maintenance-assistant.md`의 `발전 플랜트 운영·정비이력 조회 대화형 서비스 개발` 1건이고, CLAUDE.md, 용어집, basic-plan의 제목 표에는 이 표기가 없다 (2026-11-22 확인).
- **한 줄 소개** (`profile.yaml`의 `taglines`): 그대로 둔다.
- 회사 이름, 조직 이름, 직함: 고유명사라 그대로 둔다.
- 단위 `N·m` (뉴턴미터, 2곳): 중간점이 아니라 단위 기호다. 같은 이유로 수식 `Kd·ω`, 법령 단위 `조·항`, `조·항·호`, 강의 제목 `학부·석사`도 그대로 둔다 (5.2 예외 표).

---

## 4. 현황 (2026-11-22 측정)

측정 대상은 `src/content/`의 `en`, `ko` 문자열 값이다 (YAML 키, 주석 제외). 영문과 국문 1,437쌍, 영문 약 61,000자, 국문 약 28,700자.

### 4.1 기호

| 항목 | 개수 | 위치 |
|---|---|---|
| Em dash, 화면 노출 | 4곳 | 영문 본문 2 (`samsung-scm-agent.md`, `lotte-price-forecasting.md`), CV 역할 구분 `" — role"`과 빈 날짜 표시 `'—'` (`Cv.astro`), 표준 구성 그림 대체 텍스트 (`StandardSet.astro`) |
| Em dash, 주석 | 5곳 | 대상 아님 |
| 중간점, 콘텐츠 값 | 616 | 국문 453, 영문 163. 다이어그램 387, 프로젝트 176, profile 22, experience 15, personal 14, 기타 2 |
| 중간점, UI와 컴포넌트 | 약 30곳 | `ui.ts` 섹션 제목과 분야 이름 등, 컴포넌트 구분자 (CSS `content: ' · '` 포함) |
| 중간점, 용어집 국문 표기 | 6건 | `Dense·BM25 하이브리드`, `PM·PO`, `강의 · 저서 · 자문`, `지식재산 · 출판물`, `CV · PDF 다운로드`, `강의·자문` |
| En dash | 콘텐츠 16, 코드 다수 | 모두 기간과 숫자 범위 (`2024.03 – 2024.09`, `1–4 weeks`, `#1–#5`). 문장 연결용은 없음 |

중간점이 가장 많은 파일: `diagrams/genp-humanoid.yaml` 107, `diagrams/legal-agentic-rag.yaml` 76, `diagrams/samsung-consultation-assistant.yaml` 56, `projects/genp-humanoid.md` 54, `diagrams/docent-humanoid.yaml` 49.

### 4.2 국문 종결 (25자 이상 문자열 360개)

| | 형태 | 개수 | 예 |
|---|---|---|---|
| ① | 명사형, 마침표 없음 | 318 | `... MCP 서버 설계` |
| ② | 명사형, 마침표 있음 | 17 | `영향이 크고 적용 사례가 있는 영역. 시스템 구축 전에 효과를 먼저 검증.` |
| ③ | ~함, ~음 | 17 | `벡터 DB에 이력 자체가 없음` |
| ④ | ~한다. | 8 | `도슨트가 태블릿 버튼이나 호출어로 회차를 시작한다.` |

③과 ④는 케이스 스터디의 결정 근거와 트레이드오프, 문제 목록, 그림 아래 설명(`note`), 기종 비교 결론에 몰려 있다. DESIGN.md 어조 표에 이 자리에 대한 규칙이 없다.

### 4.3 문형 신호 (1차 집계, 단계 1에서 정밀 진단)

| 언어 | 신호 | 개수 | 비고 |
|---|---|---|---|
| 국문 | "A가 아닌 B", "A가 아니라 B" 대구 | 7 | humanize-korean 실측에서 가장 강한 AI 신호(C-8) |
| 국문 | 콜론 | 30 | |
| 영문 | "X, not Y" | 6 | 결정 제목에 몰림 (`Two complementary sources, not one`) |
| 영문 | "from X to Y" | 23 | 실제 범위(`from 12 to 3,046`)와 꾸밈용 범위를 나눠 판단 |
| 영문 | 콜론 22, 세미콜론 32 | | |
| 영문 | 유행어 (leverage, seamless, robust 등) | 거의 없음 | |

---

## 5. 표기 규칙 (작업 기준)

2026-11-22 확정. 근거는 2장의 두 결정이다. 1.6에서 진단 보고서(`docs/anti-ai-slop-report.md`) 7장 판단 15건과 강도 시안(`docs/design-drafts/g17/tone/README.md`) 8장 규칙 12건을 추천대로 정했고, 2.3에서 구분자 B 조합(`docs/design-drafts/g17/README.md`)과 윤문 강도 "중간 + 적극 2곳"을 골랐다. 같은 결정이 `DESIGN.md` 1장 어조 표와 11.18, `docs/glossary.md` 6절, 9.5, 9.6에 들어가 있고 이 장은 그와 맞춘다. 단계 3~5는 이 장을 기준으로 고친다.

- 강도: 중간이 기본이다. 기호, 종결, 대구(보수)에 더해 번역투(관형절 사슬, 명사 더미, 범용 동사, 무생물 주어), 영문 콜론과 세미콜론, 꾸밈용 범위, 결정 제목 비교 틀을 고친다. 적극(문장 다시 짜기)은 두 자리에만 쓴다 (5.7 끝).
- 위치와 고친 예: 영문 문제 100건은 보고서 8.1, 국문 패턴은 보고서 4.1, 굳은 말은 보고서 5장, 강도별 대조는 `docs/design-drafts/g17/tone/samples.md` 57쌍. 표본의 `조와 항`, `조/항`(†)은 5.2 예외 결정으로 쓰지 않는다.
- 추천 문구가 없어 남았던 **미정** 5곳은 2026-11-22에 모두 정했다 (2장, 해당 줄에 **정함**). 앞으로도 정하지 않은 것은 **미정**으로 적고, 정해지면 2장에 날짜와 함께 적은 뒤 이 장을 고친다. 새 예외도 같은 방식으로 적고 7.1 빌드 검사의 예외 목록에 넣는다.

### 5.1 Em dash

화면에 보이는 문구에서 모두 없앤다 (2장). 콘텐츠 2곳, 컴포넌트 6곳이다.

| 자리 | 처리 | 예 |
|---|---|---|
| 영문 본문 2곳 (lotte-price `caseStudy.approach[0]`, samsung-scm `caseStudy.approach[1]`, 단계 4.0) | 마침표로 문장을 나누거나 쉼표, 콜론, 괄호, 문장 재구성 중에서 고른다 (antislop R-02) | `... agreed with the client on what counts as improvement — a MAPE target of 10% or less ...` → `... agreed the improvement target with the client. The target was a MAPE of 10% or less ...` (보고서 E1). samsung-scm은 `A2A —` 뒤의 세 에이전트를 괄호로 묶는다 |
| CV 역할 구분 (`Cv.astro` ` — `) | 기호 없이 다음 줄로 내린다. 화면도 인쇄처럼 | `GenON, R&D Group — Director / AI Product Engineer` → `GenON, R&D Group` 다음 줄에 `Director / AI Product Engineer` |
| CV 빈 날짜 (`Cv.astro` `'—'`) | 빈칸 | 날짜 없는 SW 등록 진행 중 2건. 같은 줄의 `Pending`이 이유를 말한다 |
| 표준 구성 그림 대체 텍스트 (`StandardSet.astro`, 4곳) | 문장으로 풀어 쓴다 | 영문 `{alt}. {robot} and {server}: Wi-Fi 6, ROS 2 + ZMQ. {server} and {external}: OUTBOUND.` 국문 `{alt}. {robot}, {server} 연결: Wi-Fi 6, ROS 2 + ZMQ. {server}, {external} 연결: 외부망.` |

### 5.2 중간점 (콘텐츠 문구)

콘텐츠 값의 `·`(보고서 4.3 S2: 붙여 쓴 나열 372, 띄어 쓴 구분자 245)는 자리에 따라 아래 표 하나를 따른다. 본문 문장은 "본문 문장", 다이어그램 라벨은 "다이어그램 라벨과 좁은 자리", 정해진 말은 "굳은 말"과 "예외"를 본다. 1.2 처방 예에 남은 `·`(`직접·재귀`, `개발·배포를 자동화하는`, `현업이 직접 재학습·배포`)도 이 기준으로 푼다.

**본문 문장** (프로젝트, 경력, 프로필, 개인 프로젝트, 그림 설명 `note`, HTML 표 칸)

| 상황 | 기호 | 예 |
|---|---|---|
| 두 항목 | "와/과" | `학습·평가` → `학습과 평가`, `에너지·제조 분야` → `에너지와 제조 분야` |
| 세 항목 이상 | 쉼표 | `모니터링·알람·태스크 실행` → `모니터링, 알람, 태스크 실행` |
| 쉼표 나열 안의 하위 묶음 | "와/과" (쉼표가 겹치지 않게). 어려우면 `/` | `시나리오·시스템 프롬프트 설계, 서비스 배포` → `시나리오와 시스템 프롬프트 설계, 서비스 배포` |
| 잘린 합성어 | 빠진 공통 요소를 살려 "와/과" | `온·오프라인` → `온라인과 오프라인`, `공포·시행일` → `공포일과 시행일` |
| 동사 결합형 | 활용형으로. 영문이 or면 "이나" | `계획·조합하는` → `계획하고 조합하는`, `요약·의역 없이` → `요약이나 의역 없이` |
| 대비 (vs.) | `/` | `Direct·Recursive 방식` → `직접/재귀 방식` (그림의 `재귀`와 맞춤), `가격·가격 변화량` → `가격/가격 변화량` |
| 용어집이나 같은 사례가 이미 `/`를 쓰는 기술 이름 짝 | `/` (영문 값도 같이) | `Dense·BM25` → `Dense/BM25`, `LLMOps·MLOps` → `LLMOps/MLOps`, `STT·TTS` → `STT/TTS` |
| 숫자 묶음 | 같은 파일의 범위 표기에 맞춤 | `Phase 2·3` → `Phase 2~3` (같은 파일 `Phase 1~3`), `1–4주·1–3개월` → `1–4주와 1–3개월` (그림은 쉼표) |
| 조 번호 나열 | 쉼표 (영문과 같은 번호 나열) | `제26·27·28·30·31·33조` → `제26, 27, 28, 30, 31, 33조` |

`/`는 아래 자리에만 쓴다.

- 라벨 안 병렬: 분야와 역량 이름(`제어/최적화`, 5.3 (4))과 다이어그램 라벨의 붙여 쓴 `·`(아래). 라벨 안에서는 `/`를 "와"의 뜻으로 쓴다. 이전 초안의 주의("국문 `/`는 '또는'으로 읽힐 수 있다")는 g17 README 추천안에 함께 적혀 있었고, 2.3에서 그대로 (4)를 `/`로 정했다
- 위 표의 대비와 기술 이름 짝, 이미 쓰는 표기(`C/C++/C#`, `LangChain/LangGraph`), 경력 직함(아래)
- 본문 문장의 나열에는 쉼표와 "와/과"를 먼저 쓴다. 문장 안의 `/`는 "또는"으로 읽힐 수 있어서다

**경력 직함** (`experience.yaml` `role` 국문 3곳, 보고서 7장 13번): 영문 `role`과 같은 ` / `로 바꾸고 직함 문구는 그대로 둔다 (고유명사, 2장). `Director · AI Product Engineer` → `Director / AI Product Engineer`, `파트 리더 · Senior ML Engineer · PO` → `파트 리더 / Senior ML Engineer / PO`. 구분자 시안(5.3) 대상이 아니다.

**다이어그램 라벨과 좁은 자리** (`src/content/diagrams/`, 태그, 표 머리. 강도 시안 8장 6번, 표본 `samples.md` 4장)

| 형태 | 기호 | 예 |
|---|---|---|
| 띄어 쓴 ` · `, 이름과 설명 구분 | 괄호. 국문은 괄호를 앞말에 붙여 쓴다 | `Before · one vector search` → `Before (one vector search)`, `이전 · 벡터 DB 1회 조회` → `이전(벡터 DB 1회 조회)`, `Unitree G1 · on-board` → `Unitree G1 (on-board)` |
| 띄어 쓴 ` · `, 나열 | 쉼표 | `rate · concurrency · PII` → `rate, concurrency, PII`, `원문 그대로 · 조언 금지 · 출처 · 읽기 전용` → `원문 그대로, 조언 금지, 출처, 읽기 전용` |
| 붙여 쓴 `·` (국문) | `/` (글자 수가 같음). 세 항목이어도 `/` | `커밋·메타데이터` → `커밋/메타데이터`, `IP 제한·동시성·개인정보` → `IP 제한/동시성/개인정보` |
| 둘이 섞인 라벨 | 띄어 쓴 것과 붙여 쓴 것을 따로 | `참고 지식: 도구 소개 · 저장소 구조·스키마` → `참고 지식: 도구 소개, 저장소 구조/스키마`, `Dense·BM25 하이브리드 · 조·항 단위 청크` → `Dense/BM25 하이브리드, 조·항 단위 청크` |

- 글자 수: 표본 라벨 28개는 모두 원문 이하였다. 영문 라벨은 ` · `(3자)를 `, `(2자)나 괄호로 바꾸고, 글자가 느는 `and`는 뒤로 미룬다 (보고서 6.3. lotte-inventory는 기준선부터 넘침 1곳, 꽉 찬 상자 1곳)
- **정함 (2026-11-22, 2장)**: 범례처럼 폭이 넉넉한 자리(항목마다 144 단위)는 캡처로 넘침이 없음을 확인하면 1자 증가를 허용해 붙여 쓴 `·`도 쉼표로 바꿀 수 있다. 상자 안 라벨은 지금처럼 글자 수를 늘리지 않는다
- 줄바꿈 바로 앞 중간점 4곳(`주문·결제·\n배송`, `매장·\n온라인몰`, `데이터·\n거버넌스`, `최적해·\n기준 만족?`)은 바꾼 뒤 그림에서 줄 끝 기호를 확인한다 (보고서 4.3)
- 화살표, 곱셈, 더하기(`→`, `×`, `+`)와 라벨형 콜론(`Source:`, `원천:`)은 그대로 둔다
- 다이어그램 라벨과 표 칸에는 5.6의 문장 구조 처방(관형절, `~을 위한`, 명사 더미, 범위 공식, 범용 동사)을 쓰지 않는다. 표기 통일(B-1, B-2)만 한다 (보고서 8.3)

**굳은 말** (보고서 5.1 후보 25개, 국문 약 50곳. 모두 제안대로)

| 처리 | 보고서 5.1 번호 | 예 |
|---|---|---|
| 풀기 (14) | 1, 2, 5~11, 14, 16, 23~25 | `시행령·시행규칙` → `시행령과 시행규칙`, `데이터·모델 파이프라인` → `데이터와 모델 파이프라인`, `추적성·재현성` → `추적성과 재현성`, `WMS·MES` → `WMS, MES` (영문 라벨 `WMS · MES`도 쉼표) |
| `/` (8) | 3, 4, 17~22 | 제목 `운영·정비이력` → `운영/정비이력` (`summary`는 풀어 `운영 이력과 정비이력`), 그림 `단순·정보형` → `단순형/정보형` (본문은 `단순형과 정보형`, 세 항목 `단순·정보형·재질문`은 쉼표), `AS·CS` → `AS/CS` |
| `~` (1) | 15 | `Phase 2·3` → `Phase 2~3` |
| 유지 (2) | 12, 13 | `조·항` (6곳), `조·항·호` (1곳). 법령 단위 표기 관례이고 용어집도 `조·항 단위`로 적는다 |

**예외** (그대로 두는 `·`. 7.1 빌드 검사의 예외 목록과 같다)

| 표기 | 곳 | 이유 |
|---|---|---|
| `N·m` | 2 (genp 본문 사양) | 단위 (2장) |
| `Kd·ω` | 1 (genp 그림 `stack.layers[3].value`) | 제어 법칙 수식의 곱셈 기호 (보고서 7장 12번) |
| `조·항`, `조·항·호` | 7 (legal 본문과 그림) | 법령 단위 표기 (보고서 7장 13번) |
| `학부·석사` | 1 (`teaching.yaml` 강의 제목) | 제목은 그대로 둔다 (2장 작업자 판단, 단계 4.3) |

**언어 구분 없는 값 3곳** (보고서 7장 12번): docent 그림 `journey.marks[0].n`의 `1 · 2` → `1–2` (5.4), legal 그림 `repomap.tree[8].name`의 `법률.md · …` → `법률.md …` (말줄임만), genp 그림의 `Kd·ω`는 예외.

**분야와 역량 이름**: 라벨 안 병렬은 `/`다 (5.3 (4)). `ui.ts`의 분야, 역량 이름(용어집 6절)과 같은 성격인 콘텐츠 라벨도 같다: `profile.yaml` `trajectory` 라벨 `제어·자동화` → `제어/자동화`, `데이터 사이언스·머신러닝` → `데이터 사이언스/머신러닝`, `skills` 라벨 `서빙·인프라` → `서빙/인프라` (용어집 1절). 본문에서 이 이름을 그대로 쓸 때도 같은 표기다 (`skills` 요약의 `에너지/유틸리티`, `석유화학/철강`, 용어집 6절). 이름이 아닌 본문 나열(`Physical AI·에이전트 시스템 분야`)은 본문 기본 표대로 "와/과"다 (표본 중간안 `Physical AI와 에이전트 시스템 분야`, 용어집 9.5).

### 5.3 구분자 (컴포넌트와 UI 문구)

B 조합으로 확정 (2.3, 시안 `docs/design-drafts/g17/`). B를 기본으로 하고 (3) 문서 제목은 ` | `, (4) 국문 라벨 안 병렬은 `/`를 쓴다.

| 성격 | 기호 | 예 |
|---|---|---|
| (1) 키워드 나열 | 쉼표. 국문 두 말은 "와/과" | `Teaching, Books & Advisory`, `강의, 저서, 자문`, `지식재산과 출판물`, `강의와 자문`, `7 registered, 8 filed` |
| (2) 필드 구분 | 소속과 고객 사이는 쉼표, 덧붙는 값은 괄호 | `PwC Consulting, Samsung Electronics`, `AI Engineer (Director, R&D Group, GenON)`, `AgiBot X2 Ultra (Selected)` |
| (3) 문서 제목 | ` \| ` (`<title>`, og:title, CV PDF 바닥글에만) | `Kwang Myung Yu \| AI Engineer`, `유광명 \| 이력서`, `Kwang Myung Yu \| CV \| sguys99.github.io` |
| (4) 라벨 안 병렬 (국문) | `/` 붙여 씀. 영문 이름은 이미 `&`라 그대로 | `제어/최적화`, `석유화학/철강 (3)`. (1)과 겹치면 `LLM 에이전트/RAG, 예측, 제어/최적화` |
| (5) 빈 날짜 | 빈칸 | CV의 SW 등록 진행 중 2건 |

- 작업자 판단 (2장): meta description은 검색 결과에서 문장처럼 보이는 자리라 쉼표와 괄호를 쓴다. CV는 `Kwang Myung Yu, AI Engineer (Director, R&D Group, GenON)`, `유광명, AI Engineer (GenON R&D그룹 Director)`. 홈 description은 한 줄 소개라 그대로 둔다 (DESIGN.md 11.18).
- 모든 안 공통 (g17 README 1장): CV 역할은 기호 없이 다음 줄 (5.1), og:image:alt는 쉼표 (`Kwang Myung Yu, AI Engineer`, `유광명, AI Engineer`), 표준 구성 그림 대체 텍스트는 문장 (5.1), `dgWith` 국문은 `{a}, {b} 연동` ("와/과"는 앞말 받침에 따라 달라 자동으로 붙일 수 없음).

자리별 요약 (지금 값, 캡처, 안별 비교는 `docs/design-drafts/g17/README.md` 3장):

| 자리 | 파일 | 성격 | 바꾼 뒤 (영문 / 국문) |
|---|---|---|---|
| Teaching 섹션 제목, 메뉴 시트와 404 목록 | `ui.ts` `teaching` (`MenuSheet`, `NotFound`가 같이 씀) | (1) | `Teaching, Books & Advisory` / `강의, 저서, 자문` |
| IP 섹션 제목, 탭 | `ui.ts` `ip`, `tab_ip` | (1) | 영문 그대로 / `지식재산과 출판물` |
| CV 강의 제목 | `ui.ts` `cv_teaching` | (1) | 영문 그대로 / `강의와 자문` |
| 건수 줄 | `ui.ts` `regFiled`, `regPending`, `Teaching.astro` | (1) | `7 registered, 8 filed`, `Books 2, Teaching 6, Advisory 2` / `등록 7, 출원 8`, `저서 2, 강의 6, 자문 2` |
| 원장 역량 태그 줄, 모바일 분야 뒤 | `ProjectLedger` (join, CSS `content`) | (1)(4) | `LLM Agents & RAG, Forecasting`, `Robotics, Physical AI` / `LLM 에이전트/RAG, 예측, 제어/최적화` |
| 분야와 역량 이름 (칩, 원장 필터) | `ui.ts` `TAG_KO` (`Tags`, 원장 `data-label`) | (4) | `에너지/유틸리티`, `석유화학/철강`, `공공/법률`, `LLM 에이전트/RAG`, `제어/최적화` (용어집 6절) |
| 스택 줄 | `CaseStudy`, `Cv`, `PersonalProjects` (지금 ` / `) | (1) | `AgiBot SDK, SLAM, FastAPI` |
| 표준 구성 그림 | `StandardSet` | (1) | `LLM, STT, TTS` |
| 소속과 고객 | `ProjectLedger`, `Cv` | (2) | `PwC Consulting, Samsung Electronics` / `PwC 컨설팅, 삼성전자` |
| 로고와 고객 | `SelectedWork` | (2) | 로고 뒤 쉼표, 고객 이름 |
| CV 머리 | `Cv` | (2) | `AI Engineer (Director, R&D Group, GenON)` / `AI Engineer (GenON R&D그룹 Director)` |
| 학력 세부전공 | `About` | (2) | `M.S. in Electrical Engineering (Control & network optimization)` / `… 공학석사 (세부전공: …)` |
| 기종 비교 선정 표시 | `Comparison` | (2) | `AgiBot X2 Ultra (Selected)` / `AgiBot X2 Ultra (선정)` |
| 화면 캡션 | `Screens` | (2) | `… Nov 21, 2026 (legalq.dnotitia.ai)` / `… 캡처 (legalq.dnotitia.ai)` |
| 구조 표의 연결 라벨 | `CaseStudy` (`<em>· …</em>`) | (2) | 괄호. 그림이 없는 사례에만 나오는 표라 지금은 화면에 없음 (시안 범위 밖) |
| 문서 제목 | `Home`, `CaseStudy`, `Cv`, `pages/404` | (3) | `Kwang Myung Yu \| AI Engineer`, `… \| Kwang Myung Yu`, `Kwang Myung Yu \| CV`, `Page not found \| Kwang Myung Yu` / `유광명 \| AI Engineer`, `… \| 유광명`, `유광명 \| 이력서`, `페이지를 찾을 수 없습니다 \| 유광명` |
| og:image:alt | `Head` | 공통 | `Kwang Myung Yu, AI Engineer` / `유광명, AI Engineer` |
| CV description | `Cv` | 작업자 판단 | 쉼표와 괄호 (위) |
| CV PDF 바닥글 | `Cv` `@page` | (3) | `Kwang Myung Yu \| CV \| sguys99.github.io` / `유광명 \| 이력서 \| sguys99.github.io` |
| CV 역할 | `Cv` | 공통 | 기호 없이 다음 줄 (5.1) |
| CV 빈 날짜 | `Cv` | (5) | 빈칸 |

구현할 때 (g17 README 1장 공통, 5장):

- 쉼표는 앞말에 붙여 줄 머리에 오지 않게 한다 (스택 줄은 지금처럼 이름 `<span>` 안에 넣음). 그래서 중간점 앞에 두던 NBSP(`regFiled` 등)는 필요 없다. 괄호는 줄 머리에 와도 되는 기호라 NBSP를 두지 않는다
- 원장 태그는 태그마다 `white-space: nowrap`으로 묶는다 (지금 360 영문에서 `Control` / `& Optimization`으로 갈라지는 결함)
- 원장 분야 `<b>` 끝에 쉼표를 글자로 둔다. 데스크톱은 숨기고, 모바일은 `b::after` 대신 보인다 (복사하면 `RoboticsPhysical AI`로 붙는 결함, DESIGN.md 11.18)
- CV 역할은 인쇄 전용 `.row h3 > .sub { display: block }`을 화면에도 적용해 내린다. 바꾼 뒤 PDF 글자 위치(단계 3.4)와 `pdftotext -layout` 글자층을 확인한다
- 중간점이 아닌 기존 `/`(`03 / 08`, `{n} / {total}`, `GPA 3.83 / 4.3`, `Topbar` 모바일 `content: '/'`)는 대상이 아니다
- 컴포넌트 명세는 `DESIGN.md`(11.18의 "반영한 명세": 5.19 원장, 5.20 개인 프로젝트, 5.24.4 스택 줄, 7장 줄바꿈과 구두점 등)를 따른다. 11.8의 "구분자 앞 NBSP"는 11.18의 쉼표 규칙으로 대신한다

### 5.4 En dash

- 기간과 숫자 범위 표기로는 유지한다 (`2024.03 – 2024.09`, `1–4 weeks`, `#1–#5`. 콘텐츠 39곳 모두 범위). 문장을 잇는 데 쓰지 않는다.
- 중간점으로 적은 숫자 범위는 en dash로 바꾼다: docent 그림 `journey.marks[0].n`의 `1 · 2` → `1–2` (보고서 7장 12번, 글자도 줄어듦).
- 국문 본문에 이미 `~`로 쓴 범위(`Phase 1~3`, `7~10주`, `23~43 DoF`)는 그대로 둔다. 중간점을 범위로 바꿀 때는 같은 파일의 표기를 따른다 (`Phase 2·3` → `Phase 2~3`, 5.2).
- antislop-copywriting의 마지막 점검(em dash, en dash 확인)은 "문장 연결용 대시가 없는지"로 해석한다.

### 5.5 국문 종결

2장 통일 규칙: 국문 콘텐츠는 명사형 종결. 한 문장이면 마침표 없음, 두 문장 이상이면 문장마다 마침표. UI 안내 문장의 합니다체는 유지한다 (DESIGN.md 1장). `/humanize-korean`에는 6장 조건을 붙이고, 1.2 진단의 "줄마다 기존 종결 유형 유지"보다 이 통일 규칙이 우선한다.

고치는 법:

| 원래 종결 | 처리 | 예 |
|---|---|---|
| ③ `~함`, `~음`, `~됨` | 사실을 담은 명사로 끝낸다 (`대응 불가`, `수정 필요`, `호출 증가`, `바로 접근`). `상태`, `방식`, `구조`를 기계적으로 붙이지 않고, 다른 명사가 없을 때만 쓴다 (강도 시안 8장 3번) | `검색 호출 없이 파일 경로를 만들고 조문 제목을 바로 찾음` → `에이전트가 검색 호출 없이 파일 경로를 만들어 조문 제목에 바로 접근`, `... 조문을 찾도록 함` → `... 조문을 찾도록 구성` |
| ④ `~한다.`, `~다.` | 명사형 문장 | `회차를 시작한다.` → `회차 시작.`, `에이전트는 벡터 DB로 찾고 저장소로 확인한다.` → `에이전트는 벡터 DB로 조문을 찾고 저장소에서 확인` (한 문장이라 마침표 없음) |
| `~해야 함` (3곳) | 명사형. 영문에 `must`, `needs`가 있으면 `~필요`, 없으면 사실 명사구 | `저장소 구조가 바뀌면 프롬프트도 고쳐야 함` → `저장소 구조가 바뀌면 프롬프트도 수정 필요` (영문 `must`) |
| `~필요` | 영문에 `must`, `needs`가 있을 때만 둔다. 없으면 영문처럼 명사구로. 트레이드오프는 비용을 적는 명사구가 기본이다 (보고서 7장 10번, 강도 시안 8장 2번, DESIGN.md 1장과 11.18) | 유지: `API용 외부망 허용 필요` (영문 `Needs outbound internet`). 고침: `자체 파서 유지와 법령 개정 때마다 재적재 필요` → `자체 파서 유지와 법령이 바뀔 때마다 재적재` (영문 `A custom parser and re-indexing ...`) |

- 문제 줄(`problem`)은 A-18 처방(`~ 수행해야 하는 과제` → `~ 수행 필요`)을 쓰더라도 사례마다 `필요` 결말을 1개 이하로 두고 나머지는 사실 서술로 끝낸다 (보고서 7장 10번).

대상 범위 (보고서 7장 9번, 단계 8.2의 목표):

| 구분 | 곳 | 처리 |
|---|---|---|
| 25자 이상 문자열의 ③④ | 21 (24곳에서 말풍선 3 제외) | 고친다. 결정 근거와 트레이드오프, 그림 설명, 문제 목록, 비교 결론, 접근, 화면 설명, 배경 |
| 25자 미만의 결정 제목 | 3 (docent `decisions[2].title`, genp `decisions[0].title`, `decisions[3].title`) | 고친다. 짧아도 문장 자리다 |
| 25자 미만의 트레이드오프 | 3 (legal `decisions[2]`, lotte-ai `decisions[1]`, lotte-inventory `decisions[1]`) | 고친다 |
| 25자 미만의 표 칸과 다이어그램 라벨 | 12 (표 칸 3, 라벨 9) | 평가어와 상태어(`없음`, `강함`, `멈춤`, `찾음`)는 라벨 관례라 허용한다 (강도 시안 8장 4번). 예: `개정 이력·과거 원문 없음`의 `없음`(중간점만 고침), `선 채로 멈춤`, `규칙, 모델 없음` |
| 고객 목소리 말풍선 | 4 (samsung-consultation 그림 `problem.callouts`) | 제외. 고객 고충을 흉내 낸 해라체 인용이다 |

단계 8.2의 대상은 위에서 "고친다"인 27곳(25자 이상 21, 짧은 문장 6)이다.

마침표 규칙 위반 14건 (보고서 7장 11번):

- 한 줄 소개(`profile.yaml` `taglines`) 3건: 예외. 한 문장이어도 마침표를 둔다 (2장 작업자 판단, DESIGN.md 1장)
- 경력 요약(`experience.yaml` `summary`) 6곳: 문장 수와 관계없이 마침표. 한 문장인 `posco-enc.summary`도 끝 모양을 맞춰 마침표를 둔다
- genp `caseStudy.hardware.credit` 1건: 도구 오탐 (`Robotics.`처럼 소문자 뒤 마침표에서 문장을 나눔). 단계 7에서 빌드 검사로 붙이기 전에 `scripts/check-text.mjs`를 고친다
- 나머지 9건은 규칙대로 고친다: docent `caseStudy.journey.steps[1].body`, `caseStudy.safety[0]`, genp `caseStudy.outcome[0]`, legal `caseStudy.compare.verdict`, `caseStudy.screens.slices[0].notes[0].body`, `personal/mcp-connectors.md` `summary`, genp 그림 `episode.metrics`, `episode.note`, lotte-price 그림 `results.note`

그 밖에:

- 따옴표 안 직접 인용(`"해외직구 세금이 어떻게 되나요?"`, 음성 `"멈춰"`)과 말풍선은 바꾸지 않는다 (5.8).
- 결정 표 칸은 한 문장으로 둔다 (2026-11-22 결정, 2장). 두 문장이 필요한 내용은 쉼표나 명사형으로 압축하고, 칸 안에 마침표가 섞이지 않게 한다. 강도 시안 중간안의 legal `decisions[3].rationale`도 한 문장으로 다시 맞춘다.

### 5.6 국문 점검표

1.2 진단의 지배 패턴 6개와 보고서 7장 14번 목록이 기준이다. "한 카드"는 프로젝트 파일 하나다 (1.2 진단 입력의 한 묶음). 다이어그램 라벨과 표 칸은 B-1, B-2 표기 통일만 본다 (5.2).

- [ ] **C-8 대구** "A가 아닌 B", "A가 아니라 B": 꼭 필요한 1곳만 남기고 직접 단언한다. 결정 제목의 `~가 아닌` 3건은 고른 것만 남긴다. 예: `하나가 아닌 두 지식원의 상호 보완` → `서로 보완하는 두 지식원`
- [ ] **A-18 긴 좌향 관형절과 빈 머리명사**: 빈 머리명사(`과제`, `조건`, `구조`, `위험`)를 떼고 사실을 담은 명사로 끝낸다 (`~ 반출할 수 없는 조건` → `~ 반출 불가`). 관형절이 두 겹 이상이면 줄 안에서 마침표나 쉼표로 끊고 "무엇을 만들었나"를 앞에 둔다. `~ 기능을 갖춘 N`은 `~를 넣은 N`으로 바꾸거나 따로 떼고, `~ 규칙을 가진 N`은 `~ 규칙을 둔 N`. 예: legal `approach[2]` → `질문을 6가지 의도로 분류해 ... 경로를 고르는 시스템 프롬프트 설계. 최신성 신호가 있으면 ... 키워드 검색으로 전환.`
- [ ] **A-11 `~을 위한`**: 한 카드에 1회만. 나머지는 `~용`, 동사 관형형, 삭제 중에서 고른다. 예: `딥러닝 모델 구동을 위한 SW 플랫폼` → `딥러닝 모델 구동용 SW 플랫폼`. 15회 중 9회가 sinter, visual-inspection, petrochemical
- [ ] **A-13 명사 더미와 `및`, `기반`**: 공통 서술이 걸리는 범위를 조사로 드러낸다 (`A, B, C를 정의하고 D, E는 직접 개발`, 끝은 명사형). 조사 없는 명사가 4어절 이상 이어지면 "을/를", "의", "하는" 중 하나로 끊는다. `및`은 "와/과"나 쉼표로 바꾸고 중간점으로는 바꾸지 않는다 (학과 같은 고유 명칭의 `및`은 제외). `X 기반`은 굳은 기술 명칭(`RAG 기반`, `규칙 기반`, `SLAM 기반`)만 두고 한 카드 2회 이하. 나머지는 `~를 활용한`, `~로 하는`
- [ ] **D-7 범위와 전환 공식**: 줄 머리의 `A부터 B까지,`는 없애고 핵심 명사를 앞에, 범위는 줄 뒤에 사실로 붙인다 (예: `볼록 최적화 프로그램부터 마이크로컨트롤러 구동 MPC까지, 발전용 보일러 최적제어 연구`). `부터~까지`는 범위 자체가 정보인 곳만 남긴다 (지금 10줄의 절반 이하). 영문을 유지하는 실제 작업 순서 3건도 국문 어순은 바꾼다 (보고서 7장 4번). 개념적 `A에서 B로 전환`, `바뀐다`는 바뀐 뒤 상태를 직접 쓰고 이전 상태는 `~ 대신`으로 남긴다. `~을 넘어`는 `~만 하지 않고`. 숫자 변화(`MAPE 6.5%에서 3.4%로`)는 대상이 아니다
- [ ] **F-7 범용 동사**: `확보`는 무엇이 어떻게 됐는지로 푼다 (`정확도와 비용 확보` → `정확도는 높이고 비용은 낮춤`, 원문이 뜻하는 방향만). `종속`은 `~에 따라 정해짐`, `~에 묶임`, `발생`은 `~이 생김`, `~이 남`. 한 줄에 `총괄`이 두 번이면 하나를 `주도`로 (genp 역할 줄)
- [ ] **A-15 무생물 주어**: 사람 동사가 붙은 무생물 주어는 사람(현업, 팀, 에이전트)을 주어로 돌리거나 `~로는` 꼴로 바꾼다. 예: `기본 1,000자 청크는 조문을 자르거나 묶어 인접 청크 호출이 늘었고, ...` → `기본 1,000자 청크로는 조문이 잘리거나 묶여 인접 청크 호출 증가. ...`. 영문 짝(보고서 P9, P13)과 함께 고친다
- [ ] **B-2 대응어 통일**: 같은 글이나 용어집에 국문 표기가 있으면 그쪽으로 바꾼다 (`Admin` → `관리자`, `Depth 카메라` → `깊이 카메라`, `Manipulation` → `조작`, `온프렘` → `온프레미스`, `non-agentic 워크플로우` → `에이전트 없이 ... 워크플로우`, `현장 딜리버리` → `현장 구축과 납품`). 국문 표기가 없는 기술 용어(`Pseudo Query`, `lag`, `Teleop`)와 용어집이 영문 유지로 정한 용어는 둔다. `Predefined 답변`은 모듈명일 수 있어 산문과 그림 라벨을 함께 바꾸거나 둘 다 둔다
- [ ] **B-1 괄호 병기**: 화면마다 첫 등장 1회만 (`프로젝트 관리(PM)`, `제품 총괄(PO)`, `예측 오차(MAPE)`, `비상정지(E-Stop)`). 요약 줄과 케이스 스터디 본문이 다른 화면이면 각 화면의 첫 등장은 둔다
- [ ] **C-11 연결어미 뒤 쉼표**: `-고`, `-며`, `-지만`, `-면서`, `-아서/-어서`, `-아/-어` 뒤 쉼표를 뺀다. 빼면 붙어 읽히는 곳(`묻고, 답은`이 "묻고 답하다"로 읽힘)은 문장을 나눈다 (강도 시안 8장 7번)
- [ ] **콜론으로 문장을 잇는 곳** (legal `compare.verdict` 1곳). 라벨형(`발견:`, `예:`, `세부전공:`)과 작업 뒤 도구 목록(`teaching.yaml`)은 정상
- [ ] **동의어 돌려쓰기 금지**: 어휘 다양도(0.46)가 낮은 것은 기술 용어가 사례마다 반복되기 때문이다. 어휘를 다양하게 하려고 같은 대상을 다른 말로 바꾸지 않는다 (용어 일관성 우선)
- [ ] **국소 결함 4곳** (보고서 4.1, 해당 줄만): `가용 가능한` (동의어 중복), `청크는 ... 호출이 늘었고` (주어와 서술 어긋남), `시연 한 번이 ... 라벨을 단다` (뒷절 주어), `의도 규칙을 가진` (have 직역)
- [ ] 낮음: `~적 + 명사` 추상 체인(F-5)과 피동 번역투. 1.2에서 지배 패턴이 아니었다 (사람 글 기준 이하). 눈에 띄면 고치되 찾아다니지 않는다

**정함 (2026-11-22, 2장)**: 대칭 "A는 ~고 B는 ~"는 실제 역할 분담을 설명할 때만 케이스 스터디당 1회 허용한다 (강도 시안 8장 11번). 1.3 스캔은 이 꼴을 대칭 대구에 가깝다고 봤고(legal 결정 근거 3곳), 표본 중간안은 기존 3곳을 남기고 legal `approach[0]`에 하나를 새로 만들었다 (`벡터 DB는 의미로 조문을 찾고 Markdown 저장소는 ... 맡도록 설계`).

### 5.7 영문 점검표 (antislop-copywriting 기준)

- [ ] **Em dash 0** (5.1)
- [ ] **부정 대구**: `X, not Y`, 꼬리 `rather than`, 부정 서두(`Not one or the other:`), 격언형 부정 정의(`A demo is not an acceptance test; ...`)를 긍정 단언으로 바꾼다. 버린 대안은 근거 문장이 이미 설명한다. 예외: lotte-inventory `Finds a good combination, not a proven optimum.`은 휴리스틱과 최적해의 실제 대비라 둔다 (보고서 7장 8번 (마))
- [ ] **결정 제목**: 고른 것을 단언형 명사구로 쓰고 버린 대안은 이유 칸에 둔다. `, not`은 금지. 비교 틀(`instead of`, `over`, `A, B` 대구)은 실제로 검토한 대안이 정보인 5개만 둔다 (보고서 7장 3번, 강도 시안 8장 1번). 국문 제목도 같이 고친다
  - 둘 것 5: docent `decisions[1]` (`Fixed-pose basket instead of grasping`), lotte-inventory `decisions[0]`, lotte-price `decisions[0]`, samsung-scm `decisions[0]`, `decisions[2]`
  - 바꿀 것 8: `, not` 4 (legal `decisions[0]`, `[1]`, genp `decisions[0]`, samsung-consultation `decisions[0]`), docent `decisions[3]`, lotte-inventory `decisions[1]`, lotte-ai `decisions[2]`, samsung-consultation `decisions[1]`
  - 예: `Two complementary sources, not one` → `Two complementary sources`, `Routing in one agent's prompt, not a multi-agent system` → `Intent routing inside one agent's prompt`
  - 순서가 곧 결정인 제목 3개(`Score first, then classify`, `A PoC before any system build`, `Benchmark before models`)는 비교 틀이 아니라 그대로 (보고서 8.2)
- [ ] **시제**: 끝난 일은 과거형, 진행 중인 일(현재 역할과 진행 중 프로젝트)은 현재형 (보고서 7장 2번, DESIGN.md 1장과 11.18). 과거형 목록 안에 `-ing`를 섞지 않는다. 대상 8곳: docent `summary`, `highlights[0..2]`, `caseStudy.approach[3]`, genp `summary`, `caseStudy.approach[2]`, `[3]`. 예: `Delivering a docent humanoid robot ...` → `Deliver a docent humanoid robot ...`, `Leading development of GenP, ...` → `Lead development of GenP, ...`
- [ ] **세미콜론**: 문장을 잇는 세미콜론은 마침표로 나눈다 (19건, docent와 genp에 15건). 예: `... lifts accuracy on proper nouns; if confidence stays low ...` → `... lifts accuracy on proper nouns. If confidence stays low ...`. 그대로 둘 것: 표 칸 9곳(docent 비교표 7, genp 사양 1, legal 비교표 1)의 약식 표기, 따옴표 안 인용 2곳, profile `skills[1].summary`의 목록 묶음 구분. 고칠 것: samsung-consultation 그림 말풍선 2곳(`problem.callouts[0]`, `[2]`)은 세미콜론을 빼고 줄바꿈만 남긴다 (`Too many lookalikes;\nreviews hard to trust` → `Too many lookalikes\nreviews hard to trust`). awards `pnu-honors.title`은 설명이라 쉼표나 `and`로. legal 그림 범례 설명 `prompt.texts[0]`은 중간안대로 쉼표 (보고서 7장 5번)
- [ ] **콜론**: 결론을 터뜨리는 콜론(`Not one or the other: ...`)과 격언형 콜론(`EACH LAYER DOWN: LESS INFORMATION, MORE PRECISION` → `Each layer down adds precision` 식 한 절, 대문자는 그림 규칙이라 유지)만 고친다. 라벨형 콜론 15곳은 정상
- [ ] **꾸밈용 범위 "from X to Y"**: 고칠 것 7건 (profile `about`, `availability[4]`, `trajectory[1].description`, genp `caseStudy.context[0]`, `highlights[2]`, samsung-consultation `caseStudy.problem[2]`, lotte-ai `caseStudy.role[1]`). 예: `..., from solar power forecasting and transformer anomaly detection to a machine vision platform.` → `..., including solar power forecasting, transformer anomaly detection, and a machine vision platform.` 둘 것: 수치 범위 10, 실제로 바뀐 과정 5, 실제 작업 순서 3 (boiler `summary`, distribution `summary`, genp `caseStudy.approach[3]`) (보고서 7장 4번, 8.2)
- [ ] **`end to end`**: 범위를 말하는 `role` 2곳(samsung-scm `caseStudy.role[0]`, lotte-price `caseStudy.role[0]`)만 둔다. `highlights[0]` 3곳(power-plant, samsung-consultation, samsung-scm)과 genp `summary`의 `end-to-end`는 뺀다 (`Led the project end to end` → `Led the project`)
- [ ] **상투구 반복과 격언형**: 같은 상투구를 여러 곳에 되풀이하지 않는다. `early wins` 3곳은 원자료 확인(5.8)을 따르고, 확인 전에는 lotte-ai `decisions[2].rationale` 1곳만 평이하게 바꾼다 (`Commercial tools can go live first, while tasks that need new data wait ...` 식). 격언형(`An edge built on open models is short-lived, ...`)은 원문 뜻만 평이하게 쓰고 새 주장을 넣지 않는다. 꼬리 분사 `, covering ...`(4곳)는 고치면서 늘리지 않는다. `customer journey`는 CX 용어이고 그림 단계와 짝이라 단어는 두고 문장만 사람 주어로 바꾼다 (보고서 7장 6번)
- [ ] **억지 세 항목 나열**: 원자료에 있으면 그대로, 없으면 줄인다 (원자료 확인 대상, 5.8). 세 항목 나열 약 70곳은 대부분 실제 항목이라 정상
- [ ] **행위자 없는 수동태, 사람 동사를 쓴 무생물 주어**: 성과 문장은 본인을 주어로 (`localization and path planning are implemented` → `Implemented localization and path planning`), 문제 문장은 같은 사례에 나온 사람을 주어로 (`Mix plans were built by hand` → `Planners built mix plans by hand`). 행위자보다 대상이 주제인 수동태 약 13곳과 docent 명단 삭제의 수동태는 정상 (보고서 8.2, 7장 8번 (마))
- [ ] **유행어와 과장** (Empty AI Vocabulary, Significance Inflation): `showcase`, 근거 없는 `instant` 등. 예: `Built a demo dashboard to showcase the chatbot.` → `Built a demo dashboard for the chatbot.`
- [ ] **따옴표**: 곧은 따옴표(`"`)로 통일한다 (곡선 따옴표는 genp 3곳)
- [ ] **Title Case**: 목록 항목에는 쓰지 않는다. 섹션 제목 말고는 About 궤적 단계 이름(`trajectory` 라벨, `h3`)과 역량 표 머리(`skills` 라벨, `dt`)만 Title Case를 유지한다 (`Control & Automation`, `Serving & Infrastructure`. 용어집 9.4의 제목형 라벨, DESIGN.md 11.18)
- [ ] **동사로 시작, 결과 중심 1~2줄** (DESIGN.md 1장) 유지. 예외: docent, genp `caseStudy.role[0]`이 직함 명사구로 시작하는 것은 둔다. 결정 표의 이유와 설명은 완결 문장이고, 트레이드오프는 비용을 적는 명사구도 된다 (`A custom parser and re-indexing whenever statutes change.`, DESIGN.md 1장). 개인 프로젝트 8건의 `Built a ... that ...` 틀은 유지하고, 단계 4.2에서 다른 이유로 고치는 카드만 동사를 바꾼다
- [ ] **적극 2곳** (2.3 강도 결정)
  - 두 줄을 넘는 긴 문장(보고서 P12 길이 4건): 두 문장으로 나눈다. legal `caseStudy.approach[2]` (48단어), docent `caseStudy.compare.verdict` (46), genp `caseStudy.approach[2]` (35), `highlights[1]` (33). 나누는 자리는 보고서 8.1의 고칠 방향을 따른다
  - 비교 결론(`compare.verdict`): 결론 동작만 남긴 한 문장으로 다시 쓴다. 예: `Not one or the other: the agent finds with the vector DB and confirms with the repository.` → `The agent finds articles with the vector DB and confirms them in the repository.` (국문 `에이전트는 벡터 DB로 조문을 찾고 저장소에서 확인`)
  - **정함 (2026-11-22, 2장)**: 경력형 항목(`highlights`, `role`, `approach`, `outcome`)을 둘로 나누면 둘째 문장도 동사로 시작한다 (강도 시안 8장 10번). 아래 예처럼 명사로 시작하는 둘째 문장은 동사로 다시 쓴다. 보고서 8.1의 samsung-scm `role[1]` 방향은 "둘 다 동사 시작"이고, 표본 적극안 `approach[2]`과 보고서 E1의 lotte-price 예는 `The same prompt ...`, `The target was ...`처럼 주어로 시작한다

### 5.8 지킬 것

- **사실 불변**: 숫자, 날짜, 고유명사(회사, 조직, 직함 포함), 제품명, 모델명, 괄호 안 약어는 키별로 전후가 같아야 한다 (`node scripts/check-text.mjs --facts 8ee3c7a`). 도구는 한글 고유명사와 한글 단위를 보지 않으므로 그 부분은 눈으로 대조한다.
- **의도한 국문화**: 일반 영어를 국문으로 옮긴 곳(`non-agentic` → `에이전트 없이`, `Admin` → `관리자` 등, 5.6 B-2)은 사실 변경이 아니지만 `--facts`가 차이로 잡는다. **정함 (2026-11-22, 2장)**: 허용 목록은 두지 않고, 배치마다 사람이 확인해 10장 진행 기록에 적는다 (강도 시안 8장 8번).
- **고정 문구**: 프로젝트 제목은 기호만 바꾸고(`운영·정비이력` → `운영/정비이력`), 한 줄 소개와 발표물 제목(논문, 보고서, 특허, 책, 강의)은 손대지 않는다 (2장). 학과, 기관, 학회지 이름(`전기 및 전자공학`, `제어로봇시스템학회 논문지` 등)도 그대로 둔다.
- **인용은 원문 그대로** (보고서 8.3): `"해외직구 세금이 어떻게 되나요?"`, `"회사에서 갑자기 해고 통보를 ..."`, `“빨간 컵 있는 곳으로 가”`, 음성 `"멈춰"`, samsung-consultation 그림의 고객 고충 말풍선 4줄. docent 시나리오의 `고정 자세로 바구니를 받치고`도 실물을 받치는 경우라 그대로.
- **영문이 원본이다**: 국문은 영문과 같은 정보를 담되 문장 구조는 따라가지 않아도 된다. 국문이 영문과 다르면 영문에 맞춘다 (강도 시안 8장 9번: 빠진 `often`은 `대개`로, `could not`에 맞춰 `어려웠고`를 `대응 불가`로, `then`은 `~에 이어`로). 국문이 더 구체적이면 국문을 두고(`Article-level chunks`와 `조·항 단위 청크`), 영문을 보완할지는 사용자에게 묻는다.
- **원자료 확인이 필요한 문장** (보고서 7장 7번): 해당 파일 작업 직전에 사용자에게 한 번에 묻고 항목마다 "원자료에 있음/없음"만 받는다. 답 전에는 그 구절을 고치지 않는다 (CLAUDE.md 규칙 2). 없으면 1.4 방향대로 줄이거나 삭제한다. 대상: lotte-ai `context[0]`와 `problem[0]`의 세 항목, `approach[3]`의 세 항목, genp `decisions[0].rationale`의 세 항목, `decisions[0].tradeoff`의 `edge`와 `lasting advantage`, docent `roadmap.note`의 주체, lotte-price `problem[0]`의 주체(구매 담당), samsung-consultation `problem[1]`의 `costing sales`, `early wins` 3곳, genp `domains` 표의 세 항목 칸. **정함 (2026-11-22, 2장)**: 단계 4 시작 때 원자료와 대조해 모두 답을 받음. 항목별 처리는 2장 "원자료 확인 (5.8)" 행.
- **줄 구조**: 한 줄이 콘텐츠 필드 하나다. 항목 수와 순서를 바꾸지 않고, 줄 안에서만 마침표나 쉼표로 끊는다 (보고서 8.3).
- **다른 지표를 늘리지 않는다**: 고치면서 중간점, 콜론, 대구를 새로 만들지 않는다. `및`을 중간점으로 바꾸지 않는다. 처방 예에 남은 중간점은 5.2로 푼다.
- **용어**: `docs/glossary.md`를 따른다. 표기를 바꾸면 용어집을 먼저 고친다.
- **다이어그램 글자**: 상자 안에 들어가야 한다. 넘치면 문구를 줄이는 쪽을 먼저 택한다 (단계 5.2).

---

## 6. 진행 방식 (C 상세)

```
단계 1 진단
  기계 집계 (스크립트) ─┐
  국문 진단 (humanize-korean 진단 단계만) ─┼─> 진단 보고서 ─> 사용자 우선순위 결정
  영문 진단 (antislop-copywriting 점검표) ─┘
단계 2 시안
  구분자 시안 g17 + 윤문 강도 시안 (표본 글) ─> 사용자 선택 ─> DESIGN.md, 용어집, 점검표 확정
단계 3~6 적용 (배치마다)
  영문 수정 ─> 국문 수정 (짧은 문장: 직접 / 두 문장 이상 설명: humanize-korean, 명사형 유지 조건)
  ─> 사실 대조 ─> 빌드 ─> 화면 확인 ─> 커밋
단계 7 재발 방지 / 단계 8 최종 검수
```

`/humanize-korean` 사용 조건:

- 장르는 `report`로 둔다. 입력에 "명사형 종결 유지, 마침표 규칙(2장) 유지, 문장 길이 늘리기와 종결어미 바꾸기 금지, 사실과 고유명사 불변"을 함께 준다.
- 결과는 원문과 나란히 놓고 검토한다. 명사형 통일이나 사실을 건드린 곳은 되돌린다.
- 작업 폴더 `_workspace/`가 저장소 루트에 생기므로 단계 0에서 `.gitignore`에 넣는다.

---

## 7. 단계별 작업

각 단계는 끝날 때 `npm run build`, 해당 화면 확인, 커밋으로 마무리한다. 작업은 `master`에서 하고, push는 사용자가 요청할 때만 한다.

### 단계 0. 준비

- [x] 0.1 `docs/tasks.md` Backlog에 이 작업을 추가하고 이 문서를 연결
- [x] 0.2 `.gitignore`에 `/_workspace/` 추가 (humanize-korean 작업 폴더)
- [x] 0.3 기준 커밋 해시를 이 문서 10장에 기록 (되돌리기와 사실 대조의 기준)
- [x] 0.4 문구 도구 만들기: `scripts/check-text.mjs` (의존성 추가 없음, 설치된 `yaml` 사용)
  - [x] `--report`: 4장의 집계를 파일별로 출력 (em dash, 중간점, 국문 종결 ①~④, 대구, 영문 신호). `--detail`은 적중 위치 목록, `--json`은 기계용
  - [x] `--facts <기준 커밋>`: 문자열 키별로 숫자, 날짜, 라틴 문자 고유명사, 괄호 안 약어가 기준과 같은지 대조
  - [x] `--dump <en|ko> [--pairs]`: 키 경로와 함께 문구 전체 추출 (단계 1 진단 입력), `--self-test`
  - 기본 실행(빌드용)은 단계 7.1에서 붙인다
- [x] 0.5 수정 전 화면 캡처: 홈, `/cv/`, 케이스 스터디 8건, 각 다이어그램을 영문/국문, 데스크톱/360px로 캡처 (커밋하지 않음, 단계 5 비교용)
  - 도구 `scripts/capture-pages.mjs` (커밋함). 결과 `_workspace/shots/before/` (커밋 안 함, `manifest.json` 참고)

### 단계 1. 진단 보고서 (수정 없음)

- [x] 1.1 `node scripts/check-text.mjs --report`로 기계 집계 (결과 `_workspace/diagnosis/report*.txt`, `dump-*.txt`)
- [x] 1.2 국문 진단: 국문 전체를 뽑아 `/humanize-korean`의 진단 단계(`humanize-diagnostician`)만 실행해 지배 패턴 3~6개와 근거 수집
  - 입력 26,065자 (제목, 소속, 한 줄 소개 제외), 진단 `_workspace/2026-11-22-001-0d41/02_diagnosis.md`
- [x] 1.3 국문 표본 측정: `/humanize-scan`으로 산문 블록 3~4개의 신호 개수 기록 (단계 8에서 다시 측정해 비교)
  - 결과와 블록별 키 경로, 재측정 기준: `_workspace/diagnosis/scan-before.md`. 짧은 문장(E-1)과 명사형 연속(E-2)은 의도된 형식이라 발동 수에서 뺌 (단계 8도 같은 조건)
- [x] 1.4 영문 진단: 5.7 점검표로 전체 영문을 훑어 패턴별 위치 목록 작성 (`_workspace/diagnosis/en-diagnosis.md`)
- [x] 1.5 `docs/anti-ai-slop-report.md` 작성: 파일별 표, 패턴별 대표 예문, 굳은 말 목록(5.2), 우선순위 제안
- [x] 1.6 **[확인]** 사용자가 보고서를 보고 우선순위와 점검표 확정 (추천대로, 2장)

### 단계 2. 시안과 기준 확정 (CLAUDE.md 규칙 1)

- [x] 2.1 구분자 시안 `docs/design-drafts/g17/`: 2~3안을 실제 화면(섹션 제목, 메타 줄, 페이지 제목, 기술 스택 줄, 건수 줄, CV 머리, 빈 날짜 표시)에 적용. 데스크톱/모바일, 라이트/다크, 영문/국문
  - A 글자 구분(쉼표, `/`, ` | `), B 문장 부호와 말(쉼표, 괄호, "와/과"), C 여백과 선(CSS 세로선 + 숨긴 쉼표). 비교 `index.html`, 설명 `README.md`, 캡처 `shots/` 296장
- [x] 2.2 윤문 강도 시안: 같은 표본에 2~3단계 강도 적용 (`docs/design-drafts/g17/tone/README.md`, `samples.md` 57쌍)
  - 표본: profile 요약, 경력 1건, 케이스 스터디 1건(`legal-agentic-rag`: ③④, 대구, 콜론이 모두 있음), 다이어그램 라벨 일부
  - 보수: 기호, 종결, 명백한 패턴(대구, "X, not Y")만. 문장 구조 유지
  - 중간: 보수 + 번역투 정리(관형절 사슬 나누기, 명사 나열 풀기), 영문 콜론과 꾸밈용 범위 정리
  - 적극: 중간 + 국문을 한국어 어순으로 재구성, 영문 문장도 재구성. 정보 단위는 유지
- [x] 2.3 **[확인]** 사용자가 구분자 안과 강도를 선택 (또는 조합): B 조합, 중간 + 적극 2곳 (2장)
- [x] 2.4 `DESIGN.md` 반영
  - [x] 11장에 11.18 "AI 흔적 제거" 결정 기록 (구분자, 강도, 종결 통일, 중간점 대체 기준)
  - [x] 1장 어조 표에 "그림 설명, 결정 근거" 행 추가, 섹션 제목 예시(`지식재산 · 출판물`) 갱신
  - [x] 구분자를 다루는 컴포넌트 명세와 줄바꿈 규칙(중간점 앞 NBSP) 갱신
- [x] 2.5 `docs/glossary.md` 국문 표기 6건 갱신 (4.1 표)과 분야, 역량 이름의 국문 표기 확정 (`에너지·유틸리티`, `석유화학·철강`, `공공·법률`, `LLM 에이전트·RAG`, `제어·최적화`, `제어·자동화` 등)
- [x] 2.6 5장 점검표와 중간점 대체 기준 확정

### 단계 3. UI 문구와 구분자

- [x] 3.1 `src/i18n/ui.ts`: 섹션 제목, 건수 줄, 분야와 역량 이름, 연동 표시(`{a}·{b} 연동`), 스크린 리더 라벨
- [x] 3.2 컴포넌트 구분자를 시안 결과로 교체: `ProjectLedger`(CSS `content` 포함), `CaseStudy`(스택 줄, 페이지 제목, 그림 라벨), `Cv`(머리, 바닥글, 역할 구분, 빈 날짜), `Home`, `Head`(OG 대체 텍스트), `About`, `Teaching`, `SelectedWork`, `Comparison`, `Screens`, `pages/404`
  - 시안 조사에서 더한 것: `PersonalProjects` 스택 줄(`/`를 쉼표로), `StandardSet` 그림 글자 `LLM · STT · TTS`, 원장 역량 태그 `nowrap`과 분야 `<b>` 끝 쉼표(현재 결함 2건: 360px 영문 `& Optimization` 줄 머리, 복사 텍스트 `RoboticsPhysical AI`). 규칙은 5.3과 DESIGN.md 11.18
- [x] 3.3 `StandardSet.astro` 대체 텍스트의 em dash
- [x] 3.4 CV 역할 구분을 바꾼 뒤 PDF 글자 위치 확인 (`Cv.astro` 주석: 이 구분자를 다른 글자 묶음으로 나누면 PDF 글자가 밀렸던 이력)
- [x] 3.5 빌드, 홈과 `/cv/` 영문/국문 확인, 커밋

### 단계 4. 본문 윤문 (배치마다 영문 → 국문)

배치마다 아래 순서를 반복한다.

1. 영문: 5.7 점검표와 선택한 강도로 수정
2. 국문: 기호(5.2), 종결(5.5), 5.6 점검표. 두 문장 이상인 설명은 `/humanize-korean` (6장 조건)
3. `node scripts/check-text.mjs --facts <기준 커밋>`으로 사실 대조
4. 빌드, 해당 화면 확인, 커밋

- [x] 4.0 높음 9건 먼저 일괄 수정 (1.6에서 추가, 보고서 6장): em dash 2, 결정 제목 `, not` 4, 부정 결론 2, 축 없는 범위 1. 어느 강도에서나 고치는 것이고 화면 배치를 바꾸지 않는다
- [x] 4.1 프로필과 경력: `profile.yaml`, `experience.yaml`, `education.yaml`, `awards.yaml` (사이드바, About, Experience, CV 머리)
  - 끝나면 영문 CV PDF 1쪽을 다시 확인: 3.2 이후 마지막 경력 행(POSCO E&C)이 2쪽으로 넘어감. 요약이 짧아져 1쪽에 들어가는지 보고, 그래도 넘치면 사용자에게 다시 묻는다 (2장)
- [x] 4.2 일반 프로젝트 12건과 개인 프로젝트 10건 (`projects/` 중 케이스 스터디가 없는 것, `personal/`). 제목은 기호만 (`power-plant-maintenance-assistant.md`의 `운영·정비이력` 1곳)
- [x] 4.3 특허, SW, 논문과 보고서, 강의 (`patents`, `software`, `publications`, `teaching`). 제목은 그대로, 설명만
- [x] 4.4 케이스 스터디 8건, 한 건씩 커밋. 순서는 단계 1 보고서의 우선순위를 따른다 (1.6 확정: legal은 강도 시안 표본이라 첫 번째, genp와 docent는 문체가 같아 이어서)
  - [x] `legal-agentic-rag.md`
  - [x] `genp-humanoid.md`
  - [x] `docent-humanoid.md`
  - [x] `samsung-consultation-assistant.md`
  - [x] `lotte-price-forecasting.md`
  - [x] `samsung-scm-agent.md`
  - [x] `lotte-ai-masterplan.md`
  - [x] `lotte-inventory-blend-optimization.md`

### 단계 5. 다이어그램 (`src/content/diagrams/` 8건, 중간점 387개)

글자 위치가 SVG 좌표로 고정돼 있어, 문구가 길어지면 상자를 넘칠 수 있다. 파일마다 따로 커밋한다.

- [x] 5.1 파일마다: 문구 수정 → 단계 0.5 캡처와 비교 (데스크톱, 360px, 라이트/다크, 영문/국문)
- [x] 5.2 넘치면 문구를 먼저 줄이고, 그래도 안 되면 상자 크기 조정. 크기 조정이 기존 디자인을 바꿀 정도면 사용자에게 확인. 순서는 4.4와 같다 (1.6 확정, 괄호는 중간점 수)
  - [x] `legal-agentic-rag.yaml` (76)
  - [x] `genp-humanoid.yaml` (107)
  - [x] `docent-humanoid.yaml` (49)
  - [x] `samsung-consultation-assistant.yaml` (56)
  - [x] `lotte-price-forecasting.yaml` (38)
  - [x] `samsung-scm-agent.yaml` (17)
  - [x] `lotte-ai-masterplan.yaml` (4)
  - [x] `lotte-inventory-blend-optimization.yaml` (40): 수정 전에도 라벨 1곳이 상자를 넘고 1곳이 꽉 참 (0.5). `and`보다 쉼표
- [ ] 5.3 그림 전용 컴포넌트 문구 확인: `Comparison`, `StandardSet`, `LayerStack`, `EpisodeLoop`, `DomainTable`, `RepoMap`, `Screens`, `TaskSelection`, `Quadrant`, `RoadmapGantt`, `ResultsChart`, `RoleShift`

### 단계 6. 메타 정보와 CV 결과물

- [ ] 6.1 `dist/`에서 페이지 제목, description, OG 대체 텍스트, JSON-LD 문구 확인 (영문/국문 모든 페이지)
- [ ] 6.2 CV PDF 2건(`/cv/kwang-myung-yu-cv.pdf`, `/ko/cv/yu-kwang-myung-cv-ko.pdf`) 열어 구분자, 줄바꿈, 쪽 나눔 확인

### 단계 7. 재발 방지

- [ ] 7.1 `scripts/check-text.mjs` 기본 실행을 `npm run build` 끝에 추가: `src/content/` 값, `src/i18n/ui.ts`, 컴포넌트 출력 문구(빌드된 `dist/` HTML과 CSS `content`)에 `—`나 나열용 `·`가 있으면 실패. 예외는 5.2의 예외 목록 (`N·m`, `Kd·ω`, `조·항`, `조·항·호`, 강의 제목의 `학부·석사`)
  - `yaml`은 `devDependencies`에 직접 선언한다. 새로 설치하는 것이 아니라 astro 하위 의존성(지금 2.9.1)을 쓰던 것을 선언만 하는 것으로, astro가 하위 의존성을 바꿔도 검사가 깨지지 않게 한다 (보고서 7장 15번)
- [ ] 7.2 `CLAUDE.md` 규칙 2에 표기 규칙(em dash 금지, 중간점 대체, 국문 종결) 추가, "콘텐츠 갱신 절차" 확인 순서에 문구 검사 언급
- [ ] 7.3 `.claude/commands/add-project.md`, `add-entry.md`의 작성 안내에 같은 규칙 추가
- [ ] 7.4 `docs/glossary.md` 머리말에 표기 규칙 한 줄 추가
- [ ] 7.5 낡은 표기 정리 (2026-11-22 사용자 요청): `docs/basic-plan.md`의 `PM·PO`, 용어집 7.3 `Download CV (PDF)` 메모를 `ui.ts` `cvPdfName`과 DESIGN.md 5.1(`Download PDF (CV)` / `PDF 다운로드 (CV)`)에 맞춤, 용어집 9.5 첫 줄 "영문 항목과 1:1"을 5.8과 맞춤

### 단계 8. 최종 검수와 인계

- [ ] 8.1 `npm run build`, `npm run format:check` 통과
- [ ] 8.2 `node scripts/check-text.mjs --report`: em dash 0, 나열용 중간점 0 (5.2 예외만 남음), 국문 종결 ③④는 5.5 대상 27곳(25자 이상 21, 결정 제목과 트레이드오프 6)이 0. 남아도 되는 것은 고객 목소리 말풍선 4곳과 25자 미만 표 칸, 다이어그램 라벨의 평가어와 상태어 12곳
- [ ] 8.3 `/humanize-scan`으로 단계 1.3 표본을 다시 측정해 전후 비교
- [ ] 8.4 전체 화면 확인: `/`, `/ko/`, `/cv/`, `/ko/cv/`, `/work/<slug>/` 8건과 국문 경로, 404. 데스크톱/모바일, 라이트/다크
- [ ] 8.5 `docs/tasks.md` 갱신. 대기 중인 1.2.11(영문 전체 검토)과 1.3.2(국문 전체 검토)는 이번에 다듬은 문구로 진행한다고 적음
- [ ] 8.6 **[확인]** 사용자 최종 검토. push와 배포는 요청이 있을 때

---

## 8. 위험과 대응

| 위험 | 대응 |
|---|---|
| 윤문 중 사실이 바뀜 (규칙 2 위반) | 키별 사실 대조(0.4), 영문 원본과 국문 대조, 배치마다 diff 검토 |
| 과하게 고쳐 어조가 흔들림 | 단계 2에서 고른 강도만 적용, humanize-korean 변경률 게이트, 결과를 원문과 나란히 검토 |
| humanize-korean이 명사형 종결을 서술형으로 바꿈 | 입력 조건 명시, 위반 문장은 되돌림 |
| 다이어그램 글자 넘침 | 수정 전후 캡처 비교(0.5, 5.1), 360px 확인 |
| 용어 표기가 용어집과 어긋남 | 표기를 바꿀 때 용어집 먼저 수정(2.5) |
| 구분자 교체로 줄바꿈이나 PDF 글자 위치가 깨짐 | 시안 단계에서 줄바꿈 확인, PDF 확인(3.4, 6.2) |
| 빌드 검사가 정상 표기를 막음 | 예외 목록(5.2 예외 표: `N·m`, `Kd·ω`, `조·항`, `조·항·호`, `학부·석사`)을 스크립트에 두고, 새 예외는 이 문서 5장에 기록 |

## 9. 열린 질문

| 질문 | 정할 때 | 결과 |
|---|---|---|
| 구분자를 무엇으로 바꿀지 | 2.3 | B 조합 (2장) |
| 윤문 강도 | 2.3 | 중간 + 적극 2곳 (2장) |
| 분야, 역량 이름의 국문 표기 (`제어·최적화` 등) | 2.5 | 라벨 안 병렬은 `/` (`제어/최적화`, 2장 구분자 결정). 용어집 반영은 2.5 |
| 굳은 말(`시행령·시행규칙`, `조·항`) 처리 | 1.6 | 보고서 5장 제안대로 풀거나 `/`, `~`로. `조·항`, `조·항·호`만 예외로 유지 |
| 단계 1 보고서에서 새로 나온 패턴을 점검표에 넣을지 | 1.6 | 넣음 (보고서 7장 14번). 반영은 2.6 |
| 추적하지 않는 원자료 폴더 7개(`docs/project-references/`)를 `.gitignore`에 넣을지 | 2026-11-22 | 넣음 (2장) |
| 본문 짝 표기, `Vision 판독`, 결정 표 칸 문장 수, 대칭 문장 | 2026-11-22 | 2장 |

정한 질문: 프로젝트 제목과 한 줄 소개의 처리, 문서 공개 여부 (2026-11-22, 2장). 위 표의 1.6, 2.3 결정 (2026-11-22).

## 10. 진행 기록

| 날짜 | 단계 | 내용 | 커밋 |
|---|---|---|---|
| 2026-11-22 | 계획 | 이 문서 작성. 별도 검토자가 읽고 남긴 질문 3건 중 2건은 사용자가 결정, 1건(한 줄 소개 마침표)은 작업자 판단 | |
| 2026-11-22 | 0.1~0.3 | tasks.md Backlog에 항목 추가, `.gitignore`에 `/_workspace/`. **기준 커밋 `8ee3c7a`** (`8ee3c7aeb4826ae57d5f8fc992d0460052d95738`, 문구 수정 전 마지막 커밋). 사실 대조는 `--facts 8ee3c7a` | `dbb4dfd` |
| 2026-11-22 | 0.5 | `scripts/capture-pages.mjs --label before`로 11쪽 × 영문/국문 × 1440/360 × 라이트/다크: 전체 화면 88장, 그림 264장(33개), 360px 그림 전체 116장. 기준선: 360px 가로 넘침 0. 그림 글자 넘침은 영문 1곳(그린소재 흐름도 `stock age · re-feed ratio`, 360px에서 상자 밖 1.4), 꽉 찬 상자 2곳(`grade · quantity · batch`, `+ validity check`), 연결선 라벨 바탕보다 긴 것 8곳(1440). 비교는 같은 폭끼리만 (배율마다 SVG 글자 폭이 다름). 빌드는 Node 24 필요 (`nvm use`) | `ff7008e` |
| 2026-11-22 | 0.4 | `scripts/check-text.mjs` 작성. 집계가 4장과 맞음 (쌍 1,437, em dash 2, 중간점 국문 452 + 영문 162 + 언어 구분 없는 값 3 + `N·m` 2). 차이: 국문 종결은 판정 방식 차이로 ① 319, ② 17, ③ 14, ④ 10. en dash 39는 국문과 `years` 필드까지 센 값이고 모두 범위 표기. from X to Y 27 (숫자 10, 기타 17). UI와 컴포넌트 40줄 (· 43, — 6). 기호만 바꾸면 `--facts` 차이 0을 확인. 한계: 한글 고유명사와 한글 단위, 영문 수사는 대조하지 않음 (스크립트 머리 주석) | `8e46512` |
| 2026-11-22 | 1.1, 1.3 | 1.1 기계 집계 결과를 `_workspace/diagnosis/`에 저장. 1.3 표본 4블록(A 프로필 소개 392자, B legal-agentic-rag 문제와 결정 643자, C docent-humanoid 결정과 그림 설명 806자, D 경력 요약 6곳 640자). 발동 신호 A 0, B 3(부정 대구 C-8 4건, 연결어미 뒤 쉼표 C-11 5건, 당위 결말 I-4), C 2(C-11 7건, I-4), D 0. 명사 나열형인 A와 D의 문제(중간점, 같은 말 반복)는 스캔이 보지 못하므로 단계 8에서는 `check-text.mjs` 지표로 비교 | `5492297` |
| 2026-11-22 | 1.2 | humanize-korean 정량 점수 route_hint heavy. 지배 패턴 6개: ① A-18 긴 좌향 관형절과 빈 머리명사(`~하는 과제`, `~ 기능을 갖춘 N`) ② A-11 `~을 위한 N` 약 15회 ③ A-13 조사 없는 명사 더미와 `및` 24회, `기반` 약 35회 ④ D-7 `A부터 B까지` 10회, 개념적 `A에서 B로 전환` 약 6회 ⑤ F-7, A-15 범용 동사(`확보` 6회)와 무생물 주어 ⑥ B-2 대응어가 있는데 남은 영어와 표기 불일치(`Admin`과 `관리자 페이지`, `Depth 카메라`와 `깊이 카메라`, `온프렘`과 `온프레미스`). `~적` 추상 체인, 피동, 대명사는 지배 패턴 아님 | `ffda75a` |
| 2026-11-22 | 1.4 | 영문 1,437개 전체 판독. 문제 100건 (높음 9, 중간 38, 낮음 53), 유행어(leverage, robust 류) 0. 높음 9건: em dash 2, 결정 제목 `, not` 4, 부정 결론 2, 축 없는 범위 1. 몰린 자리: 결정 제목(24개 중 13개가 비교 틀), 근거와 트레이드오프의 세미콜론 19, 시제(진행 중 프로젝트의 `-ing`) 13, 행위자 없는 수동태 11, `end to end` 6. 파일 순위: genp 43점, docent 32, legal 17, samsung-consultation 14, samsung-scm 12 | `823e394` |
| 2026-11-22 | 2.1 | 구분자 시안 g17 (단계 1과 병렬 진행). 5쪽 × 4안(현재, A, B, C) × 4조합, CV PDF 첫 쪽과 끝 쪽. 80쪽 모두 가로 넘침 0, 줄 머리 구분 글자 0. 세 안 공통: CV 역할은 기호 없이 다음 줄로(PDF 글자 밀림 이력 해소), `dgWith` 국문은 `{a}, {b} 연동`. 새로 찾은 자리: `PersonalProjects` 스택 줄(이미 `/`), `MenuSheet`, `NotFound`, `Tags`, `Topbar` 모바일 `content: '/'`. 현재 결함 2건: 360 영문 원장 `& Optimization` 줄 머리, 원장 복사 텍스트 `RoboticsPhysical AI` 붙음 | `52f2889` |
| 2026-11-22 | 2.2 | 표본 57쌍(영문 5,526자, 국문 2,530자)에 보수, 중간, 적극 적용. 바뀐 글자 비율 영문 2.5%, 3.5%, 7.0%, 국문 6.7%, 20.4%, 27.0% (적극은 프로필에서 33.2%로 humanize 경고선 30% 넘음). 1.3 블록 B 신호: 부정 대구 4 → 0, 0, 0, 연결어미 뒤 쉼표 5 → 5, 0, 0. 세 강도 모두 em dash, 중간점, 대구 0, 다이어그램 라벨 길어진 것 0, 사실 차이는 의도한 `non-agentic` 국문화 1건. 작업 파일 `_workspace/tone/` | `a5db79a` |
| 2026-11-22 | 1.5 | 진단 보고서 `docs/anti-ai-slop-report.md`. 흔적의 대부분이 케이스 스터디 8건에 있음 (콘텐츠 중간점 617개 중 550개, 국문 ③④ 43곳 전부, 영문 문제 점수 156점 중 145점). 굳은 말 후보 25개 약 50곳 (풀기 14, `/` 8, `~` 1, 유지 2). 판단 필요 15건은 보고서 7장, 강도 시안에서 나온 규칙 12건은 `g17/tone/README.md` 8장 | `943e55c` |
| 2026-11-22 | 1.6, 2.3 | 사용자 결정: 구분자 B 조합, 강도 중간 + 적극 2곳, 판단 사항 27건 추천대로, 원자료 pptx 유지 (2장). 4.0 추가, 4.4와 5.2 순서 갱신, 9장 결과 기록 | `f9bf0cc` |
| 2026-11-22 | 2.4 | DESIGN.md 11.18 추가, 1장 어조 표(그림 설명과 결정 근거 행, 시제, 경력 요약 마침표), 5장과 6장의 구분자 명세, 7장 줄바꿈과 구두점 표, 10장 인쇄. 3.1 작업자가 찾은 5.21 건수 줄 옛 표기 2행은 오케스트레이터가 고침 | `a146594` |
| 2026-11-22 | 2.5 | 용어집: 4.1 표의 6건, 분야와 역량 국문 이름 `/`, 9.5 개정과 9.6 "구두점과 기호" 신설, 굳은 말과 B-2 대응어 통일(`온프레미스`, `깊이 카메라`, `조작`, `납품`), 소제목 10개의 중간점. 단계 4~5에서 바꿀 콘텐츠 목록은 작업자 보고에 따라 해당 단계에서 다시 뽑는다 (`check-text.mjs --report --detail`) | `ce789e8` |
| 2026-11-22 | 2.6 | 5장 확정본 (5.1 em dash 8곳 표, 5.2 본문 기본 표와 굳은 말과 예외, 5.3 B 조합 규칙과 자리별 요약 21행, 5.5 종결 대상 27곳, 5.6과 5.7 점검표, 5.8). 7.1 예외 목록과 `yaml` 직접 의존성, 8.2 목표 범위. 사용 한도로 한 번 끊겼다가 이어서 끝냄. 남은 미정 5곳은 사용자 답과 작업자 판단으로 정함 (2장) | |
| 2026-11-22 | 3.1 | `src/i18n/ui.ts`: `teaching`, `ip`, `tab_ip`, `regFiled`, `regPending`, `dgWith`, `cv_teaching`, `TAG_KO` 5개. 빌드 통과, 4조합(en 1280 라이트, en 360 다크, ko 1280 다크, ko 360 라이트)에서 가로 넘침 0, 원장 필터 동작 확인. `check-text` UI 줄 40 → 27 (ui.ts 0). 3.2 전까지 국문 원장에 `/`와 `·`가 섞여 보이는 과도기 | `e999eac` |
| 2026-11-22 | 문서 정리 | 사용자 승인: `.gitignore`에 `/docs/project-references/` (추적 중인 pptx 3건은 그대로), CLAUDE.md 건수를 대표 8건, 케이스 스터디 8건으로. `basic-plan.md`와 용어집 7.3은 7.5로 미룸 | `b17131f` |
| 2026-11-22 | 3.2, 3.3 | 컴포넌트 15개: 원장(소속과 고객 쉼표, 태그 `nowrap`, 분야 `<b>` 끝 쉼표 `.pl-sep`), 케이스 스터디(제목 ` \| `, 스택 줄 쉼표, 흐름 라벨 괄호), CV(머리 괄호, 역할 다음 줄, 빈 날짜 빈칸, 바닥글과 제목 ` \| `, description 쉼표와 괄호), Home, Head, About, Teaching, SelectedWork, Comparison, Screens, PersonalProjects, StandardSet(`LLM, STT, TTS`, 스크린 리더 문장은 새 `ui.ts` 키 `ssLink`), 404. `check-text` UI 줄 27 → 0. 화면 28조합: 360px 넘침 0, 줄 머리 구분자 0 (1,455줄), 현재 결함 2건 해소. 영문 CV PDF는 5쪽 (작업자 확인으로는 이번 변경 전에도 5쪽, 3.4에서 기준 커밋과 대조) | `a77bb22` |
| 2026-11-22 | 3.4 | 기준 `8ee3c7a`, 3.1 `e999eac`, HEAD를 각각 빌드해 PDF 비교. 쪽수 영문 5, 국문 4로 전후 같음 (영문 5쪽은 `cd3e7eb` 그린소재 케이스 스터디 추가부터). 같은 줄 글자 x 좌표와 폭 차이 0.000000pt, 역할 줄 글자 간격 차이 1e-6pt 이하 (예전 0.002pt 밀림 재발 없음). 글자층: 역할 줄 분리, 머리 괄호, 스택 쉼표, 바닥글 ` \| `, 빈 날짜, em dash 8 → 0 모두 통과. 영문 1쪽 마지막 경력 행이 2쪽으로 넘어감 (2장 결정). 이번과 무관한 기존 현상: 국문 PDF 라틴 글자 간격 불균일 (tasks.md Backlog). 자료 `_workspace/stage3/3.4/` | `137674e` |
| 2026-11-22 | 3.5 | 독립 검수 6항목 모두 통과: 빌드, `format:check`, `check-text` UI 0줄, `--facts 8ee3c7a` 차이 0 (4,633키). 수정 전후 캡처 468쌍 중 170쌍이 바뀌었고 모두 구분자 자리와 그에 따른 1~2px 밀림. 360px 넘침 0 → 0, 그림 글자 넘침 20 → 20 (기준선 그대로). 메타 151필드에 em dash 0. 공개 사이트 HTML 4쪽이 로컬 빌드와 바이트 단위로 같고 PDF 2건 새 바닥글. **단계 4로 넘길 것**: em dash 2곳(4.0), 국문 콘텐츠 `·`(홈 58곳, CV 43곳), `/ko/` 360 대표작 요약 `에이전트·RAG`의 `·` 줄 머리(samsung-consultation `summary`), 국문 description 2쪽, genp 표준 구성 유닛 이름(`Unitree G1 · on-board` 등, 스크린 리더 문장에도 나옴), genp 그림 fig-04 `LLM · STT · TTS`와 표준 구성 `LLM, STT, TTS` 불일치(5.2), docent `summary` 시제. 단계 3 이전부터의 결함 1건은 tasks.md Backlog (CV 섹션 제목 복사 텍스트). 자료 `_workspace/stage3/3.5/`, `_workspace/shots/after-stage3/` | `99df91b` |
| 2026-11-22 | 단계 0~3 완료 | 다음은 4.0 (높음 9건). 4.1 뒤 영문 CV 1쪽 재확인 | `99df91b` |
| 2026-11-22 | 단계 4 준비 | 단계 4는 배치마다 작업 에이전트 1개가 고치고 오케스트레이터가 검토, 빌드, 기록, 커밋, push (사용자 요청: 항목마다 push). 작업자 공통 지시 `_workspace/stage4/brief.md`. 원자료 확인 11곳을 미리 조사해 사용자 답을 받음 (2장) | |
| 2026-11-22 | 4.0 | 높음 9건, 6개 파일 9키: 결정 제목 `, not` 4 (legal 2건은 표본 중간안, samsung-consultation `A modular platform shared across channels`, genp `A custom AI stack on a stock humanoid and open models`), 부정 결론 2 (legal `verdict`는 적극 예 그대로, genp `problem[2]`는 격언을 빼되 검수 기준이라는 정보는 `To pass acceptance`로 남김), em dash 2 (scm은 세 에이전트를 괄호로, lotte-price는 두 문장이고 둘째도 동사 `Targeted`로 시작), profile `trajectory[1]`은 `including` 나열. 의도한 사실 차이 2키: genp `decisions[0].title` en/ko에 `AI` (같은 결정의 이유 칸에 있는 말). 국문 두 문장 2줄은 humanize-korean light 경로(변경률 0.0%, 되돌림 0). 빌드, 서식 통과, HTML em dash 0, 캡처 48회 가로 넘침 0. 단계 5로: scm 그림 라벨 `Work support (AI Advisor)`와 본문 영문 `the AI Advisor for work support`의 표현 차이 (국문은 같음) | `84fd347` |
| 2026-11-22 | 4.1 | 4개 파일 26키 (profile 15, experience 9, education 1, awards 1). 4.1~4.3은 파일이 겹치지 않아 작업자 3명을 동시에 돌리고, 오케스트레이터가 배치마다 나머지를 stash에 둔 채 빌드해 따로 커밋. 영문: `about`은 표본 중간안(`including its definition and VLA training pipelines`), `availability[4]`는 범위 대신 `System architecture and VLA data and training pipelines for ...`, awards 제목 세미콜론은 쉼표 (용어집 8절도). 국문: 중간점 38 → 0 (라벨 `제어/자동화`, `데이터 사이언스/머신러닝`, `생성형 AI/에이전트`, `서빙/인프라`, 업종 `에너지/유틸리티`, `석유화학/철강`, 같은 줄에 괄호가 걸린 `이상탐지/시계열 예측/컴퓨터 비전(...)`), 경력 직함 3곳 ` / `, 경력 요약 `및` 5 → 0, `~을 위한` 1 → 0, `기반`은 굳은 명칭만, `trajectory[0]`의 `모델 기반 예측 제어(MPC)`는 같은 카드 `about`에 먼저 나와 `MPC`만 (B-1), `then`은 `~에 이어`. humanize-korean light(두 문장 이상 6줄, 스킬 출력 변경 0, 지적 3곳 손으로 반영, 기준 대비 7.9%, gate OK). 의도한 사실 차이 1키: `availability[4].en`의 `Physical`이 문장 가운데로 옮겨 이름으로 잡힘 (낱말은 같음). 4.1만 넣은 빌드 통과, 홈과 CV 16회 캡처 가로 넘침 0. 영문 CV PDF 5쪽, 국문 4쪽 그대로이고 POSCO E&C 행은 여전히 2쪽 첫 줄 (그대로 두기로, 2장) | `abfc7c4` |
| 2026-11-22 | 4.2 | 22개 파일 중 20개, 37키 (lunchmate, practice-git-materials는 고칠 곳 없음). 일반 프로젝트 12건의 `summary`와 `highlights`는 지금 화면에 나오지 않고 (원장과 CV는 제목, 소속, 고객, 태그만), 화면 변화는 power-plant 국문 제목 `운영/정비이력`(원장, CV, 국문 PDF)과 개인 프로젝트 카드. 영문 2: equipment `showcase` 삭제, power-plant `end to end` 삭제. 국문: 중간점 28 → 0, `~을 위한` 12 → 5 (카드당 1회, 제목과 같은 말만), `및` 10 → 0, `기반` 12 → 5 (굳은 명칭이나 영문 `based`), boiler와 distribution `summary`는 영문 작업 순서는 두고 국문 줄 머리 범위만 뒤로, petrochemical `추적성·재현성 확보를 위한` → `모델을 추적하고 재현할 수 있는`, 연결어미 뒤 쉼표 2 → 0. 오케스트레이터 보정 2: pyroad는 다른 카드처럼 "무엇인지"로 끝나게 `...를 넣은 초등학생용 파이썬 학습 플랫폼` (영문 `interactive`는 `대화형`과 `인터랙티브 파이썬`이 다른 뜻으로 읽혀 넣지 않음), mcp-connectors는 두 문장 마침표 대신 한 문장 (개인 카드 10건 중 마침표 끝이 이것 하나라 모양을 맞춤). ai-daybook 비용 표기는 사용자 답대로 (2장). 의도적 국문 보완: euro-digest와 research-curator `매일`(영문 `daily`), mcp `실행`(`running`), boiler `구현`(같은 카드 하이라이트). humanize-korean light(mcp 1줄, 변경 0). 4.2만 넣은 빌드 통과, 사실 차이 새로 0, 홈과 CV 16회 캡처 가로 넘침 0 | `d7af568` |
| 2026-11-22 | 4.3 | `patents`, `software`, `publications`는 설명 필드가 없고(제목, 발표처, 저자만) 고칠 것 0. `teaching.yaml` 1키 5값: 인천대 자문 설명 국문 `개발 및 배포 환경 구축` → `개발하고 배포 환경 구축` (`개발과 배포 환경`은 "개발 환경과 배포 환경"으로 읽혀 쓰지 않음), 진행 중이라는 사용자 답에 따라 같은 항목 영문 설명 4줄을 현재형(`Advise`, `Support`, `Develop ... and build`). 그대로 둔 것: 강의 제목 `학부·석사`(5.2 예외)와 강의 제목 안의 `및` 2곳(`커리큘럼 기획 및 강의`, `제어 시스템 및 데이터 분석 기술 실무 과정 강의`, 5.8 고정 문구), 라벨형 콜론 4. 빌드 통과, 사실 차이 새로 0, 홈 Teaching 섹션 확인 | `9a70bde` |
| 2026-11-22 | 4.4 legal | 28키 (영문 8, 국문 27값). 표본 `g17/tone/samples.md` 3장 "중간" 열을 옮기고, 표본 뒤 규칙과 어긋난 7곳은 규칙대로: `조·항` 예외 유지(표본의 `조와 항` 대신, 4곳), `Dense/BM25`(영문 `Dense and BM25`도), `approach[2]` 적극(두 문장, 둘째 `Instructed the agent to ...`), 대칭 "A는 ~고 B는 ~" 4 → 1 (실제 역할 분담인 `decisions[0].rationale`만), `decisions[3].rationale` 한 문장, `problem[0]`은 영문 `, not in legal terms` 삭제에 맞춰 국문 `법률 용어 대신`도 뺌, `context[0]`의 `such as`를 질문 쪽으로. 표본 밖: `outcome[2]` 병렬(`rejection of personal data in input`), 비교표 선택지 이름은 괄호(`Vector DB (Seahorse)`, `벡터 DB(Seahorse)`), 조 번호 쉼표, `시행령과 시행규칙`, `공포일과 시행일`. 오케스트레이터 보정: 비교표 라벨 국문 `컨텍스트 효율` → `컨텍스트 비용`(영문 `Context cost`와 틀을 맞춤, 5.8), 용어집 5.2절에 `non-agentic workflow` 행 추가. 지표: 국문 중간점 30 → 4 (모두 `조·항`), 25자 이상 ③④ 6 → 0, 짧은 ③④ 3 → 2 (표 칸 `강함`, `시차 있음`, 허용), 대구 0, 연결어미 뒤 쉼표 9 → 0. 의도한 사실 차이 1키: `problem[1].ko`의 `non-agentic` 국문화. humanize-korean light(7줄, 변경 0, 기준 대비 24.8%, gate OK). 빌드 통과, 캡처 8회 가로 넘침 0과 그림 글자 넘침 0 (after-stage3과 같음), 국문 CV PDF 4쪽 그대로. 단계 5로: 그림의 `Repository · legalize-kr`, `Vector DB · Seahorse MCP`를 괄호로, `arch.nodes[11].sub`는 `Dense/BM25 하이브리드, 조·항 단위 청크`, 범례 `법률, 시행령, 시행규칙 세트`, 말풍선 `개정 이력/과거 원문 없음`, `원문 인용 · 출처 · 면책`과 본문 `주의와 면책` | `3c073da` |
| 2026-11-22 | 4.4 genp | 49쌍 수정. 진행 중인 개발과 시연 완료 항목의 시제를 구분하고 관제시스템 설명을 두 문장으로 나눔. 공개 국문과 대조해 운영 인력당 담당 세대, 일일 위임 태스크, 현장별 센서 계측, 부분 ASR 전사를 영문에 반영. 나열 중간점 52개 정리, 단위 `N·m` 보존. 사실 검사 신규 차이 5키는 요약의 E2E 삭제, ASR 영문 보완, 조작 국문화, Vision AI 양 언어 반영. 국문 복문 light 게이트 통과. 빌드와 링크 정상, 상세 8조합 가로 넘침 0, SVG 경고 4개는 기준과 동일. 단계 5에서 온프레미스, VR Teleop, LLM/STT/TTS 라벨 대조. | `907d26a` |
| 2026-11-22 | 4.4 docent | 41쌍 수정. 진행 중인 일은 현재형으로 쓰고, 기종 선정 이유와 G1 호환 근거를 두 문장에 나눠 담음. 기존 국문에 있는 명단 자동 삭제, 0 토크 정지, 감사 로그, 모션 제작과 배포, 운영 중 충전 가능 여부를 영문에도 명시. Step 2의 일정과 범위는 시범운영 자료로 고객과 협의. 나열 중간점 33개 정리, 25자 이상 종결 오류 7개 해소, 복문 7개 light 통과. 누적 사실 검사에서 이 사례의 차이 0. 빌드와 링크 정상, 상세 8조합 가로 넘침 0, SVG 경고 4개는 기준과 동일. 단계 5에서 깊이 카메라와 정지 경로, System 1/2, STT/TTS 표기를 대조. | `b2203c7` |
| 2026-11-22 | 4.4 samsung-consultation | 18쌍 수정. 고객이 단계마다 다른 담당자에게 문의한 과정, 전화 연결 지연으로 인한 이탈과 매출 기회 감소를 영문에 반영. 한국어 요약은 에이전트와 RAG의 역할을 풀어 쓰고 운영 이관 주체를 명시. 중간점 13개 정리, 국문 복문 0. 사실 검사에서 관리자 국문화 2키, Text-to-SQL을 제목에서 근거로 옮긴 양 언어 4키 확인. 빌드와 링크 정상, 상세 8조합 가로 넘침 0, 그림 경고 4개는 기준과 동일. 단계 5에서 정형/비정형과 단순형/정보형 라벨 대조. | `03246a1` |
| 2026-11-22 | 4.4 lotte-price | 21쌍 수정. 구매 담당자를 견적 검토의 주체로 명시. 1–4주와 1–3개월 후 예측의 MAPE 목표(10% 이하), 비교 대상(규칙 기반 방식), 실측(5.9%에서 1.3%)을 구분. 주기성, 모델 선정 근거와 견적 검토에 예측 모델을 도입한 사실도 대조. 나열 중간점 8개 정리. 사실 검사 신규 차이는 Direct/Recursive의 국문화 1키. 목표 설명 복문은 light로 검토. 빌드와 링크 정상, 상세 8조합 가로 넘침 0, 그림 경고 2개는 기준과 동일. 단계 5에서 재귀 예측과 예측 기간 라벨 대조. | `f01aea7` |
| 2026-11-22 | 4.4 samsung-scm | 17쌍 수정. SQL 생성 정확도의 목표 95%와 평가 결과 95% 이상을 구분하고, 조회 성과는 담당자 회신 없이 자연어로 데이터를 조회하고 차트를 확인하는 동작으로 설명. 국문에 있는 개발 총괄과 운영 환경의 수동 배포를 영문에 반영. 본문의 나열 중간점 5개와 문장 연결 세미콜론을 정리. 국문 역할 설명 light 통과, 사실 검사 신규 차이 0. 빌드와 링크 정상, 상세 8조합에서 가로 넘침과 그림 글자 넘침 0. 단계 5에서 업무 지원 에이전트의 영문 라벨을 대조. | `a6df3bb` |
| 2026-11-22 | 4.4 lotte-ai | 18쌍 수정. 2개월은 로드맵 수립에 걸린 기간, 정의서는 로드맵 26개 과제마다 작성한 문서라고 명시. 원자료에 없는 평가 축 3개를 삭제하고 당시 우선순위를 정할 기준이 없었다는 사실을 남김. 공개 국문에 따라 유사 과제 통합 검토와 AI 전담 조직을 영문에 명시. 상용 솔루션은 로드맵 전반부에 배치. 국문 중간점 13개 정리, 복문 0, 사실 검사 신규 차이 0. 빌드와 링크 정상, 상세 8조합 가로 넘침과 그림 글자 넘침 0. 단계 5에서 간트의 앞쪽 배치와 매트릭스의 작은 성공을 구분. | `55e9b1c` |
| 2026-11-22 | 4.4 lotte-inventory | 21쌍 수정. 점도 예측 목표(MAPE 5% 이내, 1초 이내)와 실측(MAPE 3.4%, 약 1초)을 구분. 점도맵의 기존 소요 시간은 10분 이상, 기존 솔버는 300초 이상으로 국문과 원자료를 대조. 모의 계획 20건 중 18건에서 조합 산출, 산출 조합의 레시피 오차는 2% 이내로 별도 표기. 나열 중간점 1개 정리, 비교 문구는 휴리스틱의 한계를 설명하는 승인 예외. 국문 복문 0, 사실 검사 신규 차이 0. 빌드와 링크 정상, 상세 8조합 가로 넘침 0, 그림 경고 6개는 기준과 동일. 단계 5에서 재고 기간과 재투입 비율 라벨의 기존 넘침을 확인. | 이 행을 추가한 커밋 |

**단계 4 완료 (2026-11-22).** 다이어그램을 제외한 콘텐츠 38개 파일, 영문/국문 626쌍에서 em dash와 나열용 중간점은 0개다. 남은 중간점은 법률 표기 `조·항` 4곳, 강의 제목 `학부·석사` 1곳, 토크 단위 `N·m` 영문과 국문 각 1곳이다. 25자 이상 국문의 종결 ③④는 0곳이며 짧은 표 칸의 상태 표현 3곳은 승인 예외다. `--facts 8ee3c7a`로 4,633개 키를 대조해 차이 16개를 각 배치 기록과 확인했다. 이어서 작업한 7건은 상세 화면 56조합에서 가로 넘침 0, 새 SVG 글자 넘침 0이었다. 영문과 국문 홈, CV의 변경 문구도 브라우저에서 확인했다. 최종 빌드, 링크, 서식 검사가 통과했고 CV PDF는 영문 5쪽, 국문 4쪽이다. 다음 작업은 단계 5의 다이어그램이다.

### 단계 5 진행 기록

| 날짜 | 항목 | 결과 | 커밋 |
|---|---|---|---|
| 2026-11-22 | 5.2 legal-agentic-rag | 나열과 이름 설명에 쓴 중간점 73개 정리(공통 파일명 1개 포함). 법령 단위 표기 3곳의 중간점 4개 보존. Dense/BM25와 법령 파일 세트를 본문과 대조. 사실 검사 4,633키 차이 0. 빌드와 링크 통과, 기준 캡처와 상세 화면 8조합 비교. 가로 넘침과 SVG 텍스트 넘침 0. | `1b8def4` |
| 2026-11-22 | 5.2 genp-humanoid | 나열용 중간점 107개 정리, 수식 Kd·ω 보존. 온프레미스와 VR Teleop 표기를 맞추고 계층별 변환과 학습 트랙 설명을 대조. 국문 복문 light 통과. 사실 검사의 차이 3키는 영문 대문자 라벨 2개와 Teleop 표기. 연결선 바탕의 영문 글자 폭 추정치를 브라우저 실측에 맞춰 조정. 기준 이미지 76쌍에서 상자와 바탕 넘침, 잘림, 새 겹침 0. 빌드와 링크 통과. | `5fb14d1` |
| 2026-11-22 | 5.2 docent-humanoid | 나열 49개와 언어 공통 단계 번호 1개를 정리해 중간점 50→0. 방문 단계 1–2, STT/TTS, 깊이 카메라 표기를 대조하고 비상정지 3경로와 거리 기준을 보존. 사실 검사의 차이 1키는 Depth의 국문화. 빌드와 링크 통과, 기준 이미지 64쌍에서 넘침과 잘림 0. | `47b8a82` |
| 2026-11-22 | 5.2 legal 재확인 | 5.7에서 쉼표로 정한 영문 프롬프트 범례 1곳 반영. 사실 차이 0이며 공통 바탕 폭 조정 후에도 기준 이미지 84쌍에서 넘침과 잘림 0. | `895e888` |
| 2026-11-23 | 5.2 samsung-consultation-assistant | 나열용 중간점 56개 정리. 말풍선의 영문 세미콜론 2곳을 줄바꿈으로 바꾸고 고객 표현 보존. 정형/비정형, 단순형/정보형과 세 유형 나열을 구분하고 결제와 프로모션을 영문에 반영. 제품 검증 라벨을 줄여 모바일 여백 확보. 사실 차이 0. 빌드와 링크 통과, 기준 이미지 56쌍에서 넘침과 잘림 0. | `92517fa` |
| 2026-11-23 | 5.2 lotte-price-forecasting | 중간점 38개 정리. 예측 구간(1–4주, 1–3개월)과 SHAP를 구분하고 MAPE 목표 10%, 기준 5.9%, 최종 1.3%와 비교 구성 7개를 대조. 사실 차이 1키는 Recursive의 국문화. 국문 결과 설명 light 통과. 빌드와 링크 통과, 기준 이미지 44쌍에서 넘침과 잘림 0. | `d75dbb4` |
| 2026-11-23 | 5.2 samsung-scm-agent | 중간점 17개 정리. 모델 종류와 모델명을 괄호로 구분하고 흐름의 AI Advisor 표기를 아키텍처와 본문의 업무 지원 역할에 맞춤. 사실 차이 0. 빌드와 링크 통과, 기준 이미지 32쌍에서 넘침과 잘림 0. | `406e57c` |
| 2026-11-23 | 5.2 lotte-ai-masterplan | 나열용 중간점 4개 정리. 매트릭스에는 상용 솔루션으로 작은 성과를 얻는 목적을, 간트에는 로드맵 전반부 일정을 명시. 원자료의 단일 과제인 고객사, 경쟁사, 기술 동향을 양 언어로 대조. 매트릭스 국문 4칸 light 통과. 사실 차이 0. 빌드와 링크 통과, 기준 이미지 44쌍에서 넘침과 잘림 0. | `aaafecf` |
| 2026-11-23 | 5.2 lotte-inventory-blend-optimization | 나열용 중간점 40개 정리. WMS, MES 및 조합 탐색과 기준 충족 조건을 양 언어로 대조. 모바일 영문 흐름도에서 재고 기간과 재투입 비율 라벨은 양끝 1.4단위 넘침에서 4.1단위 여백으로, 등급과 수량 및 차수 라벨은 1.3에서 6.9단위 여백으로 개선. 노드 크기와 좌표 보존. 사실 차이 0. 빌드와 링크 통과, 기준 이미지 44쌍에서 넘침과 잘림 0. | 이 행을 추가한 커밋 |
