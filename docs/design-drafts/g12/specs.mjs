// g10 시안 데이터: 그린소재 재고 조합 최적화 케이스 스터디 다이어그램 4종 (2026-11-21).
// 형식은 src/content/diagrams/*.yaml과 같다 (zones, nodes, edges). 시안용 추가 요소:
//   kind: accent(ML 모델) strong(탐색 알고리즘) logic(데이터·규칙) plain input decision(마름모)
//   zone.labelAt: 'bl' (왼쪽 아래 이름), edge.style: 'retired' (현행 방식, 흐린 점선), notes[] (지표 글자)
// 출처: docs/project-references/green-material/ 최종보고(슬라이드 9, 10, 15, 18–21, 31–34, 41, 43).
// 고객 내부 명칭은 일반화: OIS → 믹싱 계획 시스템, 제품 브랜드·제품 코드는 싣지 않음.

const R = 8;
const sgn = (v) => Math.sign(v);
/** 직각 경로, 꺾이는 곳마다 반지름 8 (diagram-design 규칙 1). pts = [[x,y], ...] */
export function poly(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const ix = sgn(x - px), iy = sgn(y - py), ox = sgn(nx - x), oy = sgn(ny - y);
    d += ` L${x - ix * R},${y - iy * R} Q${x},${y} ${x + ox * R},${y + oy * R}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx},${ly}`;
}
const L = (x1, y1, x2, y2) => `M${x1},${y1} L${x2},${y2}`;

// ---------- 문구 ----------
const t = (en, ko) => ({ en, ko });
const N = {
  planner: t('Planner', '계획 담당자'),
  mixInput: [t('Mix plan input', '믹싱 계획 입력'), t('grade · quantity · batch', '등급·수량·차수')],
  prefs: [t('Preferences', '선호 설정'), t('stock age · re-feed ratio', '장기재고·재투입 비율')],
  rules: [t('Mixing rules', '믹싱 규칙'), t('planner know-how', '숙련자 노하우')],
  settings: [t('Automation settings', '자동화 설정'), t('preferences · mixing rules', '선호 설정·믹싱 규칙')],
  mixDb: [t('Mixing-plan DB', '믹싱 계획 DB'), t('recipes · past plans', '레시피·과거 실적')],
  invDb: [t('Inventory DB', '재고 DB'), t('WMS · MES', 'WMS·MES')],
  lab: [t('Lab quality data', '품질 측정 데이터'), t('LIMS · viscosity', 'LIMS·점도')],
  records: [t('Operating records', '운영 실적 데이터'), t('2018–23 · ≈180k rows', '2018–23·약 18만 행')],
  init: [t('Initialize', '초기화'), t('initialize', 'initialize')],
  filter: [t('Filter inventory', '재고 선별'), t('filter_search_space', 'filter_search_space')],
  space: [t('Search space', '탐색 공간'), t('candidate stock list', '조합 후보 재고')],
  base: [t('Base combination', '기본 조합'), t('find_base_combination', 'find_base_combination')],
  predict: [t('Viscosity prediction', '점도 예측'), t('predict_viscosity', 'predict_viscosity')],
  model: [t('Viscosity model', '점도 예측 모델'), t('Random Forest', 'Random Forest')],
  adjust: [t('Adjust combination', '조합 조정'), t('adjust_mix_plan', 'adjust_mix_plan')],
  search: [t('Combination search', '조합 검색'), t('sort + grid search', '정렬 + 격자 탐색')],
  result: [t('Recommended mix', '추천 조합'), t('report', 'report')],
  start: [t('Start mixing', '믹싱 진행')],
  meets: [t('Meets\nspec?', '기준\n만족?')],
  dataset: [t('Labeled dataset', '학습 데이터셋'), t('≈22k mixes', '약 2.2만 건')],
  dataPipe: [t('Data pipeline', '데이터 파이프라인'), t('grade · outliers · gaps', '등급·이상치·결측치')],
  modelPipe: [t('Model pipeline', '모델 파이프라인'), t('select · scale · encode', '선별·정규화·인코딩')],
};
const node = (id, kind, [label, sub], x, y, w, h, extra = {}) => ({ id, kind, label, sub, x, y, w, h, ...extra });
const lab = (en, ko, x, y, anchor = 'middle') => ({ text: t(en, ko), x, y, anchor });

// ---------- 범례 ----------
const LG = {
  accent: { kind: 'accent', label: t('ML model', 'ML 모델') },
  strong: { kind: 'strong', label: t('MixPlanner step', 'MixPlanner 단계') },
  auto: { kind: 'strong', label: t('Automated step', '자동화 단계') },
  logic: { kind: 'logic', label: t('Data and rules', '데이터·규칙') },
  data: { kind: 'logic', label: t('Data', '데이터') },
  offline: { kind: 'logic', label: t('Offline training', '오프라인 학습') },
  train: { kind: 'plain', label: t('Training step', '학습 단계') },
  manual: { kind: 'plain', label: t('Manual step', '수작업 단계') },
  input: { kind: 'input', label: t('Planner input', '담당자 입력') },
};

