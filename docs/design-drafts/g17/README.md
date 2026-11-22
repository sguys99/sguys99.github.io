# g17. 구분자 시안 (2026-11-22, 계획 단계 2.1)

`docs/anti-ai-slop-plan.md` 2장 "구분자 범위: B"에 따라 컴포넌트와 UI 문구가 넣는 가운뎃점 ` · `과 em dash `—`를 무엇으로 바꿀지 고르는 시안. 결정 전이라 src/는 바꾸지 않았다.

- 비교 페이지: `index.html` (조합 버튼으로 영문/국문, 1280/360, 라이트/다크 전환)
- 캡처: `shots/<자리>-<안>-<조합>.png` (안: `base`=지금, `A`, `B`, `C` / 조합: `en-light-desk`, `ko-dark-desk`, `ko-light-360`, `en-dark-360`), CV PDF `shots/pdf-<안>-<언어>.png`(첫 쪽), `-last.png`(끝 쪽)
- 검사 결과: `shots/manifest.json` (80쪽: 가로 넘침 0, 줄 머리에 온 쉼표, 슬래시, 세로 막대 0)

생성 순서: 최신 빌드를 서빙(저장소 루트, Node 24: `npm run build` → `npm run preview -- --port 4417`) → `node docs/design-drafts/g17/shoot.mjs http://localhost:4417` → `node docs/design-drafts/g17/make.mjs`. 보기: 저장소 루트에서 `python3 -m http.server 4418` → `http://localhost:4418/docs/design-drafts/g17/`.

방법: 빌드된 실제 페이지를 Playwright로 열고, 안마다 해당 자리의 글자와 DOM을 바꾸고 CSS를 덧붙여(`shoot.mjs`의 `apply()`) 찍었다. 규칙 데이터는 `variants.mjs`. 색과 간격은 `tokens.css` 변수만 쓴다(`--line-strong`, `--sp-2`, `--sp-3`).

## 1. 안별 규칙

자리 성격: (1) 키워드 나열 (2) 필드 구분 (3) 문서 제목(순수 텍스트) (4) 라벨 안 병렬(국문) (5) 빈 날짜

| 성격 | A 글자 구분 | B 문장 부호와 말 | C 여백과 선 |
|---|---|---|---|
| (1) 나열 | 쉼표. 영문 제목 `Teaching, Books & Advisory`, 국문 `강의, 저서, 자문`, `지식재산, 출판물` | 쉼표. 국문 두 말은 "와/과" (`지식재산과 출판물`, `강의와 자문`) | 가는 세로선 + 숨긴 쉼표. 링크(탭, 메뉴, 404 목록) 안에서만 쉼표 |
| (2) 필드 | `NBSP/ ` (`PwC Consulting / Samsung Electronics`) | 소속과 고객은 쉼표, 덧붙는 값은 괄호 (`AI Engineer (Director, R&D Group, GenON)`) | 가는 세로선 + 숨긴 쉼표 |
| (3) 문서 제목 | ` \| ` | `, ` (이름 + CV는 띄어쓰기: `Kwang Myung Yu CV`, `유광명 이력서`) | ` \| ` (PDF 바닥글만 전각 공백) |
| (4) 라벨 안 (국문) | `/` 붙여 씀 (`제어/최적화`) | "와/과" (`제어와 최적화`) | `/` 붙여 씀 |
| (5) 빈 날짜 | 빈칸 | 빈칸 | 짧은 가는 선 (CSS) |

(1)과 (4)의 조합: A `LLM 에이전트/RAG, 예측, 제어/최적화` / B `LLM 에이전트와 RAG, 예측, 제어와 최적화` / C `LLM 에이전트/RAG │ 예측 │ 제어/최적화`(│는 CSS 선). 어느 안도 두 자리가 같은 기호를 쓰지 않는다. 영문 분야와 역량 이름은 이미 `&`라 모든 안에서 그대로.

모든 안 공통:

