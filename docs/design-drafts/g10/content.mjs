// g10 시안 내용: 원자재 가격 예측 케이스 스터디 (2026-11-21).
// 출처: docs/project-references/price-forecasting/ 최종보고(6, 15–16, 25–35, 36–40장), 수행계획서(10장).
// ①② 스펙은 Diagram.astro 형식. 선택되면 pts를 d로 바꿔 src/content/diagrams/lotte-price-forecasting.yaml로 옮긴다.
import { L } from './lib.mjs';

// ---------- 공통 노드 ----------
const sources = (x, ys, w, h = 40) => [
  { id: 's1', kind: 'input', label: L('Raw-material prices', '원료 가격'), sub: L('cotton, linter, viscose', '면화·린터·비스코스'), x, y: ys[0], w, h },
  { id: 's2', kind: 'input', label: L('Cotton market', '면화 시장'), sub: L('USDA', '미국 농무부(USDA)'), x, y: ys[1], w, h },
  { id: 's3', kind: 'input', label: L('Macro indicators', '거시 지표'), sub: L('FRED: FX, SCFI, CPI', 'FRED: 환율·SCFI·물가'), x, y: ys[2], w, h },
  { id: 's4', kind: 'input', label: L('Climate', '기후'), sub: L('NASA'), x, y: ys[3], w, h },
];
const pages = (xs, y, w, h = 44) => [
  { id: 'up', kind: 'plain', label: L('Upload'), sub: L('data files', '데이터 파일'), x: xs[0], y, w, h },
  { id: 'eda', kind: 'plain', label: L('EDA'), sub: L('variable analysis', '변수 분석'), x: xs[1], y, w, h },
  { id: 'trn', kind: 'plain', label: L('Training'), sub: L('settings · retrain', '설정·재학습'), x: xs[2], y, w, h },
  { id: 'brd', kind: 'plain', label: L('Dashboard'), sub: L('forecast · SHAP', '예측·SHAP'), x: xs[3], y, w, h },
];
const srcZone = (h) => ({ id: 'src', label: L('~150 attributes', '속성 약 150개'), x: 0, y: 0, w: 152, h });

// ---------- ① Architecture ----------
const archLegend = [
  { kind: 'sllm', label: L('Forecast model', '예측 모델') },
  { kind: 'llm', label: L('Pipeline step', '파이프라인 단계') },
  { kind: 'logic', label: L('Evaluation', '평가') },
  { kind: 'plain', label: L('Dashboard page', '대시보드 페이지') },
  { kind: 'input', label: L('External data', '외부 데이터') },
];

// A. 두 구역: 위 학습 파이프라인(왼→오, 평가에서 꺾여 돌아옴), 아래 현업 대시보드 4페이지. 열을 맞춘 격자.
const archA = {
  width: 720,
  height: 364,
  zones: [
    srcZone(232),
    { id: 'pipe', label: L('Training pipeline', '학습 파이프라인'), x: 176, y: 0, w: 544, h: 176 },
    { id: 'dash', label: L('Dashboard for business users', '현업용 대시보드'), x: 176, y: 212, w: 544, h: 104 },
  ],
  nodes: [
    ...sources(8, [36, 84, 132, 180], 136),
    { id: 'build', kind: 'llm', label: L('Build dataset', '데이터셋 생성'), sub: L('merge · resample', '병합·리샘플링'), x: 188, y: 40, w: 112, h: 44 },
    { id: 'lag', kind: 'llm', label: L('Lag features', 'lag 피처'), sub: L('X(t−2…t)→y(t+1…3)'), x: 324, y: 40, w: 112, h: 44 },
    { id: 'prep', kind: 'llm', label: L('Preprocess', '전처리'), sub: L('interpolate · scale', '보간·스케일링'), x: 460, y: 40, w: 112, h: 44 },
    { id: 'model', kind: 'sllm', label: L('Forecast model', '예측 모델'), sub: L('XGBoost · RF · LR'), x: 596, y: 40, w: 112, h: 44 },
    { id: 'eval', kind: 'logic', label: L('Evaluate', '성능 평가'), sub: L('MAE · RMSE · MAPE'), x: 596, y: 120, w: 112, h: 44 },
    { id: 'gate', kind: 'logic', label: L('Meets target?', '목표 충족?'), sub: L('MAPE ≤ 10%', 'MAPE 10% 이하'), x: 460, y: 120, w: 112, h: 44 },
    ...pages([188, 324, 460, 596], 248, 112),
  ],
  edges: [
    { from: 'src', to: 'build', pts: [[152, 62], [188, 62]] },
    { from: 'build', to: 'lag', pts: [[300, 62], [324, 62]] },
    { from: 'lag', to: 'prep', pts: [[436, 62], [460, 62]] },
    { from: 'prep', to: 'model', pts: [[572, 62], [596, 62]] },
    { from: 'model', to: 'eval', pts: [[652, 84], [652, 120]] },
    { from: 'eval', to: 'gate', pts: [[596, 142], [572, 142]] },
    { from: 'gate', to: 'build', style: 'back', pts: [[460, 142], [272, 142], [272, 84]], label: { text: L('NO · RETRAIN', '미달 · 재학습'), x: 368, y: 132 } },
    { from: 'gate', to: 'brd', pts: [[516, 164], [516, 200], [652, 200], [652, 248]], label: { text: L('YES · DEPLOY', '충족 · 배포'), x: 584, y: 190 } },
    { from: 'up', to: 'build', pts: [[188, 270], [164, 270], [164, 74], [188, 74]] },
    { from: 'up', to: 'eda', pts: [[300, 270], [324, 270]] },
    { from: 'eda', to: 'trn', pts: [[436, 270], [460, 270]] },
    { from: 'trn', to: 'brd', pts: [[572, 270], [596, 270]] },
  ],
};

