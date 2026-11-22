---
title:
  en: Green-Material Inventory Blend Optimization
  ko: 그린소재 재고 조합 최적화
summary:
  en: Built an ML viscosity prediction model and a blend-search algorithm to recommend green-material mix plans in about 10 seconds as part of an AI master plan PoC.
  ko: AI 마스터플랜 PoC로 ML 점도 예측 모델과 조합 탐색 알고리즘을 개발해 약 10초 만에 그린소재 믹싱 계획 추천
highlights:
  - en: Delivered one of three PoCs selected under the company-wide AI master plan, alongside raw-material price forecasting and an LLM-based service platform.
    ko: 전사 AI 마스터플랜에서 선정한 PoC 3건 중 1건을 맡아 원자재 가격 예측, LLM 기반 서비스 플랫폼과 병행
  - en: Cut viscosity prediction error from 6.5% to 3.4% MAPE with a Random Forest model trained on 2018–2023 mixing records.
    ko: 2018–2023년 믹싱 실적으로 학습한 Random Forest 모델로 점도 예측 오차(MAPE)를 6.5%에서 3.4%로 감소
  - en: Cut blend planning time from about 20 minutes by hand to about 10 seconds with automation and found combinations for 18 of 20 simulated plans.
    ko: 수작업으로 약 20분 걸리던 믹싱 계획을 자동화해 약 10초로 단축하고 모의시험 20건 중 18건에서 조합 산출
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
      ko: 롯데정밀화학은 믹싱 계획에서 사용할 그린소재 반제품 재고와 투입량을 정한 뒤 첨가제를 섞어 등급별 완제품 생산
    - en: The company selected this PoC as one of three under its company-wide AI master plan to improve finished-product quality and reduce the work of planning blends.
      ko: 전사 AI 마스터플랜에서 선정한 PoC 3건 중 하나로 완제품 품질을 높이고 믹싱 계획에 드는 수고를 줄이는 것이 목표
  problem:
    - en: Planners needed at least 10 minutes to estimate finished-product viscosity with a lab-built viscosity map that required costly experiments and missed plant operating conditions.
      ko: 점도맵 제작에 드는 실험 비용이 크고 점도맵에 설비 운영 조건도 반영되지 않았으며 완제품 점도 추정 1건에 10분 이상 소요
    - en: Planners spent about 20 minutes on each mix plan by hand, relying on trial and error, a few experts, and mixing rules that were neither written down nor standardized.
      ko: 현업이 시행착오를 거쳐 수작업으로 믹싱 계획을 짜는 데 건당 약 20분이 걸렸고 소수 전문가와 문서화나 표준화를 거치지 않은 믹싱 규칙에 의존
    - en: An earlier system for automating mix planning with a solver took at least 300 seconds per run, ignored the planners' mixing rules, and often failed. The team could not maintain it because the solver was closed.
      ko: 이전 솔버 기반 자동화는 현업의 믹싱 규칙을 반영하지 못했고 연산 한 번에 300초 이상 걸리며 실패도 잦은 데다 내부 구현이 비공개라 유지보수 불가
  role:
    - en: Led the PoC as project manager in a two-person team with a data scientist, reporting to the client's AI task force.
      ko: 데이터 사이언티스트와 2인 팀에서 프로젝트 관리(PM)를 맡아 PoC를 총괄하고 고객사 AI TF에 보고
    - en: Built the viscosity prediction pipeline and the MixPlanner combination algorithm, then handed over the pilot and trained users.
      ko: 점도 예측 파이프라인과 MixPlanner 조합 알고리즘을 직접 개발한 뒤 파일럿 인수인계와 사용자 교육 진행
  approach:
    - en: Used about 180,000 raw rows to build a regression dataset of about 22,000 mixing records from 2018–2023 for viscosity prediction. Targeted a MAPE of 5% or less and predictions within one second.
      ko: 원시 데이터 약 18만 행을 2018–2023년 믹싱 실적 약 2.2만 건으로 정리해 점도 예측을 회귀 문제로 정의하고 MAPE 5% 이내, 예측 시간 1초 이내를 목표로 설정
    - en: Implemented preprocessing and modeling as reusable data and model pipelines, compared five models, and selected Random Forest.
      ko: 전처리와 모델링을 재사용할 수 있도록 데이터와 모델 파이프라인을 구현하고 모델 5종을 비교해 Random Forest 선정
    - en: Built MixPlanner, a Python package that applies planners' preferences and mixing rules to filter out unsuitable stock, rank candidates, and search near the best combination, rechecking viscosity until the plan meets spec.
      ko: 현업의 선호 설정과 믹싱 규칙을 담은 Python 패키지 MixPlanner로 부적정 재고를 제외하고 후보를 정렬한 뒤 최적 조합 부근을 탐색하며 기준을 만족할 때까지 점도 재검증
    - en: Tested the algorithm on 20 representative plans from 2023 records, checking output quantity, compliance with quality criteria, and run time.
      ko: 2023년 실적에서 대표 계획 20건을 뽑아 산출량, 품질 기준, 연산 시간을 검증
  outcome:
    - en: Cut viscosity prediction error from 6.5% to 3.4% MAPE versus the viscosity map, and prediction time from at least 10 minutes to about one second.
      ko: 점도 예측 오차를 점도맵 대비 MAPE 6.5%에서 3.4%로 줄이고 예측 시간을 10분 이상에서 약 1초로 단축
    - en: Generated mix plans in about 10 seconds instead of about 20 minutes by hand and found combinations for 18 of 20 simulated plans. Kept the calculated blends within 2% of recipe targets.
      ko: 수작업으로 약 20분 걸리던 믹싱 계획을 약 10초 만에 산출하고 조합의 레시피 기준 오차를 2% 이내로 유지했으며 모의시험 20건 중 18건에서 조합 도출
    - en: Completed a pilot linked to the operating databases and handed over the source code and training to the client's AI task force.
      ko: 운영 DB와 연계한 파일럿을 마치고 고객사 AI TF에 소스코드를 넘겨 교육 진행
  decisions:
    - title:
        en: Sorting and grid search instead of a commercial solver
        ko: 상용 솔버 대신 정렬 + 격자 탐색
      rationale:
        en: The team applied the planners' mixing rules, cut run time from at least 300 seconds to about 10 by searching the most promising combinations first, and gave the client access to the code for maintenance.
        ko: 유망한 조합 부근부터 탐색해 연산 시간을 300초 이상에서 약 10초로 줄이고 현업 믹싱 규칙을 반영한 코드를 고객사가 직접 유지보수할 수 있도록 제공
      tradeoff:
        en: Finds a good combination, not a proven optimum.
        ko: 최적해가 아닌 근사해 탐색
    - title:
        en: Training on plant operating records
        ko: 운영 실적을 활용한 모델 학습
      rationale:
        en: The team used about 22,000 plant records in place of about 50 lab mixes to reflect real operating conditions and include inputs such as re-fed material and additives.
        ko: 실험 약 50건 대신 운영 실적 약 2.2만 건을 써서 실제 운영 조건을 반영하고 재투입 원료와 첨가제 등도 입력에 포함
      tradeoff:
        en: The team needs to maintain the quality of its operating data for reliable predictions.
        ko: 예측 품질을 유지하려면 운영 데이터의 품질 관리 필요
---