- **CV 역할**은 화면에서도 인쇄처럼 다음 줄로 내리고 기호를 쓰지 않는다. 소속에 쉼표(`GenON, R&D Group`), 영문 직함에 슬래시(`Director / AI Product Engineer`)가 있어 쉼표와 슬래시는 겹친다. 괄호는 인쇄(PDF)에서 역할이 이미 따로 한 줄이라 `(Director / AI Product Engineer)`만 남는 줄이 된다.
- **og:image:alt**는 스크린 리더가 읽으므로 쉼표: `Kwang Myung Yu, AI Engineer` / `유광명, AI Engineer`.
- **원장 태그**는 한 태그가 줄에서 갈라지지 않게 한다(A, B는 태그마다 `white-space: nowrap` 묶음, C는 항목 단위 줄바꿈). 지금 화면은 360 영문에서 `Control` / `& Optimization`으로 갈라져 `&`가 줄 머리에 온다(`shots/ledger-base-en-dark-360.png`).
- 화면에 안 보이는 문구: `dgWith` 국문 `{a}·{b} 연동` → `{a}, {b} 연동`("와/과"는 `{a}` 끝 글자에 따라 달라져 자동으로 못 붙임). 표준 구성 그림의 스크린 리더 문장(em dash 4개) → 영문 `{alt}. {robot} and {server}: Wi-Fi 6, ROS 2 + ZMQ. {server} and {external}: OUTBOUND.`, 국문 `{alt}. {robot}, {server} 연결: Wi-Fi 6, ROS 2 + ZMQ. {server}, {external} 연결: 외부망.`

## 2. 의도와 장단점

| 안 | 의도 | 장점 | 단점 |
|---|---|---|---|
| A 글자 구분 | 중간점 자리에 같은 일을 하는 글자를 하나씩: 나열 쉼표, 필드 슬래시, 제목 세로 막대. 화면 구조는 그대로 | 구현이 가장 단순(ui.ts와 join 문자열만). 복사, 스크린 리더, PDF 글자층에 보이는 그대로 남음 | 슬래시가 이미 다른 뜻으로 쓰임: `03 / 08`(케이스 위치), `{n} / {total}`(건수), `GPA 3.83 / 4.3`(학력 같은 줄, `shots/edu-A-en-light-desk.png`), 영문 직함, 개인 프로젝트 스택 줄, 항목 `External STT/TTS APIs`. 국문에서 `/`는 "또는"으로도 읽힘 |
| B 문장 부호와 말 | 이력서 본문처럼: 나열 쉼표, 두 말 "와/과", 덧붙는 값 괄호, 제목 쉼표 | 가장 자연스럽게 읽힘(`M.S. in Electrical Engineering (Control & network optimization)`, `AgiBot X2 Ultra (Selected)`, 캡션 `… 2026 (legalq.dnotitia.ai)`). 텍스트만 남는 곳(PDF, 복사, 스크린 리더)에서도 그대로 | 자리마다 쉼표와 괄호를 골라야 해 규칙이 둘. 국문 학력 줄에 괄호가 두 번(`KAIST (한국과학기술원) … (세부전공: …)`). 로고 뒤 쉼표가 어색(`shots/work-B-ko-dark-desk.png`). 국문 문서 제목의 쉼표가 어색(`페이지를 찾을 수 없습니다, 유광명`). "와/과" 라벨이 길어짐 |
| C 여백과 선 | 화면에서는 글자 없이 가는 세로선(`--line-strong`)과 간격(`--sp-2`). 숨긴 쉼표가 스크린 리더와 복사에 남음 | 원장과 기록표가 가장 조용하고 표처럼 보임(`shots/ledger-C-ko-dark-desk.png`). 줄 머리 선은 잘려 보이지 않아 줄바꿈 걱정 없음. 태그가 통째로 넘어가 `& Optimization` 문제도 함께 풀림. 라벨 안 `/`와 모양이 달라 구분됨 | 구현 범위가 가장 큼: ui.ts 문자열을 배열로, 컴포넌트마다 마크업 변경, CSS `content`(원장 모바일)와 `attr()`(기종 비교 라벨), SVG(표준 구성)는 따로 처리. 링크 안에는 선을 못 넣어 탭과 메뉴는 쉼표(`shots/menu-C-ko-light-360.png`, 선을 넣으면 링크가 둘로 보였음). **CV PDF 글자층에서 숨긴 쉼표가 빠짐**: `pdftotext` 결과가 `LangChain     LangGraph`, `PwC Consulting        Samsung Electronics`로 구분 없이 이어짐(ATS, 복사에 불리) |