// =====================================================================
// ① Architecture
// =====================================================================
const archA = {
  width: 720,
  height: 476,
  legend: [LG.accent, LG.strong, LG.train, LG.data, LG.input],
  zones: [
    { id: 'train', label: t('Training program · offline', '학습 프로그램 · 오프라인'), x: 0, y: 64, w: 232, h: 272 },
    { id: 'engine', label: t('MixPlanner engine · pilot server', 'MixPlanner 엔진 · 파일럿 서버'), labelAt: 'tr', x: 256, y: 64, w: 464, h: 272 },
    { id: 'loop', label: t('Combination search', '조합 탐색'), x: 272, y: 156, w: 440, h: 164 },
  ],
  nodes: [
    node('ui', 'input', [t('Planning screen', '계획 화면'), t('settings in · recommended mix out', '설정 입력·추천 조합 출력')], 280, 0, 424, 44),
    node('dataset', 'plain', N.dataset, 16, 96, 200, 44),
    node('dataPipe', 'plain', N.dataPipe, 16, 156, 200, 44),
    node('modelPipe', 'plain', N.modelPipe, 16, 216, 200, 44),
    node('model', 'accent', [N.model[0], t('Random Forest · MAPE 3.4%', 'Random Forest · MAPE 3.4%')], 16, 276, 200, 44),
    node('init', 'strong', [N.init[0], t('recipes · inventory', '레시피·재고')], 280, 96, 176, 44),
    node('filter', 'strong', N.filter, 504, 96, 200, 44),
    node('base', 'strong', N.base, 504, 180, 200, 44),
    node('predict', 'strong', N.predict, 288, 256, 168, 44),
    node('adjust', 'strong', N.adjust, 504, 256, 200, 44),
    node('lab', 'logic', N.lab, 0, 376, 152, 44),
    node('mixDb', 'logic', N.mixDb, 184, 376, 176, 44),
    node('invDb', 'logic', N.invDb, 528, 376, 176, 44),
  ],
  edges: [
    { from: 'ui', to: 'init', d: L(368, 44, 368, 96), style: 'both' },
    { from: 'dataset', to: 'dataPipe', d: L(116, 140, 116, 156) },
    { from: 'dataPipe', to: 'modelPipe', d: L(116, 200, 116, 216) },
    { from: 'modelPipe', to: 'model', d: L(116, 260, 116, 276) },
    { from: 'model', to: 'predict', d: L(216, 292, 288, 292), label: lab('load', '탑재', 244, 282) },
    { from: 'init', to: 'filter', d: L(456, 118, 504, 118) },
    { from: 'filter', to: 'base', d: L(604, 140, 604, 180) },
    { from: 'base', to: 'predict', d: poly([[504, 202], [372, 202], [372, 256]]) },
    { from: 'predict', to: 'adjust', d: L(456, 270, 504, 270) },
    { from: 'adjust', to: 'predict', d: L(504, 286, 456, 286), style: 'back' },
    { from: 'lab', to: 'train', d: L(76, 376, 76, 336) },
    { from: 'mixDb', to: 'train', d: L(208, 376, 208, 336) },
    { from: 'mixDb', to: 'engine', d: L(336, 376, 336, 336) },
    { from: 'invDb', to: 'engine', d: L(616, 376, 616, 336) },
  ],
};

const archB = {
  width: 720,
  height: 452,
  legend: [LG.accent, LG.strong, LG.train, LG.data, LG.input],
  zones: [
    { id: 'engine', label: t('MixPlanner engine', 'MixPlanner 엔진'), x: 176, y: 40, w: 400, h: 220 },
    { id: 'train', label: t('Training program · offline', '학습 프로그램 · 오프라인'), x: 176, y: 292, w: 400, h: 100 },
  ],
  nodes: [
    node('mixDb', 'logic', N.mixDb, 0, 74, 144, 44),
    node('invDb', 'logic', N.invDb, 0, 138, 144, 44),
    node('records', 'logic', [N.records[0], t('2018–23 mix + lab', '2018–23 믹싱·품질')], 0, 326, 144, 44),
    node('init', 'strong', [N.init[0], t('recipes · inventory', '레시피·재고')], 192, 74, 168, 44),
    node('filter', 'strong', N.filter, 392, 74, 168, 44),
    node('base', 'strong', N.base, 392, 138, 168, 44),
    node('predict', 'strong', N.predict, 392, 202, 168, 44),
    node('adjust', 'strong', N.adjust, 184, 202, 160, 44),
    node('planner', 'input', [N.planner], 608, 76, 112, 40),
    node('result', 'plain', [t('Recommended\nmix', '추천 조합')], 608, 200, 112, 48),
    node('dataset', 'plain', [t('Dataset', '데이터셋'), N.dataset[1]], 192, 328, 104, 44),
    node('pipes', 'plain', [t('Pipelines', '파이프라인'), t('data · model', '데이터·모델')], 320, 328, 104, 44),
    node('model', 'accent', N.model, 448, 328, 112, 44),
  ],
  edges: [
    { from: 'mixDb', to: 'init', d: L(144, 96, 192, 96) },
    { from: 'invDb', to: 'init', d: poly([[144, 160], [216, 160], [216, 118]]) },
    { from: 'init', to: 'filter', d: L(360, 96, 392, 96) },
    { from: 'filter', to: 'base', d: L(476, 118, 476, 138) },
    { from: 'base', to: 'predict', d: L(476, 182, 476, 202) },
    { from: 'predict', to: 'adjust', d: L(392, 216, 344, 216), label: lab('fail', '미달', 368, 206) },
    { from: 'adjust', to: 'predict', d: L(344, 234, 392, 234), style: 'back' },
    { from: 'predict', to: 'result', d: L(560, 224, 608, 224), label: lab('pass', '만족', 584, 214) },
    { from: 'planner', to: 'init', d: poly([[664, 76], [664, 24], [336, 24], [336, 74]]), label: lab('settings', '설정', 470, 14) },
    { from: 'result', to: 'planner', d: L(664, 200, 664, 116), style: 'back' },
    { from: 'records', to: 'dataset', d: L(144, 348, 192, 348) },
    { from: 'dataset', to: 'pipes', d: L(296, 350, 320, 350) },
    { from: 'pipes', to: 'model', d: L(424, 350, 448, 350) },
    { from: 'model', to: 'predict', d: L(504, 328, 504, 246), label: lab('load', '탑재', 512, 280, 'start') },
  ],
};

