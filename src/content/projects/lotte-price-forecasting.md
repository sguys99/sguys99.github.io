---
title:
  en: Raw-Material Price Forecasting and Market Analysis Dashboard
  ko: 원자재 가격 예측 및 시황 분석 대시보드 구축
summary:
  en: Built a raw-material price forecasting model and market analysis dashboard to support purchasing decisions, as a PoC within the AI master plan engagement.
  ko: AI 프로젝트 마스터플랜 과제의 PoC로, 구매 의사결정을 지원하는 원자재 가격 예측 모델과 시황 분석 대시보드 구축
highlights:
  - en: Framed price forecasting as supervised regression over about 150 candidate attributes and compared Linear Regression, Random Forest, XGBoost, and LSTM against a rule-based benchmark.
    ko: 약 150개 후보 속성을 바탕으로 가격 예측을 지도학습 회귀 문제로 정의하고, Rule 기반 벤치마크 대비 Linear Regression, Random Forest, XGBoost, LSTM 비교
  - en: Cut forecast error (MAPE) from 5.9% with the rule-based method to 1.3%, with multi-horizon forecasts 1–4 weeks and 1–3 months ahead.
    ko: 예측 오차(MAPE)를 Rule 기반 5.9%에서 1.3%로 개선, 1~4주 및 1~3개월 후 다구간 예측 제공
  - en: Built a four-page dashboard (Upload, EDA, Training, Dashboard) with SHAP-based driver analysis, letting business users upload data and retrain models themselves.
    ko: SHAP 기반 영향 요인 분석을 포함한 4페이지 대시보드(Upload, EDA, Training, Dashboard)를 개발해 현업이 직접 데이터를 올리고 재학습하는 체계 구축
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
---