### 추천: B를 기본으로, (3)은 ` | `, (4)는 `/`

- 이 사이트에서 구분자가 가장 많이 남는 곳은 CV PDF와 복사 텍스트다. B는 그 둘에서 보이는 그대로 읽히고, A처럼 슬래시 뜻이 섞이지 않는다. C는 화면이 가장 정돈돼 보이지만 PDF 글자층에서 구분이 사라지고 구현 범위가 크다.
- (3) 문서 제목은 B의 쉼표 대신 ` | `: 국문 제목의 쉼표(`…없습니다, 유광명`)가 어색하고, 탭 제목의 세로 막대는 웹 관례라 눈에 띄지 않는다. og:image:alt만 쉼표(공통).
- (4) 라벨은 "와/과"보다 `/`: 칩과 필터 선택 상자에서 짧고(`석유화학/철강 (3)`), 분류 이름으로 익숙하다. 쉼표 나열과도 겹치지 않는다. 다만 `/`가 "또는"으로 읽힐 수 있다는 계획서 5.2의 지적이 걸리면 B의 "와/과"를 그대로 쓴다.
- B 안에서 다듬을 곳: 로고 뒤 고객(`work`)은 쉼표 대신 C처럼 가는 선 하나만 쓰는 방법도 있다(로고는 글자가 아니라 쉼표가 붙을 자리가 없음).

## 3. 자리별 before / after

`│`는 CSS로 그린 세로선(글자 아님). `⏎`는 줄바꿈. 캡처 이름은 `shots/` 기준.

### (1) 키워드 나열