// B. 순환: 업로드 → 데이터셋 → lag → 학습 → 평가 → 예측 대시보드 → 신규 데이터로 다시 업로드. 미달이면 가운데로 재학습.
const archB = {
  width: 720,
  height: 300,
  zones: [srcZone(232), { id: 'loop', label: L('Retraining cycle', '재학습 순환'), x: 176, y: 0, w: 544, h: 256 }],
  nodes: [
    ...sources(8, [36, 84, 132, 180], 136),
    { id: 'up', kind: 'plain', label: L('Upload data', '데이터 업로드'), sub: L('Upload page', 'Upload 페이지'), x: 192, y: 40, w: 144, h: 48 },
    { id: 'build', kind: 'llm', label: L('Build dataset', '데이터셋 생성'), sub: L('merge · resample W/M', '병합·주/월 리샘플링'), x: 380, y: 40, w: 144, h: 48 },
    { id: 'lag', kind: 'llm', label: L('Lag features', 'lag 피처 변환'), sub: L('X(t−2…t) → y(t+1…3)'), x: 568, y: 40, w: 144, h: 48 },
    { id: 'model', kind: 'sllm', label: L('Train model', '모델 학습'), sub: L('XGBoost · RF · LR'), x: 568, y: 184, w: 144, h: 48 },
    { id: 'eval', kind: 'logic', label: L('Evaluate', '성능 평가'), sub: L('MAPE ≤ 10%?', 'MAPE 10% 이하?'), x: 380, y: 184, w: 144, h: 48 },
    { id: 'brd', kind: 'plain', label: L('Forecasts', '예측 대시보드'), sub: L('SHAP · Bollinger bands', 'SHAP·볼린저 밴드'), x: 192, y: 184, w: 144, h: 48 },
  ],
  edges: [
    { from: 'src', to: 'up', pts: [[152, 64], [192, 64]] },
    { from: 'up', to: 'build', pts: [[336, 64], [380, 64]] },
    { from: 'build', to: 'lag', pts: [[524, 64], [568, 64]] },
    { from: 'lag', to: 'model', pts: [[640, 88], [640, 184]] },
    { from: 'model', to: 'eval', pts: [[568, 208], [524, 208]] },
    { from: 'eval', to: 'brd', pts: [[380, 208], [336, 208]], label: { text: L('DEPLOY', '배포'), x: 358, y: 198 } },
    { from: 'eval', to: 'build', style: 'back', pts: [[452, 184], [452, 88]], label: { text: L('NO · RETRAIN', '미달 · 재학습'), x: 464, y: 140, anchor: 'start' } },
    { from: 'brd', to: 'up', style: 'back', pts: [[264, 184], [264, 88]], label: { text: L('NEW DATA', '신규 데이터'), x: 276, y: 140, anchor: 'start' } },
  ],
};

