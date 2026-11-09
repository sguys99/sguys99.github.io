---
title:
  en: Raw-Material Price Forecasting and Market Analysis Dashboard
  ko: 원자재 가격 예측 및 시황 분석 대시보드 구축
summary:
  en: Built a raw-material price forecasting model and market analysis dashboard to support purchasing decisions, as a PoC within the AI master plan engagement.
  ko: 구매 의사결정 지원을 위한 원자재 가격 예측 모델과 시황 분석 대시보드 구축 (AI 마스터플랜 과제 PoC)
highlights:
  - en: Framed price forecasting as supervised regression over about 150 candidate attributes and compared Linear Regression, Random Forest, XGBoost, and LSTM against a rule-based benchmark.
    ko: 후보 속성 약 150개로 가격 예측을 지도학습 회귀 문제로 정의, 규칙 기반 벤치마크와 Linear Regression, Random Forest, XGBoost, LSTM 비교
  - en: Cut forecast error (MAPE) from 5.9% with the rule-based method to 1.3%, with multi-horizon forecasts 1–4 weeks and 1–3 months ahead.
    ko: 예측 오차(MAPE)를 규칙 기반 방식의 5.9%에서 1.3%로 감소, 1–4주·1–3개월 후 다구간 예측 제공
  - en: Built a four-page dashboard (Upload, EDA, Training, Dashboard) with SHAP-based driver analysis, letting business users upload data and retrain models themselves.
    ko: SHAP 기반 영향 요인 분석을 담은 4페이지 대시보드(Upload, EDA, Training, Dashboard) 개발, 현업이 직접 데이터를 올리고 모델을 재학습하는 환경 마련
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
order: 5
caseStudy:
  context:
    - en: As a PoC within the AI master plan for LOTTE Fine Chemical, built a price forecasting model and dashboard for a key purchased raw material.
      ko: 롯데정밀화학 AI 마스터플랜 과제의 PoC로 주요 구매 원자재의 가격 예측 모델과 대시보드 구축
  problem:
    - en: Purchase quotes were reviewed on experts' experience, with no objective benchmark for a fair price.
      ko: 가격 적정성을 판단할 객관적 기준 없이 현업 전문가의 경험에 의존한 견적 검토
    - en: The existing forecast used a few fixed variables and missed external drivers, trends, and seasonality.
      ko: 소수의 고정 변수만 사용해 외부 요인, 추세, 주기성을 반영하지 못한 기존 예측
    - en: Without a forecast, inventory could not flex with the market, such as buying ahead of price rises, which raised purchasing costs.
      ko: 가격 상승기 선구매 같은 시황 대응형 재고 운영이 어려워 구매 비용 손실 발생
  role:
    - en: In a team of three, led the work end to end, framing the business need as an ML problem, designing the experiments, and building the models, pipeline, and dashboard.
      ko: 3명 규모 팀에서 과제 리드, 현업 요구를 ML 문제로 정의하고 실험을 설계, 모델·파이프라인·대시보드 개발
  approach:
    - en: Set baselines first and agreed with the client on what counts as improvement — a MAPE target of 10% or less against the rule-based benchmark, forecasting 1–4 weeks and 1–3 months ahead.
      ko: 벤치마크를 먼저 확정하고 개선 기준을 고객과 합의, 규칙 기반 대비 MAPE 10% 이하, 1–4주·1–3개월 후 다구간 예측 목표
    - en: Reframed the time series as supervised regression with lag features, screening about 150 candidate attributes from sources with different update cycles.
      ko: 시계열을 lag 피처 기반 지도학습 회귀로 재구성, 갱신 주기가 다른 출처의 후보 속성 약 150개를 검토해 선별
    - en: Ran independent experiments along seven axes, including feature selection, lags, direct vs. recursive forecasting, price vs. price-change targets, and models.
      ko: 피처 선별, lag, Direct·Recursive 방식, 가격·가격 변화량 타깃, 모델 등 7개 축을 독립 실험으로 비교
    - en: Built a four-page dashboard where business users upload data, retrain models, and see SHAP-based drivers and Bollinger bands.
      ko: 현업이 데이터를 올리고 모델을 재학습하며 SHAP 영향 요인과 볼린저 밴드를 확인하는 4페이지 대시보드 개발
  outcome:
    - en: Cut forecast error (MAPE) from 5.9% with the rule-based method to 1.3%, well under the 10% target.
      ko: 예측 오차(MAPE)를 규칙 기반 방식의 5.9%에서 1.3%로 감소, 목표(10% 이하) 초과 달성
    - en: Moved from a single-point estimate to multi-horizon forecasts, 1–4 weeks and 1–3 months ahead.
      ko: 단일 시점 추정에서 1–4주·1–3개월 후 다구간 예측으로 확장
    - en: Shifted retraining and deployment from data scientists to business users, and brought the forecast into the quote review process.
      ko: 재학습과 배포 주체를 데이터 사이언티스트에서 현업으로 전환, 견적 검토 프로세스에 예측 모델 편입
  decisions:
    - title:
        en: Supervised regression over deep sequence models
        ko: 시퀀스 딥러닝 대신 지도학습 회귀
      rationale:
        en: With a short history, tree ensembles on lag features were more stable than deep learning.
        ko: 데이터 기간이 짧아 lag 피처 기반 트리 앙상블이 딥러닝보다 안정적
      tradeoff:
        en: Long-range dependencies depend on the lag design.
        ko: 장기 의존성 표현이 lag 설계에 종속
    - title:
        en: Benchmark before models
        ko: 모델보다 벤치마크 먼저
      rationale:
        en: Persistence and exponential smoothing baselines fixed the bar for improvement, agreed with the client up front.
        ko: Persistence·지수평활 모델로 최소 기준을 정해 개선의 기준선을 고객과 먼저 합의
      tradeoff:
        en: Modeling started about two weeks later.
        ko: 초기 2주 모델링 지연
    - title:
        en: Seven independent experiment axes
        ko: 7개 실험 축 독립 비교
      rationale:
        en: Comparing one axis at a time instead of every combination made each modeling choice explainable.
        ko: 조합 전체 대신 축별로 비교해 모델 조합 선택 근거를 설명 가능
      tradeoff:
        en: Interactions between axes were not explored.
        ko: 축 간 상호작용 미탐색
  architecture:
    layers:
      - id: sources
        label: { en: Data sources, ko: 데이터 출처 }
        nodes:
          - { en: About 150 external attributes, ko: 외부 속성 약 150개 }
          - { en: Manual uploads, ko: 수동 업로드 }
      - id: prep
        label: { en: Data pipeline, ko: 데이터 파이프라인 }
        nodes:
          - { en: "Resampling and interpolation", ko: "리샘플링, 보간" }
          - { en: Lag features (time series to supervised), ko: lag 피처(시계열의 지도학습 변환) }
      - id: models
        label: { en: Models, ko: 모델 }
        nodes:
          - { en: Linear Regression, ko: Linear Regression }
          - { en: Random Forest, ko: Random Forest }
          - { en: XGBoost, ko: XGBoost }
          - { en: LSTM, ko: LSTM }
      - id: eval
        label: { en: Evaluation, ko: 평가 }
        nodes:
          - { en: "MAE, RMSE, and MAPE", ko: "MAE, RMSE, MAPE" }
          - { en: Deploy or retrain, ko: 배포 또는 재학습 }
      - id: dashboard
        label: { en: Dashboard, ko: 대시보드 }
        nodes:
          - { en: Upload, ko: Upload }
          - { en: EDA, ko: EDA }
          - { en: Training, ko: Training }
          - { en: Forecasts with SHAP drivers, ko: SHAP 영향 요인과 예측 }
    flows:
      - { from: sources, to: prep }
      - { from: prep, to: models }
      - { from: models, to: eval }
      - { from: eval, to: dashboard }
      - { from: dashboard, to: prep, label: { en: New data and retraining, ko: "신규 데이터, 재학습" } }
---
