---
title:
  en: AI Assistant for Customer Service
  ko: 온라인 상담 지원 및 제품 추천 어시스턴트 개발
summary:
  en: Led development of an assistant that uses an agent and RAG to support online customer consultations and recommend products.
  ko: 에이전트와 RAG로 온라인 고객 상담을 지원하고 제품을 추천하는 어시스턴트 개발 총괄
highlights:
  - en: Led the project, designed the service architecture and agent/RAG workflows, and deployed and ran the service on Azure.
    ko: 프로젝트를 총괄하고 서비스 아키텍처와 에이전트/RAG 워크플로우를 설계해 Azure에 서비스를 배포하고 운영
  - en: Defined an evaluation framework for the RAG service and wrote a program to automate the checks.
    ko: RAG 서비스의 평가 체계를 정하고 검사를 자동화하는 프로그램 개발
period: { start: 2024-12, end: 2025-02 }
org: { en: PwC Consulting, ko: PwC 컨설팅 }
client:
  public: true
  name: { en: Samsung Electronics, ko: 삼성전자 }
lead: true
domain: Manufacturing
capability: [LLM Agents & RAG]
stack: [Microsoft Azure, Azure AI Search, Python, LangChain, Ragas]
featured: true
order: 5
caseStudy:
  context:
    - en: Samsung Electronics wanted an assistant to give customers consistent answers in stores, in its online store, and through consultation agents.
      ko: 삼성전자는 오프라인 매장, 온라인몰, 상담원 채널에서 고객 문의에 일관되게 답하는 어시스턴트를 요청
  problem:
    - en: Customers researched reviews and prices on external sites and came to Samsung channels only to buy.
      ko: 고객은 외부 사이트에서 사용기와 가격을 확인한 뒤 구매할 때만 자사 채널 방문
    - en: Staff could not answer questions about product comparisons or promotions on the spot. Customers dropped out while waiting for phone transfers about deliveries or repairs, costing sales opportunities.
      ko: 직원이 제품 비교나 프로모션 문의에 즉답하지 못하고 배송이나 고장 문의 고객도 전화 연결이 늦어 이탈하면서 매출 기회 감소
    - en: Customers had to find a different contact at each stage of the customer journey, including product discovery and repeat purchases.
      ko: 제품 인지, 재구매 등 고객 여정의 단계마다 다른 담당자에게 문의
  role:
    - en: Led a project team of about 30 and directed the architecture design and core module development.
      ko: 약 30명 규모의 프로젝트를 총괄하고 아키텍처 설계와 핵심 모듈 개발 주도
    - en: Defined the platform architecture, 18 response scenarios, the data model, and admin requirements. Built the orchestrator pipeline, predefined answer and guardrail modules, and prompt templates.
      ko: 플랫폼 아키텍처, 18개 응대 시나리오, 데이터 모델, 관리자 요구사항을 정의하고 오케스트레이터 파이프라인, Predefined 답변과 가드레일 모듈, 프롬프트 템플릿을 직접 개발
  approach:
    - en: Built a channel-independent platform behind an API gateway, so new channels and features reuse the same modules.
      ko: API 게이트웨이 뒤에 채널 독립형 플랫폼을 두고 채널이나 기능을 추가할 때 같은 모듈을 재사용하도록 설계
    - en: Evolved the architecture over three versions, from a single-pipeline MVP to separate structured and unstructured retrieval with reranking and guardrails, then to parallel execution.
      ko: 단일 파이프라인 MVP로 시작해 정형 조회와 비정형 조회를 분리하고 재순위화와 가드레일을 추가한 뒤 3차 버전에서 병렬 처리 도입
    - en: Split queries into sub-queries in the final version, ran structured, unstructured, and web searches in parallel, and routed simple and informative questions separately.
      ko: 최종 버전에서 질의를 하위 질의로 분해해 정형, 비정형, 웹 검색을 병렬로 실행하고 질문을 단순형과 정보형으로 나눠 처리
    - en: Established an evaluation framework for the RAG service and automated evaluation with Ragas.
      ko: RAG 서비스 평가 체계를 세우고 Ragas로 평가 자동화
  outcome:
    - en: Automated answers for 18 customer scenarios previously handled one by one by agents, and handed the service over to operations for online and offline stores.
      ko: 상담원이 일일이 답하던 고객 문의를 18개 시나리오로 나눠 답변을 자동화하고 온라인과 오프라인 매장 운영팀에 서비스 이관
    - en: Halved average response time from 10 s to 5 s between versions 2 and 3.
      ko: 2차에서 3차 버전으로 평균 응답 시간을 10초에서 5초로 단축
    - en: Cut LLM call cost by 50% by serving frequent questions with predefined answers.
      ko: 자주 묻는 질문을 Predefined 답변으로 처리해 LLM 호출 비용 50% 절감
  decisions:
    - title:
        en: A modular platform shared across channels
        ko: 여러 채널이 함께 쓰는 모듈형 플랫폼
      rationale:
        en: The team can reuse the modules as it adds channels or features and hand the service over to operations through an admin page.
        ko: 채널이나 기능을 추가할 때 같은 모듈을 재사용하고 관리자 페이지를 통해 운영팀에 서비스 이관 가능
      tradeoff:
        en: Slower initial MVP delivery.
        ko: 초기 MVP 납품 지연
    - title:
        en: Entity mapping and pseudo queries
        ko: 엔티티 매핑과 Pseudo Query
      rationale:
        en: Mapping extracted entities to codes and a predefined view schema lets the team validate queries and keep them secure without direct Text-to-SQL.
        ko: 추출한 엔티티를 코드와 사전에 정의한 View 스키마에 매핑해 직접 Text-to-SQL을 쓰지 않고 쿼리 검증과 보안 유지
      tradeoff:
        en: Mapping tables must be maintained for each new query type.
        ko: 신규 질의 유형마다 매핑 테이블 관리 필요
    - title:
        en: Predefined answers that bypass the LLM
        ko: LLM을 거치지 않는 Predefined 답변
      rationale:
        en: Greetings, FAQs, and policy-restricted answers come from a table, cutting cost and latency.
        ko: 인사, FAQ, 정책상 제한 답변을 테이블로 처리해 비용과 지연 절감
      tradeoff:
        en: Less flexible answers and a table to maintain.
        ko: 답변 유연성 감소, 테이블 유지 부담
---