| 자리 (파일) | 언어 | 지금 | A | B | C | 캡처 |
|---|---|---|---|---|---|---|
| Teaching 섹션 제목 (`ui.ts` teaching) | EN | `Teaching · Books · Advisory` | `Teaching, Books & Advisory` | 같음(A) | `Teaching │ Books │ Advisory` | `teach-*` |
| | KO | `강의 · 저서 · 자문` | `강의, 저서, 자문` | `강의, 저서, 자문` | `강의 │ 저서 │ 자문` | |
| IP 섹션 제목 (`ui.ts` ip) | KO | `지식재산 · 출판물` | `지식재산, 출판물` | `지식재산과 출판물` | `지식재산 │ 출판물` | `ip-*` |
| 탭, 메뉴 (`ui.ts` tab_ip, 메뉴 하위 teaching) | KO | `지식재산 · 출판물`, `강의 · 저서 · 자문` | 쉼표 | `지식재산과 출판물`, `강의, 저서, 자문` | 쉼표(A와 같음) | `nav-*`, `menu-*` |
| CV 강의 제목 (`ui.ts` cv_teaching) | KO | `강의·자문` | `강의, 자문` | `강의와 자문` | `강의 │ 자문` | `cv-teach-*` |
| Teaching 건수 (`Teaching.astro`) | EN | `Books 2 · Teaching 6 · Advisory 2` | `Books 2, Teaching 6, Advisory 2` | 같음(A) | `Books 2 │ Teaching 6 │ Advisory 2` | `teach-*` |
| | KO | `저서 2 · 강의 6 · 자문 2` | `저서 2, 강의 6, 자문 2` | 같음(A) | 선 | |
| 건수 줄 (`ui.ts` regFiled, regPending) | EN | `7 registered · 8 filed` | `7 registered, 8 filed` | 같음(A) | 선 | `ip-*`, `cv-pat-*` |
| | KO | `등록 7 · 출원 8`, `등록 8 · 등록 진행 중 2` | `등록 7, 출원 8` | 같음(A) | 선 | |
| 원장 역량 (`ProjectLedger` join) | EN | `LLM Agents & RAG · Forecasting · Control & Optimization` | `LLM Agents & RAG, Forecasting, Control & Optimization` | 같음(A) | 선 | `ledger-*` |
| | KO | `LLM 에이전트·RAG · 예측 · 제어·최적화` | `LLM 에이전트/RAG, 예측, 제어/최적화` | `LLM 에이전트와 RAG, 예측, 제어와 최적화` | `LLM 에이전트/RAG │ 예측 │ 제어/최적화` | |
| 원장 모바일 분야 뒤 (`ProjectLedger` CSS `content: ' · '`) | 둘 | `Robotics · Physical AI` | `Robotics, Physical AI` | 같음(A) | `Robotics │ Physical AI` | `ledger-*-360` |
| 케이스 스택 줄 (`CaseStudy` `NBSP·`) | 둘 | `AgiBot SDK · SLAM · FastAPI` | `AgiBot SDK, SLAM, FastAPI` (쉼표는 앞 이름에 붙음) | 같음(A) | 선 | `rec-*`, `rec2-*` |
| CV 스택 줄 (`Cv` `NBSP· `) | 둘 | 같음 | 쉼표 | 쉼표 | 선 | `cv-proj-*` |
| 표준 구성 SVG (`StandardSet`) | 둘 | `LLM · STT · TTS` | `LLM, STT, TTS` | 같음(A) | 간격 15 + SVG 선 | `ss-*` |

### (2) 필드 구분

| 자리 (파일) | 언어 | 지금 | A | B | C | 캡처 |
|---|---|---|---|---|---|---|
| 소속과 고객 (`ProjectLedger`, `Cv` `NBSP· `) | EN | `PwC Consulting · Samsung Electronics` | `PwC Consulting / Samsung Electronics` | `PwC Consulting, Samsung Electronics` | `PwC Consulting │ Samsung Electronics` | `ledger-*`, `cv-other-*` |
| | KO | `PwC 컨설팅 · 삼성전자` | `PwC 컨설팅 / 삼성전자` | `PwC 컨설팅, 삼성전자` | 선 | |
| 로고와 고객 (`SelectedWork` `· `) | 둘 | `[pwc] · 롯데정밀화학` | `[pwc] / 롯데정밀화학` | `[pwc], 롯데정밀화학` | `[pwc] │ 롯데정밀화학` | `work-*` |
| CV 머리 (`Cv` 244행) | EN | `AI Engineer · Director, R&D Group, GenON` | `AI Engineer / Director, R&D Group, GenON` | `AI Engineer (Director, R&D Group, GenON)` | 선 | `cv-head-*` |
| | KO | `AI Engineer · GenON R&D그룹 Director` | `AI Engineer / GenON R&D그룹 Director` | `AI Engineer (GenON R&D그룹 Director)` | 선 | |
| CV 역할 (`Cv` 285행 ` — `) | EN | `GenON, R&D Group — Director / AI Product Engineer` | `GenON, R&D Group` ⏎ `Director / AI Product Engineer` | 같음 | 같음 | `cv-exp-*`, `pdf-*` |
| 학력 세부전공 (`About` ` · `) | EN | `M.S. in Electrical Engineering · Control & network optimization` | `… / Control & network optimization` | `M.S. in Electrical Engineering (Control & network optimization)` | 선 | `edu-*` |
| | KO | `전기 및 전자공학 공학석사 · 세부전공: 제어 최적화·네트워크 최적화` | `… / 세부전공: …` | `… (세부전공: …)` | 선 | |
| 기종 비교 좁은 칸 (`Comparison` `· 선택`) | EN | `AgiBot X2 Ultra · Selected` | `AgiBot X2 Ultra / Selected` | `AgiBot X2 Ultra (Selected)` | 선 + 강조색 `Selected` | `cmp-*-360` |
| | KO | `AgiBot X2 Ultra · 선정` | `… / 선정` | `AgiBot X2 Ultra (선정)` | 선 | |
| 화면 캡션 (`Screens` ` · `) | EN | `legalQ live service, captured Nov 21, 2026 · legalq.dnotitia.ai` | `… 2026 / legalq.dnotitia.ai` | `… 2026 (legalq.dnotitia.ai)` | 선 | `scr-*` |
| | KO | `legalQ 실서비스 화면, 2026-11-21 캡처 · legalq.dnotitia.ai` | `… 캡처 / legalq…` | `… 캡처 (legalq…)` | 선 | |