const archC = {
  width: 720,
  height: 336,
  legend: [LG.accent, LG.strong, { kind: 'plain', label: t('Offline tool', '오프라인 도구') }, LG.data, { kind: 'input', label: t('Planner screen', '담당자 화면') }],
  zones: [
    { id: 'poc', label: t('PoC · offline', 'PoC · 오프라인'), x: 0, y: 48, w: 184, h: 216 },
    { id: 'pilot', label: t('Pilot server · online', '파일럿 서버 · 온라인'), x: 216, y: 0, w: 304, h: 264 },
    { id: 'mps', label: t('Mixing-plan system', '믹싱 계획 시스템'), x: 552, y: 0, w: 168, h: 104 },
  ],
  nodes: [
    node('records', 'logic', [t('Exported records', '추출 데이터'), t('CSV · 2018–23', 'CSV·2018–23')], 16, 92, 152, 44),
    node('training', 'plain', [t('Training program', '학습 프로그램'), t('pipelines · evaluation', '파이프라인·평가')], 16, 196, 152, 44),
    node('screen', 'input', [t('Planning screen (demo)', '계획 화면 (데모)')], 232, 40, 272, 40),
    node('engine', 'strong', [t('MixPlanner engine', 'MixPlanner 엔진'), t('initialize · filter · search · adjust', '초기화·선별·탐색·조정')], 232, 112, 272, 48),
    node('model', 'accent', N.model, 232, 196, 272, 44),
    node('mixDb', 'logic', [N.mixDb[0], t('recipes · plans', '레시피·계획')], 568, 40, 136, 44),
    node('invDb', 'logic', N.invDb, 552, 136, 168, 44),
  ],
  edges: [
    { from: 'records', to: 'training', d: L(92, 136, 92, 196) },
    { from: 'screen', to: 'engine', d: L(368, 80, 368, 112), style: 'both' },
    { from: 'engine', to: 'model', d: L(368, 160, 368, 196), style: 'both' },
    { from: 'training', to: 'model', d: L(168, 218, 232, 218), label: lab('deploy', '탑재', 200, 208) },
    { from: 'mixDb', to: 'engine', d: poly([[568, 62], [536, 62], [536, 128], [504, 128]]) },
    { from: 'invDb', to: 'engine', d: L(552, 148, 504, 148) },
  ],
};

// =====================================================================
// ② Service flow
// =====================================================================
const col = (i) => 16 + i * 176;
const flowA = {
  width: 720,
  height: 420,
  legend: [LG.accent, LG.strong, LG.logic, LG.input],
  zones: [
    { id: 'lanePlanner', label: N.planner, x: 0, y: 28, w: 720, h: 92 },
    { id: 'laneAuto', label: t('Automation', '자동화 프로세스'), x: 0, y: 144, w: 720, h: 216 },
    { id: 'c1', label: t('1 New run', '1 신규 실행'), center: true, x: col(0), y: 176, w: 152, h: 168 },
    { id: 'c2', label: t('2 Load data', '2 데이터 추출'), center: true, x: col(1), y: 176, w: 152, h: 168 },
    { id: 'c3', label: t('3 Narrow stock', '3 재고 범위'), center: true, x: col(2), y: 176, w: 152, h: 168 },
    { id: 'c4', label: t('4 Recommend', '4 조합 추천'), center: true, x: col(3), y: 176, w: 152, h: 168 },
  ],
  nodes: [
    node('mixInput', 'input', N.mixInput, 24, 56, 136, 48),
    node('start', 'plain', N.start, 376, 56, 136, 40),
    node('meets', 'decision', [t('Optimal and\nin spec?', '최적해·\n기준 만족?')], 552, 44, 136, 64),
    node('prefs', 'logic', N.prefs, col(0) + 8, 212, 136, 44),
    node('rules', 'logic', N.rules, col(0) + 8, 284, 136, 44),
    node('mixDb', 'logic', N.mixDb, col(1) + 8, 212, 136, 44),
    node('invDb', 'logic', N.invDb, col(1) + 8, 284, 136, 44),
    node('filter', 'strong', [N.filter[0], t('drop unfit stock', '부적정 재고 제외')], col(2) + 8, 212, 136, 44),
    node('space', 'logic', N.space, col(2) + 8, 284, 136, 44),
    node('search', 'strong', N.search, col(3) + 8, 212, 136, 44),
    node('predict', 'accent', [N.predict[0], t('ML model', 'ML 모델')], col(3) + 8, 284, 136, 44),
  ],
  edges: [
    { from: 'mixInput', to: 'prefs', d: L(92, 104, 92, 212) },
    { from: 'c1', to: 'c2', d: L(168, 270, 192, 270) },
    { from: 'c2', to: 'c3', d: L(344, 270, 368, 270) },
    { from: 'c3', to: 'c4', d: L(520, 270, 544, 270) },
    { from: 'filter', to: 'space', d: L(444, 256, 444, 284) },
    { from: 'search', to: 'predict', d: L(608, 256, 608, 284) },
    { from: 'predict', to: 'search', d: L(632, 284, 632, 256), style: 'back' },
    { from: 'search', to: 'meets', d: L(620, 212, 620, 108) },
    { from: 'meets', to: 'start', d: L(552, 76, 512, 76), label: lab('yes', '예', 532, 66) },
    { from: 'meets', to: 'prefs', d: poly([[620, 44], [620, 8], [180, 8], [180, 234], [160, 234]]), style: 'back', label: lab('change settings', '설정 변경', 400, 24) },
  ],
};