// C. 계층 띠(위→아래): 출처 → 파이프라인 → 모델 → 평가 → 대시보드. 띠 사이 화살표는 왼쪽 이름 열, 재학습은 오른쪽 바깥 점선.
const band = (id, label, y) => ({ id, label, x: 0, y, w: 680, h: 56, mid: true });
const c3 = [120, 312, 504];
const archC = {
  width: 720,
  height: 436,
  zones: [
    band('z1', L('Data sources', '데이터 출처'), 0),
    band('z2', L('Pipeline', '파이프라인'), 84),
    band('z3', L('Models', '모델'), 168),
    band('z4', L('Evaluation', '평가'), 252),
    band('z5', L('Dashboard', '대시보드'), 336),
  ],
  nodes: [
    { ...sources(0, [8, 8, 8, 8], 0)[0], x: 120, w: 156 },
    { ...sources(0, [8, 8, 8, 8], 0)[1], x: 288, w: 116 },
    { ...sources(0, [8, 8, 8, 8], 0)[2], x: 416, w: 116 },
    { ...sources(0, [8, 8, 8, 8], 0)[3], x: 544, w: 116 },
    { id: 'build', kind: 'logic', label: L('Build dataset', '데이터셋 생성'), sub: L('merge · resample W/M', '병합·주/월 리샘플링'), x: c3[0], y: 92, w: 164, h: 40 },
    { id: 'lag', kind: 'logic', label: L('Lag features', 'lag 피처 변환'), sub: L('X(t−2…t) → y(t+1…3)'), x: c3[1], y: 92, w: 164, h: 40 },
    { id: 'prep', kind: 'logic', label: L('Preprocess', '전처리'), sub: L('interpolate · scale · Δ', '보간·스케일링·변화량'), x: c3[2], y: 92, w: 164, h: 40 },
    { id: 'lr', kind: 'llm', label: L('Linear Regression'), sub: L('MAPE 13.3%'), x: c3[0], y: 176, w: 164, h: 40 },
    { id: 'rf', kind: 'llm', label: L('Random Forest'), sub: L('MAPE 2.5%'), x: c3[1], y: 176, w: 164, h: 40 },
    { id: 'xgb', kind: 'sllm', label: L('XGBoost'), sub: L('MAPE 1.3% · final', 'MAPE 1.3% · 최종'), x: c3[2], y: 176, w: 164, h: 40 },
    { id: 'met', kind: 'logic', label: L('Error metrics', '오차 지표'), sub: L('MAE · RMSE · MAPE'), x: c3[0], y: 260, w: 164, h: 40 },
    { id: 'bench', kind: 'logic', label: L('vs. benchmark', '벤치마크 비교'), sub: L('persistence 5.9%', 'Persistence 5.9%'), x: c3[1], y: 260, w: 164, h: 40 },
    { id: 'gate', kind: 'logic', label: L('Meets target?', '목표 충족?'), sub: L('MAPE ≤ 10%', 'MAPE 10% 이하'), x: c3[2], y: 260, w: 164, h: 40 },
    ...pages([120, 260, 400, 540], 344, 128, 40),
  ],
  edges: [
    { from: 'z1', to: 'z2', pts: [[60, 56], [60, 84]] },
    { from: 'z2', to: 'z3', pts: [[60, 140], [60, 168]] },
    { from: 'z3', to: 'z4', pts: [[60, 224], [60, 252]] },
    { from: 'z4', to: 'z5', pts: [[60, 308], [60, 336]], label: { text: L('DEPLOY', '배포'), x: 72, y: 326, anchor: 'start' } },
    { from: 'build', to: 'lag', pts: [[284, 112], [312, 112]] },
    { from: 'lag', to: 'prep', pts: [[476, 112], [504, 112]] },
    { from: 'met', to: 'bench', pts: [[284, 280], [312, 280]] },
    { from: 'bench', to: 'gate', pts: [[476, 280], [504, 280]] },
    { from: 'z5', to: 'z2', style: 'back', pts: [[680, 364], [700, 364], [700, 112], [680, 112]], label: { text: L('RETRAIN', '재학습'), x: 690, y: 242, anchor: 'end' } },
  ],
};