### (3) 문서 제목 (화면에 안 보임, `manifest.json`의 실제 값)

| 자리 | 언어 | 지금 | A | B | C |
|---|---|---|---|---|---|
| 홈 `<title>`, og:title (`Home`) | EN | `Kwang Myung Yu · AI Engineer` | `Kwang Myung Yu \| AI Engineer` | `Kwang Myung Yu, AI Engineer` | A와 같음 |
| | KO | `유광명 · AI Engineer` | `유광명 \| AI Engineer` | `유광명, AI Engineer` | A와 같음 |
| 케이스 `<title>` (`CaseStudy`) | EN | `Docent Humanoid Robot for a Brand Experience Center · Kwang Myung Yu` | `… \| Kwang Myung Yu` | `…, Kwang Myung Yu` | A와 같음 |
| | KO | `브랜드 체험관 도슨트 휴머노이드 로봇 구축 · 유광명` | `… \| 유광명` | `…, 유광명` | A와 같음 |
| CV `<title>` (`Cv`) | EN | `Kwang Myung Yu · CV` | `Kwang Myung Yu \| CV` | `Kwang Myung Yu CV` | A와 같음 |
| | KO | `유광명 · 이력서` | `유광명 \| 이력서` | `유광명 이력서` | A와 같음 |
| 404 `<title>` (`pages/404`) | EN | `Page not found · Kwang Myung Yu` | `Page not found \| Kwang Myung Yu` | `Page not found, Kwang Myung Yu` | A와 같음 |
| | KO | `페이지를 찾을 수 없습니다 · 유광명` | `… \| 유광명` | `페이지를 찾을 수 없습니다, 유광명` | A와 같음 |
| og:image:alt (`Head`) | 둘 | `Kwang Myung Yu · AI Engineer` | `Kwang Myung Yu, AI Engineer` (공통) | 같음 | 같음 |
| CV description (`Cv`) | EN | `Kwang Myung Yu · AI Engineer · Director, R&D Group, GenON` | `Kwang Myung Yu \| AI Engineer \| Director, R&D Group, GenON` | `Kwang Myung Yu, AI Engineer (Director, R&D Group, GenON)` | A와 같음 |
| | KO | `유광명 · AI Engineer · GenON R&D그룹 Director` | `유광명 \| AI Engineer \| GenON R&D그룹 Director` | `유광명, AI Engineer (GenON R&D그룹 Director)` | A와 같음 |
| CV PDF 바닥글 (`Cv` `@page`) | EN | `Kwang Myung Yu · CV · sguys99.github.io` | `Kwang Myung Yu \| CV \| sguys99.github.io` | `Kwang Myung Yu CV, sguys99.github.io` | `Kwang Myung Yu[전각 공백]CV[전각 공백]sguys99.github.io` |
| | KO | `유광명 · 이력서 · sguys99.github.io` | `유광명 \| 이력서 \| sguys99.github.io` | `유광명 이력서, sguys99.github.io` | 전각 공백 |

### (5) 빈 날짜

