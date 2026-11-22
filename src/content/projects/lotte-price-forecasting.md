---
title:
  en: Raw-Material Price Forecasting and Market Dashboard
  ko: 원자재 가격 예측 및 시황 대시보드
summary:
  en: Built a raw-material price forecasting model and a market analysis dashboard to support purchasing decisions as part of an AI master plan PoC.
  ko: AI 마스터플랜의 PoC로 구매 의사결정을 돕는 원자재 가격 예측 모델과 시황 분석 대시보드 구축
highlights:
  - en: Framed price forecasting as supervised regression over about 150 candidate attributes and compared Linear Regression, Random Forest, XGBoost, and LSTM against a rule-based benchmark.
    ko: 후보 속성 약 150개로 가격 예측을 지도학습 회귀 문제로 정의하고 Linear Regression, Random Forest, XGBoost, LSTM을 규칙 기반 벤치마크와 비교
  - en: Cut forecast error (MAPE) from 5.9% with the rule-based method to 1.3%, with multi-horizon forecasts 1–4 weeks and 1–3 months ahead.
    ko: 기존 규칙을 썼을 때 5.9%였던 예측 오차(MAPE)를 1.3%로 줄이고 1–4주와 1–3개월 후 다구간 예측 제공
  - en: Built a four-page dashboard (Upload, EDA, Training, Dashboard) with SHAP-based driver analysis, letting business users upload data and retrain models themselves.
    ko: 현업이 직접 데이터를 올리고 모델을 재학습할 수 있도록 SHAP 영향 요인 분석을 담은 4페이지 대시보드(Upload, EDA, Training, Dashboard) 개발
period: { start: 2024-03, end: 2024-11 }
org: { en: PwC Consulting, ko: PwC 컨설팅 }
client:
  public: true
  name: { en: LOTTE Fine Chemical, ko: 롯데정밀화학 }
lead: true
domain: Petrochemical & Steel
capability: [Forecasting]
stack: [XGBoost, scikit-learn, SHAP, Streamlit]
featured: true
order: 7
caseStudy:
  context:
    - en: Built a model and dashboard to forecast the price of a key raw material that LOTTE Fine Chemical purchases, as a PoC within its AI master plan.
      ko: 롯데정밀화학 AI 마스터플랜 과제의 PoC로 주요 구매 원자재의 가격 예측 모델과 대시보드 구축
  problem:
    - en: Purchasing staff relied on their experience to review supplier quotes and had no objective benchmark for a fair price.
      ko: 구매 담당자는 적정 가격을 판단할 객관적 기준 없이 경험에 의존해 공급업체 견적 검토
    - en: The existing forecast used a few fixed variables and missed external drivers, trends, and recurring cycles such as seasonality.
      ko: 기존 예측은 몇 가지 고정 변수만 써서 외부 요인, 추세, 주기성을 누락
    - en: Purchasing costs rose because buyers had no forecast to guide inventory decisions such as stocking up before prices rose.
      ko: 가격 상승 전 선구매처럼 시황에 맞춰 재고를 조절할 예측 자료가 없어 구매 비용 증가
  role:
    - en: Led the work end to end in a team of three, framing the business need as an ML problem, designing experiments, and building the models, pipeline, and dashboard.
      ko: 3명으로 구성된 팀에서 과제 전반을 이끌고 현업 요구를 ML 문제로 정의해 실험을 설계하고 모델, 파이프라인, 대시보드 개발
  approach:
    - en: Set baselines first and agreed with the client on what counts as improvement. Targeted a MAPE of 10% or less for forecasts 1–4 weeks and 1–3 months ahead and compared them with the rule-based method.
      ko: 벤치마크를 먼저 확정하고 개선 기준을 고객과 합의. 1–4주와 1–3개월 후 예측의 MAPE 목표를 10% 이하로 정하고 규칙 기반 방식과 비교.
    - en: Reframed the time series as supervised regression with lag features, screening about 150 candidate attributes from sources with different update cycles.
      ko: lag 피처로 시계열을 지도학습 회귀 문제로 바꾸고 갱신 주기가 서로 다른 출처에서 후보 속성 약 150개를 검토해 선별
    - en: Ran independent experiments along seven axes, including feature selection, lags, direct vs. recursive forecasting, price vs. price-change targets, and models.
      ko: 피처 선별, lag, 직접/재귀 방식, 가격/가격 변화량 타깃, 모델 등 7개 실험 축을 하나씩 비교
    - en: Built a four-page dashboard where business users upload data, retrain models, and see SHAP-based drivers and Bollinger bands.
      ko: 현업이 데이터를 올리고 모델을 재학습하며 SHAP 영향 요인과 볼린저 밴드를 확인하는 4페이지 대시보드 개발
  outcome:
    - en: Cut forecast error (MAPE) from 5.9% with the rule-based method to 1.3%, well below the target ceiling of 10%.
      ko: 예측 오차(MAPE)를 기존 규칙의 5.9%에서 1.3%로 줄여 10% 이하 목표 달성
    - en: Moved from a single-point estimate to multi-horizon forecasts, 1–4 weeks and 1–3 months ahead.
      ko: 단일 시점에 그치던 예측을 1–4주와 1–3개월 후 다구간 예측으로 확장
    - en: Shifted retraining and deployment from data scientists to business users, and put the forecasting model to use in quote reviews.
      ko: 데이터 사이언티스트가 맡던 재학습과 배포를 현업에 넘기고 견적 검토에 예측 모델 도입
  decisions:
    - title:
        en: Supervised regression over deep sequence models
        ko: 시퀀스 딥러닝 대신 지도학습 회귀
      rationale:
        en: With a short history, tree ensembles on lag features were more stable than deep learning.
        ko: 데이터 기간이 짧아 lag 피처를 쓰는 트리 앙상블이 딥러닝보다 안정적
      tradeoff:
        en: The lag design limits which long-range dependencies the model can capture.
        ko: 모델이 포착할 수 있는 장기 의존성은 lag 설계에 따라 제한
    - title:
        en: Benchmark before models
        ko: 모델보다 벤치마크 먼저
      rationale:
        en: The team and the client agreed up front to measure improvement against persistence, a cotton-linter price rule, and linear regression.
        ko: 개선 여부를 판단할 기준으로 Persistence, 린터 가격 규칙, 선형 회귀를 쓰기로 고객과 사전에 합의
      tradeoff:
        en: Modeling started about two weeks later.
        ko: 모델링 착수 약 2주 지연
    - title:
        en: Seven independent experiment axes
        ko: 7개 실험 축 독립 비교
      rationale:
        en: Comparing one axis at a time instead of every combination showed why each part of the model configuration was chosen.
        ko: 조합 전체 대신 축을 하나씩 비교해 모델을 구성하는 요소별로 선택 근거를 설명 가능
      tradeoff:
        en: Testing one axis at a time left interactions between axes untested.
        ko: 축 간 상호작용 미탐색
---
