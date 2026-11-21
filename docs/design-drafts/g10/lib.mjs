// g10 시안 공통: Diagram.astro와 같은 마크업을 문자열로 그리는 렌더러 + 좌표 점검.
// 스펙 형식은 src/content/diagrams/<slug>.yaml과 같다(zones/nodes/edges). 연결선만 d 대신 pts(직각 꼭짓점 목록)로 적고 d는 여기서 만든다.
export const L = (en, ko = en) => ({ en, ko });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 직각 꺾은선 → 모서리 반지름 8(구간이 짧으면 절반까지 줄임)의 경로.
export function path(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const r = Math.min(8, Math.hypot(x - px, y - py) / 2, Math.hypot(nx - x, ny - y) / 2);
    const ux = Math.sign(x - px), uy = Math.sign(y - py);
    const vx = Math.sign(nx - x), vy = Math.sign(ny - y);
    d += ` L${x - ux * r},${y - uy * r} Q${x},${y} ${x + vx * r},${y + vy * r}`;
  }
  const [ex, ey] = pts.at(-1);
  return d + ` L${ex},${ey}`;
}

// 글자 폭 추정: 이름 12px(라틴 6.8, 한글 12), 부제 9px 모노(라틴 5.4, 한글 9), 연결선 라벨 8px(라틴 4.8, 한글 8).
const w = (s, lat, han) => [...s].reduce((n, c) => n + (/[ㄱ-힝]/.test(c) ? han : lat), 0);
export const est = (s) => w(s, 6.8, 12);
const estSub = (s) => w(s, 5.4, 9);
const lw = (s) => w(s, 4.8, 8);

const within = (a, b) =>
  a !== b && a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;

/** Diagram.astro와 같은 SVG. 추가: zone.mid(이름을 세로 가운데), label.anchor 'end'. */
export function svg(spec, legend, lang) {
  const { width: W, height: H, zones = [], nodes, edges = [] } = spec;
  const nested = new Set(zones.filter((z) => zones.some((o) => within(z, o))).map((z) => z.id));
  const onWash = (p) => {
    const z = zones
      .filter((z) => p.x >= z.x && p.y >= z.y && p.x <= z.x + z.w && p.y <= z.y + z.h)
      .sort((a, b) => a.w * a.h - b.w * b.h)[0];
    return !!z && !nested.has(z.id);
  };
  const id = `g10-${Math.random().toString(36).slice(2, 7)}`;
  let s = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false"><defs><marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto-start-reverse"><polygon class="mk" points="0 0, 8 3, 0 6"/></marker></defs>`;
  for (const z of zones) {
    s += `<rect class="zone${nested.has(z.id) ? ' in' : ''}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8"/>`;
    if (!z.center) s += `<text class="zl" x="${z.x + 12}" y="${z.mid ? z.y + z.h / 2 + 4 : z.y + 20}">${esc(z.label[lang])}</text>`;
  }
  for (const e of edges) {
    s += `<path class="ln${e.style === 'back' ? ' back' : ''}" d="${path(e.pts)}" marker-end="url(#${id})"${e.style === 'both' ? ` marker-start="url(#${id})"` : ''}/>`;
  }
  for (const z of zones.filter((z) => z.center)) {
    const ww = est(z.label[lang]) + 12;
    s += `<rect class="zm${nested.has(z.id) ? ' in' : ''}" x="${z.x + z.w / 2 - ww / 2}" y="${z.y + 8}" width="${ww}" height="16" rx="2"/><text class="zl" x="${z.x + z.w / 2}" y="${z.y + 20}" text-anchor="middle">${esc(z.label[lang])}</text>`;
  }
  for (const e of edges.filter((e) => e.label)) {
    const l = e.label;
    const t = l.text[lang];
    const ww = lw(t) + 8;
    const a = l.anchor ?? 'middle';
    const x = a === 'start' ? l.x - 4 : a === 'end' ? l.x - ww + 4 : l.x - ww / 2;
    s += `<rect class="em${onWash(l) ? ' wash' : ''}" x="${x}" y="${l.y - 8}" width="${ww}" height="11" rx="2"/><text class="el" x="${l.x}" y="${l.y}" text-anchor="${a}">${esc(t)}</text>`;
  }
  for (const n of nodes) {
    const ls = n.label[lang].split('\n');
    const rows = ls.length + (n.sub ? 1 : 0);
    const y0 = n.y + n.h / 2 - ((rows - 1) * 14) / 2 + 4;
    const cx = n.x + n.w / 2;
    s += `<g class="k-${n.kind}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6"/>`;
    ls.forEach((t, i) => (s += `<text class="nt" x="${cx}" y="${y0 + i * 14}" text-anchor="middle">${esc(t)}</text>`));
    if (n.sub) s += `<text class="ns" x="${cx}" y="${y0 + ls.length * 14}" text-anchor="middle">${esc(n.sub[lang])}</text>`;
    s += `</g>`;
  }
  const LG = H - 12;
  const step = W / legend.length;
  s += `<line class="rule" x1="0" y1="${LG - 20}" x2="${W}" y2="${LG - 20}"/>`;
  legend.forEach((l, i) => {
    s += `<g class="k-${l.kind}"><rect x="${i * step}" y="${LG - 10}" width="16" height="12" rx="3"/></g><text class="lg" x="${i * step + 24}" y="${LG}">${esc(l.label[lang])}</text>`;
  });
  return s + `</svg>`;
}

/** 시안용 figure: 그림 + 좁은 열 안내 + 화면 낭독기 목록. */
export function figure(spec, legend, lang, label) {
  const zl = new Map((spec.zones ?? []).map((z) => [z.id, z.label[lang]]));
  const nm = new Map([...(spec.zones ?? []), ...spec.nodes].map((n) => [n.id, n.label[lang].replace(/\n/g, ' ')]));
  const then = lang === 'ko' ? (a, b) => `${a} → ${b}` : (a, b) => `${a} to ${b}`;
  return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(label)}">${svg(spec, legend, lang)}</div>
<p class="hint">${lang === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p>
<div class="sr-only"><ul>${spec.nodes.map((n) => `<li>${esc(nm.get(n.id))}${n.sub ? `, ${esc(n.sub[lang])}` : ''}</li>`).join('')}</ul>
<ul>${(spec.edges ?? []).map((e) => `<li>${esc(then(nm.get(e.from) ?? zl.get(e.from), nm.get(e.to) ?? zl.get(e.to)))}</li>`).join('')}</ul></div></figure>`;
}