const flowB = {
  width: 720,
  height: 656,
  legend: [LG.accent, LG.strong, LG.logic, LG.input],
  zones: [
    { id: 'z1', label: t('Set up', '설정'), x: 0, y: 0, w: 720, h: 136 },
    { id: 'z2', label: t('Narrow stock', '재고 범위'), x: 0, y: 152, w: 720, h: 136 },
    { id: 'z3', label: t('Search', '조합 탐색'), x: 0, y: 304, w: 720, h: 232 },
  ],
  nodes: [
    node('mixInput', 'input', N.mixInput, 248, 16, 224, 44),
    node('settings', 'logic', N.settings, 248, 84, 224, 40),
    node('init', 'strong', [N.init[0], N.init[1]], 248, 168, 224, 48),
    node('filter', 'strong', N.filter, 248, 236, 224, 44),
    node('mixDb', 'logic', N.mixDb, 520, 168, 168, 44),
    node('invDb', 'logic', N.invDb, 520, 236, 168, 44),
    node('base', 'strong', N.base, 248, 320, 224, 44),
    node('predict', 'accent', N.predict, 248, 388, 224, 44),
    node('meets', 'decision', N.meets, 300, 456, 120, 56),
    node('adjust', 'strong', [N.adjust[0], t('next-ranked stock', '차순위 재고')], 512, 462, 176, 44),
    node('result', 'strong', N.result, 248, 552, 224, 44),
  ],
  edges: [
    { from: 'mixInput', to: 'settings', d: L(360, 60, 360, 84) },
    { from: 'settings', to: 'init', d: L(360, 124, 360, 168) },
    { from: 'mixDb', to: 'init', d: L(520, 190, 472, 190) },
    { from: 'invDb', to: 'init', d: poly([[520, 258], [496, 258], [496, 206], [472, 206]]) },
    { from: 'init', to: 'filter', d: L(360, 216, 360, 236) },
    { from: 'filter', to: 'base', d: L(360, 280, 360, 320) },
    { from: 'base', to: 'predict', d: L(360, 364, 360, 388) },
    { from: 'predict', to: 'meets', d: L(360, 432, 360, 456) },
    { from: 'meets', to: 'adjust', d: L(420, 484, 512, 484), label: lab('no', '아니오', 466, 474) },
    { from: 'adjust', to: 'predict', d: poly([[600, 462], [600, 410], [472, 410]]) },
    { from: 'adjust', to: 'settings', d: poly([[688, 484], [704, 484], [704, 104], [472, 104]]), style: 'back', label: lab('stock exhausted', '후보 소진', 600, 94) },
    { from: 'meets', to: 'result', d: L(360, 512, 360, 552), label: lab('yes', '예', 368, 536, 'start') },
  ],
};

const flowC = {
  width: 720,
  height: 452,
  legend: [LG.accent, LG.strong, LG.logic, LG.input],
  zones: [{ id: 'loop', label: t('Combination search · ≈10 s per plan', '조합 탐색 · 건당 약 10초'), labelAt: 'bl', x: 176, y: 96, w: 544, h: 232 }],
  nodes: [
    node('planner', 'input', [N.planner], 0, 14, 112, 40),
    node('settings', 'logic', N.settings, 144, 12, 160, 44),
    node('init', 'strong', [N.init[0], t('recipes · inventory', '레시피·재고')], 336, 12, 160, 44),
    node('filter', 'strong', N.filter, 528, 12, 192, 44),
    node('base', 'strong', N.base, 200, 140, 176, 44),
    node('predict', 'accent', N.predict, 528, 140, 176, 44),
    node('meets', 'decision', N.meets, 556, 232, 120, 56),
    node('adjust', 'strong', [N.adjust[0], t('next-ranked stock', '차순위 재고')], 360, 238, 152, 44),
    node('result', 'strong', N.result, 528, 360, 176, 40),
  ],
  edges: [
    { from: 'planner', to: 'settings', d: L(112, 34, 144, 34) },
    { from: 'settings', to: 'init', d: L(304, 34, 336, 34) },
    { from: 'init', to: 'filter', d: L(496, 34, 528, 34) },
    { from: 'filter', to: 'base', d: poly([[624, 56], [624, 76], [288, 76], [288, 140]]) },
    { from: 'base', to: 'predict', d: L(376, 162, 528, 162), label: lab('candidate', '후보 조합', 452, 152) },
    { from: 'predict', to: 'meets', d: L(616, 184, 616, 232) },
    { from: 'meets', to: 'adjust', d: L(556, 260, 512, 260), label: lab('no', '아니오', 534, 250) },
    { from: 'adjust', to: 'predict', d: poly([[480, 238], [480, 208], [552, 208], [552, 184]]) },
    { from: 'meets', to: 'result', d: L(616, 288, 616, 360), label: lab('yes', '예', 624, 316, 'start') },
    { from: 'result', to: 'planner', d: poly([[528, 380], [56, 380], [56, 54]]), style: 'back', label: lab('review', '검토', 300, 370) },
    { from: 'adjust', to: 'settings', d: poly([[360, 272], [192, 272], [192, 56]]), style: 'back', label: lab('stock exhausted', '후보 소진', 200, 228, 'start') },
  ],
};