// ---------- ② Service flow ----------
const cols5 = [12, 156, 300, 444, 588];
const steps = (y, review, pre) => [
  { id: `${pre}1`, kind: 'plain', label: L('Purchase plan', '구매계획 수립'), sub: L('monthly revision', '월 단위 수정'), x: cols5[0], y, w: 120, h: 44 },
  { id: `${pre}2`, kind: 'plain', label: L('Quote request', '견적 요청'), sub: L('quarterly contract', '분기 단위 계약'), x: cols5[1], y, w: 120, h: 44 },
  { id: `${pre}3`, ...review, x: cols5[2], y, w: 120, h: 44 },
  { id: `${pre}4`, kind: 'plain', label: L('Adjust & confirm', '견적 조정·확정'), x: cols5[3], y, w: 120, h: 44 },
  { id: `${pre}5`, kind: 'plain', label: L('Purchase order', '구매 주문'), x: cols5[4], y, w: 120, h: 44 },
];
const chain = (pre, y) =>
  [0, 1, 2, 3].map((i) => ({ from: `${pre}${i + 1}`, to: `${pre}${i + 2}`, pts: [[cols5[i] + 120, y], [cols5[i + 1], y]] }));

// A. 기존/개선 두 줄 비교. 같은 단계 열을 맞추고, 개선 줄에만 예측이 견적 검토로 들어간다.
const flowA = {
  width: 720,
  height: 328,
  zones: [
    { id: 'before', label: L('Before', '기존'), x: 0, y: 0, w: 720, h: 92 },
    { id: 'after', label: L('After', '개선 후'), x: 0, y: 116, w: 720, h: 168 },
  ],
  nodes: [
    ...steps(36, { kind: 'input', label: L('Quote review', '견적 검토'), sub: L('expert judgment', '전문가 경험 의존') }, 'b'),
    { id: 'mkt', kind: 'logic', label: L('Market data', '시황 데이터'), sub: L('~150 attributes', '속성 약 150개'), x: 12, y: 152, w: 120, h: 44 },
    { id: 'fc', kind: 'sllm', label: L('Price forecast', '가격 예측'), sub: L('1–4 wk · 1–3 mo · SHAP', '1–4주·1–3개월·SHAP'), x: 272, y: 152, w: 176, h: 44 },
    ...steps(224, { kind: 'llm', label: L('Quote review', '견적 검토'), sub: L('forecast-based', '예측 기반') }, 'a'),
  ],
  edges: [
    ...chain('b', 58),
    { from: 'mkt', to: 'fc', pts: [[132, 174], [272, 174]] },
    { from: 'fc', to: 'a3', pts: [[360, 196], [360, 224]] },
    ...chain('a', 246),
  ],
};
const flowALegend = [
  { kind: 'sllm', label: L('Forecast', '예측') },
  { kind: 'llm', label: L('Changed step', '바뀐 단계') },
  { kind: 'input', label: L('Experience-based', '경험 의존') },
  { kind: 'plain', label: L('Process step', '업무 단계') },
  { kind: 'logic', label: L('Data', '데이터') },
];

// B. 스윔레인: 계획 / 구매 담당 / 대시보드. 대시보드의 예측과 영향 요인이 견적 검토로 넘어가는 지점이 초점.
const c4 = [136, 284, 432, 580];
const lane = (id, label, y) => ({ id, label, x: 0, y, w: 720, h: 72, mid: true });
const flowB = {
  width: 720,
  height: 288,
  zones: [lane('plan', L('Planning', '계획 수립'), 0), lane('buy', L('Purchasing', '구매 담당'), 84), lane('dash', L('Dashboard', '대시보드'), 168)],
  nodes: [
    { id: 'annual', kind: 'plain', label: L('Annual plan', '연간 경영계획'), sub: L('Sep–Oct', '매년 9–10월'), x: c4[0], y: 12, w: 128, h: 48 },
    { id: 'pplan', kind: 'plain', label: L('Purchase plan', '구매계획 수립'), sub: L('monthly revision', '월 단위 수정'), x: c4[1], y: 12, w: 128, h: 48 },
    { id: 'req', kind: 'plain', label: L('Quote request', '견적 요청'), sub: L('quarterly', '분기 단위'), x: c4[1], y: 96, w: 128, h: 48 },
    { id: 'rev', kind: 'llm', label: L('Quote review', '견적 검토'), sub: L('was expert judgment', '기존: 전문가 경험'), x: c4[2], y: 96, w: 128, h: 48 },
    { id: 'ord', kind: 'plain', label: L('Confirm and order', '확정·주문'), x: c4[3], y: 96, w: 128, h: 48 },
    { id: 'up', kind: 'plain', label: L('Upload data', '데이터 업로드'), sub: L('retrain models', '모델 재학습'), x: c4[0], y: 180, w: 128, h: 48 },
    { id: 'fc', kind: 'sllm', label: L('Forecasts', '가격 예측'), sub: L('1–4 weeks · 1–3 months', '1–4주·1–3개월'), x: c4[1], y: 180, w: 128, h: 48 },
    { id: 'drv', kind: 'sllm', label: L('Price drivers', '영향 요인'), sub: L('SHAP · Bollinger bands', 'SHAP·볼린저 밴드'), x: c4[2], y: 180, w: 128, h: 48 },
  ],
  edges: [
    { from: 'annual', to: 'pplan', pts: [[264, 36], [284, 36]] },
    { from: 'pplan', to: 'req', pts: [[348, 60], [348, 96]] },
    { from: 'req', to: 'rev', pts: [[412, 120], [432, 120]] },
    { from: 'rev', to: 'ord', pts: [[560, 120], [580, 120]] },
    { from: 'up', to: 'fc', pts: [[264, 204], [284, 204]] },
    { from: 'fc', to: 'drv', pts: [[412, 204], [432, 204]] },
    { from: 'drv', to: 'rev', pts: [[496, 180], [496, 144]], label: { text: L('FORECAST + DRIVERS', '예측 + 요인'), x: 508, y: 165, anchor: 'start' } },
  ],
};
const flowBLegend = [
  { kind: 'sllm', label: L('Forecast output', '예측 결과') },
  { kind: 'llm', label: L('Changed step', '바뀐 단계') },
  { kind: 'plain', label: L('Process step', '업무 단계') },
];

