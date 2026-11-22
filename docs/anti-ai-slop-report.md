# anti-ai-slop-report.md: AI 흔적 진단 보고서

작성 2026-11-22. `docs/anti-ai-slop-plan.md` 단계 1.5의 산출물이다. 단계 1.1~1.4의 진단 결과를 한곳에 모으고, 단계 1.6에서 사용자가 정할 것을 7장에 번호로 정리했다. 이 단계에서는 문구를 고치지 않았다.

- 이 문서도 새 규칙을 따른다. em dash와 나열용 중간점은 쓰지 않고, 원문 인용만 백틱 안에 그대로 둔다
- 원문 인용은 모두 저장소에 이미 있는 문구다 (`src/content/`, 3.3의 `src/i18n/ui.ts`와 컴포넌트, 용어집). 고친 예시는 1.2(국문 진단), 1.4(영문 진단), 계획서가 붙인 것만 옮겼다
- 수치는 입력 파일 그대로 옮겼고, 추정한 수치에는 "약"을 붙였다

---

## 1. 기준과 입력

| 항목 | 값 |
|---|---|
| 기준 커밋 | `8ee3c7a` (문구 수정 전 마지막 커밋, 계획서 10장). 진단 때 HEAD는 `823e394`이고, `src/content/`는 기준 커밋과 같다 (`git diff 8ee3c7a -- src/content` 차이 없음) |
| 측정 대상 | `src/content/`의 `en`, `ko` 문자열 1,437쌍 (영문 60,991자, 국문 28,729자, YAML 키와 주석 제외). UI와 컴포넌트는 `src/i18n/ui.ts`, 컴포넌트, 레이아웃, 페이지, 스타일의 40줄 (주석 제외) |
| 수치 기준 | 도구(`scripts/check-text.mjs`)의 수치를 쓴다. 계획서 4장 1차 집계와 다른 곳(중간점 616 → 617, 국문 종결 ③ 17 → 14, ④ 8 → 10)은 판정 방식 차이다 (계획서 10장 0.4 기록) |

입력 파일은 모두 `_workspace/` 아래라 커밋되지 않는다. 이 보고서가 단계 1의 유일한 커밋 기록이다.

| 단계 | 내용 | 파일 (`_workspace/` 기준) | 다시 만드는 법 |
|---|---|---|---|
| 1.1 | 기계 집계 | `diagnosis/report.txt`, `report-detail.txt`, `report.json` | `node scripts/check-text.mjs --report` (`--detail`은 적중 위치, `--json`은 기계용). 2026-11-22 다시 돌려 `report.txt`와 같음을 확인 |
| 1.1 | 문구 추출 | `diagnosis/dump-en.txt`, `dump-ko.txt`, `dump-pairs.txt` | `node scripts/check-text.mjs --dump en`, `--dump ko`, 영문과 국문 짝은 `--pairs`를 붙임 |
| 1.2 | 국문 진단 | `2026-11-22-001-0d41/02_diagnosis.md` (입력 `01_input.txt` 26,065자, 정량 `00_metrics.json`) | 국문 전체(제목, 소속, 한 줄 소개 제외)를 `/humanize-korean`의 진단 단계(`humanize-diagnostician`)에만 넣음. 정량 `route_hint`는 heavy지만 이유는 길이(15,000자 초과)이고 `risk_band`는 low |
| 1.3 | 국문 표본 측정 | `diagnosis/scan-before.md` | `/humanize-scan`. 표본 4블록의 키 경로와 측정 규칙은 부록 8.4에 옮김 (단계 8.3 재측정 기준) |
| 1.4 | 영문 진단 | `diagnosis/en-diagnosis.md` | 계획서 5.7 점검표와 `/antislop-copywriting` (after 모드)로 영문 1,437개 전수 판독 |
| 0.4 | 도구 작성 때 남은 판단 4건 | (작업 메모) | 7장 9, 11, 12, 15번에 옮김 |

이 보고서가 새로 센 것은 세 가지다. 3장의 파일별 국문 지배 패턴 수, 4.3의 중간점 형태(붙여 쓴 것과 띄어 쓴 것), 5장의 굳은 말 후보. 모두 `dump-ko.txt`와 `dump-pairs.txt`를 다시 읽어 셌고, 셈 규칙은 해당 표 아래에 적었다.

---

## 2. 요약

1. 흔적은 케이스 스터디 8건에 몰려 있다. 콘텐츠 중간점 617개 중 550개(89%), 국문 ③④ 종결 43곳 전부, 영문 문제 점수 156점 중 145점이 이 8건의 본문과 다이어그램에 있다.
2. 그중 `genp-humanoid`, `docent-humanoid`, `legal-agentic-rag` 세 건이 가장 무겁다. 영문 점수 92점(43, 32, 17), ③④ 33곳, 중간점 353개가 이 세 건에 있다.
3. em dash는 콘텐츠 2곳과 컴포넌트 6곳뿐이다. 중간점은 띄어 쓴 구분자형(콘텐츠 245개)과 컴포넌트 구분자(43개)가 많아, 규칙만 정하면 기계적으로 바꿀 수 있는 몫이 크다.
4. 영문은 유행어가 0이고, 문제 100건(높음 9)은 결정 제목의 비교 틀(24개 중 13개), 근거와 트레이드오프의 세미콜론(19), 진행 중 프로젝트의 시제(8)처럼 같은 형식의 반복이다.
5. 국문은 영문 구조를 옮긴 번역투 6패턴(긴 관형절, `~을 위한`, 명사 더미와 `및`, 범위 공식, `확보`, 남은 영어)이 지배하고, 종결 ③④와 대구는 legal과 docent의 결정 근거, 트레이드오프, 그림 설명에 몰려 있다.

---

## 3. 파일별 표

### 3.1 케이스 스터디 8건 (본문 md와 다이어그램 yaml)

| 파일 | 중간점 국/영 | em | ③④ | 마침표 | 대구 국/영 | 콜론 국/영 | 세미콜론 영 | 범위 영 | 영문 점수 | 국문 지배 패턴 |
|---|---|---|---|---|---|---|---|---|---|---|
| `genp-humanoid` md | 49/3 | 0 | 5 | 2 | 1/3 | 3/4 | 7 | 3 | 40 | A-18 5, A-13 및 2 기반 2, D-7 4, F-7 2, B-2 6 |
| yaml | 59/48 (+1) | 0 | 3 | 2 | 0/0 | 1/1 | 0 | 1 | 3 | B-2 2 |
| `docent-humanoid` md | 26/7 | 0 | 9 | 2 | 0/0 | 2/1 | 16 | 1 | 32 | A-18 4, A-13 및 3 기반 4, D-7 1, F-7 1 |
| yaml | 31/18 (+1) | 0 | 3 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | B-2 1 |
| `legal-agentic-rag` md | 30/3 | 0 | 10 | 2 | 4/3 | 7/7 | 3 | 0 | 17 | A-18 1, A-13 및 1 기반 1, B-2 1 |
| yaml | 50/26 (+1) | 0 | 3 | 0 | 0/0 | 2/2 | 1 | 0 | 0 | 0 |
| `samsung-consultation-assistant` md | 13/0 | 0 | 0 | 0 | 1/1 | 0/0 | 0 | 2 | 12 | A-18 1, A-11 1, A-13 및 3 기반 3, D-7 1, F-7 1, B-2 2 |
| yaml | 39/17 | 0 | 4 | 0 | 0/0 | 0/0 | 2 | 0 | 2 | 0 |
| `samsung-scm-agent` md | 6/0 | 1 | 0 | 0 | 0/0 | 0/0 | 1 | 0 | 12 | A-18 1, A-13 및 1 기반 1, F-7 3 |
| yaml | 11/6 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `lotte-price-forecasting` md | 9/0 | 1 | 0 | 0 | 0/0 | 0/0 | 0 | 2 | 12 | A-11 1, A-13 기반 7, D-7 2, F-7 2, B-2 1 |
| yaml | 23/15 | 0 | 1 | 1 | 0/0 | 2/2 | 0 | 0 | 0 | 0 |
| `lotte-ai-masterplan` md | 13/0 | 0 | 2 | 0 | 0/0 | 0/0 | 0 | 1 | 8 | A-18 1, A-13 기반 3, D-7 1 |
| yaml | 4/0 | 0 | 1 | 0 | 0/0 | 3/0 | 0 | 0 | 2 | 0 |
| `lotte-inventory-blend-optimization` md | 1/0 | 0 | 2 | 0 | 1/1 | 0/0 | 0 | 0 | 5 | A-13 기반 2, F-7 1 |
| yaml | 21/19 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 기반 1 |

열 설명:

- 중간점: 콘텐츠 값의 `·` 수 (국문 값/영문 값, 괄호는 언어 구분 없는 값). 단위 `N·m`은 뺐다
- ③④: 국문 종결 ③(`~함/~음`)과 ④(`~다`)의 합. 25자 이상과 25자 미만을 합쳤다
- 마침표: 계획서 2장 마침표 규칙(한 문장이면 없음, 두 문장 이상이면 문장마다) 위반
- 대구: 국문 `아닌/아니라`, 영문 `, not`과 `rather than`. 범위 영: 수치가 아닌 "from X to Y"
- 영문 점수: 1.4 판독의 문제 점수 (높음 3, 중간 2, 낮음 1)
- 국문 지배 패턴: 1.2 패턴의 표면형 적중 (이 보고서가 셈). A-18은 문제 줄이 빈 머리명사(`과제`, `조건`, `구조`, `위험`)로 끝나는 수와 `기능을 갖춘`, `규칙을 가진`의 수. A-11은 `위한`. A-13은 ` 및 `과 `X 기반 Y`. D-7은 `부터`와 `까지`가 함께 있는 줄, 개념적 `~에서 ~로 전환/확장/바뀐다`, `넘어`. F-7은 `확보`, `종속`, `발생`. B-2는 1.2가 짚은 영어 잔존 표기(`Admin`, `Manipulation`, `Depth 카메라`, `Vision 판독`, `non-agentic`, `딜리버리`, `Direct·Recursive`, `온프렘`). 제목, 소속, 한 줄 소개, 학과명은 뺐다. 표면형이라 1.2 본문 수치(`및` 24, `기반` 약 35)와 조금 다르다

읽는 법:

- 중간점은 다이어그램이 본문보다 많다 (yaml 390, md 160). 영문 중간점 162개 중 149개가 다이어그램 라벨에 있다.
- ③④는 legal 13, docent 12, genp 8로 세 건이 43곳 중 33곳이다. samsung-consultation yaml 4곳은 고객 목소리를 흉내 낸 말풍선이다 (7장 9번).
- 영문 세미콜론은 docent 16, genp 7이다. 1.4가 문제로 본 19건 중 15건이 이 두 파일에 있다.
- 국문 대구 7건 중 4건이 legal이다. 국문 지배 패턴은 genp 본문에 가장 많다 (A-18 5, D-7 4, B-2 6).

### 3.2 그 밖의 콘텐츠 파일