// =====================================================================
// ③ Before → After
// =====================================================================
const baA = {
  width: 720,
  height: 416,
  legend: [LG.manual, LG.auto, LG.accent, LG.offline, LG.input],
  zones: [
    { id: 'before', label: t('Before · manual, ≈20 min per plan', '현행 · 수작업, 건당 약 20분'), x: 0, y: 0, w: 720, h: 128 },
    { id: 'after', label: t('After · automated, ≈10 s per plan', '개선 · 자동화, 건당 약 10초'), x: 0, y: 152, w: 720, h: 204 },
  ],
  nodes: [
    node('b0', 'input', [N.mixInput[0]], 16, 44, 112, 44),
    node('b1', 'plain', [t('Check recipe', '레시피 확인'), t('additive ratios', '첨가제 투입비')], 152, 44, 128, 44),
    node('b2', 'plain', [t('Draft combination', '조합 수기 작성'), t('stock by hand', '재고 수기 검토')], 304, 44, 128, 44),
    node('b3', 'plain', [t('Viscosity map', '점도맵 추정'), t('lab lookup table', '실험 기반 표')], 456, 44, 128, 44),
    node('b4', 'plain', [t('Confirm plan', '계획 확정')], 608, 44, 104, 44),
    node('a0', 'input', [N.mixInput[0], t('+ preferences', '+ 선호 설정')], 16, 196, 112, 44),
    node('a1', 'strong', [N.filter[0], t('rules applied', '규칙 적용')], 152, 196, 128, 44),
    node('a2', 'strong', [N.space[0], N.space[1]], 304, 196, 128, 44),
    node('a3', 'strong', [t('Recommend mix', '조합 추천'), t('sort + grid search', '정렬 + 격자 탐색')], 456, 196, 128, 44),
    node('a4', 'plain', [t('Confirm plan', '계획 확정')], 608, 196, 104, 44),
    node('a6', 'logic', [t('Model training', '모델 학습'), t('2018–23 records', '2018–23 실적')], 304, 296, 128, 44),
    node('a5', 'accent', [N.model[0], t('MAPE 3.4% (map 6.5%)', 'MAPE 3.4% (점도맵 6.5%)')], 456, 296, 128, 44),
  ],
  edges: [
    { from: 'b0', to: 'b1', d: L(128, 66, 152, 66) },
    { from: 'b1', to: 'b2', d: L(280, 66, 304, 66) },
    { from: 'b2', to: 'b3', d: L(432, 66, 456, 66) },
    { from: 'b3', to: 'b4', d: L(584, 66, 608, 66) },
    { from: 'b3', to: 'b2', d: poly([[520, 88], [520, 104], [368, 104], [368, 88]]), style: 'back', label: lab('off spec · retry', '기준 미달 · 재시도', 444, 120) },
    { from: 'a0', to: 'a1', d: L(128, 218, 152, 218) },
    { from: 'a1', to: 'a2', d: L(280, 218, 304, 218) },
    { from: 'a2', to: 'a3', d: L(432, 218, 456, 218) },
    { from: 'a3', to: 'a4', d: L(584, 218, 608, 218) },
    { from: 'a3', to: 'a5', d: L(508, 240, 508, 296) },
    { from: 'a5', to: 'a3', d: L(532, 296, 532, 240), style: 'back' },
    { from: 'a6', to: 'a5', d: L(432, 318, 456, 318) },
  ],
};

