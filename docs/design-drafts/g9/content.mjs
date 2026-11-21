// SCM 케이스 스터디 다이어그램 시안 콘텐츠 (2026-11-21).
// 기준: service_flow v0.2의 G-Matrix 2.0판 + 사이트 확정 모델(Qwen 8B 파인튜닝 2역할, Llama 3.1 70B) + 인프라 v0.1의 개발/운영 구조(사양 제외).
// kind: sllm = 파인튜닝 sLLM, llm = 생성 LLM, logic = 검색·DB·규칙.
const L = (en, ko) => ({ en, ko });

export const flow = {
  portal: L('Web and mobile portal', '웹·모바일 포털'),
  orch: {
    label: L('Orchestrator', '오케스트레이터'),
    steps: [
      { kind: 'llm', t: L('Query rewrite', '질의 재작성') },
      { kind: 'logic', t: L('Embedding', '임베딩') },
      { kind: 'llm', t: L('Router', '라우터') },
    ],
  },
  a2a: L('A2A', 'A2A'),
  agents: [
    {
      label: L('Data query', '데이터 조회'),
      steps: [
        { kind: 'llm', t: L('View identification', 'View 식별') },
        { kind: 'sllm', t: L('Entity extraction', '엔티티 추출') },
        { kind: 'logic', t: L('Code mapping', '코드 매핑') },
        { kind: 'sllm', t: L('Pseudo query', 'Pseudo Query') },
      ],
    },
    {
      label: L('Work support (AI Advisor)', '업무 지원(AI Advisor)'),
      steps: [
        { kind: 'logic', t: L('Retrieval', '검색'), sub: L('work-guide vector DB', '업무 가이드 벡터 DB') },
        { kind: 'logic', t: L('Reranking', '재순위화') },
        { kind: 'llm', t: L('Generation', '생성') },
      ],
    },
    {
      label: L('External information', '외부 정보 조회'),
      steps: [
        { kind: 'logic', t: L('Search', '검색'), sub: L('market data', '외부 시황 데이터') },
        { kind: 'logic', t: L('Post-processing', '후처리') },
        { kind: 'llm', t: L('Generation', '생성') },
      ],
    },
  ],
  layout: { kind: 'logic', t: L('Response layout', '답변 구성') },
  bi: {
    label: L('BI engine', 'BI 엔진'),
    steps: [
      { kind: 'logic', t: L('Query conversion', '쿼리 변환') },
      { kind: 'logic', t: L('Run query', '쿼리 실행'), sub: L('SCM database', 'SCM DB') },
      { kind: 'logic', t: L('Compute and chart', '연산·시각화') },
      { kind: 'logic', t: L('Build result', '결과 생성') },
    ],
  },
  legend: {
    sllm: L('Fine-tuned sLLM · Qwen 8B', '파인튜닝 sLLM · Qwen 8B'),
    llm: L('LLM · Llama 3.1 70B', 'LLM · Llama 3.1 70B'),
    logic: L('Search, database, rules', '검색·DB·규칙'),
  },
};

export const ops = {
  git: L('Git repository', 'Git 저장소'),
  auto: L('CI/CD, automatic', 'CI/CD 자동 배포'),
  pr: L('Reviewed pull request', 'PR 검토 후 반영'),
  envs: [
    { id: 'dev', label: L('Development', '개발계') },
    { id: 'prod', label: L('Production', '운영계') },
  ],
  app: L('Portal, BI engine, orchestrator, vector DB', '포털, BI 엔진, 오케스트레이터, 벡터 DB'),
  appT: L('Application', '애플리케이션'),
  infer: L('sLLM inference server', 'sLLM 추론 서버'),
  inferSub: L('vLLM · entity extraction, pseudo query', 'vLLM · 엔티티 추출, Pseudo Query'),
  shared: L('Shared by both environments', '두 환경 공용'),
  train: L('Training server', '학습 서버'),
  trainSub: L('fine-tunes Qwen 8B', 'Qwen 8B 파인튜닝'),
  gen: L('Generation LLM server', '생성 LLM 서버'),
  genSub: L('Llama 3.1 70B', 'Llama 3.1 70B'),
  weights: L('fine-tuned weights', '파인튜닝 모델'),
};

// 시안 C의 주석: 기존 caseStudy 문장(approach, decisions)에서 가져옴. 새 사실 없음.
export const notes = {
  sllm: L(
    'A prompted general-purpose LLM kept confusing entity codes, so a fine-tuned Qwen 8B handles extraction and the pseudo query.',
    '범용 LLM 프롬프트로는 엔티티 코드 혼동이 발생해 Qwen 8B를 파인튜닝해 추출과 Pseudo Query를 담당',
  ),
  bi: L(
    'The BI engine turns the pseudo query into SQL, so generated queries never hit the production database directly.',
    'BI 엔진이 Pseudo Query를 SQL로 변환해 생성된 쿼리가 운영 DB에 직접 닿지 않음',
  ),
};

export const ui = {
  figFlow: L('How a question is answered', '질문이 답변이 되기까지'),
  figOps: L('Models and deployment', '모델과 배포'),
  spot: L('Inside the data-query agent', '데이터 조회 에이전트 상세'),
  back: L('chart and answer back to the portal', '차트와 답변을 포털로'),
  scroll: L('Scroll sideways to see the whole diagram', '옆으로 밀어 전체 보기'),
};
