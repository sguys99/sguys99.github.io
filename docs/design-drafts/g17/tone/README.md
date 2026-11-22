# G17 윤문 강도 시안 (단계 2.2)

작성 2026-11-22. `docs/anti-ai-slop-plan.md` 단계 2.2. 같은 표본에 윤문 강도 3단계(보수, 중간, 적극)를 적용해 사용자가 고르게 한다. 문장별 대조는 `samples.md`.

- `src/`는 고치지 않았다. 원문은 `src/content/` 현재 값이고 기준 커밋 `8ee3c7a`와 같다.
- 구분자(컴포넌트가 넣는 ` · `) 모양은 같은 g17의 구분자 시안(2.1)이 정한다. 여기서는 콘텐츠 문자열만 다룬다.
- 이 문서와 `samples.md`에는 em dash와 나열용 중간점을 쓰지 않았다. 중간점은 원문을 인용할 때만 나온다.

## 1. 표본

| 묶음 | 키 | 문자열 쌍 |
|---|---|---|
| 프로필 | `profile.yaml`의 `about`, `trajectory[0..3].description`, 같은 화면의 `trajectory[0..2].label` (taglines 제외) | 8 |
| 경력 | `experience.yaml`의 `genon.org`, `genon.role`, `genon.summary` | 3 |
| 케이스 스터디 | `legal-agentic-rag.md`의 `summary`, `highlights`, `context`, `problem`, `role`, `approach` 4개, `decisions` 4건(제목, 이유, 트레이드오프), `compare.verdict`, 화면 캡처 설명(`screens` 주석 4개와 `gap`) | 32 |
| 다이어그램 라벨 | `diagrams/legal-agentic-rag.yaml`에서 중간점이나 콜론이 있는 라벨 14개 (영역, 범례, 노드, 말풍선, 범례 설명) | 14 |
| 합계 | | 57쌍 (영문 5,526자, 국문 2,530자) |

`trajectory` 라벨, `genon.role`, `screens.gap`은 요청 범위 밖이지만 같은 화면에 중간점이 있어 넣었다. 바뀌지 않는 문자열도 그대로 두어 "어디까지 손대는지"가 보이게 했다.

## 2. 강도별 의도와 장단점

| 강도 | 의도 | 장점 | 단점 |
|---|---|---|---|
| **보수** | 규칙 위반만 고친다. em dash, 중간점(5.2), 국문 종결(명사형, 마침표 규칙), 부정 대구("A가 아닌 B", "X, not Y"). 문장 구조는 그대로 | 변경이 가장 적고(국문 6.7%) 검토가 쉽다. 사실이 바뀔 여지가 거의 없다 (사실 대조 차이 0) | 종결을 기계적으로 바꾸면 `~하는 방식`, `~있는 상태` 같은 빈 머리명사가 생긴다. 연결어미 뒤 쉼표 9개, 명사 더미, 꾸밈용 범위 2개(홈 첫 화면 `about` 포함)가 남는다 |
| **중간** | 보수에 더해 번역투를 정리한다. 긴 관형절 사슬 나누기, 명사 더미와 "및" 풀기, 범용 동사와 무생물 주어, 영문 콜론과 세미콜론, 꾸밈용 범위, 결정 제목의 비교 틀 | 스캔 신호가 거의 다 사라진다 (아래 4장). 국문 변경 20.4%로 humanize 경고선(30%) 아래. 영문은 이미 깨끗해서 3.5%만 바뀐다 | 문장 수가 늘어 결정 표 칸에 마침표가 생긴다. 역할 분담을 나누다 "A는 ~고 B는 ~" 대칭이 한 곳 새로 생겼다 (`approach[0]`) |
| **적극** | 중간에 더해 국문을 한국어 어순으로, 영문 문장도 다시 짠다. 정보 단위는 유지 | 영문 긴 문장(48단어 `approach[2]`)과 결론 문장(`verdict`)이 가장 깔끔해진다 | 국문 변경 27.0%, 프로필은 33.2%로 경고선을 넘는다. 어순을 바꾸다 없던 연결이 생긴다 (`trajectory[1]` "제조 현장의 태양광 출력 예측"). 짧은 명사형 문장이 잇따라 끊겨 보인다 (`about` "~로 출발.") |

## 3. 변경량

글자 비율은 원문 대비 편집 거리(바뀐 글자 수)를 원문 글자 수로 나눈 값이다. 문자열 수는 57쌍 가운데 원문과 달라진 것.