const bl = 88, bc = 188, al = 464, ac = 564; // B안 기둥 왼쪽·가운데
const baB = {
  width: 720,
  height: 624,
  legend: [LG.manual, LG.auto, LG.accent, LG.input],
  zones: [
    { id: 'before', label: t('Before · manual', '현행 · 수작업'), x: 0, y: 0, w: 344, h: 500 },
    { id: 'after', label: t('After · automated', '개선 · 자동화'), x: 376, y: 0, w: 344, h: 500 },
  ],
  nodes: [
    node('b0', 'input', [N.mixInput[0]], bl, 40, 200, 40),
    node('b1', 'plain', [t('Check recipe', '레시피 확인'), t('additive ratios', '첨가제 투입비')], bl, 104, 200, 44),
    node('b2', 'plain', [t('Check stock levels', '재고 수량 확인'), t('by hand', '수기 검토')], bl, 168, 200, 44),
    node('b3', 'plain', [t('Draft combination', '조합 수기 작성'), t('trial and error', '시행착오')], bl, 232, 200, 44),
    node('b4', 'plain', [t('Viscosity map', '점도맵 추정'), t('lab lookup table', '실험 기반 표')], bl, 296, 200, 44),
    node('bm', 'decision', N.meets, bc - 56, 364, 112, 56),
    node('b5', 'plain', [t('Confirm plan', '계획 확정')], bl, 444, 200, 40),
    node('a0', 'input', [N.mixInput[0], t('+ preferences', '+ 선호 설정')], al, 40, 200, 40),
    node('a1', 'strong', [N.filter[0], t('rules applied', '규칙 적용')], al, 104, 200, 44),
    node('a2', 'strong', [N.space[0], N.space[1]], al, 168, 200, 44),
    node('a3', 'strong', [t('Recommend mix', '조합 추천'), t('sort + grid search', '정렬 + 격자 탐색')], al, 232, 200, 44),
    node('a4', 'accent', [N.model[0], N.model[1]], al, 296, 200, 44),
    node('am', 'decision', N.meets, ac - 56, 364, 112, 56),
    node('a5', 'plain', [t('Confirm plan', '계획 확정')], al, 444, 200, 40),
  ],
  edges: [
    { from: 'b0', to: 'b1', d: L(bc, 80, bc, 104) },
    { from: 'b1', to: 'b2', d: L(bc, 148, bc, 168) },
    { from: 'b2', to: 'b3', d: L(bc, 212, bc, 232) },
    { from: 'b3', to: 'b4', d: L(bc, 276, bc, 296) },
    { from: 'b4', to: 'bm', d: L(bc, 340, bc, 364) },
    { from: 'bm', to: 'b5', d: L(bc, 420, bc, 444) },
    { from: 'bm', to: 'b3', d: poly([[bc - 56, 392], [52, 392], [52, 254], [bl, 254]]), style: 'back', label: lab('retry', '재시도', 60, 324, 'start') },
    { from: 'a0', to: 'a1', d: L(ac, 80, ac, 104) },
    { from: 'a1', to: 'a2', d: L(ac, 148, ac, 168) },
    { from: 'a2', to: 'a3', d: L(ac, 212, ac, 232) },
    { from: 'a3', to: 'a4', d: L(ac - 12, 276, ac - 12, 296) },
    { from: 'a4', to: 'a3', d: L(ac + 12, 296, ac + 12, 276), style: 'back' },
    { from: 'a4', to: 'am', d: L(ac, 340, ac, 364) },
    { from: 'am', to: 'a5', d: L(ac, 420, ac, 444) },
    { from: 'am', to: 'a3', d: poly([[ac - 56, 392], [428, 392], [428, 254], [al, 254]]), style: 'back', label: lab('next stock', '차순위', 436, 324, 'start') },
  ],
  notes: [
    { x: 16, y: 540, cls: 'big', text: t('≈20 min', '약 20분') },
    { x: 16, y: 560, cls: 'small', text: t('per plan · viscosity error 6.5% MAPE', '건당 · 점도 오차 MAPE 6.5%') },
    { x: 392, y: 540, cls: 'big accent', text: t('≈10 s', '약 10초') },
    { x: 392, y: 560, cls: 'small', text: t('per plan · viscosity error 3.4% MAPE', '건당 · 점도 오차 MAPE 3.4%') },
  ],
};

const baC = {
  width: 720,
  height: 288,
  legend: [LG.manual, LG.auto, LG.accent, LG.input],
  zones: [
    { id: 'combo', label: t('Build combination', '조합 구성'), center: true, x: 152, y: 0, w: 216, h: 224 },
    { id: 'visc', label: t('Check viscosity', '점도 확인'), center: true, x: 392, y: 0, w: 192, h: 224 },
  ],
  nodes: [
    node('in', 'input', [N.mixInput[0]], 0, 96, 120, 48),
    node('bc', 'plain', [t('By hand', '수기 작성'), t('trial and error · ≈20 min', '시행착오·약 20분')], 168, 56, 184, 44),
    node('ac', 'strong', [t('Sort + grid search', '정렬 + 격자 탐색'), t('MixPlanner · ≈10 s', 'MixPlanner·약 10초')], 168, 148, 184, 44),
    node('bv', 'plain', [t('Viscosity map', '점도맵'), t('MAPE 6.5%', 'MAPE 6.5%')], 408, 56, 160, 44),
    node('av', 'accent', [N.model[0], t('MAPE 3.4%', 'MAPE 3.4%')], 408, 148, 160, 44),
    node('out', 'plain', [t('Confirm plan', '계획 확정')], 616, 96, 104, 48),
  ],
  edges: [
    { from: 'in', to: 'bc', d: poly([[120, 112], [140, 112], [140, 78], [168, 78]]), style: 'retired' },
    { from: 'in', to: 'ac', d: poly([[120, 128], [140, 128], [140, 170], [168, 170]]) },
    { from: 'bc', to: 'bv', d: L(352, 78, 408, 78), style: 'retired' },
    { from: 'ac', to: 'av', d: L(352, 170, 408, 170) },
    { from: 'bv', to: 'out', d: poly([[568, 78], [596, 78], [596, 112], [616, 112]]), style: 'retired' },
    { from: 'av', to: 'out', d: poly([[568, 170], [596, 170], [596, 128], [616, 128]]) },
  ],
  notes: [
    { x: 168, y: 48, cls: 'tag', text: t('before', '현행') },
    { x: 168, y: 140, cls: 'tag', text: t('after', '개선') },
  ],
};

