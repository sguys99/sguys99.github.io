---
title:
  en: SCM Data Analysis and Work Support Service
  ko: 공급망 관리(SCM) 데이터 분석 및 업무 지원 서비스 개발
summary:
  en: Led development of an LLM service that analyzes supply chain management (SCM) data and supports planners' daily work with Text-to-SQL and agents.
  ko: Text-to-SQL과 에이전트로 SCM 데이터를 분석하고 계획 담당자의 일상 업무를 지원하는 LLM 서비스 개발 총괄
highlights:
  - en: Led the project and designed the service architecture and agent workflows that use Text-to-SQL.
    ko: 프로젝트를 총괄하고 서비스 아키텍처와 Text-to-SQL을 쓰는 에이전트 워크플로우 설계
  - en: Deployed the service and managed its operation.
    ko: 서비스 배포와 운영 관리
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
order: 4
caseStudy:
  context:
    - en: Samsung Electronics' supply chain management (SCM) organization wanted planners to query SCM data and get work guidance directly, in natural language.
      ko: 삼성전자 SCM 조직에서 계획 담당자가 자연어로 SCM 데이터를 직접 조회하고 업무 가이드를 받도록 서비스 구축 추진
  problem:
    - en: Even routine data questions required SQL and schema knowledge, so planners had to route them through specialists.
      ko: 간단한 데이터 조회도 계획 담당자가 SQL과 테이블 구조를 아는 전문가에게 의뢰
    - en: Operational know-how was scattered across documents and individual experience.
      ko: 문서와 개인 경험에 흩어진 업무 노하우
    - en: Planners gathered market information such as news, financial indices, and logistics data by hand, slowing root-cause analysis.
      ko: 계획 담당자가 뉴스, 금융 지수, 운송 정보 등 외부 시황 정보를 수작업으로 수집해 원인 분석 지연
  role:
    - en: Led the project end to end in a team of seven, owning the service architecture, the agent roles and their coordination, and the workflow design.
      ko: 7명 규모 프로젝트를 총괄하며 서비스 아키텍처와 워크플로우를 설계하고 에이전트별 역할과 연계 방식 정의
    - en: Built the data-query agent pipeline and prepared the dataset and training scripts for sLLM fine-tuning. Set up the development and production environments and defined the CI/CD branch strategy.
      ko: 데이터 조회 에이전트 파이프라인과 sLLM 파인튜닝용 데이터셋, 학습 스크립트 직접 개발. 개발 환경과 운영 환경을 구성하고 CI/CD 브랜치 전략 수립.
  approach:
    - en: Agreed on 95% SQL generation accuracy on an evaluation set as the success criterion at kickoff.
      ko: 착수 시 평가셋 기준 SQL 생성 정확도 95%를 성공 기준으로 합의
    - en: Designed an orchestrator (query rewrite, routing, response layout) that coordinates three agents (data query and analysis, the AI Advisor for work support, and external information) through A2A.
      ko: 질의 재작성, 라우팅, 답변 구성을 맡는 오케스트레이터를 설계해 데이터 조회와 분석, 업무 지원(AI Advisor), 외부 정보 조회 에이전트 3개를 A2A로 연계
    - en: Built the data-query pipeline as view identification, entity extraction, code mapping, and a pseudo query that a BI engine turns into the final query.
      ko: View 식별, 엔티티 추출, 코드 매핑을 거쳐 Pseudo Query를 생성하고 BI 엔진에서 최종 쿼리로 변환하는 데이터 조회 파이프라인 구축
    - en: Fine-tuned a Qwen 8B sLLM for entity extraction and Text-to-SQL after a prompted general-purpose LLM kept confusing entity codes, and split training and inference servers.
      ko: 범용 LLM이 프롬프트만으로는 엔티티 코드를 자주 혼동해 엔티티 추출과 Text-to-SQL용으로 Qwen 8B sLLM을 파인튜닝하고 학습 서버와 추론 서버 분리
  outcome:
    - en: Achieved 95%+ SQL generation accuracy on the evaluation set.
      ko: 평가셋 기준 SQL 생성 정확도 95% 이상 달성
    - en: Enabled planners to query data in natural language and view charts directly without waiting for a specialist to reply.
      ko: 계획 담당자가 전문가의 회신을 기다릴 필요 없이 자연어로 데이터를 조회하고 차트도 직접 확인
    - en: Won the phase-2 contract to extend the service with direct system integration and real-time external data.
      ko: 서비스에 시스템을 직접 연계하고 실시간 외부 데이터를 활용하는 2단계 고도화 수주
  decisions:
    - title:
        en: Pseudo query instead of direct SQL
        ko: 직접 SQL 대신 Pseudo Query
      rationale:
        en: A BI engine converts a structured pseudo query into SQL, so generated queries never hit the production database directly and can be validated before execution.
        ko: BI 엔진이 구조화된 Pseudo Query를 SQL로 변환해 운영 DB 직접 접근을 막고 실행 전 쿼리 검증 가능
      tradeoff:
        en: Query coverage is limited to what the BI engine can express.
        ko: BI 엔진으로 표현할 수 있는 쿼리로 조회 범위 제한
    - title:
        en: Separate models for SQL and generation
        ko: SQL용 모델과 답변 생성용 모델 분리
      rationale:
        en: We chose a fine-tunable Qwen 8B sLLM for Text-to-SQL to balance accuracy and cost, and Llama 3.1 70B to write the answers.
        ko: 정확도와 비용을 고려해 Text-to-SQL에는 파인튜닝 가능한 Qwen 8B sLLM을 쓰고 답변 생성에는 Llama 3.1 70B 사용
      tradeoff:
        en: Two models to serve and operate.
        ko: 모델 2종을 서빙하고 운영하는 부담
    - title:
        en: Automated dev deployment, gated production release
        ko: 개발계 자동 배포, 운영계 수동 배포
      rationale:
        en: We automated development deployments with CI/CD for speed and kept production releases stable through pull request review and manual deployment.
        ko: 개발계에는 CI/CD로 빠르게 자동 배포하고 운영계는 PR 검토 후 수동 배포해 안정성 유지
      tradeoff:
        en: Longer lead time for production releases.
        ko: 운영 반영 리드타임 증가
---