| 파일 | 중간점 국/영 | em | ③④ | 마침표 | 대구 국/영 | 콜론 국/영 | 세미콜론 영 | 범위 영 | 영문 점수 | 국문 지배 패턴 |
|---|---|---|---|---|---|---|---|---|---|---|
| `profile.yaml` | 22/0 | 0 | 0 | 3 | 0/0 | 0/0 | 1 | 5 | 7 | A-13 기반 4, D-7 3 |
| `experience.yaml` | 15/0 | 0 | 0 | 1 | 0/0 | 0/0 | 0 | 0 | 0 | A-11 1, A-13 및 5 기반 3 |
| `education.yaml` | 1/0 | 0 | 0 | 0 | 0/0 | 1/0 | 0 | 0 | 0 | 0 |
| `awards.yaml` | 0/0 | 0 | 0 | 0 | 0/0 | 0/0 | 1 | 0 | 1 | 0 |
| `teaching.yaml` | 1/0 | 0 | 0 | 0 | 0/0 | 4/0 | 0 | 0 | 0 | A-13 및 1 |
| `publications.yaml` | 0/0 | 0 | 0 | 0 | 0/0 | 5/5 | 0 | 0 | 0 | 0 |
| `projects/boiler-optimal-control.md` | 0/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 1 | 0 | A-11 1, A-13 기반 1, D-7 1 |
| `projects/distribution-equipment-detection.md` | 2/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 1 | 0 | A-13 및 1 기반 1, D-7 1 |
| `projects/equipment-diagnosis-chatbot.md` | 0/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 2 | A-11 1, A-13 및 1 기반 2 |
| `projects/ess-frequency-regulation.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-11 1, A-13 및 1 기반 1 |
| `projects/ev-charging-usage-analysis.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 및 1 |
| `projects/lifestyle-guide-app.md` | 2/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 기반 3 |
| `projects/petrochemical-reactor-prediction.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-11 3, A-13 및 3, F-7 1 |
| `projects/power-plant-maintenance-assistant.md` | 4/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 1 | 0 |
| `projects/sinter-process-optimization.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-11 3, A-13 및 1 |
| `projects/solar-power-forecasting.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 및 1 기반 1 |
| `projects/transformer-dga-anomaly-detection.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 기반 2 |
| `projects/visual-inspection-platform.md` | 0/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-11 3, A-13 및 1 |
| `personal/ai-daybook.md` | 5/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `personal/ai-wiki.md` | 4/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `personal/research-curator.md` | 2/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `personal/link-digest.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `personal/mcp-connectors.md` | 1/0 | 0 | 0 | 1 | 0/0 | 0/0 | 0 | 0 | 0 | A-13 기반 1 |
| `personal/oathkeeper.md` | 1/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | 0 |
| `personal/pyroad.md` | 0/0 | 0 | 0 | 0 | 0/0 | 0/0 | 0 | 0 | 0 | A-18 1 |

모든 열이 0인 파일: `patents.yaml`, `software.yaml`, `personal/euro-digest.md`, `personal/lunchmate.md`, `personal/practice-git-materials.md`.

읽는 법:

- `profile.yaml`: 마침표 3은 한 줄 소개(`taglines`, 예외로 정한 곳), 범위 5 중 2도 한 줄 소개라 제외. 남은 영문 문제 3건(`about`, `trajectory[1]`, `availability[4]`)은 홈 첫 화면이라 노출이 가장 크다.
- `publications.yaml`의 콜론 5/5는 논문 제목이라 대상이 아니다. `teaching.yaml`의 콜론 4는 `... 개발 지원: LSTM Autoencoder`처럼 작업 뒤에 도구 이름을 붙인 라벨형이고, 중간점 1은 강의 제목(`학부·석사 ...`)이라 그대로 둔다.
- `~을 위한` 15회 중 9회가 오래된 프로젝트 카드 3건(sinter, visual-inspection, petrochemical 각 3회)에 있다.
- 개인 프로젝트 10건은 중간점 14와 마침표 1이 거의 전부다.

### 3.3 UI와 컴포넌트

| 파일 | 줄 | `·` | `—` | 자리 | 처리 단계 |
|---|---|---|---|---|---|
| `src/i18n/ui.ts` | 13 | 17 | 0 | 섹션 제목 3 (`Teaching · Books · Advisory`, `강의 · 저서 · 자문`, `지식재산 · 출판물` 2곳), 건수 줄 3 (`{reg} registered\u00a0· {filed} filed` 등), 연동 표시 `{a}·{b} 연동`, CV 제목 `강의·자문`, 분야와 역량 이름 5 (`에너지·유틸리티`, `석유화학·철강`, `공공·법률`, `LLM 에이전트·RAG`, `제어·최적화`) | 3.1, 2.5 |
| `Cv.astro` | 9 | 9 | 2 | 페이지 제목, description, 머리 줄, 바닥글, 소속과 고객사, 목록 구분, 역할 구분 ` — `, 빈 날짜 `'—'` | 3.2, 3.4 |
| `ProjectLedger.astro` | 3 | 3 | 0 | 소속과 고객사, 역량 태그 줄, CSS `content: ' · '` | 3.2 |
| `CaseStudy.astro` | 3 | 3 | 0 | 페이지 제목, 기술 스택 줄, 그림 라벨 | 3.2 |
| `StandardSet.astro` | 3 | 2 | 4 | `LLM · STT · TTS`, 대체 텍스트의 em dash 4 | 3.2, 3.3 |
| `pages/404.astro` | 2 | 2 | 0 | 페이지 제목 (영문, 국문) | 3.2 |
| `About.astro` | 1 | 1 | 0 | 학력의 세부전공 앞 구분 | 3.2 |
| `Comparison.astro` | 1 | 1 | 0 | 이름과 선정 표시 사이 구분자 | 3.2 |
| `Head.astro` | 1 | 1 | 0 | OG 대체 텍스트 (이름과 직함 사이 구분자) | 3.2 |
| `Home.astro` | 1 | 1 | 0 | 페이지 제목 | 3.2 |
| `Screens.astro` | 1 | 1 | 0 | 화면 캡션과 주소 | 3.2 |
| `SelectedWork.astro` | 1 | 1 | 0 | 소속 앞 구분 | 3.2 |
| `Teaching.astro` | 1 | 1 | 0 | 건수 줄 | 3.2 |
| 합계 | 40 | 43 | 6 | | |

이 구역은 1.4 영문 진단의 범위 밖이다 (덤프에 없음). 모양은 단계 2.1 시안으로 정하고 단계 3에서 바꾼다.

---

## 4. 패턴별 대표 예문

패턴마다 원문 인용 2~3개와 고칠 방향을 적는다. 위치 표기는 `파일` `키 경로`이고, 같은 파일이면 파일을 줄였다. "1.2 예"와 "1.4 예"는 각 진단이 붙인 고친 예시다. 1.2 예시 중 중간점이 남은 것은 실제로 고칠 때 5.2 기준으로 따로 바꾼다.

### 4.1 국문 지배 패턴 (1.2)

**K1. A-18 긴 좌향 관형절과 빈 머리명사** (관형절 겹침 8, 빈 머리명사로 끝나는 문제 줄 9, `기능을 갖춘`류 5)

- `로봇 한 대가 대화, 제스처, 보행, 바구니 운반을 하나의 연속된 환영 시나리오로 수행해야 하는 과제` (`projects/docent-humanoid.md` `caseStudy.problem[0]`)
- `질문을 6가지 의도로 분류해 벡터 DB, 법령 파일, 부칙, 파일 메타데이터 중 경로를 고르고, 최신성 신호가 있으면 저장소 최신 원문으로 다시 확인하며 벡터 결과가 빗나가면 키워드 검색으로 전환하는 시스템 프롬프트 설계` (`projects/legal-agentic-rag.md` `caseStudy.approach[2]`)
- `로봇 상태·알람 모니터링, 시나리오 실행, 언어 설정, 비상정지(E-Stop) 기능을 갖춘 관제 대시보드 개발` (`projects/docent-humanoid.md` `highlights[2]`)
- 방향: 빈 머리명사를 떼고 사실을 담은 명사로 끝낸다 (1.2 예: `~ 반출할 수 없는 조건` → `~ 반출 불가`). 관형절이 두 겹 이상이면 줄 안에서 마침표나 쉼표로 끊고 "무엇을 만들었나"를 앞에 둔다. 줄 수는 그대로

**K2. A-11 `~을 위한` 밀집** (15회, 이 중 9회가 sinter, visual-inspection, petrochemical)

- `제철소 소결 공정 효율 개선을 위한 머신러닝 및 제어 최적화 알고리즘 개발 총괄` (`projects/sinter-process-optimization.md` `summary`)
- `모델 개발·배포 자동화를 위한 온프레미스 MLOps 환경 구축 지원` (같은 파일 `highlights[1]`)
- `모델 추적성·재현성 확보를 위한 실험 환경 구축 및 템플릿 코드 개발` (`projects/petrochemical-reactor-prediction.md` `highlights[2]`)
- 방향: 한 카드에 1회만 둔다. 나머지는 `~용`, 동사 관형형, 삭제 중에서 고른다 (1.2 예: `딥러닝 모델 구동용 SW 플랫폼`, `개발·배포를 자동화하는 온프레미스 MLOps 환경`)

**K3. A-13 (+A-6) 조사 없는 명사 더미, `및`, `X 기반`** (`및` 26, `X 기반 Y` 43, 표면형)

- `플랫폼 아키텍처, 18개 응대 시나리오, 데이터 모델, Admin 요구사항 정의, 오케스트레이터 파이프라인, Predefined 답변·가드레일 모듈, 프롬프트 템플릿 직접 개발` (`projects/samsung-consultation-assistant.md` `caseStudy.role[1]`). `정의`와 `직접 개발`이 어디까지 걸리는지 보이지 않는다
- `AI·데이터 사이언스 분야 로드맵 수립, 신규 과제 발굴 및 기획, 연구 인프라·분석 환경 구축 계획 수립.` (`experience.yaml` `kepco.summary`)
- `라이프로그 데이터 기반 신체활동 가이드, CGM 센서 기반 식습관 가이드 개발` (`projects/lifestyle-guide-app.md` `highlights[0]`)
- 방향: 공통 서술이 걸리는 범위를 조사로 드러낸다 (1.2 예: `A, B, C를 정의하고 D, E는 직접 개발`). `및`은 "와/과"나 쉼표로 바꾸고 중간점으로는 바꾸지 않는다. `X 기반`은 굳은 기술 명칭(`RAG 기반`, `규칙 기반`, `SLAM 기반`)만 두고 한 카드 2회 이하

**K4. D-7 범위와 전환 공식** (`부터~까지` 10줄, 개념적 전환 표면형 3줄과 1.2 판독 약 6회, `~을 넘어` 1)

- `볼록 최적화 프로그램부터 마이크로컨트롤러 구동 MPC까지, 발전용 보일러 최적제어 연구` (`projects/boiler-optimal-control.md` `summary`)
- `재학습과 배포 주체를 데이터 사이언티스트에서 현업으로 전환, 견적 검토 프로세스에 예측 모델 편입` (`projects/lotte-price-forecasting.md` `caseStudy.outcome[2]`)
- `사전 정의된 시나리오 실행을 넘어 플래너가 상황에 맞게 태스크를 스스로 계획·조합하고, ...` (`projects/genp-humanoid.md` `caseStudy.archNote`)
- 방향: 줄 머리의 `A부터 B까지,`는 없애고 핵심 명사를 앞에, 범위는 줄 뒤에 사실로 붙인다. `부터~까지`는 범위 자체가 정보인 곳만 남긴다 (지금의 절반 이하). 전환은 바뀐 뒤 상태를 직접 쓴다 (1.2 예: `현업이 직접 재학습·배포`). `~을 넘어`는 `~만 하지 않고` 꼴로

**K5. F-7 + A-15 범용 동사와 무생물 주어** (`확보` 6, `종속` 2, `발생` 3)

- `파인튜닝 가능한 Qwen 8B sLLM이 Text-to-SQL을 맡아 정확도와 비용 확보, 답변 생성은 Llama 3.1 70B 담당` (`projects/samsung-scm-agent.md` `caseStudy.decisions[1].rationale`). `비용 확보`는 뜻이 거꾸로 읽힌다
- `점수는 순위만 정할 뿐 추진 방식을 알려 주지 않아, 선별한 과제를 사업 영향도 × 기술 성숙도 매트릭스로 한 번 더 분류` (`projects/lotte-ai-masterplan.md` `caseStudy.decisions[0].rationale`)
- `장기 의존성 표현이 lag 설계에 종속` (`projects/lotte-price-forecasting.md` `caseStudy.decisions[0].tradeoff`)
- 방향: `확보`는 무엇이 어떻게 됐는지로 푼다 (1.2 예: `정확도는 높이고 비용은 낮춤`, 원문이 뜻하는 방향만). `종속`은 `~에 따라 정해짐`, `발생`은 `~이 생김`. 무생물 주어는 사람(현업, 팀, 에이전트)을 주어로 돌리거나 `~로는 ~을 알 수 없어` 꼴로. 영문 짝(1.4 P9, P13)과 함께 고친다

**K6. B-2 (+B-1) 남은 영어와 표기 불일치** (1.2가 짚은 표기 13곳)

- `Admin 요구사항 정의` (`projects/samsung-consultation-assistant.md` `caseStudy.role[1]`), `Admin 페이지로 운영 이관 가능` (같은 파일 `caseStudy.decisions[0].rationale`). 같은 사례 그림은 `관리자 페이지`
- `LiDAR + Depth 카메라 이중 감지` (`diagrams/docent-humanoid.yaml` `safety.texts[0]`). 같은 사례 본문은 `깊이 카메라`
- `폐쇄망이면 온프렘 전환` (`projects/genp-humanoid.md` `caseStudy.hardware.external.sub`). 용어집 표기는 `온프레미스`
- 방향: 같은 글이나 용어집에 국문 표기가 있으면 그쪽으로 통일한다 (`Admin` → `관리자`, `Depth 카메라` → `깊이 카메라`, `Manipulation` → `조작`). 국문 표기가 없는 기술 용어(`Pseudo Query`, `lag`, `Teleop`)는 둔다. 괄호 병기(`프로젝트 관리(PM)`, `제품 총괄(PO)`, `예측 오차(MAPE)`)는 화면마다 첫 등장 1회만

**국소 결함** (지배 패턴은 아니고 해당 줄만 고친다, 1.2)

- `개별 시연이 아닌 가용 가능한 상태로 납품해야 하는 과제` (`projects/genp-humanoid.md` `caseStudy.problem[0]`): `가용 가능한`은 동의어 중복
- `기본 1,000자 청크는 조문을 자르거나 묶어 인접 청크 호출이 늘었고, ...` (`projects/legal-agentic-rag.md` `caseStudy.decisions[3].rationale`): 주어와 서술이 어긋남
- `시연 한 번이 공통 에피소드 스키마(EpisodeSchema)의 다섯 줄 기록이 되고, 구간별로 라벨을 단다.` (`diagrams/genp-humanoid.yaml` `episode.note`): 뒷절의 주어가 `시연`으로 읽힘
- `의도 규칙을 가진 단일 에이전트` (`projects/legal-agentic-rag.md` `caseStudy.decisions[1].rationale`): have 직역

**지배 패턴이 아닌 것** (1.2 확인): `~적` 추상 체인(6회 안팎, 사람 글 기준 이하), 피동, 대명사, 이중 조사, 결산 관용구, 문두 접속사. 어휘 다양도(0.46)가 낮은 것은 기술 용어가 사례마다 반복되기 때문이라 동의어로 돌려쓰지 않는다.

### 4.2 영문 패턴 (1.4)

문제 100건 (높음 9, 중간 38, 낮음 53). 패턴 번호는 1.4의 P 번호다. 전체 위치는 부록 8.1.

**E1. Em dash** (P1, 2건, 모두 높음)

- `Set baselines first and agreed with the client on what counts as improvement — a MAPE target of 10% or less against the rule-based benchmark, forecasting 1–4 weeks and 1–3 months ahead.` (`projects/lotte-price-forecasting.md` `caseStudy.approach[0]`)
- `... that coordinates three agents through A2A — data query and analysis, work support (AI Advisor), and external information.` (`projects/samsung-scm-agent.md` `caseStudy.approach[1]`)
- 방향 (1.4 예): `Set baselines first and agreed the improvement target with the client. The target was a MAPE of 10% or less against the rule-based benchmark, for forecasts 1–4 weeks and 1–3 months ahead.` 둘째는 세 에이전트를 괄호로 묶는다

**E2. 부정 대구** (P2, 10건: 높음 6, 중간 2, 낮음 2)

- `Two complementary sources, not one`, `Routing in one agent's prompt, not a multi-agent system` (`projects/legal-agentic-rag.md` `caseStudy.decisions[0].title`, `[1].title`)
- `Not one or the other: the agent finds with the vector DB and confirms with the repository.` (같은 파일 `caseStudy.compare.verdict`)
- `A demo is not an acceptance test; tasks must succeed in repeated runs under fixed conditions, and stopping the robot must not depend on the planning layers.` (`projects/genp-humanoid.md` `caseStudy.problem[2]`)
- 방향 (1.4 예): `Intent routing inside one agent's prompt`, `A modular platform shared across channels`, `The agent uses both, finding articles with the vector DB and confirming them in the repository.`, `Tasks must succeed in repeated runs under fixed conditions to pass acceptance. Stopping the robot must not depend on the planning layers.` 버린 대안은 바로 아래 근거 문장이 이미 설명한다