// =====================================================================
// ④ Viscosity model pipeline
// =====================================================================
const plA = {
  width: 720,
  height: 236,
  legend: [LG.accent, { kind: 'plain', label: t('Pipeline step', '파이프라인 단계') }, LG.data, LG.strong],
  zones: [],
  nodes: [
    node('records', 'logic', N.records, 0, 0, 152, 44),
    node('dataset', 'plain', N.dataset, 184, 0, 152, 44),
    node('dataPipe', 'plain', N.dataPipe, 376, 0, 152, 44),
    node('modelPipe', 'plain', N.modelPipe, 568, 0, 152, 44),
    node('eval', 'plain', [t('Train and evaluate', '학습·평가'), t('18k train · 4.5k test', '학습 18,000·평가 4,500')], 568, 120, 152, 44),
    node('meets', 'decision', [t('MAPE\n≤ 5%?', 'MAPE\n5% 이내?')], 432, 114, 104, 56),
    node('model', 'accent', [N.model[0], t('Random Forest · 3.4%', 'Random Forest · 3.4%')], 240, 120, 152, 44),
    node('mp', 'strong', [t('MixPlanner', 'MixPlanner'), t('predict_viscosity', 'predict_viscosity')], 0, 120, 200, 44),
  ],
  edges: [
    { from: 'records', to: 'dataset', d: L(152, 22, 184, 22) },
    { from: 'dataset', to: 'dataPipe', d: L(336, 22, 376, 22) },
    { from: 'dataPipe', to: 'modelPipe', d: L(528, 22, 568, 22) },
    { from: 'modelPipe', to: 'eval', d: L(644, 44, 644, 120) },
    { from: 'eval', to: 'meets', d: L(568, 142, 536, 142) },
    { from: 'meets', to: 'model', d: L(432, 142, 392, 142), label: lab('yes', '예', 412, 132) },
    { from: 'model', to: 'mp', d: L(240, 142, 200, 142), label: lab('load', '탑재', 220, 132) },
    { from: 'meets', to: 'dataPipe', d: L(484, 114, 484, 44), style: 'back', label: lab('no · revise', '아니오 · 재학습', 492, 84, 'start') },
  ],
};

const plB = {
  width: 720,
  height: 300,
  legend: [LG.accent, { kind: 'plain', label: t('Pipeline step', '파이프라인 단계') }, LG.data, LG.strong],
  zones: [
    { id: 'dp', label: t('Data pipeline', '데이터 파이프라인'), x: 168, y: 0, w: 264, h: 152 },
    { id: 'mpz', label: t('Model pipeline', '모델 파이프라인'), x: 456, y: 0, w: 264, h: 152 },
  ],
  nodes: [
    node('records', 'logic', N.records, 0, 16, 136, 48),
    node('dataset', 'logic', N.dataset, 0, 96, 136, 44),
    node('d1', 'plain', [t('Grade category', '등급 범주화')], 180, 40, 112, 36),
    node('d2', 'plain', [t('Outliers', '이상치 처리')], 316, 40, 104, 36),
    node('d3', 'plain', [t('Missing values', '결측치 처리')], 316, 100, 104, 36),
    node('d4', 'plain', [t('Drop unused', '미사용 값 제거')], 180, 100, 112, 36),
    node('m1', 'plain', [t('Select features', '피처 선별')], 468, 40, 112, 36),
    node('m2', 'plain', [t('Scale · encode', '정규화·인코딩')], 604, 40, 104, 36),
    node('m3', 'accent', [t('Random Forest', 'Random Forest'), t('best of 5 models', '모델 5종 중 최고')], 540, 96, 168, 44),
    node('eval', 'plain', [t('Evaluate', '평가'), t('MAPE 3.4% vs map 6.5%', 'MAPE 3.4% (점도맵 6.5%)')], 456, 196, 264, 44),
    node('mp', 'strong', [t('Load into MixPlanner', 'MixPlanner에 탑재'), t('predict_viscosity', 'predict_viscosity')], 168, 196, 264, 44),
  ],
  edges: [
    { from: 'records', to: 'dataset', d: L(68, 64, 68, 96) },
    { from: 'dataset', to: 'dp', d: L(136, 118, 168, 118) },
    { from: 'd1', to: 'd2', d: L(292, 58, 316, 58) },
    { from: 'd2', to: 'd3', d: L(368, 76, 368, 100) },
    { from: 'd3', to: 'd4', d: L(316, 118, 292, 118) },
    { from: 'dp', to: 'mpz', d: L(432, 76, 456, 76) },
    { from: 'm1', to: 'm2', d: L(580, 58, 604, 58) },
    { from: 'm2', to: 'm3', d: L(656, 76, 656, 96) },
    { from: 'mpz', to: 'eval', d: L(588, 152, 588, 196) },
    { from: 'eval', to: 'mp', d: L(456, 218, 432, 218) },
  ],
};