| 자리 | 지금 | A | B | C | 캡처 |
|---|---|---|---|---|---|
| CV 프로그램 등록 중 날짜 없는 2건 (`Cv` 161행 `'—'`) | `—` | 빈칸 | 빈칸 | 짧은 가는 선(`--sp-3` 폭, `--line-strong`) | `cv-sw-*` |

빈칸이 홈 IP 서랍과 맞다(날짜 없는 항목을 "Pending / 등록 진행 중" 묶음 아래에 두고 연도를 비움). 같은 줄의 상태 `Pending`이 이미 이유를 말한다. C의 선은 보기에는 대시와 비슷하다.

## 4. 분야와 역량의 국문 이름 (4)

| 영문 값 (모든 안 그대로) | 지금 | A | B | C |
|---|---|---|---|---|
| Energy & Utilities | 에너지·유틸리티 | 에너지/유틸리티 | 에너지와 유틸리티 | 에너지/유틸리티 |
| Manufacturing | 제조 | 제조 | 제조 | 제조 |
| Petrochemical & Steel | 석유화학·철강 | 석유화학/철강 | 석유화학과 철강 | 석유화학/철강 |
| Healthcare | 헬스케어 | 헬스케어 | 헬스케어 | 헬스케어 |
| Robotics | 로보틱스 | 로보틱스 | 로보틱스 | 로보틱스 |
| Public & Legal | 공공·법률 | 공공/법률 | 공공과 법률 | 공공/법률 |
| Physical AI | Physical AI | Physical AI | Physical AI | Physical AI |
| LLM Agents & RAG | LLM 에이전트·RAG | LLM 에이전트/RAG | LLM 에이전트와 RAG | LLM 에이전트/RAG |
| Anomaly Detection | 이상탐지 | 이상탐지 | 이상탐지 | 이상탐지 |
| Forecasting | 예측 | 예측 | 예측 | 예측 |
| Control & Optimization | 제어·최적화 | 제어/최적화 | 제어와 최적화 | 제어/최적화 |
| Computer Vision | 컴퓨터 비전 | 컴퓨터 비전 | 컴퓨터 비전 | 컴퓨터 비전 |
| MLOps | MLOps | MLOps | MLOps | MLOps |

위 6개는 분야(`DOMAINS`), 아래 7개는 역량(`CAPABILITIES`). 바뀌는 것은 5개. 쓰이는 곳: 원장 태그 줄, 원장 필터 선택 상자(`data-label`과 옵션 글자), Selected Work 칩. 받침: 에너지, 에이전트, 제어는 "와", 석유화학, 공공은 "과".

## 5. 구현할 때 주의점 (단계 3)