**E3. 결정 제목의 비교 틀** (P3, 9건, 모두 낮음)

- `Fixed-pose basket instead of grasping` (`projects/docent-humanoid.md` `caseStudy.decisions[1].title`)
- `Pseudo query instead of direct SQL` (`projects/samsung-scm-agent.md` `caseStudy.decisions[0].title`)
- `Proven solutions first, development after the data platform` (`projects/lotte-ai-masterplan.md` `caseStudy.decisions[2].title`)
- 방향: 하나씩은 자연스럽지만 결정 제목 24개 중 13개(`, not` 4 포함)가 같은 틀이라 묶음으로 신호가 된다. 몇 개를 남길지는 7장 3번

**E4. 꾸밈용 범위 "from X to Y"** (P4, 7건: 높음 1, 중간 6)

- `Applied ML to the power grid and factories, from solar power forecasting and transformer anomaly detection to a machine vision platform.` (`profile.yaml` `trajectory[1].description`)
- `now leads a Physical AI humanoid product from product definition to VLA training pipelines` (`profile.yaml` `about`)
- 방향 (1.4 예): `Applied ML to the power grid and factories, including solar power forecasting, transformer anomaly detection, and a machine vision platform.` 수치 범위 10건과 실제로 바뀐 과정 5건은 유지 (부록 8.2)

**E5. 콜론과 세미콜론으로 이은 문장** (P5 콜론 2건, P6 세미콜론 19건. 합쳐서 중간 12, 낮음 9)

- `EACH LAYER DOWN: LESS INFORMATION, MORE PRECISION` (`diagrams/genp-humanoid.yaml` `stack.descent`)
- `... which lifts accuracy on proper nouns; if confidence stays low after one retry, the robot greets without a name.` (`projects/docent-humanoid.md` `caseStudy.decisions[0].rationale`)
- `The data and model pipeline is an in-house facility; customers receive only the trained models.` (`projects/genp-humanoid.md` `caseStudy.loop[0]`)
- 방향: 세미콜론은 마침표로 나눈다 (1.4 예: `... proper nouns. If confidence stays low after one retry, the robot greets without a name.`). 라벨형 콜론 15곳과 표 칸, 인용, 범례의 세미콜론 13곳은 정상

**E6. 억지 세 항목 나열** (P7, 3건, 모두 낮음)

- `facing unstable raw-material supply, tighter safety rules, and an aging plant workforce` (`projects/lotte-ai-masterplan.md` `caseStudy.context[0]`)
- `no common criteria for value, readiness, or priority` (같은 파일 `caseStudy.problem[0]`)
- 방향: 원자료에 그대로 있으면 정상으로 돌리고, 없으면 줄인다 (7장 7번). 세 항목 나열 약 70곳은 대부분 실제 항목이라 정상

**E7. 행위자 없는 수동태와 무생물 주어** (P8 11건, P9 7건)

- `Mix plans were built by hand` (`projects/lotte-inventory-blend-optimization.md` `caseStudy.problem[1]`)
- `localization and path planning are implemented` (`projects/genp-humanoid.md` `caseStudy.outcome[1]`)
- `One local server completes the site` (`projects/genp-humanoid.md` `caseStudy.decisions[2].title`), `Commercial tools bring early wins` (`projects/lotte-ai-masterplan.md` `caseStudy.decisions[2].rationale`)
- 방향: 성과 문장은 본인을 주어로 (1.4 예: `Implemented localization and path planning`). 문제 문장은 같은 사례에 이미 나온 사람(`Planners`)을 주어로

**E8. 유행어와 과장** (P10, 12건: 중간 3, 낮음 9). leverage, seamless, robust 류는 0

- `Built a demo dashboard to showcase the chatbot.` (`projects/equipment-diagnosis-chatbot.md` `highlights[1]`)
- `An edge built on open models is short-lived, so site data and the task library have to become the lasting advantage.` (`projects/genp-humanoid.md` `caseStudy.decisions[0].tradeoff`)
- `Led the project end to end` (6곳에 반복)
- 방향 (1.4 예): `Built a demo dashboard for the chatbot.` 격언형은 원문 뜻만 평이하게 쓰고 새 주장은 넣지 않는다. 반복 상투구는 7장 6번

**E9. 동사 시작, 시제, 길이** (P12, 13건: 중간 10, 낮음 3)

- `Delivering a docent humanoid robot ...`, `Managing the project as PM, ...` (`projects/docent-humanoid.md` `summary`, `highlights[0]`)
- `Wrote a system prompt that classifies ... routes ..., then re-checks ... and falls back ...` (`projects/legal-agentic-rag.md` `caseStudy.approach[2]`, 48단어)
- 방향: 시제는 7장 2번. 35단어를 넘는 문장은 두 문장으로

**E10. 그 밖의 문장 구조** (P13, 5건, 모두 낮음)

- `Long-range dependencies depend on the lag design.` (`projects/lotte-price-forecasting.md` `caseStudy.decisions[0].tradeoff`)
- `..., costing sales.` (`projects/samsung-consultation-assistant.md` `caseStudy.problem[1]`)
- 참고 (세지 않음): 꼬리 분사 `, covering ...` 4곳 반복, 개인 프로젝트 10건 중 8건이 `Built a ... that ...`로 시작, 곡선 따옴표와 곧은 따옴표 혼용
- 방향: 같은 어근 반복은 다시 쓴다. 근거 없이 결과를 덧붙인 꼬리는 원자료 확인 뒤 삭제 (7장 7번)

목록 항목의 Title Case(P11)는 문제 0건, 판단 4건이다 (7장 8번).

### 4.3 기호와 종결 패턴 (1.1)

**S1. Em dash와 en dash**

- 콘텐츠 2곳 (E1), 컴포넌트 6곳: `Cv.astro` 역할 구분 ` — `와 빈 날짜 `'—'`, `StandardSet.astro` 대체 텍스트 4곳
- En dash 39곳은 모두 기간과 숫자 범위 (`2008 – 2015`, `1–4 weeks`, `#1–#5`). 문장을 잇는 데 쓴 곳은 0이라 유지
- 방향: em dash는 계획서 5.1. 컴포넌트 두 곳은 단계 2.1 시안에서 함께 정한다

**S2. 중간점** (콘텐츠 617개, 단위 `N·m` 2개 별도)

| 형태 | 국문 | 영문 | 언어 무관 | 자리와 예 | 방향 |
|---|---|---|---|---|---|
| 붙여 쓴 나열 | 370 | 2 | 0 | 본문 나열과 다이어그램 라벨. `모니터링·알람·태스크 실행·비상정지 기능의 관제시스템 개발` (`projects/genp-humanoid.md` `caseStudy.approach[2]`), 영문 2곳은 `Dense·BM25 hybrid` | 계획서 5.2 (두 항목 "와/과", 셋 이상 쉼표, 좁은 자리 쉼표나 `/`). 굳은 말은 5장 |
| 띄어 쓴 구분자 | 82 | 160 | 3 | 다이어그램 라벨(국문 73), 경력 직함 4, 표준 구성과 비교 선택지 이름 5. `Unitree G1 · on-board`, `Vector DB · Seahorse`, `1m 이내 · 감속` | 5.2 영문 라벨 행 (쉼표, `and`, 괄호). 경력 직함은 7장 13번, 언어 무관 3곳은 7장 12번 |

- 같은 내용인데 영문은 띄우고 국문은 붙인 곳이 있다. 예: docent 여정 태그 `navigation · gesture · voice · face display`와 `자율주행·제스처·음성·얼굴 화면`
- 줄바꿈 바로 앞의 중간점 4곳 (`주문·결제·\n배송`, `매장·\n온라인몰`, `데이터·\n거버넌스`, `최적해·\n기준 만족?`)은 쉼표로 바꾸면 줄 끝 쉼표가 되므로 그림에서 확인한다
- 1.2 처방 예시 가운데 중간점을 새로 만드는 것이 있다 (`Direct·Recursive` → `직접·재귀`, `개발·배포를 자동화하는`, `현업이 직접 재학습·배포`). 적용할 때 5.2 기준으로 푼다

**S3. 국문 종결** (25자 이상 360개: ① 319, ② 17, ③ 14, ④ 10. 25자 미만의 ③④ 19)

- ③ `벡터 DB를 한 번 조회하는 non-agentic 워크플로우로는 복합 질의와 일상어 질의에 답하기 어려웠고, 개정 시점을 묻는 질문은 벡터 DB에 이력 자체가 없음` (`projects/legal-agentic-rag.md` `caseStudy.problem[1]`)
- ④ `도슨트가 태블릿 버튼이나 호출어로 회차를 시작한다. 로봇은 네 단계를 이어서 수행하고, 마무리 인사 후 대기 구역으로 돌아가 충전한다.` (`projects/docent-humanoid.md` `caseStudy.journey.note`)
- 섞임: `X2 Ultra 선정. ... 국내 재고로 7~10주 해외 조달 기간을 없앴다. ... 같은 스택이 G1에서도 동작한다.` (같은 파일 `caseStudy.compare.verdict`)
- 자리 (25자 이상 24곳): 결정 근거와 트레이드오프 7, 그림 설명 5, 문제 목록 4, 비교 결론 2, 접근, 화면 설명, 배경 각 1, 고객 목소리 말풍선 3
- 자리 (25자 미만 19곳): 결정 제목 3, 트레이드오프 3, 표 칸 3, 다이어그램 라벨 9, 고객 목소리 말풍선 1
- 방향: 계획서 5.5 (`회차를 시작한다.` → `회차 시작.`). 목표에 넣을 범위는 7장 9번