| 강도 | 영문 바뀐 문자열 | 영문 글자 비율 | 국문 바뀐 문자열 | 국문 글자 비율 |
|---|---|---|---|---|
| 보수 | 13 / 57 | 2.5% | 37 / 57 | 6.7% |
| 중간 | 16 / 57 | 3.5% | 45 / 57 | 20.4% |
| 적극 | 25 / 57 | 7.0% | 45 / 57 | 27.0% |

묶음별 국문 글자 비율 (보수 / 중간 / 적극): 프로필 2.4 / 14.9 / 33.2%, 경력 2.2 / 6.7 / 7.1%, 케이스 스터디 7.3 / 24.8 / 29.2%, 다이어그램 13.8 / 13.8 / 20.8%.
영문: 프로필 0 / 3.6 / 7.4%, 경력 0 / 0 / 4.7%, 케이스 스터디 2.9 / 3.4 / 6.8%, 다이어그램 6.7 / 6.9 / 10.3%.

- 국문 다이어그램은 보수에서 이미 13.8%다. 중간점 대체가 짧은 라벨에서는 비율이 크게 잡히기 때문이고, 중간과 보수의 결과가 같다.
- 경력(`genon`)은 국문이 명사 나열형이라 어느 강도에서도 변경이 작다.

## 4. 신호 변화 (표본 전체)

`scripts/check-text.mjs`의 집계 로직을 그대로 써서 셌다. 연결어미 뒤 쉼표는 1.3 스캔 규칙의 근사.

| 신호 | 원문 | 보수 | 중간 | 적극 |
|---|---|---|---|---|
| em dash | 0 | 0 | 0 | 0 |
| 중간점 (영문 / 국문) | 13 / 48 | 0 / 0 | 0 / 0 | 0 / 0 |
| 국문 대구 `아닌`, `아니라` | 4 | 0 | 0 | 0 |
| 영문 `, not` | 3 | 0 | 0 | 0 |
| 영문 꾸밈용 `from X to Y` | 2 | 2 | 0 | 0 |
| 국문 종결 ③ `~함/~음`, ④ `~다` | 9 | 1 | 1 | 1 |
| 국문 마침표 규칙 위반 | 2 | 0 | 0 | 0 |
| 국문 연결어미 뒤 쉼표 | 9 | 9 | 0 | 0 |
| 콜론 (영문 / 국문) | 3 / 3 | 2 / 2 | 2 / 2 | 2 / 2 |
| 영문 세미콜론 | 2 | 2 | 1 | 1 |

- 남는 ③ 1개는 다이어그램 말풍선 `개정 이력/과거 원문 없음`의 `없음`이다 (6장 4번).
- 남는 콜론 2개는 라벨형(`Knowledge:`, `Source:`), 세미콜론 1개는 따옴표 안 인용이라 영문 진단에서 정상으로 본 것이다.

단계 1.3 스캔의 블록 B(legal 문제와 결정, 16개 키)를 같은 규칙으로 다시 재면:

| | C-8 부정 대구 | C-11 연결어미 쉼표 | I-4 당위 결말 | 발동 신호 | 판정 |
|---|---|---|---|---|---|
| 원문 (`scan-before.md`) | 4 | 5 | 3 | 3 | 많다 |
| 보수 | 0 | 5 | 3 | 2 | 적다 (경계) |
| 중간 | 0 | 0 | 2 | 1 | 적다 |
| 적극 | 0 | 0 | 2 | 1 | 적다 |

I-4가 2개 남는 것은 영문 자체가 요구 문장(`had to`, `must`)이라서다. 서법을 바꾸지 않는 한 남는다.

## 5. 사실 대조

방법: `scripts/check-text.mjs`에서 `--facts` 로직(`facts`, `diff`)과 종결 판정을 그대로 떼어 `_workspace/tone/check-lib.mjs`로 만들고, `_workspace/tone/compare.mjs`가 키마다 원문과 각 강도를 대조했다. 숫자, 날짜, 라틴 문자 고유명사와 약어(국문은 라틴 문자 전부)가 대상이다. 이 대조는 한글 고유명사를 보지 않아서, 한글 고유명사와 핵심 용어 34개(`리걸큐`, `국가법령정보센터`, `시행령`, `범칙금`, `기술트리`, `관제시스템` 등)가 키마다 줄지 않았는지도 따로 셌다.

| 강도 | 숫자, 날짜, 라틴 문자 | 한글 핵심어 |
|---|---|---|
| 보수 | 차이 0 | 1건 줄어듦 (의도) |
| 중간 | 차이 1 (의도) | 1건 줄어듦 (의도) |
| 적극 | 차이 1 (의도) | 1건 줄어듦 (의도) |