- **PDF 글자 위치** (`Cv.astro` 653행 주석: 역할 앞 `—`를 다른 글자 묶음으로 나누면 PDF 글자가 밀렸음). 세 안 모두 역할을 다음 줄로 내려 기호가 없어지므로 이 문제는 사라진다. 대신 `.row h3 > .sub { display: block }`을 인쇄 전용에서 화면에도 적용한다. C는 스택 줄, 메타 줄, 머리를 항목마다 다른 상자로 나누므로 PDF 글자층이 갈라지고(위 단점), 글자 위치를 다시 확인해야 한다. 바꾼 뒤 `pdftotext -layout`으로 글자층도 본다.
- **NBSP**: A의 슬래시는 앞을 NBSP로(`a\u00a0/ b`), 쉼표는 앞 말에 붙여 줄 머리에 오지 않게 한다(스택 줄은 지금처럼 이름 `<span>` 안에 쉼표를 넣음). B의 괄호는 줄 머리에 와도 되는 기호라 NBSP가 필요 없다. 분야와 역량 태그는 태그 단위 `nowrap`. 시안 80쪽에서 줄 머리 구분자 0, 360 가로 넘침 0.
- **스크린 리더**: A, B는 보이는 글자를 그대로 읽는다. C는 선이 `::before`라 읽히지 않으므로 항목 사이에 `.sr-only` 쉼표를 둔다(시안의 `ruleize()`). 원장 데스크톱은 지금도 분야 `<b>`와 역량 사이에 글자가 없어 복사하면 `RoboticsPhysical AI`로 붙는다(현재 결함, A와 B 시안에도 남아 있음). 단계 3에서 `<b>` 끝에 `.sr-only` 쉼표를 두면 세 안 모두 해결된다. `dgWith`와 표준 구성 그림 문장은 1장 공통안대로.
- **C를 고르면**: ui.ts의 `teaching`, `ip`, `cv_teaching`, `regFiled`, `regPending`을 배열(항목 목록)로 바꾸고 링크용 문자열은 따로 둔다. 원장 모바일 `b::after`, 기종 비교 `attr(data-l)`, 표준 구성 SVG는 마크업으로 옮긴다. 선 색 `--line-strong`은 장식 선이라 대비 기준(1.4.11) 대상이 아니지만 다크에서 옅다(`shots/ledger-C-ko-dark-desk.png`).
- **DESIGN.md**: 7장 "구두점·기호" 표의 가운뎃점 두 행, 1장 섹션 제목 예시 `지식재산 · 출판물`, `ProjectLedger` 명세(5.19)와 줄바꿈 규칙(중간점 앞 NBSP)을 고른 안으로 바꾼다. `docs/glossary.md`의 `강의 · 저서 · 자문`, `지식재산 · 출판물`, `강의·자문`과 분야 이름(4장 표)도.

## 6. 조사 중 새로 찾은 구분자 자리

| 자리 | 지금 | 메모 |
|---|---|---|
| `PersonalProjects.astro` 74행 스택 줄 | `NBSP/ ` | 중간점이 아니라 이미 슬래시. 케이스 스택 줄(`·`), CV 스택 줄(`·`)과 기호가 다르다. 고른 안의 (1)로 맞춘다 |
| `MenuSheet` 하위 링크, `NotFound` 섹션 목록 | `t(lang, 'teaching')` | `강의 · 저서 · 자문`이 메뉴 시트와 404 목록에도 나온다(ui.ts 한 곳에서 바뀜). C는 링크라 쉼표 |
| Selected Work 칩 (`Tags.astro`) | `tag()` 국문 이름 | 분야 이름의 `·`가 칩에도 나온다(ui.ts `TAG_KO` 한 곳에서 바뀜) |
| 원장 필터 선택 상자 | `data-label`, 옵션 글자 | 같은 `TAG_KO`. 클라이언트 스크립트가 `data-label`로 다시 쓰므로 함께 바뀜 |
| `Topbar.astro` 354행 | `content: '/'` (모바일 바 이름 / 현재 섹션) | 기존 슬래시 구분자. A의 필드 슬래시와 같은 모양 |
| 기존 슬래시 뜻 | `03 / 08`, `{n} / {total} 건`, `GPA 3.83 / 4.3`, `Print / Save PDF` | A를 고르면 같은 화면에 슬래시 뜻이 넷 이상 |
| 원장 360 영문 태그 줄바꿈 | `Control` ⏎ `& Optimization` | 지금 화면의 결함. 공통 처리(태그 nowrap) |
| 원장 데스크톱 복사 텍스트 | `RoboticsPhysical AI` | 지금 화면의 결함. 5장 스크린 리더 항목 |
| 콘텐츠 안 구분자 (단계 4, 5 대상) | `Vector DB · Seahorse`(legal 비교 옵션), `Unitree G1 · on-board`(표준 구성), 국문 직함 `Director · AI Product Engineer`, 다이어그램 표식 `1 · 2` 등 | 컴포넌트가 아니라 `src/content/`라 이번 범위 밖. 기종 비교 좁은 칸 라벨은 옵션 이름을 그대로 쓰므로 콘텐츠를 고칠 때 함께 바뀜 |
