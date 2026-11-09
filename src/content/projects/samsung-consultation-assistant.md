---
title:
  en: Online Consultation and Product Recommendation Assistant
  ko: 온라인 상담 지원 및 제품 추천 어시스턴트 개발
summary:
  en: Led an agent and RAG assistant that supports online customer consultation and recommends products.
  ko: 온라인 고객 상담 지원과 제품 추천을 위한 에이전트·RAG 기반 어시스턴트 개발 총괄
highlights:
  - en: Led the project end to end, designed the service architecture and agent/RAG workflows, and deployed and operated the service on Azure.
    ko: 프로젝트 총괄, 서비스 아키텍처와 에이전트·RAG 워크플로우 설계, Azure 기반 서비스 배포 및 운영
  - en: Established an evaluation framework for the RAG service and built a program to automate evaluation.
    ko: RAG 서비스 평가 체계 수립 및 평가 자동화 프로그램 개발
period: { start: 2024-12, end: 2025-02 }
org: { en: PwC Consulting, ko: PwC 컨설팅 }
client:
  public: true
  name: { en: Samsung Electronics, ko: 삼성전자 }
lead: true
domain: Manufacturing
capability: [LLM Agents & RAG]
stack: [Microsoft Azure, Azure AI Search, Python, LangChain, RAGAS]
featured: true
order: 4
caseStudy:
  context:
    - en: Samsung Electronics wanted an assistant that answers customer questions consistently across offline stores, online stores, and consultation agents.
      ko: 삼성전자 오프라인 매장, 온라인몰, 상담원 채널에서 고객 문의에 일관되게 답하는 어시스턴트 구축 과제
  problem:
    - en: Customers researched reviews and prices on external sites and came to Samsung channels only to buy.
      ko: 고객이 사용기와 가격은 외부 사이트에서 찾고 자사 채널은 구매 시점에만 방문하는 구조
    - en: Staff could not answer comparison and promotion questions on the spot, and delivery and repair inquiries stalled on phone transfers, costing sales.
      ko: 비교·프로모션 질문에 즉답이 어렵고 배송·고장 문의는 전화 연결 지연으로 이탈해 매출 기회 손실
    - en: Each step of the customer journey, from discovery to repurchase, was answered by a different party.
      ko: 인지부터 재구매까지 고객 여정의 접점마다 답변 주체가 다른 단절된 경험
  role:
    - en: Held overall project responsibility and led architecture design and core module development in a team of about 30.
      ko: 약 30명 규모 프로젝트의 총괄 책임, 아키텍처 설계와 핵심 모듈 개발 리드
    - en: Defined the platform architecture, 18 response scenarios, data model, and admin requirements, and built the orchestrator pipeline, pre-defined answer and guardrail modules, and prompt templates hands-on.
      ko: 플랫폼 아키텍처, 18개 응대 시나리오, 데이터 모델, Admin 요구사항 정의, 오케스트레이터 파이프라인, Pre-defined 답변·가드레일 모듈, 프롬프트 템플릿 직접 개발
  approach:
    - en: Built a channel-independent platform behind an API gateway, so new channels and features reuse the same modules.
      ko: API 게이트웨이 뒤에 채널 독립적 플랫폼을 두어 채널·기능 추가 시 같은 모듈을 재사용하는 구조로 설계
    - en: Evolved the architecture over three versions, from a single-pipeline MVP to separate structured and unstructured retrieval with reranking and guardrails, then to parallel execution.
      ko: 단일 파이프라인 MVP에서 정형·비정형 조회 분리와 재순위화·가드레일 추가를 거쳐 병렬 구조로 3차에 걸쳐 아키텍처 개선
    - en: In the final version, split queries into sub-queries, ran structured, unstructured, and web search in parallel, and branched simple and informative questions.
      ko: 최종 버전에서 질의를 하위 질의로 분해해 정형·비정형·웹 검색을 병렬 실행하고 단순·정보형 질문을 분기 처리
    - en: Established an evaluation framework for the RAG service and automated evaluation with RAGAS.
      ko: RAG 서비스 평가 체계 수립 및 RAGAS 기반 평가 자동화
  outcome:
    - en: Automated answers for 18 customer scenarios previously handled one by one by agents, and handed the service over to operations for online and offline stores.
      ko: 상담원이 개별 대응하던 문의를 18개 시나리오 자동 답변으로 전환, 온·오프라인 매장 운영 이관 완료
    - en: Halved average response time from 10 s to 5 s between versions 2 and 3.
      ko: 2차에서 3차 버전으로 평균 응답 시간을 10초에서 5초로 단축
    - en: Cut LLM call cost by 50% by serving frequent questions with pre-defined answers.
      ko: 자주 묻는 질문을 Pre-defined 답변으로 처리해 LLM 호출 비용 50% 절감
  decisions:
    - title:
        en: A modular platform, not a single chatbot
        ko: 단일 챗봇이 아닌 모듈 기반 플랫폼
      rationale:
        en: Modules are reused when channels or features are added, and an admin page lets the operations team take over.
        ko: 채널·기능 확장 시 모듈을 재사용하고 Admin 페이지로 운영 이관 가능
      tradeoff:
        en: Slower initial MVP delivery.
        ko: MVP 초기 속도 저하
    - title:
        en: Entity mapping and pseudo queries instead of direct Text-to-SQL
        ko: 직접 Text-to-SQL 대신 엔티티 매핑과 Pseudo Query
      rationale:
        en: Extracted entities are mapped to codes and a predefined view schema, so queries can be validated and stay secure.
        ko: 추출한 엔티티를 코드와 View 스키마로 치환해 쿼리 검증과 보안 확보
      tradeoff:
        en: Mapping tables must be maintained for each new query type.
        ko: 신규 질의 유형마다 매핑 테이블 관리 필요
    - title:
        en: Pre-defined answers that bypass the LLM
        ko: LLM을 거치지 않는 Pre-defined 답변
      rationale:
        en: Greetings, FAQs, and policy-restricted answers come from a table, cutting cost and latency.
        ko: 인사, FAQ, 정책상 제한 답변을 테이블로 처리해 비용과 지연 절감
      tradeoff:
        en: Less flexible answers and a table to maintain.
        ko: 답변 유연성 감소, 테이블 유지 부담
  architecture:
    layers:
      - id: channels
        label: { en: Channels, ko: 채널 }
        nodes:
          - { en: Offline stores, ko: 오프라인 매장 }
          - { en: Online stores, ko: 온라인몰 }
          - { en: Agent console, ko: 상담원 콘솔 }
      - id: gateway
        label: { en: API gateway, ko: API 게이트웨이 }
        nodes:
          - { en: Channel-independent interface, ko: 채널 독립 인터페이스 }
      - id: orchestrator
        label: { en: Orchestrator, ko: 오케스트레이터 }
        nodes:
          - { en: Query rewrite, ko: 질의 재작성 }
          - { en: Intent triage, ko: 의도 분류 }
          - { en: "Entity extraction, code mapping, and pseudo query", ko: "엔티티 추출, 코드 매핑, Pseudo Query" }
          - { en: "Pre-defined answers and guardrails", ko: "Pre-defined 답변, 가드레일" }
          - { en: "Merge and response layout", ko: "결과 병합, 답변 구성" }
      - id: retrieval
        label: { en: Retrieval and storage, ko: 검색·저장소 }
        nodes:
          - { en: Structured data (PostgreSQL), ko: 정형 데이터(PostgreSQL) }
          - { en: Unstructured data (Azure AI Search), ko: 비정형 데이터(Azure AI Search) }
          - { en: Web search, ko: 웹 검색 }
          - { en: "Logs and cache", ko: "로그, 캐시" }
      - id: llm
        label: { en: LLM, ko: LLM }
        nodes:
          - { en: Azure OpenAI, ko: Azure OpenAI }
      - id: admin
        label: { en: Admin, ko: Admin }
        nodes:
          - { en: "Logs, monitoring, permissions, and sensitive-data controls", ko: "로그, 모니터링, 권한, 민감정보 관리" }
    flows:
      - { from: channels, to: gateway }
      - { from: gateway, to: orchestrator }
      - { from: orchestrator, to: retrieval, label: { en: Parallel queries, ko: 병렬 조회 } }
      - { from: orchestrator, to: llm }
      - { from: admin, to: orchestrator }
---