- 라틴 문자 차이 1: `problem[1]` 국문의 `non-agentic`. 진단(02_diagnosis 6번)의 처방대로 "에이전트 없이 ~ 워크플로우"로 옮긴 것이라 고유명사 손실이 아니다. 실제 적용 때 `--facts`가 이 종류를 잡으므로 예외를 정해야 한다 (6장 7번).
- 한글 핵심어 1: `decisions[1].title` 국문에서 버린 대안 `멀티에이전트`가 빠졌다. 같은 행의 이유 칸에 그대로 있다. 영문 `not a multi-agent system`도 같은 이유로 뺐다.
- 수치(`12`, `약 3,046`, `1,000자`, `6가지`, `절대 규칙 6개`, `1회 조회`, 조 번호 `26`~`33`), 제품명(`legalQ`, `legalize-kr`, `Seahorse`, `law.go.kr`), 직함(`Director`, `AI Product Engineer`, `PO`, `PM`), 괄호 안 약어(`(MPC)`, `(PO)`, `(PM)`, `(리걸큐)`)는 세 강도 모두 같다.
- 다이어그램 라벨 28개(영문, 국문)는 세 강도 모두 원문보다 길어지지 않았다. 국문 7개는 1~5자 줄었다.
- 영문 경력과 프로젝트 문장은 세 강도 모두 동사로 시작하고 시제(`genon`은 현재형, legal은 과거형)를 지켰다. 예외 둘: 적극 `about`의 셋째 문장이 `Now leads`로 시작하고 (`about`은 소개 문단이라 경력 문장 규칙 밖으로 봄), 적극 `approach[2]`의 둘째 문장이 `The same prompt`로 시작한다 (항목을 나눌 때 둘째 문장도 동사로 시작할지는 8장 10번과 함께 정할 일). `role[0]` 적극의 `As an ML engineer,`는 영문 진단이 정상으로 본 전치사구 시작이다.

## 6. 대표 비교 3개

### 6.1 비교 결론 (`caseStudy.compare.verdict`)

| | 영문 | 국문 |
|---|---|---|
| 원문 | Not one or the other: the agent finds with the vector DB and confirms with the repository. | 둘 중 하나가 아니라 둘 다: 에이전트는 벡터 DB로 찾고 저장소로 확인한다. |
| 보수 | The agent uses both, finding with the vector DB and confirming with the repository. | 에이전트는 둘을 함께 써서 벡터 DB로 찾고 저장소로 확인 |
| 중간 | The agent uses both, finding articles with the vector DB and confirming them in the repository. | 에이전트는 둘을 함께 써서 벡터 DB로 조문을 찾고 저장소에서 확인 |
| 적극 | The agent finds articles with the vector DB and confirms them in the repository. | 에이전트는 벡터 DB로 조문을 찾고 저장소에서 확인 |

### 6.2 문제 1번 (`caseStudy.problem[0]`)

| | 영문 | 국문 |
|---|---|---|
| 원문 | People ask in everyday words, such as "I bought something from overseas; how is it taxed?", not in legal terms, and the answer often spans several articles, related statutes, and enforcement decrees and rules. | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어가 아닌 일상어로 묻고, 답은 여러 조문과 관련 법령, 시행령·시행규칙에 걸쳐 있음 |
| 보수 | People ask in everyday words instead of legal terms, such as "I bought something from overseas; how is it taxed?", and the answer often spans several articles, related statutes, and enforcement decrees and rules. | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어 대신 일상어로 묻고, 답은 여러 조문과 관련 법령, 시행령과 시행규칙에 걸쳐 있는 상태 |
| 중간 | (보수와 같음) | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어 대신 일상어로 묻는 질문. 답은 대개 여러 조문, 관련 법령, 시행령과 시행규칙에 분산. |
| 적극 | People ask everyday questions such as "I bought something from overseas; how is it taxed?" instead of using legal terms. The answer often spans several articles, related statutes, and enforcement decrees and rules. | 이용자는 법률 용어 대신 "해외직구 세금이 어떻게 되나요?" 같은 일상어로 질문. 답은 대개 여러 조문, 관련 법령, 시행령과 시행규칙에 분산. |

보수 영문은 `legal terms, such as "..."`로 예시가 법률 용어에 붙는 것처럼 읽힐 수 있다. 중간 국문은 원문에 빠져 있던 영문 `often`("대개")을 살렸다.

### 6.3 프로필 소개 (`about`)

