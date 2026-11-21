---
title:
  en: Agentic RAG Search Service for National Legal Information
  ko: Agentic RAG를 활용한 국가 법령정보 검색 서비스 개발
summary:
  en: Built an Agentic RAG service that searches national legal information through a hybrid-search knowledge base and MCP.
  ko: 하이브리드 검색 지식 베이스와 MCP로 국가 법령정보를 검색하는 Agentic RAG 서비스 개발
highlights:
  - en: Built a hybrid-search knowledge base (vector DB and BM25) and designed an MCP server to connect legal information sources.
    ko: 벡터 DB와 BM25 기반 하이브리드 검색 지식 베이스 구축, 법령정보 원천 연계용 MCP 서버 설계
  - en: Designed the search agent's scenarios and system prompts, and supported service deployment and performance evaluation.
    ko: 법령정보 검색 에이전트의 시나리오·시스템 프롬프트 설계, 서비스 배포 및 성능 평가 지원
period: { start: 2026-03, end: 2026-06 }
domain: Public & Legal
capability: [LLM Agents & RAG]
stack: [Claude Sonnet 4.6, Qwen3-Embedding-8B, Seahorse, GitHub MCP, FastMCP]
featured: true
order: 3
caseStudy:
  context:
    - en: Built legalQ, a public beta service where anyone can ask about Korean law in everyday language and get the relevant articles, such as whether an act is illegal or what the fine is, with sources.
      ko: 일반인이 일상어로 질문하면 관련 법 조항과 위법 여부, 범칙금 등을 근거와 함께 찾아 주는 대국민 법령 검색 서비스 legalQ(리걸큐) 개발 (베타 공개)
    - en: Drew on legalize-kr, an open repository of about 3,046 Korean statutes as Markdown files with Git history, and a Seahorse vector DB loaded from the same files.
      ko: 법령 약 3,046개를 Markdown 파일과 Git 이력으로 정리한 공개 저장소 legalize-kr와, 같은 파일을 적재한 Seahorse 벡터 DB 활용
  problem:
    - en: People ask in everyday words, such as "I bought something from overseas; how is it taxed?", not in legal terms, and the answer often spans several articles, related statutes, and enforcement decrees and rules.
      ko: '"해외직구 세금이 어떻게 되나요?"처럼 법률 용어가 아닌 일상어로 묻고, 답은 여러 조문과 관련 법령, 시행령·시행규칙에 걸쳐 있음'
    - en: A non-agentic workflow that queried the vector DB once could not handle compound or everyday questions, and the vector DB held no revision history for questions about when a statute changed.
      ko: 벡터 DB를 한 번 조회하는 non-agentic 워크플로우로는 복합 질의와 일상어 질의에 답하기 어려웠고, 개정 시점을 묻는 질문은 벡터 DB에 이력 자체가 없음
    - en: Answers had to quote articles verbatim with their numbers and sources and reflect the latest amendments, since a paraphrased or outdated article misleads users.
      ko: 요약·의역하거나 개정 전 조문을 인용하면 이용자를 오도하므로, 조문번호와 출처를 붙여 최신 원문 그대로 인용해야 함
  role:
    - en: Worked as an ML engineer and designed the overall architecture, the vector DB, and the agent's system prompt, and deployed the service.
      ko: ML 엔지니어로 참여해 전체 아키텍처, 벡터 DB, 에이전트 시스템 프롬프트를 설계하고 서비스 배포 담당
    - en: Loaded the statutes into the vector DB by article and paragraph, and designed an MCP server that gives the agent deterministic access to the statute repository.
      ko: 법령을 조·항 단위로 벡터 DB에 적재하고, 에이전트가 법령 저장소에 결정론적으로 접근하는 MCP 서버 설계
  approach:
    - en: Connected two knowledge sources to one agent through MCP, using the vector DB to discover articles by meaning and the Markdown repository for exact current text, revision history, and statistics.
      ko: 두 지식원을 MCP로 하나의 에이전트에 연결해, 의미로 조문을 찾는 일은 벡터 DB, 정확한 현행 원문·개정 이력·통계는 Markdown 저장소가 맡도록 설계
    - en: Expanded the vector DB from 12 traffic and corporate statutes to all of about 3,046, and re-indexed it by article and paragraph with statute and article metadata for Dense and BM25 hybrid search.
      ko: 벡터 DB를 교통·기업 법령 12개에서 전체 약 3,046개로 확장하고, 법령·조문 메타데이터를 붙여 조·항 단위로 다시 적재해 Dense·BM25 하이브리드 검색에 사용
    - en: Wrote a system prompt that classifies each question into one of six intents and routes it to the vector DB, the statute file, its addenda, or file metadata, then re-checks the latest text when a question signals recency and falls back to keyword search when vector results miss.
      ko: 질문을 6가지 의도로 분류해 벡터 DB, 법령 파일, 부칙, 파일 메타데이터 중 경로를 고르고, 최신성 신호가 있으면 저장소 최신 원문으로 다시 확인하며 벡터 결과가 빗나가면 키워드 검색으로 전환하는 시스템 프롬프트 설계
    - en: Put the repository's folder layout, file naming rules, and writing conventions into the prompt, so the agent builds file paths and finds articles without searching.
      ko: 저장소의 폴더 구조, 파일명 규칙, 작성 규약을 프롬프트에 미리 넣어 에이전트가 검색 없이 파일 경로를 만들고 조문을 찾도록 함
  outcome:
    - en: Opened legalQ to the public as a beta that answers everyday legal questions with verbatim articles, sources, and a disclaimer.
      ko: 생활 법률 질문에 조문 원문, 출처, 면책 문구를 붙여 답하는 legalQ를 대국민 베타로 공개
    - en: Widened search coverage from 12 statutes in the first vector DB to all of about 3,046 in the repository.
      ko: 검색 범위를 첫 벡터 DB의 법령 12개에서 저장소 전체 약 3,046개로 확대
    - en: Refined the system prompt over six revisions, covering revision history, multi-turn follow-ups, identity protection, and rejecting personal data in input.
      ko: 개정 이력 조회, 멀티턴 후속 질문, 정체성 보호, 개인정보 입력 거절을 반영해 시스템 프롬프트를 6차에 걸쳐 개선
  decisions:
    - title:
        en: Two complementary sources, not one
        ko: 하나가 아닌 두 지식원의 상호 보완
      rationale:
        en: The vector DB finds articles from everyday words, and the repository supplies the exact current text, history, and statistics that the vector DB lacks.
        ko: 벡터 DB는 일상어로 조문을 찾고, 저장소는 벡터 DB에 없는 정확한 현행 원문·이력·통계를 제공
      tradeoff:
        en: Two sources to keep in sync and more routing rules.
        ko: 두 지식원의 동기화와 라우팅 규칙 관리 부담
    - title:
        en: Routing in one agent's prompt, not a multi-agent system
        ko: 멀티에이전트가 아닌 단일 에이전트 프롬프트 라우팅
      rationale:
        en: Multi-agent setups multiply token use, and one agent with intent rules answers simple questions in fewer calls.
        ko: 멀티에이전트는 토큰 사용량이 크게 늘고, 의도 규칙을 가진 단일 에이전트는 단순 질문을 적은 호출로 처리
      tradeoff:
        en: A long system prompt that grows with every rule.
        ko: 규칙이 늘수록 길어지는 시스템 프롬프트
    - title:
        en: A repository map inside the prompt
        ko: 프롬프트에 넣은 저장소 지도
      rationale:
        en: The agent builds the file path and finds the article heading directly, skipping search calls.
        ko: 검색 호출 없이 파일 경로를 만들고 조문 제목을 바로 찾음
      tradeoff:
        en: The prompt must change when the repository layout changes.
        ko: 저장소 구조가 바뀌면 프롬프트도 고쳐야 함
    - title:
        en: Article-level chunks
        ko: 조·항 단위 청크
      rationale:
        en: Default 1,000-character chunks split or merged articles and forced extra adjacent-chunk calls, while one row per article answers citation queries in one hit.
        ko: 기본 1,000자 청크는 조문을 자르거나 묶어 인접 청크 호출이 늘었고, 조문 단위 행은 인용 질의를 한 번에 회수
      tradeoff:
        en: A custom parser and re-indexing whenever statutes change.
        ko: 자체 파서 유지와 법령 개정 때마다 재적재 필요
  compare:
    title: { en: Two knowledge sources, ko: 두 지식원 비교 }
    options:
      - name: { en: Vector DB · Seahorse, ko: 벡터 DB · Seahorse }
      - name: { en: Repository · legalize-kr, ko: 법령 저장소 · legalize-kr }
    rows:
      - label: { en: Role in the agent, ko: 에이전트 안 역할 }
        values:
          - { en: 'Discover: find where the article is by meaning', ko: '발견: 의미로 조문 위치 찾기' }
          - { en: 'Verify: exact current text, history, statistics', ko: '검증: 정확한 현행 원문·이력·통계' }
      - label: { en: Search, ko: 검색 방식 }
        values:
          - { en: Dense·BM25 hybrid, ko: Dense·BM25 하이브리드 }
          - { en: 'Keyword search, file by path', ko: '키워드 검색, 경로로 파일 조회' }
      - label: { en: Everyday words, ko: 일상어 질문 }
        values:
          - { en: Strong, ko: 강함 }
          - { en: 'Weak, needs legal terms', ko: '약함, 법률 용어 필요' }
      - label: { en: Context cost, ko: 컨텍스트 효율 }
        values:
          - { en: Only the matching chunks, ko: 관련 청크만 }
          - { en: 'Whole file; large statutes read in parts', ko: '파일 전체, 큰 법령은 부분 조회' }
      - label: { en: Revision history, ko: 개정 이력·과거 원문 }
        values:
          - { en: 'None, current text only', ko: '없음, 현행만' }
          - { en: From Git commits, ko: Git 커밋으로 조회 }
      - label: { en: Freshness, ko: 최신성 }
        values:
          - { en: 'Periodic re-index, may lag', ko: '주기적 재적재, 시차 있음' }
          - { en: Latest commit, ko: 저장소 최신 커밋 }
      - label: { en: Build cost, ko: 구축 비용 }
        values:
          - { en: 'High: chunk, embed, load', ko: '높음: 청킹·임베딩·적재' }
          - { en: 'Low: connect the repository', ko: '낮음: 저장소 연결' }
    verdict:
      en: 'Not one or the other: the agent finds with the vector DB and confirms with the repository.'
      ko: '둘 중 하나가 아니라 둘 다: 에이전트는 벡터 DB로 찾고 저장소로 확인한다.'
  screens:
    slices:
      - image: ../../assets/legalq/answer-top.webp
        alt:
          en: 'Top of a legalQ answer on a phone to "I was suddenly told I am fired; can I get relief for unfair dismissal?": the statute header and Article 23 of the Labor Standards Act'
          ko: '"회사에서 갑자기 해고 통보를 받았는데 부당해고로 구제받을 방법이 있을까요?"에 대한 legalQ 모바일 답변 앞부분: 대상 법령 정보와 근로기준법 제23조'
        notes:
          - at: 32
            title: { en: Statute header, ko: 대상 법령 }
            body:
              en: Name, ministry, promulgation and effective dates, and a source link, taken from the file frontmatter.
              ko: 법령명, 소관부처, 공포·시행일, 출처 링크. 법령 파일의 frontmatter에서 가져옴
          - at: 72
            title: { en: Verbatim articles, ko: 조문 원문 인용 }
            body:
              en: Article and paragraph numbers kept as written, with no summary or paraphrase.
              ko: 조·항 번호를 그대로 두고 요약·의역 없이 인용
      - image: ../../assets/legalq/answer-end.webp
        alt:
          en: 'End of the same answer: a table of relief steps with deadlines, a note on scope, and the disclaimer'
          ko: '같은 답변의 끝부분: 기한을 정리한 구제 절차 표, 적용 범위 주의, 면책 문구'
        notes:
          - at: 28
            title: { en: Procedure table, ko: 절차 요약 표 }
            body:
              en: The deadlines in the quoted articles, step by step.
              ko: 인용한 조문의 기한을 단계별로 정리
          - at: 80
            title: { en: Scope note and disclaimer, ko: 주의·면책 }
            body:
              en: Ends with a scope caveat, a disclaimer, and a link to the National Law Information Center.
              ko: 적용 범위 주의와 면책 문구, 국가법령정보센터 링크로 마감
    gap: { en: 'Articles 26, 27, 28, 30, 31, and 33 omitted', ko: 제26·27·28·30·31·33조 인용 생략 }
    caption: { en: 'legalQ live service, captured Nov 21, 2026', ko: 'legalQ 실서비스 화면, 2026-11-21 캡처' }
    url: https://legalq.dnotitia.ai/
---
