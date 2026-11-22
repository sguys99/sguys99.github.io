# 윤문 강도 시안: 표본 대조표

단계 2.2 (`docs/anti-ai-slop-plan.md`). 같은 표본에 보수, 중간, 적극 세 강도를 적용한 결과다. 의도와 장단점, 변경량, 추천안은 `README.md`에 있다.

- 원문은 `src/content/`의 현재 값 (기준 커밋 `8ee3c7a`와 같음). `src/`는 고치지 않았다.
- 칸의 **같음**은 바로 왼쪽 칸과 같다는 뜻이다. 보수의 "같음"은 원문 그대로, 중간의 "같음"은 보수와 같음.
- 각 표본은 영문 행(en)과 국문 행(ko)으로 나눴다. 영문을 먼저 고치고 국문을 고친 영문에 맞췄다.
- 다이어그램 라벨은 칸마다 글자 수(공백 포함)와 원문 대비 증감을 붙였다.
- † 표시는 굳은 말 `조·항`에 기본안(문장은 "조와 항", 라벨은 "조/항")을 넣은 행이다. 처리 방식은 계획서 9장 열린 질문이라 README "정해야 할 것"에 올렸다.
- 이 문서는 `_workspace/tone/compare.mjs --write`로 만든다 (데이터 `_workspace/tone/samples-data.mjs`).

## 1. 프로필 소개 (`src/content/profile.yaml`)

| 키 경로 | 원문 | 보수 | 중간 | 적극 |
|---|---|---|---|---|
| `about` en | Started in power plant automation and model predictive control, then developed anomaly detection, forecasting, and computer vision models for energy and manufacturing. Led RAG, agent, and Text-to-SQL services for enterprise clients, and now leads a Physical AI humanoid product from product definition to VLA training pipelines. | 같음 | Started in power plant automation and model predictive control, then developed anomaly detection, forecasting, and computer vision models for energy and manufacturing. Led RAG, agent, and Text-to-SQL services for enterprise clients, and now leads a Physical AI humanoid product, including its definition and VLA training pipelines. | Started in power plant automation and model predictive control. Developed anomaly detection, forecasting, and computer vision models for energy and manufacturing, then led RAG, agent, and Text-to-SQL services for enterprise clients. Now leads a Physical AI humanoid product, including its definition and VLA training pipelines. |
| `about` ko | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발해 에너지·제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발. 이후 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재 Physical AI 휴머노이드 제품 정의부터 VLA 학습 파이프라인까지 총괄. | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발해 에너지와 제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발. 이후 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재 Physical AI 휴머노이드 제품 정의부터 VLA 학습 파이프라인까지 총괄. | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발해 에너지와 제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발. 이후 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재는 제품 정의와 VLA 학습 파이프라인을 포함해 Physical AI 휴머노이드 제품 총괄. | 발전 플랜트 자동화와 모델 기반 예측 제어(MPC)로 출발. 에너지와 제조 분야의 이상탐지, 예측, 컴퓨터 비전 모델 개발에 이어 기업 고객 대상 RAG, 에이전트, Text-to-SQL 서비스 총괄. 현재는 제품 정의와 VLA 학습 파이프라인을 포함해 Physical AI 휴머노이드 제품 총괄. |
| `trajectory[0].label` en | Control & Automation | 같음 | 같음 | 같음 |
| `trajectory[0].label` ko | 제어·자동화 | 제어와 자동화 | 같음 | 같음 |
| `trajectory[0].description` en | Designed automation for power and energy plants, then built model predictive control and PID tuning tools for power generation. | 같음 | 같음 | 같음 |
| `trajectory[0].description` ko | 전력 에너지 플랜트 자동화 설계, 발전 설비용 모델 기반 예측 제어(MPC)와 PID 제어기 튜닝 도구 개발 | 같음 | 전력 에너지 플랜트 자동화 설계에 이어 발전 설비용 모델 기반 예측 제어(MPC)와 PID 제어기 튜닝 도구 개발 | 같음 |
| `trajectory[1].label` en | Data Science & ML | 같음 | 같음 | 같음 |
| `trajectory[1].label` ko | 데이터 사이언스·머신러닝 | 데이터 사이언스와 머신러닝 | 같음 | 같음 |
| `trajectory[1].description` en | Applied ML to the power grid and factories, from solar power forecasting and transformer anomaly detection to a machine vision platform. | 같음 | Applied ML to the power grid and factories, including solar power forecasting, transformer anomaly detection, and a machine vision platform. | 같음 |
| `trajectory[1].description` ko | 태양광 출력 예측, 변압기 이상탐지부터 머신비전 플랫폼까지 전력망과 제조 현장에 머신러닝 적용 | 같음 | 태양광 출력 예측, 변압기 이상탐지, 머신비전 플랫폼 등 전력망과 제조 현장에 머신러닝 적용 | 전력망과 제조 현장의 태양광 출력 예측, 변압기 이상탐지, 머신비전 플랫폼 등에 머신러닝 적용 |
| `trajectory[2].label` en | Generative AI & Agents | 같음 | 같음 | 같음 |
| `trajectory[2].label` ko | 생성형 AI·에이전트 | 생성형 AI와 에이전트 | 같음 | 같음 |
| `trajectory[2].description` en | Led RAG, agent, and Text-to-SQL services for enterprises, alongside industrial ML for anomaly detection and process optimization. | 같음 | 같음 | Led RAG, agent, and Text-to-SQL services for enterprises while developing industrial ML for anomaly detection and process optimization. |
| `trajectory[2].description` ko | 기업용 RAG, 에이전트, Text-to-SQL 서비스 총괄, 이상탐지·공정 최적화 분야 산업용 머신러닝 개발 병행 | 기업용 RAG, 에이전트, Text-to-SQL 서비스 총괄, 이상탐지와 공정 최적화 분야 산업용 머신러닝 개발 병행 | 기업용 RAG, 에이전트, Text-to-SQL 서비스를 총괄하며 이상탐지와 공정 최적화 분야의 산업용 머신러닝 개발도 병행 | 이상탐지와 공정 최적화 분야의 산업용 머신러닝을 개발하며 기업용 RAG, 에이전트, Text-to-SQL 서비스 총괄 |
| `trajectory[3].description` en | Leads a humanoid robot product that unifies voice conversation, VLA manipulation, autonomous navigation, and whole-body control in one workflow. | 같음 | 같음 | 같음 |
| `trajectory[3].description` ko | 음성 대화, VLA 조작, 자율주행, 전신 제어를 하나의 워크플로우로 통합한 휴머노이드 로봇 제품 총괄 | 같음 | 같음 | 같음 |

