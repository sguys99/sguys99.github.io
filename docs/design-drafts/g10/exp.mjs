// ③ 실험 시안 3종 (HTML/SVG). 내용은 content.mjs의 axes/configs/settings.
import { axes, configs, settings } from './content.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pct = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v));
const T = {
  axis: { en: 'Axis', ko: '실험 축' },
  compared: { en: 'Compared', ko: '비교' },
  vs: { en: 'vs', ko: '대' },
  combined: {
    en: 'All seven choices together: XGBoost on price change, recursive, retrained, interpolated',
    ko: '일곱 가지 선택을 모두 적용: XGBoost, 가격 변화량 타깃, Recursive, 재학습, 보간',
  },
  bench: { en: 'rule-based benchmark 5.9%', ko: '규칙 기반 벤치마크 5.9%' },
  noteAxes: {
    en: 'Each axis was compared on its own test window, so the values do not add up.',
    ko: '축마다 다른 시험 구간에서 비교했으므로 값을 더해 읽지 않습니다.',
  },
  noteFinal: {
    en: 'Final comparison on one test window. Δ: the model predicts the price change instead of the price.',
    ko: '같은 시험 구간에서 비교한 최종 결과. 변화량: 가격 대신 가격 변화량을 예측',
  },
  target: { en: 'TARGET 10%', ko: '목표 10%' },
  benchmark: { en: 'BENCHMARK', ko: '벤치마크' },
  rule: { en: 'rule, no model', ko: '규칙, 모델 없음' },
  start: { en: 'Benchmark', ko: '벤치마크' },
  end: { en: 'Final model', ko: '최종 모델' },
  scroll: { en: 'Scroll sideways to see the whole diagram.', ko: '그림을 옆으로 밀어 전체를 볼 수 있습니다.' },
};

// ---------- A. 실험 축 원장 + 덤벨 ----------
// 0–16% 눈금. 회색 빈 점 = 비교 대상, 채운 점 = 고른 쪽. 10% 목표선이 행을 이어 세로로 보인다.
const SX = (v) => 4 + (v / 16) * 112;
function dumbbell(a, b) {
  const [x1, x2] = [SX(a), SX(b)];
  return `<svg class="db" viewBox="0 0 120 16" aria-hidden="true"><line class="tg" x1="${SX(10)}" y1="0" x2="${SX(10)}" y2="16"/>
<line class="bar" x1="${Math.min(x1, x2)}" y1="8" x2="${Math.max(x1, x2)}" y2="8"/>
<circle class="a" cx="${x1}" cy="8" r="3.5"/><circle class="b" cx="${x2}" cy="8" r="3.5"/></svg>`;
}
export function expA(l) {
  const scale = `<svg class="db sc" viewBox="0 0 120 16" aria-hidden="true">${[0, 5, 10, 15]
    .map((v) => `<text x="${SX(v)}" y="12" text-anchor="middle">${v}${v === 15 ? '%' : ''}</text>`)
    .join('')}</svg>`;
  const rows = axes
    .map(
      (a, i) => `<tr><td class="n num">${i + 1}</td><th scope="row">${esc(a.name[l])}</th>
<td class="cmp"><span class="off">${esc(a.a[l])}</span> <span class="vs">${T.vs[l]}</span> <span class="on">${esc(a.b[l])}</span>${a.note ? ` <span class="anote">· ${esc(a.note[l])}</span>` : ''}</td>
<td class="m">${dumbbell(a.ma, a.mb)}<span class="mv num">${pct(a.ma)} → <b>${a.mbText ?? pct(a.mb)}%</b></span></td></tr>`,
    )
    .join('');
  return `<div class="xa"><table>
<thead><tr><th scope="col"><span class="sr-only">#</span></th><th scope="col">${T.axis[l]}</th><th scope="col">${T.compared[l]}</th><th scope="col">MAPE ${scale}</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr><td></td><td colspan="3"><span class="fin">${T.combined[l]}</span> <b class="num">MAPE 1.3%</b> <span class="bm">(${T.bench[l]})</span></td></tr></tfoot>
</table><p class="xnote">${T.noteAxes[l]}</p></div>`;
}