| | 영문 | 국문 |
|---|---|---|
| 원문 | Started in power plant automation and model predictive control, then developed anomaly detection, forecasting, and computer vision models for energy and manufacturing. Led RAG, agent, and Text-to-SQL services for enterprise clients, and now leads a Physical AI humanoid product from product definition to VLA training pipelines. | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발해 에너지·제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발. 이후 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재 Physical AI 휴머노이드 제품 정의부터 VLA 학습 파이프라인까지 총괄. |
| 보수 | (원문과 같음) | …에너지와 제조 분야의… (중간점만 바뀜) |
| 중간 | …Led RAG, agent, and Text-to-SQL services for enterprise clients, and now leads a Physical AI humanoid product, including its definition and VLA training pipelines. | …현재는 제품 정의와 VLA 학습 파이프라인을 포함해 Physical AI 휴머노이드 제품 총괄. |
| 적극 | Started in power plant automation and model predictive control. Developed anomaly detection, forecasting, and computer vision models for energy and manufacturing, then led RAG, agent, and Text-to-SQL services for enterprise clients. Now leads a Physical AI humanoid product, including its definition and VLA training pipelines. | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발. 에너지와 제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발에 이어 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재는 제품 정의와 VLA 학습 파이프라인을 포함해 Physical AI 휴머노이드 제품 총괄. |

## 7. 추천안: 중간을 기본으로, 두 자리만 적극

**중간**을 기본 강도로 추천한다. 다만 아래 두 자리는 적극안을 쓴다.

1. 영문 진단 P12에서 2줄을 넘는다고 잡힌 긴 영문 문장 (표본에서는 `approach[2]` 48단어, 다른 파일은 docent `compare.verdict`, genp `highlights[1]`, `approach[2]` 등)
2. 비교 결론 `verdict` (6.1의 적극안이 가장 짧고 정보가 같다)

이유:

- 보수는 필수 규칙(기호, 종결, 대구)만 채운다. 연결어미 쉼표, 명사 더미, 홈 첫 화면의 꾸밈용 범위가 남고, 종결을 바꾸며 빈 머리명사를 새로 만든다. 스캔 판정도 "경계"에 머문다.
- 중간은 스캔 신호를 1개(당위 결말, 영문이 요구 문장이라 남는 것)로 줄이면서 국문 변경 20%, 사실 대조 차이는 의도한 1건뿐이다. 영문은 진단대로 원래 깨끗해서 3.5%만 바뀐다.
- 적극을 전면 적용하면 국문 프로필이 33%까지 바뀌고, 어순을 바꾸며 없던 연결이 생긴다 (`trajectory[1]`). 영문은 대부분 이미 동사로 시작하는 1~2줄 문장이라 다시 짜도 얻는 것이 적다. 효과가 분명한 긴 문장과 결론 문장에만 쓰는 편이 낫다.

## 8. 정해야 할 것 (표본을 고치다 나온 규칙 후보)