**S4. 마침표 규칙 위반** (14건): 한 줄 소개 3, 출처 줄 1(도구 오탐), 경력 요약 1, 나머지 9. 처리는 7장 11번

**S5. 대구와 연결**

- 국문 `아닌/아니라` 7건: `하나가 아닌 두 지식원의 상호 보완`, `단일 챗봇이 아닌 모듈 기반 플랫폼`, `둘 중 하나가 아니라 둘 다: 에이전트는 벡터 DB로 찾고 저장소로 확인한다.` 중 4건이 legal. 방향: 꼭 필요한 1곳만 남기고 직접 단언 (5.6). 1.3 시험 수정에서 legal 블록은 4 → 1
- 연결어미 뒤 쉼표 (1.3 C-11): legal 블록 5, docent 블록 7. 예: `멀티에이전트는 토큰 사용량이 크게 늘고, ...`. 방향: 쉼표를 빼되, 빼면 붙어 읽히는 곳(1.3이 짚은 `묻고 답은`)은 눈으로 확인
- `A는 ~고, B는 ~` 대칭 (1.3 관찰): legal 결정 근거 3곳
- 당위 결말 (1.3 I-4): `~해야 함` 3, `~필요` 8. 처리는 7장 10번

**S6. 콜론**: 국문 30 중 문장을 잇는 것은 1곳(legal `compare.verdict`)이고, 나머지는 라벨형(`발견:`, `예:`, `세부전공:`), 논문 제목 5, 작업 뒤 도구 목록 4. 영문 22 중 문제 2 (E5). 문장을 잇는 콜론만 고친다.

---

## 5. 굳은 말 목록 (계획서 5.2)

국문 중간점 452개(붙여 쓴 나열 370, 띄어 쓴 구분자 82)를 `--report --detail`의 적중 목록과 `dump-pairs.txt`의 영문 짝으로 모두 확인했다. 기준은 "쉼표로 풀면 뜻이 바뀌거나, 와/과로 풀면 어색해 보이는 묶음"이다. 나머지는 5.2 기본 규칙(두 항목 "와/과", 셋 이상 쉼표)으로 풀리므로 적지 않았다.

결과: 후보 25개, 국문 약 50곳(중간점 58개). 제안은 풀기 14, `/` 8 (2개는 본문 풀기와 함께), `~` 1, 유지 2.

### 5.1 후보

| # | 표기 | 곳 | 위치 | 영문 짝 | 제안 |
|---|---|---|---|---|---|
| | **잘린 합성어** (한쪽의 공통 요소가 빠져 쉼표로 풀면 뜻이 바뀜) | | | | |
| 1 | `온·오프라인` | 1 | `projects/samsung-consultation-assistant.md` `caseStudy.outcome[0]` | `online and offline stores` | 풀기 ("온라인과 오프라인") |
| 2 | `공포·시행일` | 1 | `projects/legal-agentic-rag.md` `caseStudy.screens.slices[0].notes[0].body` | `promulgation and effective dates` | 풀기 ("공포일과 시행일") |
| 3 | `운영·정비이력` | 2 | `projects/power-plant-maintenance-assistant.md` `title`, `summary` | `operation and maintenance history` | 제목은 `/` (2장 결정대로 기호만 바꾸되, 쉼표는 `운영`이 따로 떨어져 읽힘). `summary`는 풀기 ("운영 이력과 정비이력") |
| 4 | `단순·정보형` | 3 | samsung-consultation md `caseStudy.approach[2]`, yaml `approach.nodes[22].sub`, `flow.nodes[17].sub` (`단순·정보형·재질문`) | `simple and informative`, `simple / informative` | 본문은 풀기 ("단순형과 정보형"). 그림은 영문 라벨과 같은 `/` ("단순형/정보형"), 세 항목은 쉼표 |
| | **짝으로 굳은 말** ("와/과"로 풀면 자연스러움) | | | | |
| 5 | `시행령·시행규칙` | 2 | legal md `caseStudy.problem[0]`, yaml `repomap.treeNote[1]` (`법률·시행령·시행규칙`) | `enforcement decrees and rules`, `act, decree, and rule set` | 풀기 (둘은 "와/과", 셋은 쉼표) |
| 6 | `정형·비정형` | 3 | samsung-consultation md `caseStudy.approach[1]`, `approach[2]` (`정형·비정형·웹`), yaml `approach.nodes[4].sub` | `structured and unstructured` | 풀기 |
| 7 | `SQL용·생성용` | 1 | `projects/samsung-scm-agent.md` `caseStudy.decisions[1].title` | `Separate models for SQL and generation` | 풀기 |
| 8 | `데이터·모델` (파이프라인) | 5 | genp md `highlights[2]`, `caseStudy.role[0]`, `approach[3]`, `loop[0]`, lotte-inventory md `caseStudy.approach[1]` | `data and model pipeline` | 풀기 ("데이터와 모델 파이프라인") |
| 9 | `추적성·재현성` | 2 | `experience.yaml` `makinarocks.summary`, petrochemical md `highlights[2]` | `traceability and reproducibility` | 풀기 |
| 10 | `전사·본부` (직원) | 1 | `experience.yaml` `pwc.summary` | `firm-wide and division staff` | 풀기 |
| 11 | `개발·운영` (환경) | 1 | `projects/samsung-scm-agent.md` `caseStudy.role[1]` | `development and production environments` | 풀기 |
| | **법령 표기** | | | | |
| 12 | `조·항` | 6 | legal md `caseStudy.role[1]`, `approach[1]`, `decisions[3].title`, `screens.slices[0].notes[1].body`, yaml `arch.nodes[11].sub`, `arch.nodes[13].label` | `by article and paragraph`, `Article-level chunks` | 유지. 법령 단위 표기 관례이고 용어집도 `"조·항 단위"`로 적음. 예외 목록에 등록 |
| 13 | `조·항·호` | 1 | legal yaml `flow.nodes[16].sub` | `article, paragraph, and item numbers` | 유지 (12와 같은 예외) |
| 14 | `제26·27·28·30·31·33조` | 1 | legal md `caseStudy.screens.gap` | `Articles 26, 27, 28, 30, 31, and 33` | 풀기 (쉼표, 영문과 같은 번호 나열) |
| | **숫자 묶음** | | | | |
| 15 | `Phase 2·3` | 3 | genp md `caseStudy.approach[2]`, `archNote`, `outcome[1]` | `Phase 2 and 3` | `~` ("Phase 2~3", 같은 파일 `outcome[0]`의 `Phase 1~3`과 맞춤) |
| 16 | `1–4주·1–3개월` | 4 | lotte-price md `highlights[1]`, `caseStudy.approach[0]`, `outcome[1]`, yaml `flow.nodes[9].sub` | `1–4 weeks and 1–3 months` | 풀기 (본문 "와/과", 그림 쉼표) |
| | **대비(vs.)를 뜻하는 중간점** | | | | |
| 17 | `Direct·Recursive` (방식) | 1 | lotte-price md `caseStudy.approach[2]` | `direct vs. recursive forecasting` | `/` (실험 축의 두 선택지라 "또는"으로 읽히는 `/`가 맞음). 1.2 B-2대로 국문화하면 그림 `results.settings[3].short`의 `재귀`와 맞춰 "직접/재귀" |
| 18 | `가격·가격 변화량` (타깃) | 1 | 같은 문자열 | `price vs. price-change targets` | `/` (17과 같은 이유) |
| | **기술 이름 짝** (용어집이나 같은 사례가 이미 `/`를 씀) | | | | |
| 19 | `Dense·BM25` | 국 3, 영 2 | legal md `caseStudy.approach[1]`, `compare.rows[1].values[0]`, yaml `arch.nodes[11].sub` | 용어집 영문 `Dense / BM25 hybrid` | `/` (영문도 같이) |
| 20 | `LLMOps·MLOps` | 1 | `experience.yaml` `makinarocks.summary` | `LLMOps and MLOps` | `/` (용어집 `MLOps / LLMOps`) |
| 21 | `STT·TTS` | 1 | docent yaml `arch.nodes[8].sub` | `STT · TTS` | `/` (용어집 `STT / TTS`, 같은 사례 본문 `STT/TTS API`) |
| 22 | `AS·CS` | 1 | samsung-consultation yaml `arch.nodes[24].label` | `Service\nand CS` | `/` |
| 23 | `WMS·MES` | 국 2, 영 2 | lotte-inventory yaml `arch.nodes[12].sub`, `flow.nodes[6].sub` | `WMS · MES` | 풀기 (쉼표, 영문 라벨도 같이) |
| | **동사 결합형** (쉼표로 못 풀고 활용형으로 풀어야 함) | | | | |
| 24 | `계획·조합하는`, `계획·조합하고` | 2 | genp md `caseStudy.approach[2]`, `archNote` | `composes tasks` | 풀기 ("계획하고 조합하는" 꼴) |
| 25 | `요약·의역하거나` | 1 | legal md `caseStudy.problem[2]` | `a paraphrased or outdated article` | 풀기 (활용형) |

위치의 `md`는 `projects/<slug>.md`, `yaml`은 `diagrams/<slug>.yaml`.

### 5.2 분야와 역량 라벨 (단계 2.5에서 함께 정할 것)

`ui.ts`의 분야, 역량 이름과 같은 성격이라 굳은 말 목록과 따로 둔다. 영문은 `&`.

| 표기 | 곳 | 위치 |
|---|---|---|
| `제어·자동화`, `데이터 사이언스·머신러닝`, `생성형 AI·에이전트` | 3 | `profile.yaml` `trajectory[0..2].label` |
| `서빙·인프라` | 1 | `profile.yaml` `skills[3].label` |
| `에너지·유틸리티`, `석유화학·철강` | 2 | `profile.yaml` `skills[4].summary` (`ui.ts` 분야 이름과 같음) |
| `에이전트·RAG`, `RAG·에이전트` | 5 | `profile.yaml` `skills[1].summary`, `availability[3]`, samsung-consultation md `summary`, `highlights[0]`, lotte-ai md `caseStudy.outcome[1]` |
| `Physical AI·에이전트`, `Physical AI·휴머노이드` | 2 | `experience.yaml` `genon.summary`, `profile.yaml` `availability[4]` |

제안: `ui.ts`의 이름(`LLM 에이전트·RAG`, `제어·최적화` 등)과 같은 기준으로 2.5에서 한 번에 정하고 콘텐츠도 같은 표기로 바꾼다. 기본안은 "와/과".

### 5.3 목록에서 뺀 것

| 표기 | 곳 | 이유 |
|---|---|---|
| `N·m` | 2 | 단위 (2장 결정) |
| `학부·석사` | 1 | `teaching.yaml` 강의 제목 (계획서 4.3, 제목은 그대로) |
| 경력 직함 구분 ` · ` (`Director · AI Product Engineer` 등) | 4 | 굳은 말이 아니라 필드 구분. 영문은 `/` (7장 13번) |
| 언어 구분 없는 값 `1 · 2`, `법률.md · …`, `Kd·ω` | 3 | 7장 12번 |

---

## 6. 우선순위 제안

### 6.1 전체 순서

| 순서 | 단계 | 내용 | 근거 |
|---|---|---|---|
| 1 | 4.0 (새로 둠, 2.3 직후) | 높음 9건 일괄. 영문 9문장과 짝 국문 (legal 3, genp 2, samsung-consultation, samsung-scm, lotte-price, profile 각 1) | 어느 강도에서도 고치는 항목이라 강도 선택과 무관하고, 화면 구조를 건드리지 않아 위험이 가장 작다. 공개 사이트에서 가장 강한 신호가 먼저 사라진다. 2.2 표본(legal)에 3건이 있어 2.3 전에 고치면 시안 비교가 흐려진다 |
| 2 | 3 | UI 문구와 구분자 | 2.1 시안 결과를 컴포넌트에 넣는 일. `ui.ts` 17개, 컴포넌트 26개, em dash 6 |
| 3 | 4.1 | 프로필과 경력 | 노출이 가장 크다. profile 범위 3 (1건은 4.0에서), experience 중간점 15와 `및` 5 |
| 4 | 4.2 | 일반 프로젝트 12건, 개인 프로젝트 10건 | `~을 위한` 15회 중 9회가 오래된 카드 3건. 개인 프로젝트는 중간점 14가 거의 전부 |
| 5 | 4.3 | 특허, SW, 논문, 강의 | 가장 가볍다. 대상 문구는 `teaching.yaml`의 라벨형 콜론 4 정도 |
| 6 | 4.4 | 케이스 스터디 8건 | 6.2 순서 |
| 7 | 5 | 다이어그램 8건 | 6.3 순서 |

