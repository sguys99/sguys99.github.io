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
---