// C. 개요 + 확대: 위 구매 절차 한 줄, 견적 검토를 아래로 펼쳐 입력 → 모델 → 예측이 견적 조정으로 돌아간다.
const c5 = [0, 148, 296, 444, 592];
const flowC = {
  width: 720,
  height: 312,
  zones: [{ id: 'zoom', label: L('Quote review with forecasts', '예측을 활용한 견적 검토'), center: true, x: 0, y: 72, w: 720, h: 192 }],
  nodes: [
    { id: 'c1', kind: 'plain', label: L('Purchase plan', '구매계획 수립'), sub: L('monthly revision', '월 단위 수정'), x: c5[0], y: 0, w: 128, h: 40 },
    { id: 'c2', kind: 'plain', label: L('Quote request', '견적 요청'), sub: L('quarterly', '분기 단위'), x: c5[1], y: 0, w: 128, h: 40 },
    { id: 'c3', kind: 'llm', label: L('Quote review', '견적 검토'), x: c5[2], y: 0, w: 128, h: 40 },
    { id: 'c4', kind: 'plain', label: L('Adjust & confirm', '견적 조정·확정'), x: c5[3], y: 0, w: 128, h: 40 },
    { id: 'c5', kind: 'plain', label: L('Purchase order', '구매 주문'), x: c5[4], y: 0, w: 128, h: 40 },
    { id: 'i1', kind: 'input', label: L('Raw-material prices', '원료 가격'), sub: L('cotton, linter, viscose', '면화·린터·비스코스'), x: 16, y: 112, w: 168, h: 40 },
    { id: 'i2', kind: 'input', label: L('Market and macro', '시장·거시 지표'), sub: L('USDA · FRED · SCFI'), x: 16, y: 160, w: 168, h: 40 },
    { id: 'i3', kind: 'input', label: L('Climate', '기후'), sub: L('NASA'), x: 16, y: 208, w: 168, h: 40 },
    { id: 'model', kind: 'sllm', label: L('Forecast model', '예측 모델'), sub: L('XGBoost · Δ price', 'XGBoost · 가격 변화량'), x: 296, y: 160, w: 128, h: 40 },
    { id: 'out', kind: 'logic', label: L('Forecasts and drivers', '예측값과 영향 요인'), sub: L('1–4 wk · 1–3 mo · SHAP', '1–4주·1–3개월·SHAP'), x: 468, y: 160, w: 176, h: 40 },
  ],
  edges: [
    { from: 'c1', to: 'c2', pts: [[128, 20], [148, 20]] },
    { from: 'c2', to: 'c3', pts: [[276, 20], [296, 20]] },
    { from: 'c3', to: 'c4', pts: [[424, 20], [444, 20]] },
    { from: 'c4', to: 'c5', pts: [[572, 20], [592, 20]] },
    { from: 'c3', to: 'model', pts: [[360, 40], [360, 160]] },
    { from: 'i1', to: 'model', pts: [[184, 132], [240, 132], [240, 168], [296, 168]] },
    { from: 'i2', to: 'model', pts: [[184, 180], [296, 180]] },
    { from: 'i3', to: 'model', pts: [[184, 228], [252, 228], [252, 192], [296, 192]] },
    { from: 'model', to: 'out', pts: [[424, 180], [468, 180]] },
    { from: 'out', to: 'c4', pts: [[556, 160], [556, 40]], label: { text: L('INFORMS', '판단 근거'), x: 568, y: 60, anchor: 'start' } },
  ],
};
const flowCLegend = [
  { kind: 'sllm', label: L('Forecast model', '예측 모델') },
  { kind: 'llm', label: L('Changed step', '바뀐 단계') },
  { kind: 'logic', label: L('Model output', '모델 출력') },
  { kind: 'plain', label: L('Process step', '업무 단계') },
  { kind: 'input', label: L('Data source', '데이터 출처') },
];