높음 9건의 위치:

| 파일 | 키 | 패턴 | 국문 짝 |
|---|---|---|---|
| `projects/legal-agentic-rag.md` | `caseStudy.decisions[0].title`, `decisions[1].title` | `, not` 제목 | `~가 아닌` 대구 |
| 같은 파일 | `caseStudy.compare.verdict` | 부정 서두와 콜론 | `~가 아니라` 대구, ④ 종결 |
| `projects/genp-humanoid.md` | `caseStudy.decisions[0].title` | `, not` 제목 | ③ 종결 (짧은 문자열) |
| 같은 파일 | `caseStudy.problem[2]` | 격언형 부정 정의와 세미콜론 | A-18 빈 머리명사 (`조건`) |
| `projects/samsung-consultation-assistant.md` | `caseStudy.decisions[0].title` | `, not` 제목 | `~가 아닌` 대구 |
| `projects/samsung-scm-agent.md` | `caseStudy.approach[1]` | em dash | |
| `projects/lotte-price-forecasting.md` | `caseStudy.approach[0]` | em dash | |
| `profile.yaml` | `trajectory[1].description` | 축 없는 범위 | D-7 범위 공식 |

### 6.2 단계 4.4 케이스 스터디 순서

본문(md)만 센다. 다이어그램은 단계 5에서 따로 본다.

| 사례 | 영문 점수 | 국문 ③④ | 국문 대구 | 국문 지배 패턴 | 국문 합 | 합계 | 참고: 중간점 |
|---|---|---|---|---|---|---|---|
| `genp-humanoid` | 40 | 5 | 1 | 19 | 25 | 65 | 52 |
| `docent-humanoid` | 32 | 9 | 0 | 9 | 18 | 50 | 33 |
| `legal-agentic-rag` | 17 | 10 | 4 | 3 | 17 | 34 | 33 |
| `samsung-consultation-assistant` | 12 | 0 | 1 | 9 | 10 | 22 | 13 |
| `lotte-price-forecasting` | 12 | 0 | 0 | 6 | 6 | 18 | 9 |
| `samsung-scm-agent` | 12 | 0 | 0 | 5 | 5 | 17 | 6 |
| `lotte-ai-masterplan` | 8 | 2 | 0 | 2 | 4 | 12 | 13 |
| `lotte-inventory-blend-optimization` | 5 | 2 | 1 | 1 | 4 | 9 | 1 |

국문 지배 패턴은 3.1의 A-18, A-11, `및`, D-7, F-7, B-2 합이다 (`X 기반`은 굳은 기술 명칭이 섞여 뺐다). 합계는 단순 합이라 대략의 순서로만 쓴다.

제안 순서: **legal → genp → docent → samsung-consultation → lotte-price → samsung-scm → lotte-ai → lotte-inventory**

- legal을 첫 건으로 당긴다. 합계는 3위지만 2.2 윤문 강도 표본이라 2.3에서 고른 결과를 옮기면 되므로 판단이 가장 적다. 첫 건에서 한 사례의 절차(영문, 국문, 사실 대조, 빌드, 화면, 커밋)를 검증한다. 국문 ③④ 10과 대구 4로 국문 종결 신호도 가장 많다.
- genp와 docent는 합계 1, 2위이고 같은 문체다 (세미콜론 문제 19건 중 15건, 시제 판단 8건 모두). 이어서 하면 같은 처리를 반복해 쓸 수 있다. docent 시제 5건은 7장 2번 결정을 따른다.
- 나머지는 합계 순이다. lotte-price와 samsung-scm은 1점 차라 순서가 바뀌어도 된다. lotte-ai는 원자료 확인(7장 7번) 답이 필요해 뒤쪽이 맞다.

### 6.3 단계 5 다이어그램 순서

| 다이어그램 | 중간점 국/영/무관 | ③④ | 영문 점수 | 0.5 기준선 |
|---|---|---|---|---|
| `genp-humanoid` | 59/48/1 (108) | 3 | 3 | |
| `legal-agentic-rag` | 50/26/1 (77) | 3 | 0 | |
| `samsung-consultation-assistant` | 39/17/0 (56) | 4 (고객 목소리) | 2 | 꽉 찬 상자 1 (`+ validity check`) |
| `docent-humanoid` | 31/18/1 (50) | 3 | 0 | |
| `lotte-inventory-blend-optimization` | 21/19/0 (40) | 0 | 0 | 360px 넘침 1 (`stock age · re-feed ratio`), 꽉 찬 상자 1 (`grade · quantity · batch`) |
| `lotte-price-forecasting` | 23/15/0 (38) | 1 | 0 | |
| `samsung-scm-agent` | 11/6/0 (17) | 0 | 0 | |
| `lotte-ai-masterplan` | 4/0/0 (4) | 1 | 2 | |

0.5 기준선에는 이 밖에 1440 폭에서 연결선 라벨이 바탕보다 긴 곳 8곳이 있다.

제안 순서: **6.2와 같은 순서** (legal → genp → docent → samsung-consultation → lotte-price → samsung-scm → lotte-ai → lotte-inventory)

- 표기 통일과 굳은 말 처리가 본문과 그림에 함께 걸린다 (`Admin`과 `관리자 페이지`, `Depth 카메라`, `온프렘`, `Dense·BM25`, `조·항`, `단순·정보형`, `정형·비정형`). 본문을 끝낸 순서대로 그림을 따라가면 같은 결정을 바로 옮길 수 있다.
- 중간점이 많은 세 건(genp, legal, samsung-consultation)도 앞쪽 네 건 안에 든다.
- lotte-inventory는 기준선에서 이미 넘침 1과 꽉 찬 상자 1이 있다. 영문 ` · `를 `and`로 바꾸면 글자가 늘어나므로 쉼표(` · ` 3자 → `, ` 2자)를 먼저 쓴다.

---

## 7. 판단 필요 (단계 1.6)

번호마다 질문과 작업자 추천안을 적었다. 모두 추천대로면 "추천대로"로 답하면 되고, 바꿀 번호만 따로 적어도 된다. 출처는 1.4 4장의 15건, 도구 작성 때 남은 4건(0.4), 1.3의 당위 결말, 1.2가 새로 제안한 점검 항목, 이 보고서의 굳은 말 목록이다.

**1. 우선순위.** 6장 제안대로 진행할지.
추천: 6장대로. 높음 9건은 2.3 직후 단계 4.0으로 묶어 처리하고, 4.4와 단계 5는 legal → genp → docent → samsung-consultation → lotte-price → samsung-scm → lotte-ai → lotte-inventory 순서.