// ---------- B. 최종 비교 막대 + 설정 행렬 ----------
export function expB(l) {
  const X0 = 188, PX = 15; // 0–16% → 240px
  const CX = (i) => 482 + i * 44;
  const rowY = (i) => 36 + i * 32 + (i >= 2 ? 8 : 0);
  let s = `<svg viewBox="0 0 720 304" aria-hidden="true">`;
  // 기준선 (막대 뒤)
  const xt = X0 + 10 * PX, xb = X0 + 5.9 * PX;
  s += `<line class="ref" x1="${xt}" y1="28" x2="${xt}" y2="276"/><line class="ref dot" x1="${xb}" y1="28" x2="${xb}" y2="276"/>`;
  s += `<text class="rl" x="${xt}" y="20" text-anchor="middle">${T.target[l]}</text><text class="rl" x="${xb}" y="20" text-anchor="middle">${T.benchmark[l]}</text>`;
  settings.forEach((h, i) => (s += `<text class="ch" x="${CX(i)}" y="20" text-anchor="middle">${esc(h[l])}</text>`));
  s += `<line class="sep" x1="0" y1="${rowY(2) - 4}" x2="720" y2="${rowY(2) - 4}"/>`;
  configs.forEach((c, i) => {
    const cy = rowY(i) + 16;
    const w = c.mape * PX;
    s += `<text class="nm${c.best ? ' best' : c.group === 'rule' ? ' rl0' : ''}" x="0" y="${cy + 4}">${esc(c.name[l])}</text>`;
    s += `<rect class="bar ${c.best ? 'best' : c.group === 'rule' ? 'rl0' : 'ml'}" x="${X0}" y="${cy - 6}" width="${w}" height="12" rx="2"/>`;
    s += `<text class="v${c.best ? ' best' : ''}" x="${X0 + w + 6}" y="${cy + 3}">${pct(c.mape)}%</text>`;
    if (!c.set) s += `<text class="nr" x="${(CX(0) + CX(5)) / 2}" y="${cy + 3}" text-anchor="middle">${T.rule[l]}</text>`;
    else c.set.forEach((on, j) => (s += `<circle class="cell${on ? ' on' : ''}${on && c.best ? ' best' : ''}" cx="${CX(j)}" cy="${cy}" r="4"/>`));
  });
  s += `<line class="ax" x1="${X0}" y1="280" x2="${X0 + 16 * PX}" y2="280"/>`;
  [0, 5, 10, 15].forEach((v) => (s += `<text class="tk" x="${X0 + v * PX}" y="296" text-anchor="middle">${v}%</text>`));
  s += `</svg>`;
  return `<div class="xb"><div class="x-scroll" tabindex="0" role="region" aria-label="MAPE">${s}</div><p class="hint">${T.scroll[l]}</p><p class="xnote">${T.noteFinal[l]}</p></div>`;
}

// ---------- C. 노선도: 벤치마크에서 최종 모델까지 일곱 정거장 ----------
const metro = {
  name: [['Feature', 'selection'], ['Lag', 'features'], ['Forecast', 'method'], ['Target'], ['Model'], ['Missing', 'targets'], ['Retraining']],
  nameKo: [['피처', '선별'], ['lag', '피처'], ['예측', '방식'], ['타깃'], ['모델'], ['타깃', '결측'], ['재학습']],
  on: { en: ['Selected', 'Two lags', 'Recursive', 'Δ price', 'RF, XGBoost', 'Interpolate', 'Retrain'], ko: ['선별', 'lag 2개', 'Recursive', '가격 변화량', 'RF·XGBoost', '보간', '재학습'] },
  off: { en: ['All', 'None', 'Direct', 'Price', 'Linear', 'Drop rows', 'Train once'], ko: ['전체', '미사용', 'Direct', '가격', '선형 회귀', '행 제거', '1회 학습'] },
};
export function expC(l) {
  const LY = 96, X = (i) => 104 + i * 80;
  let s = `<svg viewBox="0 0 720 176" aria-hidden="true">`;
  s += `<line class="track" x1="24" y1="${LY}" x2="692" y2="${LY}"/>`;
  // 시작
  s += `<circle class="st0" cx="24" cy="${LY}" r="6"/><text class="an" x="0" y="28">${T.start[l]}</text><text class="sub" x="0" y="44">Persistence</text><text class="val" x="0" y="76">5.9%</text>`;
  axes.forEach((a, i) => {
    const x = X(i);
    const nm = (l === 'ko' ? metro.nameKo : metro.name)[i];
    nm.forEach((t, k) => (s += `<text class="an" x="${x}" y="${28 + k * 14}" text-anchor="middle">${esc(t)}</text>`));
    s += `<text class="on" x="${x}" y="76" text-anchor="middle">${esc(metro.on[l][i])}</text>`;
    s += `<line class="stub" x1="${x}" y1="${LY + 8}" x2="${x}" y2="${LY + 20}"/>`;
    s += `<circle class="st" cx="${x}" cy="${LY}" r="5"/>`;
    s += `<text class="off" x="${x}" y="${LY + 36}" text-anchor="middle">${esc(metro.off[l][i])}</text>`;
    s += `<text class="mv" x="${x}" y="${LY + 56}" text-anchor="middle">${pct(a.ma)} → ${a.mbText ?? pct(a.mb)}</text>`;
  });
  // 끝
  s += `<circle class="end" cx="700" cy="${LY}" r="9"/><text class="an" x="720" y="28" text-anchor="end">${T.end[l]}</text><text class="sub" x="720" y="44" text-anchor="end">XGBoost</text><text class="val best" x="720" y="76" text-anchor="end">1.3%</text>`;
  s += `</svg>`;
  return `<div class="xc"><div class="x-scroll" tabindex="0" role="region" aria-label="MAPE">${s}</div><p class="hint">${T.scroll[l]}</p><p class="xnote">${T.noteAxes[l]}</p></div>`;
}