export const diagrams = {
  'arch-a': { spec: archA, legend: archLegend },
  'arch-b': { spec: archB, legend: archLegend },
  'arch-c': {
    spec: archC,
    legend: [
      { kind: 'sllm', label: L('Final model', '최종 모델') },
      { kind: 'llm', label: L('Candidate model', '후보 모델') },
      { kind: 'logic', label: L('Pipeline step', '처리 단계') },
      { kind: 'plain', label: L('Dashboard page', '대시보드 페이지') },
      { kind: 'input', label: L('External data', '외부 데이터') },
    ],
  },
  'flow-a': { spec: flowA, legend: flowALegend },
  'flow-b': { spec: flowB, legend: flowBLegend },
  'flow-c': { spec: flowC, legend: flowCLegend },
};

// ---------- ③ 실험 (최종보고 30–35장) ----------
// 축별 비교는 축마다 다른 시험 구간에서 측정해 서로 더하면 안 된다. 모델 축(32장)은 모델과 값의 짝이 분명하지 않아 범위로만 쓴다.
export const axes = [
  { name: L('Feature selection', '피처 선별'), a: L('All features', '전체 피처'), b: L('Drop |r| < 0.3', '|r| 0.3 미만 제외'), ma: 13.7, mb: 13.1 },
  { name: L('Lag features', 'lag 피처'), a: L('None', '미사용'), b: L('Two lags', 'lag 2개'), ma: 12.3, mb: 11.1 },
  { name: L('Forecasting method', '예측 방식'), a: L('Direct'), b: L('Recursive'), ma: 14.1, mb: 14.1, note: L('slightly lower MAE', 'MAE 소폭 낮음') },
  { name: L('Target', '타깃'), a: L('Price', '가격'), b: L('Price change', '가격 변화량'), ma: 9.0, mb: 5.2 },
  { name: L('Model', '모델'), a: L('Linear Regression'), b: L('Random Forest, XGBoost', 'Random Forest·XGBoost'), ma: 15.2, mb: 7.2, mbText: '7.2–7.3' },
  { name: L('Missing targets', '타깃 결측'), a: L('Drop rows', '행 제거'), b: L('Interpolate', '보간'), ma: 13.1, mb: 8.9 },
  { name: L('Retraining', '재학습'), a: L('Train once', '1회 학습'), b: L('Retrain each step', '시점마다 재학습'), ma: 8.9, mb: 6.3 },
];
// 최종 비교(35장). set: 피처 선별, lag, 변화량 타깃, recursive, 재학습, 보간
export const configs = [
  { name: L('Persistence'), group: 'rule', mape: 5.9, set: null },
  { name: L('Linter-price rule', '린터 가격 규칙'), group: 'rule', mape: 9.7, set: null },
  { name: L('Linear Regression'), group: 'ml', mape: 13.3, set: [0, 0, 0, 0, 0, 0] },
  { name: L('Random Forest'), group: 'ml', mape: 6.3, set: [1, 1, 0, 1, 1, 0] },
  { name: L('XGBoost'), group: 'ml', mape: 7.0, set: [1, 1, 0, 1, 1, 0] },
  { name: L('Random Forest, Δ', 'Random Forest, 변화량'), group: 'ml', mape: 2.5, set: [1, 1, 1, 1, 1, 1] },
  { name: L('XGBoost, Δ', 'XGBoost, 변화량'), group: 'ml', mape: 1.3, set: [1, 1, 1, 1, 1, 1], best: true },
];
export const settings = [L('feat.', '피처'), L('lags', 'lag'), L('Δ y', '변화량'), L('recur.', '재귀'), L('retrain', '재학습'), L('interp.', '보간')];
