---
title:
  en: SCM Data Analysis and Work Support Service
  ko: 공급망 관리(SCM) 데이터 분석 및 업무 지원 서비스 개발
summary:
  en: Led an LLM service that analyzes supply chain management (SCM) data and supports planners' daily work with Text-to-SQL and agents.
  ko: Text-to-SQL과 에이전트로 SCM 데이터를 분석하고 계획 담당자의 일상 업무를 지원하는 LLM 서비스 개발 총괄
highlights:
  - en: Led the project end to end and designed the service architecture and agent workflows built on Text-to-SQL.
    ko: 프로젝트 총괄, 서비스 아키텍처와 Text-to-SQL 기반 에이전트 워크플로우 설계
  - en: Deployed the service and managed its operation.
    ko: 서비스 배포 및 운영 관리
period: { start: 2025-02, end: 2025-08 }
org: { en: PwC Consulting, ko: PwC 컨설팅 }
client:
  public: true
  name: { en: Samsung Electronics, ko: 삼성전자 }
lead: true
domain: Manufacturing
capability: [LLM Agents & RAG]
stack: [Qwen 8B (fine-tuned), Llama 3.1 70B, LangChain, LangGraph, Hugging Face, vLLM, Milvus, LiteLLM, Braintrust]
featured: true
order: 3
caseStudy:
  context:
    - en: Samsung Electronics' supply chain management (SCM) organization wanted planners to query SCM data and get work guidance directly, in natural language.
      ko: 삼성전자 SCM 조직의 계획 담당자가 자연어로 SCM 데이터를 조회하고 업무 가이드를 받을 수 있는 서비스 구축 과제
  problem:
    - en: Even routine data questions required SQL and schema knowledge, so planners had to route them through specialists.
      ko: 단순한 데이터 질문도 SQL과 테이블 구조를 아는 담당자를 거쳐야 하는 조회 구조
    - en: Operational know-how was scattered across documents and individual experience.
      ko: 문서와 개인 경험에 흩어진 업무 노하우
    - en: External market information such as news, financial indices, and logistics data was collected by hand, which slowed root-cause analysis.
      ko: 뉴스, 금융 지수, 운송 정보 등 외부 시황 정보의 수작업 수집으로 원인 분석 지연
  role:
    - en: Led the project end to end in a team of seven, owning the service architecture, the agent roles and their coordination, and the workflow design.
      ko: 7명 규모 프로젝트 총괄, 서비스 아키텍처, 에이전트 역할 정의와 연계, 워크플로우 설계 담당
    - en: Built the data-query agent pipeline and the sLLM fine-tuning dataset and training scripts hands-on; set up the development and production environments and the CI/CD branch strategy.
      ko: 데이터 조회 에이전트 파이프라인과 sLLM 파인튜닝 데이터셋·학습 스크립트 직접 개발, 개발·운영 환경 구성과 CI/CD 브랜치 전략 수립
  approach:
    - en: Agreed on 95% SQL generation accuracy on an evaluation set as the success criterion at kickoff.
      ko: 착수 시 평가셋 기준 SQL 생성 정확도 95%를 성공 기준으로 합의
    - en: Designed an orchestrator (query rewrite, routing, response layout) that coordinates three agents through A2A — data query and analysis, work support (AI Advisor), and external information.
      ko: 질의 재작성, 라우팅, 답변 구성을 맡는 오케스트레이터가 데이터 조회·분석, 업무 지원(AI Advisor), 외부 정보 조회의 3개 에이전트를 A2A로 연계하는 구조 설계
    - en: Built the data-query pipeline as view identification, entity extraction, code mapping, and a pseudo query that a BI engine turns into the final query.
      ko: View 식별, 엔티티 추출, 코드 매핑, Pseudo Query 생성 후 BI 엔진이 최종 쿼리로 변환하는 데이터 조회 파이프라인 구축
    - en: Fine-tuned a Qwen 8B sLLM for entity extraction and Text-to-SQL after a prompted general-purpose LLM kept confusing entity codes, and split training and inference servers.
      ko: 범용 LLM 프롬프트로는 엔티티 코드 혼동이 발생해 Qwen 8B sLLM을 추출·Text-to-SQL용으로 파인튜닝, 학습 서버와 추론 서버 분리
  outcome:
    - en: Achieved 95%+ SQL generation accuracy on the evaluation set.
      ko: 평가셋 기준 SQL 생성 정확도 95% 이상 달성
    - en: Replaced request-and-wait data lookups with instant natural-language queries and charts.
      ko: 담당자 의뢰 후 회신을 기다리던 데이터 조회를 자연어 즉시 조회와 차트 제공으로 전환
    - en: Won the phase-2 contract to extend the service with direct system integration and real-time external data.
      ko: 시스템 직접 연계와 실시간 외부 데이터 활용으로 확장하는 2단계 고도화 수주
  decisions:
    - title:
        en: Pseudo query instead of direct SQL
        ko: 직접 SQL 대신 Pseudo Query
      rationale:
        en: A BI engine converts a structured pseudo query into SQL, so generated queries never hit the production database directly and can be validated before execution.
        ko: BI 엔진이 구조화된 Pseudo Query를 SQL로 변환해 운영 DB 직접 접근을 막고 실행 전 쿼리 검증 가능
      tradeoff:
        en: Query coverage is limited to what the BI engine can express.
        ko: 조회 범위가 BI 엔진의 표현 범위에 종속
    - title:
        en: Separate models for SQL and generation
        ko: SQL용·생성용 모델 분리
      rationale:
        en: A fine-tunable Qwen 8B sLLM handles Text-to-SQL for accuracy and cost, while Llama 3.1 70B writes the answers.
        ko: 파인튜닝 가능한 Qwen 8B sLLM이 Text-to-SQL을 맡아 정확도와 비용 확보, 답변 생성은 Llama 3.1 70B 담당
      tradeoff:
        en: Two models to serve and operate.
        ko: 모델 2종의 서빙·운영 부담
    - title:
        en: Automated dev deployment, gated production release
        ko: 개발계 자동 배포, 운영계 수동 배포
      rationale:
        en: CI/CD deploys to development automatically, while production changes go through a reviewed pull request, keeping development fast and production stable.
        ko: 개발계는 CI/CD 자동 배포, 운영계는 PR 검토 후 반영해 개발 속도와 운영 안정성 분리
      tradeoff:
        en: Longer lead time for production releases.
        ko: 운영 반영 리드타임 증가
  architecture:
    layers:
      - id: client
        label: { en: Users, ko: 사용자 }
        nodes:
          - { en: Web and mobile portal, ko: 웹·모바일 포털 }
      - id: orchestrator
        label: { en: Orchestrator, ko: 오케스트레이터 }
        nodes:
          - { en: Query rewrite, ko: 질의 재작성 }
          - { en: Router, ko: 라우터 }
          - { en: Response layout, ko: 답변 구성 }
      - id: agents
        label: { en: Agents, ko: 에이전트 }
        nodes:
          - { en: "Data query: view identification, entity extraction, code mapping, pseudo query", ko: "데이터 조회: View 식별, 엔티티 추출, 코드 매핑, Pseudo Query" }
          - { en: "Work support (AI Advisor): retrieval, reranking, generation", ko: "업무 지원(AI Advisor): 검색, 재순위화, 생성" }
          - { en: "External information: retrieval and post-processing", ko: "외부 정보 조회: 검색, 후처리" }
      - id: models
        label: { en: Models, ko: 모델 }
        nodes:
          - { en: Qwen 8B sLLM (fine-tuned) for Text-to-SQL, ko: Text-to-SQL용 Qwen 8B sLLM(파인튜닝) }
          - { en: Llama 3.1 70B for generation, ko: 생성용 Llama 3.1 70B }
          - { en: vLLM serving, ko: vLLM 서빙 }
      - id: data
        label: { en: Data, ko: 데이터 }
        nodes:
          - { en: "BI engine and SCM database", ko: "BI 엔진, SCM DB" }
          - { en: Vector DB of work guides, ko: 업무 가이드 벡터 DB }
          - { en: External market data, ko: 외부 시황 데이터 }
    flows:
      - { from: client, to: orchestrator }
      - { from: orchestrator, to: agents, label: { en: A2A, ko: A2A } }
      - { from: agents, to: models }
      - { from: agents, to: data }
---