**2. 진행 중 프로젝트의 영문 시제** (1.4 #1). docent의 `summary`와 `highlights`가 `Delivering`, `Managing`, `Designing`, `Building`이고, genp는 `summary`만 `Leading`이다. 케이스 스터디 `approach` 목록에는 과거형 사이에 `-ing` 3곳(docent `approach[3]`, genp `approach[2]`, `[3]`)이 섞여 있다. 모두 8곳.
추천: 끝난 일은 과거형, 진행 중인 일은 현재형으로 통일. DESIGN.md 1장의 "현재 역할만 현재형"을 진행 중 프로젝트까지 넓혀 한 줄 추가하고, 8곳을 현재형(`Deliver`, `Manage`, `Design`, `Build`, `Lead`)으로 바꾼다.

**3. 결정 제목의 비교 틀** (1.4 #2). 결정 제목 24개 중 13개가 비교 틀이다 (`, not` 4, `instead of`와 `over` 6, `A, B` 대구 3).
추천: 8개를 단언형으로 바꾸고 5개만 남긴다. 바꿀 것: `, not` 4건, 근거 문장이 대안을 이미 설명하는 docent `decisions[3]`, lotte-inventory `decisions[1]`, lotte-ai `decisions[2]`, 그리고 samsung-scm `decisions[0]`과 거의 같은 samsung-consultation `decisions[1]`. 남길 것: 실제로 검토한 대안이 정보인 docent `decisions[1]`, lotte-inventory `decisions[0]`, lotte-price `decisions[0]`, samsung-scm `decisions[0]`, `decisions[2]`. 국문 제목의 `~가 아닌` 3건도 같이 고친다.

**4. 범위 표현** (1.4 #3, 1.2 D-7). 영문 "from X to Y" 중 판단 3건(boiler `summary`, distribution `summary`, genp `approach[3]`)은 실제 작업 순서다. 국문은 `A부터 B까지` 10줄이 줄 머리에 범위를 내세운다.
추천: 영문은 실제 작업 순서 3건을 유지하고 문제 7건만 고친다 (profile `about`, `availability[4]`, genp `highlights[2]`의 "to VLA ..." 반복도 이때 풀림). 국문은 영문 유지 여부와 따로, 줄 머리 `A부터 B까지,` 어순만 바꿔 범위를 줄 뒤로 보낸다 (정보는 그대로, 계획서 5.8 "국문은 영문 문장 구조를 따라가지 않아도 됨").

**5. 세미콜론 예외** (1.4 #4~6). 표 칸 9곳(docent 비교표 7, genp 사양 1, legal 비교표 1), samsung-consultation 그림 말풍선 2곳, `awards.yaml` `pnu-honors.title` 1곳.
추천: 표 칸 9곳은 약식 표기로 유지. 말풍선 2곳은 세미콜론을 빼고 줄바꿈만 남긴다. awards `title`은 발표된 명칭이 아니라 설명이므로 쉼표나 `and`로 고친다.

**6. 어휘** (1.4 #7~9). `customer journey` 1곳, `early wins` 3곳, `end to end` 6곳.
추천: `journey`는 CX 용어이고 그림 단계와 짝이라 단어는 두고, 문장만 1.4 방향(사람 주어)으로 고친다. `early wins`는 7번의 원자료 확인을 따르고, 확인 전에는 결정 근거 1곳(lotte-ai `decisions[2].rationale`)만 평이하게 바꾼다. `end to end`는 범위를 말하는 자리인 `role` 2곳(samsung-scm `role[0]`, lotte-price `role[0]`)만 남기고 `highlights` 3곳과 genp `summary`에서 뺀다.

**7. 원자료 확인이 필요한 문장** (1.4 #10 외). 원자료로만 판단할 수 있는 곳: lotte-ai `context[0]`와 `problem[0]`의 세 항목, `approach[3]`의 세 항목, genp `decisions[0].rationale`의 세 항목, genp `decisions[0].tradeoff`의 `edge`와 `lasting advantage`, docent `roadmap.note`의 주체, lotte-price `problem[0]`의 주체(구매 담당), samsung-consultation `problem[1]`의 `costing sales`, `early wins` 3곳, genp `domains` 표의 세 항목 칸.
추천: 단계 4의 해당 파일 작업 직전에 사용자에게 한 번에 묻고 항목마다 "원자료에 있음/없음"만 받는다. 답 전에는 해당 구절을 고치지 않는다 (CLAUDE.md 규칙 2). 없으면 1.4 방향대로 줄이거나 삭제한다.

**8. 영문 형식 세부** (1.4 #11~15).
추천:
- (가) 라벨의 Title Case 4개(`Control & Automation` 등 `h3` 3개, `Serving & Infrastructure` `dt` 1개)는 유지하고, DESIGN.md 1장 어조 표에 "소제목(h3)과 정의 목록 머리(dt)는 Title Case"를 추가한다
- (나) docent, genp의 `role[0]`이 직함 명사구로 시작하는 것은 유지한다
- (다) 따옴표는 곧은 따옴표(`"`)로 통일한다 (곡선 따옴표는 genp 3곳뿐)
- (라) 개인 프로젝트 8건의 `Built a ... that ...` 틀은 유지하고, 4.2에서 다른 이유로 고치는 카드만 동사를 바꾼다
- (마) 1.4가 유지를 제안한 2건(lotte-inventory `not a proven optimum`, docent 명단 삭제의 수동태)은 유지한다

**9. 국문 종결 목표의 범위** (0.4 #2). 단계 8.2 목표 "③④ 0"에 25자 미만 19건과 고객 목소리 말풍선을 넣을지. 19건은 결정 제목 3, 트레이드오프 3, 표 칸 3, 다이어그램 라벨 9, 말풍선 1이다.
추천: 결정 제목 3과 트레이드오프 3은 짧아도 문장 자리라 목표에 넣는다. 표 칸 3과 다이어그램 라벨 9의 평가어, 상태어(`없음`, `강함`, `멈춤`, `찾음`)는 라벨 관례라 허용한다. samsung-consultation 말풍선 4곳(25자 이상 ④ 3, 짧은 것 1)은 고객 목소리 인용이라 제외한다 (1.2 보존 지침). 그러면 8.2의 대상은 27곳(25자 이상 21, 짧은 문장 6)이다.

**10. 당위 결말** (1.3 I-4). `~해야 함` 3곳(genp `decisions[0].tradeoff`, legal `problem[2]`, `decisions[2].tradeoff`), `~필요` 8곳(트레이드오프 5, 문제 1, 표 칸 2). 한 문장 항목이라 스킬 처방(문장 옮기기)을 쓸 수 없다. 또 1.2 A-18 처방 예(`~ 수행해야 하는 과제` → `~ 수행 필요`)를 그대로 쓰면 문제 줄에 `필요` 결말이 늘어난다.
추천: `~해야 함` 3곳은 ③이므로 종결 통일 때 명사형으로 함께 정리한다. `~필요`는 명사형이라 종결 규칙에 맞고, 트레이드오프와 표 칸은 비용과 조건을 적는 자리라 허용한다. 문제 줄은 A-18 처방을 쓰더라도 사례마다 `필요` 결말을 1개 이하로 하고 나머지는 사실 서술로 끝낸다.

**11. 마침표 규칙 위반 14건** (0.4 #3).
추천: 한 줄 소개 3건은 예외 (2장 결정). genp `hardware.credit` 1건은 도구 오탐이다 (`Robotics.`처럼 소문자 뒤 마침표에서 문장을 나누지 않음). 단계 7에서 빌드 검사로 붙이기 전에 도구를 고친다. `experience.yaml` `posco-enc.summary` 1건은 한 문장이지만, 경력 요약 6곳의 끝 모양을 맞추려고 마침표를 유지하고 계획서 2장 작업자 판단에 "경력 요약은 문장 수와 관계없이 마침표"를 추가한다. 나머지 9건은 규칙대로 고친다.

**12. 언어 구분 없는 값의 중간점 3곳** (0.4 #1).
추천: docent `journey.marks[0].n`의 `1 · 2`는 `1–2` (숫자 범위의 en dash는 유지 규칙, 글자도 줄어듦). legal `repomap.tree[8].name`의 `법률.md · …`는 `법률.md …` (말줄임만). genp `stack.layers[3].value`의 `Kd·ω`는 제어 법칙 수식의 곱셈 기호라 유지하고, `N·m`과 함께 예외 목록에 등록한다.

**13. 굳은 말과 경력 직함 구분** (계획서 9장 열린 질문).
추천: 5장 제안대로. 대부분 풀고, `/`는 용어집이나 같은 사례가 이미 `/`를 쓰는 곳과 대비(vs.)를 뜻하는 곳에만 쓰고, 유지는 법령 단위 `조·항`, `조·항·호`만 예외 목록에 추가한다. 경력 직함 구분(`Director · AI Product Engineer` 등 3곳)은 영문 `role`과 같은 `/`로 바꾸고 단계 2.1 시안 대상에서 뺀다.

**14. 점검표 보강** (1.2 새 항목, 1.3, 1.4). 계획서 5.6, 5.7, 5.8에 넣을지.
추천: 넣는다.
- 5.6 국문에 추가: A-18 빈 머리명사(`과제`, `조건`, `구조`, `위험`) 떼기, A-11 `~을 위한`은 한 카드 1회, A-13 `X 기반`은 한 카드 2회 이하(굳은 기술 명칭 제외)와 `및` 풀기, D-7 줄 머리 `A부터 B까지,`와 개념적 `A에서 B로 전환`, F-7 `확보`, `종속`, `발생` 풀기, B-1 괄호 병기는 화면마다 첫 등장 1회, B-2 같은 글 안 국문 표기 통일, C-11 연결어미 뒤 쉼표
- 5.7 영문에 추가: `end to end` 같은 상투구 반복, 격언형 문장, 꼬리 분사 `, covering ...` 반복, 결정 제목 비교 틀의 상한 (3번 결정)
- 5.8 지킬 것에 추가: 어휘를 다양하게 하려고 동의어로 돌려쓰지 않는다 (용어 일관성 우선). 처방 예시에 남은 중간점, 콜론, 대구는 새로 만들지 않는다
- 기존 5.6의 "~적 추상 체인"과 "피동"은 1.2에서 지배 패턴이 아니었으므로 남기되 낮은 우선순위로 둔다

**15. `yaml` 패키지** (0.4 #4). astro의 하위 의존성(지금 2.9.1)을 빌드 검사에서 직접 쓴다.
추천: `devDependencies`에 `yaml`을 직접 둔다. 새로 설치하는 패키지가 아니라 선언만 추가하는 것이고, astro가 하위 의존성을 바꾸면 빌드 검사가 깨지는 일을 막는다 (CLAUDE.md "의존성 추가는 최소로, 추가할 때 이유를 알린다").

---

## 8. 부록

### 8.1 영문 문제 목록 전체 (1.4, 100건)

단계 4에서 이 목록을 보고 고친다. 파일 순서는 6장 제안 순서다. 키 앞의 `caseStudy.`는 줄였다. 같은 문장이 두 패턴에 걸리면 두 줄로 적었다. 고칠 방향은 1.4 그대로이고, 판단이 필요한 줄에는 7장 번호를 붙였다. 패턴 번호는 1.4의 P 번호다 (P11 Title Case는 문제 0건).

#### `profile.yaml` (3건, 높음 1, 중간 2, 낮음 0, 점수 7)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `about` | `now leads a Physical AI humanoid product from product definition to VLA training pipelines` | P4 꾸밈 범위 | 중간 | 범위 대신 맡은 일 둘을 직접 ("defining the product and building its VLA training pipeline" 식). 홈 첫 화면이라 우선 |
| `availability[4]` | `from system architecture to VLA data and training pipelines` | P4 꾸밈 범위 | 중간 | about과 끝맺음이 같음. "covering system architecture and VLA data and training pipelines" 식 |
| `trajectory[1].description` | `from solar power forecasting and transformer anomaly detection to a machine vision platform` | P4 꾸밈 범위 | 높음 | 축이 없는 범위. "including ..." 나열로 |

#### `awards.yaml` (1건, 높음 0, 중간 0, 낮음 1, 점수 1)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `pnu-honors.title` | `Honors graduate; academic excellence scholarship` | P6 세미콜론 | 낮음 (판단) | `title` 필드라 고정 대상인지 확인. 고친다면 쉼표 또는 "and" (7장 5번) |

#### `projects/equipment-diagnosis-chatbot.md` (1건, 높음 0, 중간 1, 낮음 0, 점수 2)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `highlights[1]` | `Built a demo dashboard to showcase the chatbot.` | P10 유행어, 과장 | 중간 | showcase는 antislop 어휘 목록. "Built a demo dashboard for the chatbot." |

#### `projects/power-plant-maintenance-assistant.md` (1건, 높음 0, 중간 0, 낮음 1, 점수 1)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `highlights[0]` | `Led the project end to end` | P10 유행어, 과장 | 낮음 | 반복 상투구 (6곳). 몇 곳만 남기거나 "Led the project" (7장 6번) |

#### `projects/legal-agentic-rag.md` (8건, 높음 3, 중간 3, 낮음 2, 점수 17)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `approach[2]` | `Wrote a system prompt that classifies ... routes ..., then re-checks ... and falls back ...` | P12 동사, 시제, 길이 (48단어, 영문 최장급) | 중간 | 분류와 라우팅 / 재확인과 대체 검색을 두 문장으로 |
| `compare.verdict` | `Not one or the other: the agent finds ...` | P2 부정 대구 (부정 서두 + 콜론 공개) | 높음 | "The agent uses both, finding ... and confirming ..." |
| `compare.verdict` | `Not one or the other: the agent ...` | P5 콜론 | 중간 | P2와 같은 문장. 콜론으로 결론을 터뜨리는 틀. 한 문장 단언으로 |
| `context[0]` | `get the relevant articles, such as whether an act is illegal or what the fine is, with sources` | P13 문장 구조 ("such as"가 질문이 아닌 조문에 붙음, 35단어) | 낮음 | 질문 예시를 "ask ..." 바로 뒤로 |
| `decisions[0].title` | `Two complementary sources, not one` | P2 부정 대구 (X, not Y 제목) | 높음 | "Two complementary knowledge sources" |
| `decisions[1].title` | `Routing in one agent's prompt, not a multi-agent system` | P2 부정 대구 (X, not Y 제목) | 높음 | "Intent routing inside one agent's prompt" |
| `outcome[2]` | `covering revision history, multi-turn follow-ups, identity protection, and rejecting personal data in input` | P13 문장 구조 (명사 셋 뒤 동명사 하나, 병렬 깨짐) | 낮음 | "personal-data rejection" 식으로 형태 맞춤 |
| `problem[0]` | `..., not in legal terms, and the answer often spans ...` | P2 부정 대구 (꼬리 부정) | 중간 | "not in legal terms" 삭제 (앞의 "everyday words"로 뜻이 충분) |

#### `projects/genp-humanoid.md` (23건, 높음 2, 중간 13, 낮음 8, 점수 40)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `approach[2]` | `Designing the Phase 2 and 3 architecture, ...` | P12 동사, 시제, 길이 (과거형 목록 안의 진행형) | 중간 (판단) | 목록 시제 통일 (7장 2번) |
| `approach[2]` | `Designing the Phase 2 and 3 architecture, ..., and building the control panel for ...` (시제 행과 같은 문자열) | P12 동사, 시제, 길이 (35단어) | 낮음 | 설계와 제어판 구축을 두 문장으로 |
| `approach[3]` | `Setting up the data and model pipeline, ...` | P12 동사, 시제, 길이 (과거형 목록 안의 진행형) | 중간 (판단) | 목록 시제 통일 (7장 2번) |
| `context[0]` | `from site setup to monitoring and operations tools` | P4 꾸밈 범위 | 중간 | "including site setup, monitoring, and operations tools" |
| `decisions[0].rationale` | `so the effort goes into the custom AI stack, site delivery, and operations` | P7 세 항목 | 낮음 | 원자료에 이 셋이 있는지 확인. 없으면 둘로 줄이거나 주어를 사람으로 ("we focus on ...") (7장 7번) |
| `decisions[0].title` | `Build the stack, not the robot or the foundation model` | P2 부정 대구 (X, not Y 제목) | 높음 | 긍정 단언만 남김 ("Build our own AI stack on a stock robot" 식). 버린 대안은 근거 문장이 이미 설명 |
| `decisions[0].tradeoff` | `An edge built on open models is short-lived, so site data and the task library have to become the lasting advantage.` | P10 유행어, 과장 | 중간 | 전략 격언 + 과장 (edge, lasting advantage). 원문 뜻(오픈 모델에서 오는 우위는 오래가지 않으니 현장 데이터와 태스크 라이브러리로 차별화)만 평이하게. 새 주장(경쟁사 등)은 넣지 않음. 원자료 표현 확인 (7장 7번) |
| `decisions[2].rationale` | `so raw video never leaves; an export gateway and remote access are options.` | P6 세미콜론 | 중간 | 마침표 |
| `decisions[2].title` | `One local server completes the site` | P9 무생물 주어 | 중간 | 뜻이 흐린 표어. "One local server per site" 또는 "Everything runs on one local server" |
| `decisions[2].tradeoff` | `use commercial APIs; a closed-network site needs them moved ...` | P6 세미콜론 | 낮음 | 마침표 |
| `decisions[3].rationale` | `each stop the robot; the voice stop fires on partial transcripts ...` | P6 세미콜론 | 중간 | 마침표 |
| `highlights[1]` | `Architect a single workflow that integrates ..., and design and build a control panel for ...` | P12 동사, 시제, 길이 (33단어, 동사 셋 + 여섯 항목) | 낮음 | 두 문장으로 또는 제어판 항목을 줄임. "Architect" 동사도 "Design"이 무난 |
| `highlights[2]` | `from Teleop data collection to VLA training and evaluation and a simulation environment for validation` | P4 꾸밈 범위 | 중간 | 범위 뒤에 항목이 덧붙어 구조가 깨짐. 단계 나열로 |
| `loop[0]` | `is an in-house facility; customers receive only the trained models.` | P6 세미콜론 | 낮음 | 마침표 |
| `outcome[1]` | `basic pack; localization and path planning are implemented, ...` | P6 세미콜론 | 중간 | 마침표 + 능동 (P8) |
| `outcome[1]` | `localization and path planning are implemented` | P8 수동태 | 중간 | 성과 문장이라 본인이 주어. "Implemented localization and path planning" |
| `outcome[2]` | `The docent profile is in its first delivery, ...` | P12 동사, 시제, 길이 (동사로 시작하지 않음) | 낮음 | "Started the first docent delivery, a brand experience center project with its own case study." 식 |
| `problem[0]` | `ready to work rather than as separate demos` | P2 부정 대구 (rather than 꼬리) | 중간 | "rather than" 절 삭제. 앞 절(한 워크플로)로 뜻이 충분 |
| `problem[1]` | `has to be reused rather than rebuilt for every customer` | P2 부정 대구 (rather than) | 낮음 | "reused across customers"로 줄임 |
| `problem[2]` | `A demo is not an acceptance test; tasks must succeed ...` | P2 부정 대구 (격언형 부정 정의 + 세미콜론) | 높음 | 격언 첫 절을 빼고 요구 조건 두 개를 두 문장으로 |
| `problem[2]` | `A demo is not an acceptance test; tasks must succeed ...` | P6 세미콜론 | 중간 | P2와 같은 문장 |
| `summary` | `an end-to-end Physical AI humanoid product` | P10 유행어, 과장 | 낮음 | 뜻이 흐림. 빼도 문장이 성립 |
| `summary` | `Leading development of GenP, ...` | P12 동사, 시제, 길이 (highlights는 현재형 "Own/Architect/Lead"인데 summary만 `-ing`) | 중간 (판단) | "Lead development of GenP, ..." (7장 2번) |

#### `diagrams/genp-humanoid.yaml` (2건, 높음 0, 중간 1, 낮음 1, 점수 3)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `episode.note` | `One demonstration becomes five recorded tracks` | P9 무생물 주어 | 낮음 | "Each demonstration is recorded as five tracks ..." |
| `stack.descent` | `EACH LAYER DOWN: LESS INFORMATION, MORE PRECISION` | P5 콜론 | 중간 | 콜론 + "less X, more Y" 격언형 대구. "Each layer down adds precision" 식 한 절로 (대문자는 그림 규칙이라 유지) |

#### `projects/docent-humanoid.md` (21건, 높음 0, 중간 11, 낮음 10, 점수 32)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `approach[3]` | `Building a control dashboard ...` | P12 동사, 시제, 길이 (과거형 목록 안의 진행형, approach[0..2]는 과거형) | 중간 (판단) | 목록 시제 통일 (7장 2번) |
| `compare.verdict` | `so no modification was needed` | P8 수동태 | 낮음 | "with no modification" |
| `compare.verdict` | `Chose X2 Ultra because ..., so ..., and ...` | P12 동사, 시제, 길이 (46단어, because/so/and 사슬) | 중간 | 선정 이유 둘을 두 문장으로 |
| `decisions[0].rationale` | `lifts accuracy on proper nouns; if confidence stays low ...` | P6 세미콜론 | 중간 | 마침표 |
| `decisions[0].tradeoff` | `register each tour's list beforehand; the list is deleted ...` | P6 세미콜론 | 낮음 | 마침표 |
| `decisions[1].title` | `Fixed-pose basket instead of grasping` | P3 제목 비교 틀 (instead of) | 낮음 | 유지 후보 (실제 검토 대안) 또는 "Basket held in a fixed pose" (7장 3번) |
| `decisions[1].tradeoff` | `hands over the basket; grasping is left for Step 2.` | P6 세미콜론 | 낮음 | 마침표 또는 ", and grasping waits for Step 2" |
| `decisions[1].tradeoff` | `grasping is left for Step 2` | P8 수동태 | 낮음 | "Step 2 adds grasping" |
| `decisions[3].rationale` | `gave four languages at once; dialogue flow, voice preprocessing, ...` | P6 세미콜론 | 중간 | 마침표. 앞 절 과거형, 뒤 절 현재형도 맞춤 |
| `decisions[3].title` | `External speech APIs, everything else on site` | P3 제목 비교 틀 (A, B 대구) | 낮음 | "Only speech goes to external APIs" 식 단언 (7장 3번) |
| `decisions[3].tradeoff` | `Needs outbound internet for the APIs; a fully closed network ...` | P6 세미콜론 | 낮음 | 마침표 |
| `highlights[0]` | `Managing the project as PM, ...` | P12 동사, 시제, 길이 (진행 중 항목을 `-ing`로) | 중간 (판단) | "Manage the project as PM, ..." (7장 2번) |
| `highlights[1]` | `Designing the architecture for ...` | P12 동사, 시제, 길이 (진행 중 항목을 `-ing`로) | 중간 (판단) | "Design the architecture ..." (7장 2번) |
| `highlights[2]` | `Building a control dashboard ...` | P12 동사, 시제, 길이 (진행 중 항목을 `-ing`로) | 중간 (판단) | "Build a control dashboard ..." (7장 2번) |
| `journey.steps[1].body` | `greets the visitor by name; if unsure, asks once more ...` | P6 세미콜론 | 낮음 | 마침표 |
| `roadmap.note` | `same robot and sensors; its timing and scope will be set ...` | P6 세미콜론 | 중간 | 마침표 |
| `roadmap.note` | `its timing and scope will be set from pilot data` | P8 수동태 | 낮음 | "pilot data will set its timing and scope" 또는 주체(고객과 함께) 명시. 원자료 확인 (7장 7번) |
| `safety[0]` | `resumes when the visitor steps away; walls and exhibits ... are exempt, and the rule is lifted ...` | P6 세미콜론 | 중간 | 42단어. 두 문장으로, 예외 조건을 둘째 문장에 |
| `safety[0]` | `the rule is lifted while the robot stands still` | P8 수동태 | 낮음 | "the robot drops the rule while it stands still ..." |
| `safety[1]` | `cuts torque as a last resort; the voice command and dashboard button ...` | P6 세미콜론 | 중간 | 마침표 |
| `summary` | `Delivering a docent humanoid robot ...` | P12 동사, 시제, 길이 (진행 중 항목을 `-ing`로, DESIGN.md는 현재형) | 중간 (판단) | "Deliver ..." 또는 정한 형식으로 (7장 2번) |

#### `projects/samsung-consultation-assistant.md` (8건, 높음 1, 중간 2, 낮음 5, 점수 12)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `decisions[0].rationale` | `Modules are reused when channels or features are added` | P8 수동태 | 낮음 | "New channels and features reuse the same modules" (approach[0]과 같은 표현) |
| `decisions[0].title` | `A modular platform, not a single chatbot` | P2 부정 대구 (X, not Y 제목) | 높음 | "A modular platform shared across channels" (approach[0]에 근거 있음) |
| `decisions[1].title` | `Entity mapping and pseudo queries instead of direct Text-to-SQL` | P3 제목 비교 틀 (instead of) | 낮음 | scm `decisions[0]`과 거의 같은 제목. 둘 중 하나는 단언형으로 (7장 3번) |
| `highlights[0]` | `Led the project end to end` | P10 유행어, 과장 | 낮음 | 반복 상투구 (6곳). 몇 곳만 남기거나 "Led the project" (7장 6번) |
| `problem[1]` | `..., costing sales.` | P13 문장 구조 (근거 없이 결과를 덧붙이는 꼬리 분사) | 낮음 | 원자료에 매출 손실 언급이 있는지 확인. 없으면 삭제 (7장 7번) |
| `problem[2]` | `Each step of the customer journey, from discovery to repurchase, was answered by a different party.` | P4 꾸밈 범위 | 중간 | 다이어그램 단계와 짝이라 뜻은 있으나 산문에선 꾸밈. "Customers dealt with a different party at each step, from ..."처럼 주어를 사람으로 (P8, P10과 같은 문장) |
| `problem[2]` | `was answered by a different party` | P8 수동태 | 낮음 | P4 행과 같은 문장 |
| `problem[2]` | `Each step of the customer journey` | P10 유행어, 과장 | 중간 (판단) | journey는 antislop 어휘 목록. CX 용어로 볼지 확인 (7장 6번) |

#### `diagrams/samsung-consultation-assistant.yaml` (2건, 높음 0, 중간 0, 낮음 2, 점수 2)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `problem.callouts[0]` | `Too many lookalikes;\nreviews hard to trust` | P6 세미콜론 | 낮음 (판단) | 줄바꿈이 이미 나눔. 세미콜론 빼거나 마침표 (7장 5번) |
| `problem.callouts[2]` | `Can't track or change\ndelivery; no one answers` | P6 세미콜론 | 낮음 (판단) | 줄바꿈이 이미 나눔. 세미콜론 빼거나 마침표 (7장 5번) |

#### `projects/lotte-price-forecasting.md` (8건, 높음 1, 중간 2, 낮음 5, 점수 12)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `approach[0]` | `what counts as improvement — a MAPE target of 10% or less` | P1 em dash | 높음 | 마침표로 두 문장. 목표를 둘째 문장 주어로 |
| `decisions[0].title` | `Supervised regression over deep sequence models` | P3 제목 비교 틀 (X over Y) | 낮음 | 유지 후보 또는 "Tree ensembles on lag features" (7장 3번) |
| `decisions[0].tradeoff` | `Long-range dependencies depend on the lag design.` | P13 문장 구조 (같은 어근 반복) | 낮음 | "Long-range dependencies are captured only as far as the lag design allows." 식 |
| `decisions[1].rationale` | `... baselines fixed the bar for improvement, agreed with the client up front` | P9 무생물 주어 | 중간 | 주어를 팀으로 + 매달린 분사 정리 ("Agreed three baselines with the client up front: ...") |
| `decisions[2].tradeoff` | `Interactions between axes were not explored.` | P8 수동태 | 낮음 | "Leaves interactions between axes untested." (트레이드오프 형식에 맞춤) |
| `problem[0]` | `Purchase quotes were reviewed on experts' experience` | P8 수동태 | 낮음 | 주체(구매 담당)를 주어로. 주체 표현은 원자료 확인 (7장 7번) |
| `problem[2]` | `inventory could not flex with the market, such as buying ahead of price rises` | P9 무생물 주어 | 중간 | 주어를 사람으로 ("Buyers could not time purchases to the market, such as ..."), "such as" 위치도 바로잡음 |
| `role[0]` | `led the work end to end` | P10 유행어, 과장 | 낮음 | 반복 상투구 (6곳). 몇 곳만 남기거나 "Led the project" (7장 6번) |

#### `projects/samsung-scm-agent.md` (9건, 높음 1, 중간 1, 낮음 7, 점수 12)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `approach[1]` | `coordinates three agents through A2A — data query and analysis, work support (AI Advisor), and external information` | P1 em dash | 높음 | 세 에이전트를 괄호로 묶거나 "three agents (...)"로 앞에 붙임 |
| `decisions[0].title` | `Pseudo query instead of direct SQL` | P3 제목 비교 틀 (instead of) | 낮음 | samsung-consultation `decisions[1]`과 거의 같은 제목. 둘 중 하나는 단언형으로 (7장 3번) |
| `decisions[2].rationale` | `..., keeping development fast and production stable.` | P13 문장 구조 (짝 맞춘 꼬리 분사, fast / stable) | 낮음 | 유지 가능. 줄인다면 "so development moves fast and production stays reviewed" 식 |
| `decisions[2].title` | `Automated dev deployment, gated production release` | P3 제목 비교 틀 (A, B 대구) | 낮음 | 유지 가능 (두 환경 규칙 자체가 내용) (7장 3번) |
| `highlights[0]` | `Led the project end to end` | P10 유행어, 과장 | 낮음 | 반복 상투구 (6곳). 몇 곳만 남기거나 "Led the project" (7장 6번) |
| `outcome[1]` | `instant natural-language queries` | P10 유행어, 과장 | 낮음 | 측정 근거 없는 "instant". "natural-language queries that return results and charts directly" 식 |
| `problem[2]` | `was collected by hand, which slowed root-cause analysis` | P8 수동태 | 낮음 | "Planners collected ... by hand" |
| `role[0]` | `Led the project end to end in a team of seven` | P10 유행어, 과장 | 낮음 | 반복 상투구 (6곳). 몇 곳만 남기거나 "Led the project" (7장 6번) |
| `role[1]` | `training scripts hands-on; set up the development and production environments ...` | P6 세미콜론 | 중간 | 마침표로 두 문장 (둘 다 동사 시작) |

#### `projects/lotte-ai-masterplan.md` (6건, 높음 0, 중간 2, 낮음 4, 점수 8)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `context[0]` | `facing unstable raw-material supply, tighter safety rules, and an aging plant workforce` | P7 세 항목 | 낮음 | 원자료 확인. 있으면 유지 (7장 7번) |
| `decisions[0].rationale` | `A score ranks tasks but says nothing about how to run them` | P9 무생물 주어 | 낮음 | "A score ranks tasks but does not show how to run them" |
| `decisions[2].rationale` | `Commercial tools bring early wins` | P9 무생물 주어 | 중간 | 상투구 "early wins" 겸함. 새 사실 없이 "Commercial tools can go live first, while tasks that need new data wait ..." 식 |
| `decisions[2].title` | `Proven solutions first, development after the data platform` | P3 제목 비교 틀 (A, B 대구) | 낮음 | "Proven solutions first" 정도로 줄임 (7장 3번) |
| `problem[0]` | `no common criteria for value, readiness, or priority` | P7 세 항목 | 낮음 | 원자료 확인. 없으면 "no common criteria for ranking them" (7장 7번) |
| `role[1]` | `from problem framing and model selection to the training approach` | P4 꾸밈 범위 | 중간 | "covering problem framing, model selection, and the training approach" 또는 동사 셋 |

#### `diagrams/lotte-ai-masterplan.yaml` (2건, 높음 0, 중간 0, 낮음 2, 점수 2)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `gantt.notes[0].text` | `Proven solutions go\nfirst for early wins` | P10 유행어, 과장 | 낮음 (판단) | "early wins" 3곳 반복. 원자료 용어인지 확인 (7장 6번, 7번) |
| `matrix.cells[0].body` | `Bring in a commercial tool for early wins.` | P10 유행어, 과장 | 낮음 (판단) | "early wins" 3곳 반복. 원자료 용어인지 확인 (7장 6번, 7번) |

#### `projects/lotte-inventory-blend-optimization.md` (5건, 높음 0, 중간 0, 낮음 5, 점수 5)

| 키 | 구절 | 패턴 | 심각도 | 고칠 방향 |
|---|---|---|---|---|
| `decisions[0].title` | `Sorting and grid search instead of a commercial solver` | P3 제목 비교 틀 (instead of) | 낮음 | 유지 후보 (problem[2]의 기존 솔버가 실제 대안) (7장 3번) |
| `decisions[0].tradeoff` | `Finds a good combination, not a proven optimum.` | P2 부정 대구 (꼬리 부정) | 낮음 (판단) | 휴리스틱과 최적해의 실제 대비라 유지 가능. 고친다면 "Finds a good combination without proving it optimal." (7장 8번) |
| `decisions[1].rationale` | `About 22,000 plant records replace about 50 lab mixes, reflect ..., and add ...` | P9 무생물 주어 | 낮음 | 유지 가능. 고친다면 "Using about 22,000 plant records instead of about 50 lab mixes ..." |
| `decisions[1].title` | `Operating records instead of lab experiments` | P3 제목 비교 틀 (instead of) | 낮음 | "Train on operating records" 식 (7장 3번) |
| `problem[1]` | `Mix plans were built by hand` | P8 수동태 | 낮음 | "Planners built mix plans by hand" (problem[0]의 Planners) |

### 8.2 영문에서 고치지 않을 것 (1.4 정상 판정)

| 패턴 | 유지 | 위치 |
|---|---|---|
| `instead of` | 실제 수치나 정의를 잇는 4건 | lotte-inventory `outcome[1]`, lotte-price `decisions[2].rationale`, lotte-price 그림 `results.note`, genp `archNote` |
| 결정 제목 | 순서가 곧 결정 내용인 3건 | lotte-ai `Score first, then classify`, `A PoC before any system build`, lotte-price `Benchmark before models` |
| "from X to Y" 수치 범위 | 10건 | legal `approach[1]`, `outcome[1]`, lotte-inventory `highlights[1]`, `highlights[2]`, `outcome[0]` 2곳, `decisions[0].rationale`, lotte-price `highlights[1]`, `outcome[0]`, samsung-consultation `outcome[1]` |
| "from X to Y" 바뀐 과정 | 5건 | lotte-price `outcome[1]`, `outcome[2]`, samsung-consultation `approach[1]`, docent `roadmap.note`, genp 그림 `stack.note` |
| "from X to Y" 실제 작업 순서 | 3건 (7장 4번) | boiler `summary`, distribution `summary`, genp `approach[3]` |
| 콜론 | 라벨형 15건 | docent `compare.credit`, genp `hardware.title`, `hardware.external.sub`, `hardware.credit` 2곳, legal `compare.rows[0]` 2곳, `rows[6]` 2곳, `screens.slices[0].alt`, `slices[1].alt`, legal 그림 `prompt.nodes[9]`, `arch.nodes[14]`, lotte-price 그림 `arch.nodes[2].sub`, `results.note` |
| 세미콜론 | 13건 | 표 칸 9 (7장 5번), 따옴표 안 인용 2 (legal `problem[0]`, `screens.slices[0].alt`), 그림 범례 1 (legal 그림 `prompt.texts[0]`), 목록 묶음 구분 1 (profile `skills[1].summary`) |
| 수동태 | 행위자보다 대상이 주제인 곳 약 13건 | docent `problem[3]`, `safety[1]`, genp `decisions[1].tradeoff`, `decisions[3].rationale`, `problem[1]`, samsung-consultation `decisions[1]`, `outcome[0]`, samsung-scm `problem[1]`, `decisions[0]`, lotte-inventory `problem[2]`, genp 그림 `episode.metrics` 등 |
| 무생물 주어 | 5건 | legal `approach[2]`, `problem[2]`, genp `decisions[3].tradeoff`, samsung-consultation `decisions[0].rationale`, docent `compare.verdict` |

### 8.3 국문 진단의 보존 지침 (1.2)

1.2 진단이 정한 "건드리면 안 되는 것"이다. 단계 4와 5의 국문 수정, `/humanize-korean` 윤문 결과 검토에 그대로 쓴다. 표기만 이 문서 규칙에 맞췄다.

- **줄 구조**
  - 한 줄이 콘텐츠 필드 하나다. 줄 순서와 줄 수를 그대로 둔다
  - 줄을 합치거나 쪼개지 않는다. 줄 안에서 마침표나 쉼표로 끊는 것은 허용한다
- **다이어그램 라벨과 표 칸**
  - 대상: `diagrams/*.yaml` 전체, 장비 비교표(`미탑재, 전면부 개조와 표정 제어 개발 필요` 등), 결정 표(`강함`, `약함`, `높음: 청킹·임베딩·적재`), 도메인 표
  - 상자 크기 제약이 있으므로 4.1의 K1~K5 처방을 적용하지 않는다. K6 표기 통일만 예외다
  - 라벨 표기(`→`, `×`, `+`)는 그대로 둔다. 중간점은 5.2 기준과 단계 2 결정을 따른다 (1.2 원문은 "그대로 둔다"였으나 2장 결정이 우선)
- **영문 원본과 정보 1:1**
  - 관형절을 풀거나 `부터~까지`를 옮길 때 항목, 수치, 범위, 기간을 빠뜨리거나 보태지 않는다
  - `확보`를 풀 때도 원문에 없는 수치나 효과를 넣지 않는다
- **표기를 그대로 둘 것**
  - 숫자, 단위, 기간, 건수, 쪽수, 권호
  - 제품, 모델, 서비스 이름: `GR00T N1.7`, `GEAR-SONIC`, `Qwen 8B`, `Llama 3.1 70B`, `Unitree G1`, `AgiBot X2 Ultra`, `Seahorse`, `legalQ(리걸큐)`, `legalize-kr`, `MixPlanner`, `GenON`, `GenP`
  - 용어집 약어: `RAG`, `LLM`, `MCP`, `Agentic RAG`, `VLA`, `VLN`, `SLAM`, `MPC`, `PoC`, `MAPE`, `SHAP`, `sLLM`, `A2A`, `E-Stop`, `LLMOps`, `MLOps` 등
- **고객사 표기**
  - 실명(삼성전자, 롯데정밀화학)과 익명 업종 표기(글로벌 식음료 기업, 석유화학 기업, 발전 기업, 철강 기업)를 그대로 둔다
  - 회사 이름을 새로 넣거나 빼지 않는다
- **고유 명칭**: 학과, 기관, 학회지 이름(`전기 및 전자공학`, `전기전자통신공학부`, `제어로봇시스템학회 논문지` 등)은 그대로 둔다. 이 `및`은 K3 처방에서 뺀다
- **인용문은 원문 그대로**
  - `"해외직구 세금이 어떻게 되나요?"`, `"회사에서 갑자기 해고 통보를 ..."`
  - `“빨간 컵 있는 곳으로 가”`, `“테이블 위 캔을 집어 분리수거함에 정리해”`, 음성 `"멈춰"`
  - 고객 고충을 흉내 낸 해라체 말풍선 4줄 (`diagrams/samsung-consultation-assistant.yaml` `problem.callouts`)
- **`고정 자세로 바구니를 받치고`** (docent 시나리오): 실물을 받치는 경우라 그대로 둔다
- **처방이 다른 지표를 늘리지 않게**: 중간점, 콜론, `A가 아니라 B`를 새로 만들지 않는다. `및`을 중간점으로 바꾸지 않는다
- **정량 앵커의 오탐**: `safe_balance_count` 4는 모두 로봇 `균형 제어` 같은 기술어라 처방하지 않는다

### 8.4 단계 8.3 재측정 기준 (1.3)

`/humanize-scan`으로 같은 키 경로를 같은 규칙으로 다시 잰다. 원본 기록은 `_workspace/diagnosis/scan-before.md`.

| 블록 | 파일 | 키 경로 | 크기 |
|---|---|---|---|
| A 프로필 소개 | `profile.yaml` | `about.ko`, `trajectory[0..3].description.ko` | 392자, 문장 7 |
| B legal 문제와 결정 | `projects/legal-agentic-rag.md` | `caseStudy.problem[0..2].ko`, `caseStudy.decisions[0..3]`의 `title.ko`, `rationale.ko`, `tradeoff.ko`, `caseStudy.compare.verdict.ko` | 643자, 문장 16 |
| C docent 결정과 그림 설명 | `projects/docent-humanoid.md` | `caseStudy.decisions[0..3]`의 `title.ko`, `rationale.ko`, `tradeoff.ko`, `caseStudy.compare.verdict.ko`, `caseStudy.journey.note.ko`, `caseStudy.roadmap.note.ko` | 806자, 문장 19 |
| D 경력 요약 | `experience.yaml` | `genon`, `pwc`, `makinarocks`, `semco`, `kepco`, `posco-enc`의 `summary.ko` | 640자, 문장 12 |

측정 규칙 요약: 키 값 하나를 문단 하나로 본다. 6신호 중 E-1(100자 넘는 문장 없음)과 E-2(같은 종결 연속)의 명사형 연속은 이력서 형식이라 발동 수에서 뺀다. C-8 부정 대구는 `A가 아닌 B`, `A가 아니라 B` 표면형만, C-11은 `-고`, `-며`, `-지만`, `-면서`, `-아서/-어서`, `-아/-어` 뒤 쉼표만 센다. 발동 신호가 3개 이상이면 "많다".

수정 전 값:

| 블록 | C-8 | C-11 | I-4 (결말/대상) | F-5 | 발동 | 판정 | 스캔 밖 참고 (중간점, 서술형 종결 문장, `~함/~음` 종결 문단) |
|---|---|---|---|---|---|---|---|
| A | 0 | 0 | 0/0 | 0 | 0 | 적다 | 2, 0, 0 |
| B | 4 | 5 | 3/2 | 0 | 3 | 많다 | 5, 1, 5 |
| C | 0 | 7 | 2/1 | 0 | 2 | 적다 (E-1을 넣으면 3, 경계) | 4, 6, 5 |
| D | 0 | 0 | 0/0 | 0 | 0 | 적다 | 11, 0, 0 |

명사 나열형인 A와 D의 개선(중간점, 같은 말 반복)은 스캔이 보지 못하므로 단계 8에서는 `scripts/check-text.mjs` 지표로 비교한다.
