---
title:
  en: Green-Material Inventory Blend Optimization
  ko: 그린소재 재고 조합 최적화
summary:
  en: Built an ML viscosity model and a blend-search algorithm that recommends green-material mix plans in about 10 seconds, as a PoC within the AI master plan engagement.
  ko: ML 점도 예측 모델과 조합 탐색 알고리즘으로 그린소재 믹싱 계획을 약 10초 만에 추천하는 PoC 수행 (AI 마스터플랜 과제)
highlights:
  - en: Delivered one of three PoCs selected under the company-wide AI master plan, alongside raw-material price forecasting and an LLM-based service platform.
    ko: 전사 AI 마스터플랜 선정 PoC 3건 중 1건 수행 (원자재 가격 예측, LLM 기반 서비스 플랫폼과 병행)
  - en: Cut viscosity prediction error from 6.5% to 3.4% MAPE with a Random Forest model trained on 2018–2023 mixing records.
    ko: 2018–2023년 믹싱 실적으로 학습한 Random Forest 모델로 점도 예측 오차(MAPE)를 6.5%에서 3.4%로 감소
  - en: Automated blend planning from about 20 minutes by hand to about 10 seconds, with 18 of 20 simulated plans succeeding.
    ko: 수작업 약 20분이 걸리던 믹싱 계획을 약 10초로 자동화, 모의시험 20건 중 18건 조합 산출 성공
period: { start: 2024-03, end: 2024-09 }
org: { en: PwC Consulting, ko: PwC 컨설팅 }
client:
  public: true
  name: { en: LOTTE Fine Chemical, ko: 롯데정밀화학 }
lead: true
domain: Petrochemical & Steel
capability: [Control & Optimization]
stack: [Python, Random Forest, XGBoost]
featured: true
order: 8
caseStudy:
  context:
    - en: LOTTE Fine Chemical blends semi-finished green-material lots and additives into finished grades, following a mix plan that sets which inventory to use and how much.
      ko: 롯데정밀화학은 믹싱 계획에 따라 그린소재 반제품 재고와 첨가제를 섞어 완제품을 생산하며, 계획 단계에서 사용할 재고와 투입량을 정함
    - en: The PoC was one of three selected under the company-wide AI master plan, aiming to improve finished-product quality and cut planning effort.
      ko: 전사 AI 마스터플랜에서 선정된 PoC 3건 중 하나로, 완제품 품질 개선과 계획 업무 효율화가 목표
  problem:
    - en: Planners estimated finished-product viscosity from a lab-built viscosity map, which needed costly experiments, missed plant conditions, and took over 10 minutes per estimate.
      ko: 실험으로 만든 점도맵으로 완제품 점도를 추정해 실험 비용이 들고 설비 운영 조건이 반영되지 않았으며, 추정 1건에 10분 이상 소요
    - en: Mix plans were built by hand through trial and error, about 20 minutes per plan, and depended on a few experts and unwritten mixing rules.
      ko: 믹싱 계획을 시행착오로 수작업 작성해 건당 약 20분이 걸렸고, 소수 전문가와 표준화되지 않은 믹싱 규칙에 의존
    - en: An earlier solver-based automation took over 300 seconds per run, ignored planners' mixing rules, often failed, and could not be maintained because the solver was closed.
      ko: 이전에 시도한 솔버 기반 자동화는 연산에 300초 이상 걸리고 현업의 믹싱 규칙을 반영하지 못했으며, 연산 실패가 잦고 내부 비공개로 유지보수 불가
  role:
    - en: Led the PoC as project manager in a two-person team with a data scientist, reporting to the client's AI task force.
      ko: 데이터 사이언티스트와 2인 팀으로 PoC를 PM으로 총괄, 고객사 AI TF 보고 담당
    - en: Built the viscosity prediction pipeline and the MixPlanner combination algorithm hands-on, then ran the pilot hand-over and user training.
      ko: 점도 예측 파이프라인과 MixPlanner 조합 알고리즘을 직접 개발하고, 파일럿 인수인계와 사용자 교육 진행
  approach:
    - en: Framed viscosity prediction as regression on about 22,000 mixing records from 2018–2023, built from about 180,000 raw rows, with a target of under 5% MAPE and one-second predictions.
      ko: 원시 데이터 약 18만 행에서 만든 2018–2023년 믹싱 실적 약 2.2만 건으로 점도 예측을 회귀 문제로 정의, 목표는 MAPE 5% 이내와 1초 이내 예측
    - en: Implemented preprocessing and modeling as reusable data and model pipelines, compared five models, and selected Random Forest.
      ko: 전처리와 모델링을 재사용 가능한 데이터·모델 파이프라인으로 구현하고, 모델 5종을 비교해 Random Forest 선정
    - en: Encoded planners' preferences and mixing rules into MixPlanner, a Python package that filters unfit stock, ranks candidates, and searches near the best combination, re-checking viscosity until the plan meets spec.
      ko: 현업의 선호 설정과 믹싱 규칙을 Python 패키지 MixPlanner로 구현, 부적정 재고를 제외하고 후보를 정렬한 뒤 최적 조합 부근을 탐색하며 점도 기준을 만족할 때까지 재검증
    - en: Validated the algorithm on 20 representative plans from 2023 records, checking quantity, quality, and run time.
      ko: 2023년 실적에서 대표 계획 20건을 뽑아 산출량, 품질 기준, 연산 시간을 검증
  outcome:
    - en: Cut viscosity prediction error from 6.5% to 3.4% MAPE versus the viscosity map, and prediction time from over 10 minutes to about one second.
      ko: 점도 예측 오차를 점도맵 대비 MAPE 6.5%에서 3.4%로, 예측 시간을 10분 이상에서 약 1초로 단축
    - en: Produced mix plans in about 10 seconds instead of 20 minutes by hand, within 2% of recipe targets, with 18 of 20 simulated plans succeeding.
      ko: 수작업 약 20분이던 믹싱 계획을 약 10초 만에 산출, 레시피 기준 오차 2% 이내, 모의시험 20건 중 18건 성공
    - en: Completed a pilot linked to the operating databases and handed over the source code and training to the client's AI task force.
      ko: 운영 DB와 연계한 파일럿을 마치고 소스코드와 교육을 고객사 AI TF에 인계
  decisions:
    - title:
        en: Sorting and grid search instead of a commercial solver
        ko: 상용 솔버 대신 정렬 + 격자 탐색
      rationale:
        en: Searching near the most promising combinations first cut run time from over 300 seconds to about 10, applied the planners' mixing rules, and kept the code open for the client to maintain.
        ko: 유망한 조합 부근부터 탐색해 연산 시간을 300초 이상에서 약 10초로 줄이고, 현업 믹싱 규칙을 반영하며 고객사가 직접 유지보수할 수 있는 코드 확보
      tradeoff:
        en: Finds a good combination, not a proven optimum.
        ko: 최적해가 아닌 근사해 탐색
    - title:
        en: Operating records instead of lab experiments
        ko: 실험 데이터 대신 운영 실적
      rationale:
        en: About 22,000 plant records replace about 50 lab mixes, reflect real operating conditions, and add inputs such as re-fed material and additives.
        ko: 실험 약 50건 대신 운영 실적 약 2.2만 건을 써서 실제 운영 조건을 반영하고 재투입, 첨가제 등 입력 확대
      tradeoff:
        en: Prediction quality depends on managing data quality.
        ko: 예측 품질이 데이터 품질 관리에 좌우됨
---