// =====================================================================
export const groups = [
  {
    id: 'arch',
    title: t('① Architecture · 시스템 구성도', '① Architecture · 시스템 구성도'),
    where: '05 Architecture 섹션 (SCM과 같은 자리)',
    variants: [
      { key: 'A', name: '학습 | 엔진 나란히', spec: archA, intent: '오프라인 학습 프로그램과 MixPlanner 엔진을 같은 무게로 나란히 두고, 데이터 원천을 바닥에 깔았다. 엔진 안에 조합 탐색 루프를 한 겹 더 넣었다.', pros: '두 산출물(모델 학습 프로그램, 조합 엔진)이 함께 보인다. 모델이 엔진에 탑재되는 지점이 가운데에서 바로 읽힌다.', cons: '노드 13개로 밀도가 높다. 계획 화면과 엔진의 왕복을 양쪽 화살표 하나로 줄였다.' },
      { key: 'B', name: '엔진 중심 · 학습은 아래 띠', spec: archB, intent: '읽는 순서를 데이터 → 엔진 → 담당자로 두고, 학습 프로그램은 엔진 아래 얇은 띠로 내렸다. 모델은 아래에서 위로 탑재된다.', pros: '서비스가 실제로 도는 길이 주인공이다. 담당자의 설정 입력과 결과 검토가 오른쪽 끝에서 닫힌다.', cons: '학습 쪽 상세(파이프라인 단계)는 "파이프라인" 한 칸으로 줄었다. ④를 같이 쓰면 보완된다.' },
      { key: 'C', name: '배치 관점 · PoC → 파일럿', spec: archC, intent: '슬라이드 41·43처럼 어디에서 무엇이 도는지를 보여준다. 왼쪽은 PoC(오프라인), 가운데는 파일럿 서버, 오른쪽은 기존 시스템이다.', pros: '노드 7개로 가장 가볍다. 파일럿까지 갔다는 성과와 바로 이어진다.', cons: '엔진 내부 동작은 부제 한 줄뿐이다. 흐름은 ② Service flow가 맡아야 한다.' },
    ],
  },
  {
    id: 'flow',
    title: t('② Service flow · 조합 산출 흐름', '② Service flow · 조합 산출 흐름'),
    where: '06 Service flow 섹션',
    variants: [
      { key: 'A', name: '스윔레인 · 4단계 열', spec: flowA, intent: '원본 슬라이드 33을 따랐다. 담당자 줄과 자동화 줄, 4단계 열(신규 실행 → 데이터 추출 → 재고 범위 → 조합 추천)로 나눴다.', pros: '누가 무엇을 하는지와 단계 순서가 함께 보인다. SCM 흐름도와 문법(열 영역, 가운데 이름)이 같다.', cons: '"기준 미달 → 차순위 재고로 조정" 루프가 조합 검색 ⇄ 점도 예측 왕복으로만 표현된다.' },
      { key: 'B', name: '세로 척추 · 함수 순서', spec: flowB, intent: 'MixPlanner 함수가 실행되는 순서대로 위에서 아래로 내려간다. 미달 시 조정 루프와 후보 소진 시 설정 변경 경로를 따로 그렸다.', pros: '알고리즘 동작이 가장 정확하다 (기본 조합 → 예측 → 판정 → 조정 → 재예측, 후보가 없으면 설정 변경 안내).', cons: '세로로 길다(656). 모바일에서는 스크롤이 길어진다.' },
      { key: 'C', name: '루프 중심', spec: flowC, intent: '위 한 줄은 준비 단계(설정 → 초기화 → 재고 선별), 아래 큰 영역은 조합 탐색 루프다. 루프 영역 이름에 "건당 약 10초"를 넣었다.', pros: '이 프로젝트의 핵심인 탐색 루프가 가장 크게 보인다. 결과가 담당자에게 돌아가는 길이 닫혀 있다.', cons: '데이터 원천(DB)은 초기화 부제로만 남는다. ①과 함께 써야 원천이 보인다.' },
    ],
  },
  {
    id: 'ba',
    title: t('③ Before → After · 프로세스 비교', '③ Before → After · 프로세스 비교'),
    where: '02 Problem 아래 (새 자리, 컴포넌트에 슬롯 추가 필요)',
    variants: [
      { key: 'A', name: '위아래 두 줄', spec: baA, intent: '슬라이드 9처럼 현행 줄과 개선 줄을 위아래로 맞췄다. 줄 이름에 건당 소요 시간을 넣었다.', pros: '같은 열끼리 비교된다. 점도맵이 ML 모델로 바뀌는 자리가 정확히 겹친다.', cons: '두 줄의 단계 수가 같아 보이게 맞추느라 현행 단계를 일부 묶었다.' },
      { key: 'B', name: '좌우 두 기둥 + 지표', spec: baB, intent: '현행과 개선을 왼쪽·오른쪽 기둥으로 세우고, 바닥에 건당 시간과 점도 오차를 큰 숫자로 뒀다.', pros: '결과 숫자(20분 → 10초, 6.5% → 3.4%)가 가장 강하게 남는다.', cons: '세로로 길다(624). 숫자가 Outcome 섹션과 겹친다.' },
      { key: 'C', name: '바뀐 단계만', spec: baC, intent: '입력과 확정은 공통이고, 바뀐 두 단계(조합 구성, 점도 확인)만 현행(흐린 점선)과 개선으로 나눴다.', pros: '가장 짧고(288) 메시지가 하나다. 문단 사이에 넣어도 부담이 없다.', cons: '수작업 시행착오 루프가 글자로만 남는다.' },
    ],
  },
  {
    id: 'pipe',
    title: t('④ Viscosity model pipeline · 점도 예측 모델 학습', '④ Viscosity model pipeline · 점도 예측 모델 학습'),
    where: '04 Approach 아래 (새 자리)',
    variants: [
      { key: 'A', name: 'ㄹ자 한 줄 흐름', spec: plA, intent: '원시 데이터 → 데이터셋 → 두 파이프라인 → 학습·평가 → 목표(MAPE 5% 이내) 판정 → 탑재를 한 번에 그렸다. 미달이면 파이프라인으로 돌아간다.', pros: '짧고(236) 목표 기준과 재학습 경로가 보인다.', cons: '파이프라인 안의 단계는 부제 한 줄로만 보인다.' },
      { key: 'B', name: '파이프라인 펼침', spec: plB, intent: '데이터 파이프라인 4단계와 모델 파이프라인 3단계를 영역 안에 펼쳤다 (scikit-learn Pipeline 구조).', pros: '구현 깊이(전처리 설계)가 드러난다.', cons: '케이스 스터디 독자에게는 상세할 수 있다. 판정·재학습 경로는 뺐다.' },
    ],
  },
];