1. **결정 제목 형식.** 표본의 결정 제목 4개는 고친 뒤 모두 "고른 것"만 담은 명사구가 됐다 (`Two complementary sources`, `Intent routing inside one agent's prompt`). 제안: 결정 제목은 고른 것을 명사구로 쓰고, 버린 대안은 이유 칸에 둔다. `, not`과 "A가 아닌 B"는 금지. `instead of`, `over`, "A 대신 B"를 허용할지는 정해야 한다 (사이트 전체 24개 중 13개가 비교 틀).
2. **트레이드오프의 당위 결말.** 영문 트레이드오프는 대부분 비용을 명사구로만 쓰는데(`A custom parser and re-indexing whenever statutes change.`) 국문은 `~필요`로 끝내 당위 결말(I-4)이 된다. 제안: 국문도 명사구로 쓰고, `~필요`는 영문에 `must`, `needs`가 있을 때만 쓴다 (`decisions[3].tradeoff` 중간안).
3. **③ 종결을 무엇으로 바꿀지.** 기계적으로 `~하는 방식`, `~있는 상태`를 붙이면 진단 A-18이 지적한 빈 머리명사가 생긴다. 제안: 사실을 담은 명사(`대응 불가`, `수정 필요`, `호출 증가`, `바로 접근`)로 끝내고, `상태`, `방식`, `구조`는 다른 명사가 없을 때만.
4. **라벨과 표 칸의 `없음`.** 말풍선 `개정 이력/과거 원문 없음`, 비교표 `없음, 현행만`의 `없음`은 라벨 관용 표기다. 25자 미만 라벨과 표 칸은 ③ 규칙의 예외로 둘지.
5. **굳은 말 `조·항`.** 케이스 스터디와 다이어그램 두 파일에 7곳 (`조·항 단위` 5, `조·항 번호` 1, `조·항·호 번호` 1), 조 번호 나열 `제26·27·28·30·31·33조` 1곳. 표본에는 기본안(문장 "조와 항", 라벨 "조/항", 조 번호는 쉼표)을 넣었다. "조/항"은 "또는"으로 읽힐 수 있다. (a) 기본안 (b) `N·m`처럼 예외 목록에 넣고 그대로 (c) "조항" 가운데 고른다. `시행령·시행규칙`은 "시행령과 시행규칙"으로 무리 없이 읽혔다.
6. **다이어그램 라벨의 기호.** 표본에서 쓴 규칙: 띄어 쓴 ` · `(이름과 설명 구분)는 괄호, 띄어 쓴 ` · `(나열)는 쉼표, 붙여 쓴 `·`는 `/`. 붙여 쓴 `·`를 쉼표로 바꾸면 공백 1자가 늘어 "글자 수가 늘지 않게" 조건을 어긴다. 국문 라벨의 `/`를 "와"의 뜻으로 받아들일지, 범례처럼 폭이 넉넉한 자리(항목마다 144 단위)는 1자 증가를 허용할지 정해야 한다.
7. **연결어미 뒤 쉼표는 어느 강도에.** 보수 정의에 없어서 보수에는 9개가 남는다. 빼기만 하면 잘못 읽히는 곳이 있어(`묻고, 답은` → "묻고 답하다"로 읽힘) 문장을 나눠야 한다. 제안: 중간에 포함 (표본대로).
8. **용어 국문화와 사실 대조.** `non-agentic` 같은 일반 영어를 국문으로 옮기면 `--facts`가 차이로 잡는다. 진단 6번의 국문화 목록(`Admin`, `Depth 카메라`, `Manipulation`, `Direct·Recursive` 등)을 적용할 때 쓸 허용 목록을 `--facts`에 둘지, 그때마다 차이를 사람이 확인할지.
9. **국문이 영문과 다른 곳은 영문에 맞춘다.** 표본에서 4곳: `problem[0]` 국문에 `often`이 없음, `problem[1]` 영문 `could not` ↔ 국문 `어려웠고`, `trajectory[0]` 영문 `then` ↔ 국문 쉼표, `decisions[3].title` 영문 `Article-level` ↔ 국문 `조·항`. 중간안은 앞의 셋을 영문에 맞췄고 넷째는 국문 정보가 더 구체적이라 두었다. 이 방향(영문 기준, 단 국문이 더 구체적이면 영문을 보완할지 확인)을 확정해야 한다.
10. **문장을 나눈 칸과 항목.** 이유 칸을 두 문장으로 나누면(`decisions[3].rationale` 중간안) 같은 표에서 이 칸만 마침표가 생긴다. 결정 표의 칸은 한 문장으로 제한할지, 섞여도 둘지. 영문 approach 항목을 나눌 때 둘째 문장도 동사로 시작해야 하는지도 함께 정한다.
11. **역할 분담 대칭 "A는 ~고 B는 ~".** 스캔이 대칭 대구에 가깝다고 본 형식인데, 표본에서는 실제 역할 분담이라 남겼고 중간 `approach[0]`에서는 새로 하나 생겼다. 실제 분담을 설명할 때는 허용할지.
12. **경력 직함 구분.** `genon.role` 국문 `Director · AI Product Engineer`를 영문처럼 `/`로 맞췄다. 다른 경력 5곳(`파트 리더 · Senior ML Engineer · PO` 등)도 같은 규칙을 쓸지, 구분자 시안(2.1)의 모양을 따를지.

## 9. 다시 만들기

```bash
node _workspace/tone/compare.mjs --write   # samples.md 생성과 4~5장 집계 (변경량, 신호, 사실 대조, 라벨 글자 수)
node _workspace/tone/block-b.mjs           # 4장 블록 B 스캔 신호
```

- `_workspace/tone/samples-data.mjs`: 강도별 문구와 고친 이유. 원문은 `src/content/`에서 키 경로로 읽는다.
- `_workspace/tone/check-lib.mjs`: `scripts/check-text.mjs`에서 실행부만 뺀 사본. `check-text.mjs`를 고치면 다시 만든다.
- `_workspace/`는 커밋하지 않는 작업 폴더라(`.gitignore`), 시안을 확정하면 고른 강도의 문구만 단계 4~5에서 `src/content/`에 반영한다.