고친 이유:

- `about`: 보수: `에너지·제조`를 "와"로. 중간: 꾸밈용 범위 `from product definition to VLA training pipelines`를 including으로 바꾸고 국문 `~부터 ~까지`도 함께 정리 (D-7). 적극: 영문을 세 문장(출발, 개발과 총괄, 현재)으로 나누고 국문도 같은 순서로.
- `trajectory[0].label`: 보수: 중간점을 "와"로 (5.2 두 항목). 분야 이름은 2.5에서 확정. 영문 Title Case는 영문 진단 4장 11번 (판단 대기)
- `trajectory[0].description`: 중간: 쉼표로만 붙인 두 동작에 영문 then의 순서를 "~에 이어"로 살림.
- `trajectory[1].label`: 보수: 중간점을 "와"로.
- `trajectory[1].description`: 중간: 축 없는 범위(영문 진단 높음)를 세 항목 나열로, 국문 `~부터 ~까지`도 "등"으로. 적극: 국문을 "어디의, 무엇에, 적용" 어순으로.
- `trajectory[2].label`: 보수: 중간점을 "와"로.
- `trajectory[2].description`: 보수: 중간점. 중간: 조사 없는 명사 더미를 "~하며", "~의"로 풀고 alongside를 "~도 병행"으로. 적극: 영문은 while로 주된 일과 함께 한 일을 나누고, 국문은 함께 한 일을 앞에 두는 한국어 어순으로.
- `trajectory[3].description`: 세 강도 모두 그대로. 관형절이 한 겹이고 기호와 종결 문제가 없음.

## 2. 경력 1건 (`src/content/experience.yaml`의 `genon`)

| 키 경로 | 원문 | 보수 | 중간 | 적극 |
|---|---|---|---|---|
| `genon.org` en | GenON, R&D Group | 같음 | 같음 | 같음 |
| `genon.org` ko | GenON R&D그룹 | 같음 | 같음 | 같음 |
| `genon.role` en | Director / AI Product Engineer | 같음 | 같음 | 같음 |
| `genon.role` ko | Director · AI Product Engineer | Director / AI Product Engineer | 같음 | 같음 |
| `genon.summary` en | Lead the Physical AI humanoid product as Product Owner (PO), defining the product, technology tree, and commercialization roadmap, and manage client projects as Project Manager (PM). Design the integrated architecture for voice conversation, scenario execution, VLA, VLN, navigation, and motion, and build the robot control panel. Propose and run new Physical AI and agent-system projects and hire talent. | 같음 | 같음 | Lead the Physical AI humanoid product as Product Owner (PO) and define the product, its technology tree, and its commercialization roadmap. Manage client projects as Project Manager (PM). Design the integrated architecture for voice conversation, scenario execution, VLA, VLN, navigation, and motion, and build the robot control panel. Propose and run new Physical AI and agent-system projects and hire talent. |
| `genon.summary` ko | Physical AI 휴머노이드 제품 총괄(PO), 제품 정의, 기술트리, 상용화 로드맵 수립, 고객사 프로젝트 PM. 음성 대화, 시나리오 실행, VLA, VLN, 자율주행, 모션을 아우르는 통합 아키텍처 설계, 로봇 관제시스템 설계 및 개발. Physical AI·에이전트 시스템 분야 신규 프로젝트 제안·운영, 인재 채용. | Physical AI 휴머노이드 제품 총괄(PO), 제품 정의, 기술트리, 상용화 로드맵 수립, 고객사 프로젝트 PM. 음성 대화, 시나리오 실행, VLA, VLN, 자율주행, 모션을 아우르는 통합 아키텍처 설계, 로봇 관제시스템 설계 및 개발. Physical AI와 에이전트 시스템 분야 신규 프로젝트 제안과 운영, 인재 채용. | Physical AI 휴머노이드 제품 총괄(PO)로 제품 정의, 기술트리, 상용화 로드맵을 수립하고 고객사 프로젝트 PM 담당. 음성 대화, 시나리오 실행, VLA, VLN, 자율주행, 모션을 아우르는 통합 아키텍처 설계, 로봇 관제시스템 설계와 개발. Physical AI와 에이전트 시스템 분야의 신규 프로젝트 제안과 운영, 인재 채용. | Physical AI 휴머노이드 제품 총괄(PO)로 제품 정의, 기술트리, 상용화 로드맵 수립. 고객사 프로젝트는 PM으로 관리. 음성 대화, 시나리오 실행, VLA, VLN, 자율주행, 모션을 아우르는 통합 아키텍처 설계, 로봇 관제시스템 설계와 개발. Physical AI와 에이전트 시스템 분야의 신규 프로젝트 제안과 운영, 인재 채용. |

