// 고른 시안(arch-a, flow-c, exp-b)을 src/content/diagrams/lotte-price-forecasting.yaml로 옮긴다 (11.12).
import { writeFileSync } from 'node:fs';
import { diagrams, configs, settings } from './content.mjs';
import { path } from './lib.mjs';

const q = (s) => (/^[\w .()~–\-·/]+$/u.test(s) && !/^[\d~]/.test(s) && !s.includes(': ') ? s : `'${s.replace(/'/g, "''")}'`);
const loc = (l) => `{ en: ${q(l.en)}, ko: ${q(l.ko)} }`;
const kind = (k) => (k === 'sllm' ? 'focus' : k);
const legend = (items, ind) => items.map((i) => `${ind}- kind: ${kind(i.kind)}\n${ind}  label: ${loc(i.label)}`).join('\n');

function diagram(name, { spec, legend: lg }, ownLegend) {
  const o = [`${name}:`, `  width: ${spec.width}`, `  height: ${spec.height}`];
  if (ownLegend) o.push('  legend:', legend(lg, '    '));
  o.push('  zones:');
  for (const z of spec.zones)
    o.push(`    - { id: ${z.id}, label: ${loc(z.label)},${z.center ? ' center: true,' : ''} x: ${z.x}, y: ${z.y}, w: ${z.w}, h: ${z.h} }`);
  o.push('  nodes:');
  for (const n of spec.nodes)
    o.push(`    - { id: ${n.id}, kind: ${kind(n.kind)}, label: ${loc(n.label)},${n.sub ? ` sub: ${loc(n.sub)},` : ''} x: ${n.x}, y: ${n.y}, w: ${n.w}, h: ${n.h} }`);
  o.push('  edges:');
  for (const e of spec.edges) {
    const lab = e.label ? `, label: { text: ${loc(e.label.text)}, x: ${e.label.x}, y: ${e.label.y}${e.label.anchor ? `, anchor: ${e.label.anchor}` : ''} }` : '';
    o.push(`    - { from: ${e.from}, to: ${e.to}, d: '${path(e.pts)}'${e.style ? `, style: ${e.style}` : ''}${lab} }`);
  }
  return o.join('\n');
}

const names = [
  ['feature selection', '피처 선별'], ['lag features', 'lag 피처'], ['price-change target', '가격 변화량 타깃'],
  ['recursive forecasting', 'Recursive 예측'], ['retraining', '재학습'], ['target interpolation', '타깃 보간'],
];
const results = [
  'results:',
  '  max: 16',
  '  ticks: [0, 5, 10, 15]',
  `  target: { value: 10, label: ${loc({ en: 'TARGET 10%', ko: '목표 10%' })} }`,
  `  benchmark: { value: 5.9, label: ${loc({ en: 'BENCHMARK', ko: '벤치마크' })} }`,
  `  ruleNote: ${loc({ en: 'rule, no model', ko: '규칙, 모델 없음' })}`,
  '  settings:',
  ...settings.map((s, i) => `    - { short: ${loc(s)}, name: ${loc({ en: names[i][0], ko: names[i][1] })} }`),
  '  rows:',
  ...configs.map(
    (c) => `    - { label: ${loc(c.name)}, mape: ${c.mape}${c.set ? `, set: [${c.set.map(Boolean).join(', ')}]` : ', rule: true'}${c.best ? ', best: true' : ''} }`,
  ),
  `  note: ${loc({
    en: 'Final comparison on one test window. Δ: the model predicts the price change instead of the price.',
    ko: '같은 시험 구간에서 비교한 최종 결과. 변화량: 가격 대신 가격 변화량을 예측',
  })}`,
].join('\n');

const head = `# 원자재 가격 예측 케이스 스터디 다이어그램 (DESIGN.md 5.24.4·5.24.6, 11.12). 시안 g10에서 고른 조합:
# arch = A(학습 파이프라인 + 현업 대시보드 두 구역), flow = C(구매 절차 개요 + 견적 검토 확대), results = B(최종 비교 막대 + 설정 행렬).
# 출처: docs/project-references/price-forecasting/ 최종보고(6, 15–16, 25–35, 36–40장). 원자재·출처 명칭은 사용자 승인(2026-11-21).
# 포인트 색은 예측 모델(focus)과 최종 모델 막대에만. 좌표는 SVG 단위(4px 격자), 연결선은 직각 + 모서리 반지름 8.
`;
const legendTop = diagrams['arch-a'].legend;
const out = [
  head,
  'legend:',
  legend(legendTop, '  '),
  '',
  '# 05 Architecture: 위 학습 파이프라인(목표 미달이면 재학습), 아래 현업이 쓰는 대시보드 4페이지.',
  diagram('arch', diagrams['arch-a'], false),
  '',
  '# 06 Service flow: 구매 절차 한 줄, 견적 검토를 펼쳐 입력 → 모델 → 예측값이 견적 조정의 근거로.',
  diagram('flow', diagrams['flow-c'], true),
  '',
  '# 04 Approach 아래 실험 결과(최종보고 35장): 같은 시험 구간의 7개 구성. set 순서는 settings와 같다.',
  results,
  '',
].join('\n');
writeFileSync(new URL('../../../src/content/diagrams/lotte-price-forecasting.yaml', import.meta.url), out);
console.log('written');