/** 좌표 점검: 4px 격자, 글자 넘침, 노드 겹침, 연결선이 끝점 아닌 노드를 지나는지, 영역 밖 노드, 연결 지점 공유. */
export function lint(name, spec) {
  const out = [];
  const { nodes, zones = [], edges = [] } = spec;
  for (const n of nodes) {
    for (const k of ['x', 'y', 'w', 'h']) if (n[k] % 4) out.push(`${n.id}.${k}=${n[k]} not on 4px grid`);
    for (const lang of ['en', 'ko']) {
      for (const line of n.label[lang].split('\n'))
        if (est(line) > n.w - 8) out.push(`${n.id} ${lang} name "${line}" ~${est(line).toFixed(0)}px > ${n.w - 8}`);
      if (n.sub && estSub(n.sub[lang]) > n.w - 8)
        out.push(`${n.id} ${lang} sub "${n.sub[lang]}" ~${estSub(n.sub[lang]).toFixed(0)}px > ${n.w - 8}`);
    }
    if (n.x + n.w > spec.width || n.y + n.h > spec.height - 40) out.push(`${n.id} outside canvas/legend`);
  }
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) out.push(`overlap ${a.id} / ${b.id}`);
    }
  for (const z of zones)
    for (const lang of ['en', 'ko']) {
      const lab = est(z.label[lang]) + 12;
      if (lab > z.w) out.push(`zone ${z.id} ${lang} label too wide`);
    }
  // 연결선 구간을 1px씩 따라가며 끝점이 아닌 노드 안쪽(가장자리 2px 제외)을 지나는지
  const ends = new Map();
  for (const e of edges) {
    for (let i = 1; i < e.pts.length; i++) {
      const [x1, y1] = e.pts[i - 1], [x2, y2] = e.pts[i];
      if (x1 !== x2 && y1 !== y2) out.push(`${e.from}->${e.to} diagonal segment`);
      const len = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      for (let t = 0; t <= len; t++) {
        const x = x1 + Math.sign(x2 - x1) * t, y = y1 + Math.sign(y2 - y1) * t;
        for (const n of nodes) {
          if (n.id === e.from || n.id === e.to) continue;
          if (x > n.x + 2 && x < n.x + n.w - 2 && y > n.y + 2 && y < n.y + n.h - 2) {
            out.push(`${e.from}->${e.to} passes through ${n.id} at ${x},${y}`);
            t = len;
            break;
          }
        }
      }
    }
    for (const p of [e.pts[0], e.pts.at(-1)]) {
      const k = p.join(',');
      if (ends.has(k)) out.push(`attach point ${k} shared by ${ends.get(k)} and ${e.from}->${e.to}`);
      ends.set(k, `${e.from}->${e.to}`);
    }
  }
  if (out.length) console.warn(`[lint ${name}]\n  ` + out.join('\n  '));
  return out.length;
}