고친 이유:

- `genon.org`: 고유명사라 그대로.
- `genon.role`: 직함 문구는 그대로, 두 직함 사이 구분만 영문(`/`)에 맞춤
- `genon.summary`: 보수: 중간점 2곳. 중간: "수립"이 어디까지 걸리는지 조사로 드러내고(A-13), "및"을 "와"로, 명사 더미에 "의". 적극: 영문 첫 문장(28단어)을 PO 역할과 PM 역할 두 문장으로 나누고 국문도 네 문장으로.

## 3. 케이스 스터디 (`src/content/projects/legal-agentic-rag.md`)

| 키 경로 | 원문 | 보수 | 중간 | 적극 |
|---|---|---|---|---|
| `summary` en | Built an Agentic RAG service that searches national legal information through a hybrid-search knowledge base and MCP. | 같음 | 같음 | 같음 |
| `summary` ko | 하이브리드 검색 지식 베이스와 MCP로 국가 법령정보를 검색하는 Agentic RAG 서비스 개발 | 같음 | 같음 | 같음 |
| `highlights[0]` en | Built a hybrid-search knowledge base (vector DB and BM25) and designed an MCP server to connect legal information sources. | 같음 | 같음 | 같음 |
| `highlights[0]` ko | 벡터 DB와 BM25 기반 하이브리드 검색 지식 베이스 구축, 법령정보 원천 연계용 MCP 서버 설계 | 같음 | 벡터 DB와 BM25 기반 하이브리드 검색 지식 베이스 구축, 법령정보 원천을 연계하는 MCP 서버 설계 | 벡터 DB와 BM25를 함께 쓰는 하이브리드 검색 지식 베이스를 구축하고 법령정보 원천을 잇는 MCP 서버 설계 |
| `highlights[1]` en | Designed the search agent's scenarios and system prompts, and supported service deployment and performance evaluation. | 같음 | 같음 | 같음 |
| `highlights[1]` ko | 법령정보 검색 에이전트의 시나리오·시스템 프롬프트 설계, 서비스 배포 및 성능 평가 지원 | 법령정보 검색 에이전트의 시나리오와 시스템 프롬프트 설계, 서비스 배포 및 성능 평가 지원 | 법령정보 검색 에이전트의 시나리오와 시스템 프롬프트 설계, 서비스 배포와 성능 평가 지원 | 같음 |
| `caseStudy.context[0]` en | Built legalQ, a public beta service where anyone can ask about Korean law in everyday language and get the relevant articles, such as whether an act is illegal or what the fine is, with sources. | 같음 | 같음 | Built legalQ, a public beta service where anyone can ask everyday questions about Korean law, such as whether an act is illegal or what the fine is, and get the relevant articles with sources. |
| `caseStudy.context[0]` ko | 일반인이 일상어로 질문하면 관련 법 조항과 위법 여부, 범칙금 등을 근거와 함께 찾아 주는 대국민 법령 검색 서비스 legalQ(리걸큐) 개발 (베타 공개) | 같음 | 대국민 법령 검색 서비스 legalQ(리걸큐) 개발 (베타 공개). 일반인이 일상어로 질문하면 관련 법 조항과 위법 여부, 범칙금 등을 근거와 함께 안내. | 대국민 법령 검색 서비스 legalQ(리걸큐) 개발 (베타 공개). 일반인이 위법 여부나 범칙금 같은 질문을 일상어로 하면 관련 법 조항을 근거와 함께 안내. |
| `caseStudy.context[1]` en | Drew on legalize-kr, an open repository of about 3,046 Korean statutes as Markdown files with Git history, and a Seahorse vector DB loaded from the same files. | 같음 | 같음 | 같음 |
| `caseStudy.context[1]` ko | 법령 약 3,046개를 Markdown 파일과 Git 이력으로 정리한 공개 저장소 legalize-kr와, 같은 파일을 적재한 Seahorse 벡터 DB 활용 | 같음 | 같음 | 같음 |
| `caseStudy.problem[0]` en | People ask in everyday words, such as "I bought something from overseas; how is it taxed?", not in legal terms, and the answer often spans several articles, related statutes, and enforcement decrees and rules. | People ask in everyday words instead of legal terms, such as "I bought something from overseas; how is it taxed?", and the answer often spans several articles, related statutes, and enforcement decrees and rules. | 같음 | People ask everyday questions such as "I bought something from overseas; how is it taxed?" instead of using legal terms. The answer often spans several articles, related statutes, and enforcement decrees and rules. |
| `caseStudy.problem[0]` ko | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어가 아닌 일상어로 묻고, 답은 여러 조문과 관련 법령, 시행령·시행규칙에 걸쳐 있음 | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어 대신 일상어로 묻고, 답은 여러 조문과 관련 법령, 시행령과 시행규칙에 걸쳐 있는 상태 | "해외직구 세금이 어떻게 되나요?"처럼 법률 용어 대신 일상어로 묻는 질문. 답은 대개 여러 조문, 관련 법령, 시행령과 시행규칙에 분산. | 이용자는 법률 용어 대신 "해외직구 세금이 어떻게 되나요?" 같은 일상어로 질문. 답은 대개 여러 조문, 관련 법령, 시행령과 시행규칙에 분산. |
| `caseStudy.problem[1]` en | A non-agentic workflow that queried the vector DB once could not handle compound or everyday questions, and the vector DB held no revision history for questions about when a statute changed. | 같음 | 같음 | A non-agentic workflow that queried the vector DB once could not handle compound or everyday questions. The vector DB also held no revision history for questions about when a statute changed. |
| `caseStudy.problem[1]` ko | 벡터 DB를 한 번 조회하는 non-agentic 워크플로우로는 복합 질의와 일상어 질의에 답하기 어려웠고, 개정 시점을 묻는 질문은 벡터 DB에 이력 자체가 없음 | 벡터 DB를 한 번 조회하는 non-agentic 워크플로우로는 복합 질의와 일상어 질의에 답하기 어려웠고, 개정 시점을 묻는 질문은 벡터 DB에 이력 자체가 없는 상태 | 에이전트 없이 벡터 DB를 한 번 조회하는 워크플로우로는 복합 질의와 일상어 질의에 대응 불가. 개정 시점을 묻는 질문에 필요한 개정 이력도 벡터 DB에는 없는 상태. | 같음 |
| `caseStudy.problem[2]` en | Answers had to quote articles verbatim with their numbers and sources and reflect the latest amendments, since a paraphrased or outdated article misleads users. | 같음 | 같음 | 같음 |
| `caseStudy.problem[2]` ko | 요약·의역하거나 개정 전 조문을 인용하면 이용자를 오도하므로, 조문번호와 출처를 붙여 최신 원문 그대로 인용해야 함 | 요약하거나 의역하거나 개정 전 조문을 인용하면 이용자를 오도하므로, 조문번호와 출처를 붙여 최신 원문 그대로 인용 필요 | 요약, 의역, 개정 전 조문 인용은 이용자를 오도하므로 답변에는 조문번호와 출처를 붙인 최신 원문 인용 필요 | 같음 |
| `caseStudy.role[0]` en | Worked as an ML engineer and designed the overall architecture, the vector DB, and the agent's system prompt, and deployed the service. | 같음 | 같음 | As an ML engineer, designed the overall architecture, the vector DB, and the agent's system prompt, and deployed the service. |
| `caseStudy.role[0]` ko | ML 엔지니어로 참여해 전체 아키텍처, 벡터 DB, 에이전트 시스템 프롬프트를 설계하고 서비스 배포 담당 | 같음 | 같음 | 같음 |
| `caseStudy.role[1]` † en | Loaded the statutes into the vector DB by article and paragraph, and designed an MCP server that gives the agent deterministic access to the statute repository. | 같음 | 같음 | 같음 |
| `caseStudy.role[1]` † ko | 법령을 조·항 단위로 벡터 DB에 적재하고, 에이전트가 법령 저장소에 결정론적으로 접근하는 MCP 서버 설계 | 법령을 조와 항 단위로 벡터 DB에 적재하고, 에이전트가 법령 저장소에 결정론적으로 접근하는 MCP 서버 설계 | 법령을 조와 항 단위로 벡터 DB에 적재하고 에이전트가 법령 저장소에 결정론적으로 접근하는 MCP 서버 설계 | 같음 |
| `caseStudy.approach[0]` en | Connected two knowledge sources to one agent through MCP, using the vector DB to discover articles by meaning and the Markdown repository for exact current text, revision history, and statistics. | 같음 | 같음 | 같음 |
| `caseStudy.approach[0]` ko | 두 지식원을 MCP로 하나의 에이전트에 연결해, 의미로 조문을 찾는 일은 벡터 DB, 정확한 현행 원문·개정 이력·통계는 Markdown 저장소가 맡도록 설계 | 두 지식원을 MCP로 하나의 에이전트에 연결해, 의미로 조문을 찾는 일은 벡터 DB가, 정확한 현행 원문과 개정 이력, 통계는 Markdown 저장소가 맡도록 설계 | 두 지식원을 MCP로 하나의 에이전트에 연결. 벡터 DB는 의미로 조문을 찾고 Markdown 저장소는 정확한 현행 원문, 개정 이력, 통계를 맡도록 설계. | 같음 |
| `caseStudy.approach[1]` † en | Expanded the vector DB from 12 traffic and corporate statutes to all of about 3,046, and re-indexed it by article and paragraph with statute and article metadata for Dense and BM25 hybrid search. | 같음 | 같음 | Expanded the vector DB from 12 traffic and corporate statutes to all of about 3,046. Re-indexed it by article and paragraph, with statute and article metadata, for Dense and BM25 hybrid search. |
| `caseStudy.approach[1]` † ko | 벡터 DB를 교통·기업 법령 12개에서 전체 약 3,046개로 확장하고, 법령·조문 메타데이터를 붙여 조·항 단위로 다시 적재해 Dense·BM25 하이브리드 검색에 사용 | 벡터 DB를 교통과 기업 법령 12개에서 전체 약 3,046개로 확장하고, 법령과 조문 메타데이터를 붙여 조와 항 단위로 다시 적재해 Dense와 BM25 하이브리드 검색에 사용 | 벡터 DB를 교통과 기업 법령 12개에서 전체 약 3,046개로 확장. 법령과 조문 메타데이터를 붙여 조와 항 단위로 다시 적재하고 Dense와 BM25 하이브리드 검색에 사용. | 같음 |
| `caseStudy.approach[2]` en | Wrote a system prompt that classifies each question into one of six intents and routes it to the vector DB, the statute file, its addenda, or file metadata, then re-checks the latest text when a question signals recency and falls back to keyword search when vector results miss. | 같음 | 같음 | Wrote a system prompt that classifies each question into one of six intents and routes it to the vector DB, the statute file, its addenda, or file metadata. The same prompt re-checks the latest text when a question signals recency and falls back to keyword search when vector results miss. |
| `caseStudy.approach[2]` ko | 질문을 6가지 의도로 분류해 벡터 DB, 법령 파일, 부칙, 파일 메타데이터 중 경로를 고르고, 최신성 신호가 있으면 저장소 최신 원문으로 다시 확인하며 벡터 결과가 빗나가면 키워드 검색으로 전환하는 시스템 프롬프트 설계 | 같음 | 질문을 6가지 의도로 분류해 벡터 DB, 법령 파일, 부칙, 파일 메타데이터 중 경로를 고르는 시스템 프롬프트 설계. 최신성 신호가 있으면 저장소 최신 원문으로 다시 확인하고 벡터 결과가 빗나가면 키워드 검색으로 전환. | 같음 |
| `caseStudy.approach[3]` en | Put the repository's folder layout, file naming rules, and writing conventions into the prompt, so the agent builds file paths and finds articles without searching. | 같음 | 같음 | 같음 |
| `caseStudy.approach[3]` ko | 저장소의 폴더 구조, 파일명 규칙, 작성 규약을 프롬프트에 미리 넣어 에이전트가 검색 없이 파일 경로를 만들고 조문을 찾도록 함 | 저장소의 폴더 구조, 파일명 규칙, 작성 규약을 프롬프트에 미리 넣어 에이전트가 검색 없이 파일 경로를 만들고 조문을 찾도록 구성 | 같음 | 같음 |
| `caseStudy.decisions[0].title` en | Two complementary sources, not one | Two complementary sources | 같음 | 같음 |
| `caseStudy.decisions[0].title` ko | 하나가 아닌 두 지식원의 상호 보완 | 두 지식원의 상호 보완 | 서로 보완하는 두 지식원 | 같음 |
| `caseStudy.decisions[0].rationale` en | The vector DB finds articles from everyday words, and the repository supplies the exact current text, history, and statistics that the vector DB lacks. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[0].rationale` ko | 벡터 DB는 일상어로 조문을 찾고, 저장소는 벡터 DB에 없는 정확한 현행 원문·이력·통계를 제공 | 벡터 DB는 일상어로 조문을 찾고, 저장소는 벡터 DB에 없는 정확한 현행 원문, 이력, 통계를 제공 | 벡터 DB로는 일상어로 조문을 찾고 벡터 DB에 없는 정확한 현행 원문, 이력, 통계는 저장소에서 조회 | 같음 |
| `caseStudy.decisions[0].tradeoff` en | Two sources to keep in sync and more routing rules. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[0].tradeoff` ko | 두 지식원의 동기화와 라우팅 규칙 관리 부담 | 같음 | 같음 | 같음 |
| `caseStudy.decisions[1].title` en | Routing in one agent's prompt, not a multi-agent system | Routing in one agent's prompt | Intent routing inside one agent's prompt | 같음 |
| `caseStudy.decisions[1].title` ko | 멀티에이전트가 아닌 단일 에이전트 프롬프트 라우팅 | 단일 에이전트 프롬프트 라우팅 | 단일 에이전트의 프롬프트로 의도 라우팅 | 같음 |
| `caseStudy.decisions[1].rationale` en | Multi-agent setups multiply token use, and one agent with intent rules answers simple questions in fewer calls. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[1].rationale` ko | 멀티에이전트는 토큰 사용량이 크게 늘고, 의도 규칙을 가진 단일 에이전트는 단순 질문을 적은 호출로 처리 | 같음 | 멀티에이전트는 토큰 사용량이 크게 늘고 의도 규칙을 둔 단일 에이전트는 단순 질문을 적은 호출로 처리 | 같음 |
| `caseStudy.decisions[1].tradeoff` en | A long system prompt that grows with every rule. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[1].tradeoff` ko | 규칙이 늘수록 길어지는 시스템 프롬프트 | 같음 | 같음 | 같음 |
| `caseStudy.decisions[2].title` en | A repository map inside the prompt | 같음 | 같음 | 같음 |
| `caseStudy.decisions[2].title` ko | 프롬프트에 넣은 저장소 지도 | 같음 | 같음 | 같음 |
| `caseStudy.decisions[2].rationale` en | The agent builds the file path and finds the article heading directly, skipping search calls. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[2].rationale` ko | 검색 호출 없이 파일 경로를 만들고 조문 제목을 바로 찾음 | 검색 호출 없이 파일 경로를 만들고 조문 제목을 바로 찾는 방식 | 에이전트가 검색 호출 없이 파일 경로를 만들어 조문 제목에 바로 접근 | 같음 |
| `caseStudy.decisions[2].tradeoff` en | The prompt must change when the repository layout changes. | 같음 | 같음 | The prompt must change whenever the repository layout does. |
| `caseStudy.decisions[2].tradeoff` ko | 저장소 구조가 바뀌면 프롬프트도 고쳐야 함 | 저장소 구조가 바뀌면 프롬프트도 수정 필요 | 같음 | 저장소 구조를 바꿀 때마다 프롬프트 수정 필요 |
| `caseStudy.decisions[3].title` † en | Article-level chunks | 같음 | 같음 | 같음 |
| `caseStudy.decisions[3].title` † ko | 조·항 단위 청크 | 조와 항 단위 청크 | 같음 | 같음 |
| `caseStudy.decisions[3].rationale` en | Default 1,000-character chunks split or merged articles and forced extra adjacent-chunk calls, while one row per article answers citation queries in one hit. | 같음 | 같음 | Default 1,000-character chunks split or merged articles and forced extra adjacent-chunk calls. One row per article answers citation queries in one hit. |
| `caseStudy.decisions[3].rationale` ko | 기본 1,000자 청크는 조문을 자르거나 묶어 인접 청크 호출이 늘었고, 조문 단위 행은 인용 질의를 한 번에 회수 | 같음 | 기본 1,000자 청크로는 조문이 잘리거나 묶여 인접 청크 호출 증가. 조문 단위 행으로는 인용 질의를 한 번에 회수. | 같음 |
| `caseStudy.decisions[3].tradeoff` en | A custom parser and re-indexing whenever statutes change. | 같음 | 같음 | 같음 |
| `caseStudy.decisions[3].tradeoff` ko | 자체 파서 유지와 법령 개정 때마다 재적재 필요 | 같음 | 자체 파서 유지와 법령이 바뀔 때마다 재적재 | 같음 |
| `caseStudy.compare.verdict` en | Not one or the other: the agent finds with the vector DB and confirms with the repository. | The agent uses both, finding with the vector DB and confirming with the repository. | The agent uses both, finding articles with the vector DB and confirming them in the repository. | The agent finds articles with the vector DB and confirms them in the repository. |
| `caseStudy.compare.verdict` ko | 둘 중 하나가 아니라 둘 다: 에이전트는 벡터 DB로 찾고 저장소로 확인한다. | 에이전트는 둘을 함께 써서 벡터 DB로 찾고 저장소로 확인 | 에이전트는 둘을 함께 써서 벡터 DB로 조문을 찾고 저장소에서 확인 | 에이전트는 벡터 DB로 조문을 찾고 저장소에서 확인 |
| `caseStudy.screens.slices[0].notes[0].body` en | Name, ministry, promulgation and effective dates, and a source link, taken from the file frontmatter. | 같음 | 같음 | 같음 |
| `caseStudy.screens.slices[0].notes[0].body` ko | 법령명, 소관부처, 공포·시행일, 출처 링크. 법령 파일의 frontmatter에서 가져옴 | 법령명, 소관부처, 공포일과 시행일, 출처 링크. 법령 파일의 frontmatter에서 가져온 정보. | 같음 | 법령 파일의 frontmatter에서 가져온 법령명, 소관부처, 공포일과 시행일, 출처 링크 |
| `caseStudy.screens.slices[0].notes[1].body` † en | Article and paragraph numbers kept as written, with no summary or paraphrase. | 같음 | 같음 | 같음 |
| `caseStudy.screens.slices[0].notes[1].body` † ko | 조·항 번호를 그대로 두고 요약·의역 없이 인용 | 조와 항 번호를 그대로 두고 요약이나 의역 없이 인용 | 같음 | 같음 |
| `caseStudy.screens.slices[1].notes[0].body` en | The deadlines in the quoted articles, step by step. | 같음 | 같음 | 같음 |
| `caseStudy.screens.slices[1].notes[0].body` ko | 인용한 조문의 기한을 단계별로 정리 | 같음 | 같음 | 같음 |
| `caseStudy.screens.slices[1].notes[1].body` en | Ends with a scope caveat, a disclaimer, and a link to the National Law Information Center. | 같음 | 같음 | 같음 |
| `caseStudy.screens.slices[1].notes[1].body` ko | 적용 범위 주의와 면책 문구, 국가법령정보센터 링크로 마감 | 같음 | 같음 | 같음 |
| `caseStudy.screens.gap` en | Articles 26, 27, 28, 30, 31, and 33 omitted | 같음 | 같음 | 같음 |
| `caseStudy.screens.gap` ko | 제26·27·28·30·31·33조 인용 생략 | 제26, 27, 28, 30, 31, 33조 인용 생략 | 같음 | 같음 |

고친 이유:

- `summary`: 세 강도 모두 그대로.
- `highlights[0]`: 중간: `법령정보 원천 연계용` 명사 더미를 관형절로. 적극: 두 동작을 "~하고"로 이은 문장.
- `highlights[1]`: 보수: 계획서 5.2 예시 그대로. 중간: "및"을 "와"로.
- `caseStudy.context[0]`: 중간: 두 겹 관형절(질문하면, 찾아 주는)을 끊어 만든 것을 앞에 둠. 적극: 영문 such as가 조문이 아닌 질문에 붙게 옮기고(영문 진단 P13) 국문도 질문 예시로.
- `caseStudy.context[1]`: 그대로. 관형절 두 개가 나란하지만 각각 한 겹.
- `caseStudy.problem[0]`: 보수: 부정 대구 `, not in legal terms`와 `법률 용어가 아닌`을 instead of, "대신"으로, `있음`을 명사형으로, 중간점. 중간: 연결어미 쉼표를 없애려 두 문장으로 나누고, 국문에 빠진 영문 often을 "대개"로 살림. 적극: 영문도 두 문장으로, 국문은 주어(이용자)를 앞에.
- `caseStudy.problem[1]`: 보수: `없음`을 계획서 5.5 예시대로 `없는 상태`로. 중간: `non-agentic 워크플로우`를 진단 처방대로 국문으로(사실 대조에서 1건 차이로 잡힘), 영문 could not에 맞춰 `어려웠고`를 `대응 불가`로, 두 문장으로 나눠 주어 어긋남을 풂. 적극: 영문만 두 문장으로.
- `caseStudy.problem[2]`: 보수: `~해야 함`을 `~필요`로, `요약·의역하거나`를 동사 둘로. 중간: 원인을 앞, 요구를 뒤에 둔 한 문장. "원문 인용"은 용어집 표기.
- `caseStudy.role[0]`: 적극: 영문을 As an ML engineer로 시작해 and 세 번을 줄임. 국문은 그대로.
- `caseStudy.role[1]`: 보수: `조·항`(†). 중간: 연결어미 뒤 쉼표 삭제.
- `caseStudy.approach[0]`: 보수: 중간점 셋을 "과"와 쉼표로, 두 역할이 갈리게 "벡터 DB가"를 붙임. 중간: 연결과 역할 분담을 두 문장으로.
- `caseStudy.approach[1]`: 보수: 중간점 4곳(`조·항`†, `Dense·BM25` 포함). 중간: 연결 사슬을 두 문장으로. 적극: 영문도 확장과 재적재 두 문장으로.
- `caseStudy.approach[2]`: 중간: 국문 최장 관형절 사슬(진단 A-18 예문)을 만든 것과 세부 규칙 두 문장으로. 적극: 영문(48단어)도 같은 자리에서 나눔.
- `caseStudy.approach[3]`: 보수: `~도록 함`을 `~도록 구성`으로.
- `caseStudy.decisions[0].title`: 보수: 비교 틀을 뺌(버린 대안은 이유 칸이 설명). 중간: 국문 명사화 `~의 상호 보완`을 관형절로.
- `caseStudy.decisions[0].rationale`: 보수: 중간점. 중간: 쉼표 삭제, "저장소는 ~제공"(무생물 주어와 범용 동사)을 "저장소에서 조회"로.
- `caseStudy.decisions[0].tradeoff`: 그대로.
- `caseStudy.decisions[1].title`: 보수: 비교 틀 삭제. 중간: 영문 진단 제안대로 무엇을 라우팅하는지(intent) 밝히고, 국문 명사 더미에 "의", "로".
- `caseStudy.decisions[1].rationale`: 중간: 쉼표 삭제, `규칙을 가진`(have 직역)을 `규칙을 둔`으로.
- `caseStudy.decisions[2].rationale`: 보수: `찾음`을 `찾는 방식`으로(빈 머리명사가 생기는 보수의 한계). 중간: 영문 주어(The agent)를 살리고 명사형 "접근"으로.
- `caseStudy.decisions[2].tradeoff`: 보수: `~해야 함`을 `~필요`로(영문에 must가 있어 당위 유지). 적극: change 반복을 whenever로 줄이고 국문도 "~때마다".
- `caseStudy.decisions[3].title`: 보수: `조·항`(†).
- `caseStudy.decisions[3].rationale`: 중간: 주어(청크는)와 서술(호출이 늘었고)의 어긋남을 "청크로는"으로 풀고 두 문장으로. 적극: 영문도 while을 빼고 두 문장으로.
- `caseStudy.decisions[3].tradeoff`: 중간: 영문은 비용을 명사구로만 쓰는데 국문만 `필요`로 끝나 당위 결말이 됨. 영문 형식에 맞춰 명사구로.
- `caseStudy.compare.verdict`: 보수: 부정 서두와 콜론으로 결론 터뜨리기(`Not one or the other:`, `둘 중 하나가 아니라 둘 다:`)를 빼고, `확인한다.`를 명사형으로, 한 문장이라 마침표 없음. 중간: 찾고 확인하는 대상(조문)을 밝힘. 적극: uses both까지 빼고 두 동작만 남김.
- `caseStudy.screens.slices[0].notes[0].body`: 보수: 중간점, 마침표가 빠진 둘째 문장의 `가져옴`을 명사형 문장으로. 적극: 출처를 앞에 둔 한 문장.
- `caseStudy.screens.slices[0].notes[1].body`: 보수: `조·항`(†), `요약·의역`은 영문 or에 맞춰 "이나".
- `caseStudy.screens.gap`: 조 번호 나열. 굳은 말 목록에 올릴 후보

## 4. 다이어그램 라벨 (`src/content/diagrams/legal-agentic-rag.yaml`)

| 키 경로 | 원문 | 보수 | 중간 | 적극 |
|---|---|---|---|---|
| `legend[1].label` en | `Agent, LLM` 10자 | 같음 | 같음 | 같음 |
| `legend[1].label` ko | `에이전트·LLM` 8자 | `에이전트/LLM` 8자 (±0) | 같음 | 같음 |
| `problem.zones[0].label` en | `Before · one vector search` 26자 | `Before (one vector search)` 26자 (±0) | 같음 | 같음 |
| `problem.zones[0].label` ko | `이전 · 벡터 DB 1회 조회` 16자 | `이전(벡터 DB 1회 조회)` 15자 (−1) | 같음 | 같음 |
| `problem.zones[1].label` en | `After · agent with two sources` 30자 | `After (agent with two sources)` 30자 (±0) | 같음 | 같음 |
| `problem.zones[1].label` ko | `이후 · 두 지식원을 쓰는 에이전트` 19자 | `이후(두 지식원을 쓰는 에이전트)` 18자 (−1) | 같음 | 같음 |
| `problem.nodes[8].sub` en | `commits · metadata` 18자 | `commits, metadata` 17자 (−1) | 같음 | 같음 |
| `problem.nodes[8].sub` ko | `커밋·메타데이터` 8자 | `커밋/메타데이터` 8자 (±0) | 같음 | 같음 |
| `problem.callouts[2].text` en | `No revision history` 19자 | 같음 | 같음 | 같음 |
| `problem.callouts[2].text` ko | `개정 이력·과거 원문 없음` 14자 | `개정 이력/과거 원문 없음` 14자 (±0) | 같음 | 같음 |
| `prompt.zones[0].label` en | `6 absolute rules · apply to every step` 38자 | `6 absolute rules (apply to every step)` 38자 (±0) | 같음 | `6 absolute rules for every step` 31자 (−7) |
| `prompt.zones[0].label` ko | `절대 규칙 6개 · 모든 단계에 적용` 20자 | `절대 규칙 6개(모든 단계에 적용)` 19자 (−1) | 같음 | `모든 단계의 절대 규칙 6개` 15자 (−5) |
| `prompt.zones[0].note.text` en | `verbatim · no advice · cite · read-only` 39자 | `verbatim, no advice, cite, read-only` 36자 (−3) | 같음 | 같음 |
| `prompt.zones[0].note.text` ko | `원문 그대로 · 조언 금지 · 출처 · 읽기 전용` 27자 | `원문 그대로, 조언 금지, 출처, 읽기 전용` 24자 (−3) | 같음 | 같음 |
| `prompt.nodes[9].label` en | `Knowledge: tool guide · repository layout and schema` 52자 | `Knowledge: tool guide, repository layout and schema` 51자 (−1) | 같음 | 같음 |
| `prompt.nodes[9].label` ko | `참고 지식: 도구 소개 · 저장소 구조·스키마` 25자 | `참고 지식: 도구 소개, 저장소 구조/스키마` 24자 (−1) | 같음 | 같음 |
| `prompt.nodes[10].sub` en | `not found, ambiguous, API errors …` 34자 | 같음 | 같음 | 같음 |
| `prompt.nodes[10].sub` ko | `미발견·모호·API 오류 …` 15자 | `미발견/모호/API 오류 …` 15자 (±0) | 같음 | 같음 |
| `prompt.texts[0].text` en | `Each box = one section of the system prompt; second line = rules it holds` 73자 | 같음 | `Each box = one section of the system prompt, second line = rules it holds` 73자 (±0) | 같음 |
| `prompt.texts[0].text` ko | `각 상자 = 시스템 프롬프트의 섹션, 아래 줄 = 그 섹션에 든 규칙 수` 40자 | 같음 | 같음 | 같음 |
| `arch.zones[2].label` en | `MCP · read-only tools` 21자 | `MCP (read-only tools)` 21자 (±0) | 같음 | `Read-only MCP tools` 19자 (−2) |
| `arch.zones[2].label` ko | `MCP · 읽기 전용 도구` 14자 | `MCP(읽기 전용 도구)` 13자 (−1) | 같음 | `읽기 전용 MCP 도구` 12자 (−2) |
| `arch.nodes[2].sub` en | `rate · concurrency · PII` 24자 | `rate, concurrency, PII` 22자 (−2) | 같음 | 같음 |
| `arch.nodes[2].sub` ko | `IP 제한·동시성·개인정보` 14자 | `IP 제한/동시성/개인정보` 14자 (±0) | 같음 | 같음 |
| `arch.nodes[11].sub` † en | `Dense·BM25 hybrid · article chunks` 34자 | `Dense/BM25 hybrid, article chunks` 33자 (−1) | 같음 | 같음 |
| `arch.nodes[11].sub` † ko | `Dense·BM25 하이브리드 · 조·항 단위 청크` 28자 | `Dense/BM25 하이브리드, 조/항 단위 청크` 27자 (−1) | 같음 | 같음 |
| `arch.nodes[14].label` en | `Source: law.go.kr` 17자 | 같음 | 같음 | 같음 |
| `arch.nodes[14].label` ko | `원천: 국가법령정보센터` 12자 | 같음 | 같음 | 같음 |

고친 이유:

- `legend[1].label`: 보수: 붙여 쓴 중간점은 글자 수가 같은 `/`로(5.2 좁은 자리).
- `problem.zones[0].label`: 보수: 이름과 설명을 가르는 띄어 쓴 ` · `는 괄호로(5.2 영문 라벨 예시). 국문은 괄호 앞을 붙여 써 글자 수를 줄임.
- `problem.zones[1].label`: 보수: 위와 같음.
- `problem.nodes[8].sub`: 보수: 영문은 쉼표, 국문은 `/`.
- `problem.callouts[2].text`: 보수: `/`. 끝의 `없음`은 라벨 관용 표기라 둠(README 정해야 할 것).
- `prompt.zones[0].label`: 보수: 괄호. 적극: 괄호 없는 한 구로.
- `prompt.zones[0].note.text`: 보수: 띄어 쓴 ` · `를 쉼표로(글자 수가 줄어듦).
- `prompt.nodes[9].label`: 보수: 띄어 쓴 ` · `는 쉼표, 그 안에 붙여 쓴 `·`는 `/`. 라벨형 콜론은 영문 진단대로 둠.
- `prompt.nodes[10].sub`: 보수: 세 항목이지만 쉼표를 쓰면 2자 늘어 `/`.
- `prompt.texts[0].text`: 중간: 범례 설명의 세미콜론을 국문처럼 쉼표로(글자 수 같음).
- `arch.zones[2].label`: 보수: 괄호. 적극: Read-only MCP tools처럼 한 구로.
- `arch.nodes[2].sub`: 보수: 영문 쉼표, 국문 `/`.
- `arch.nodes[11].sub`: 보수: 띄어 쓴 ` · `는 쉼표, 붙여 쓴 `·`는 `/`. `Dense/BM25`는 용어집 영문 표기(`Dense / BM25`)와 같은 모양, `조/항`은 †.
- `arch.nodes[14].label`: 라벨형 콜론이라 그대로.
