// g15 ⑤ 지식원 비교 시안 3종. 근거: 법령검색_프로젝트_분석.md §8 "두 접근법 비교"(사용자가 정리한 표),
// systemprompt.md(VDB = 발견기, MCP = 검증기, 폴백 규칙 #1·#2, 조문검색 404 폴백). 커버리지 행은 확장 후 둘 다 전체라 뺀다.
import { L, figure, lint, esc } from './lib.mjs';

const rows = [
  [L('Role in the agent', '에이전트 안 역할'), L('Discover: find where the article is by meaning', '발견: 의미로 조문 위치 찾기'), L('Verify: exact current text, history, statistics', '검증: 정확한 현행 원문·이력·통계')],
  [L('Search', '검색 방식'), L('Dense·BM25 hybrid', 'Dense·BM25 하이브리드'), L('Keyword search, file by path', '키워드 검색, 경로로 파일 조회')],
  [L('Everyday words', '일상어 질문'), L('Strong', '강함'), L('Weak, needs legal terms', '약함, 법률 용어 필요')],
  [L('Context cost', '컨텍스트 효율'), L('Only the matching chunks', '관련 청크만'), L('Whole file; large statutes read in parts', '파일 전체, 큰 법령은 부분 조회')],
  [L('Revision history', '개정 이력·과거 원문'), L('None, current text only', '없음, 현행만'), L('From Git commits', 'Git 커밋으로 조회')],
  [L('Freshness', '최신성'), L('Periodic re-index, may lag', '주기적 재적재, 시차 있음'), L('Latest commit', '저장소 최신 커밋')],
  [L('Build cost', '구축 비용'), L('High: chunk, embed, load', '높음: 청킹·임베딩·적재'), L('Low: connect the repository', '낮음: 저장소 연결')],
];
const head = { en: ['Vector DB · Seahorse', 'Repository · legalize-kr'], ko: ['벡터 DB · Seahorse', '법령 저장소 · legalize-kr'] };
const verdict = L('Not one or the other: the agent finds with the vector DB and confirms with the repository.', '둘 중 하나가 아니라 둘 다: 에이전트는 벡터 DB로 찾고 저장소로 확인한다.');

// ---------- A. 비교표 + 결론 ----------
function tableA(l) {
  return `<table class="g15-tbl cmp2"><colgroup><col class="c0"><col><col></colgroup><thead><tr><th scope="col"><span class="sr-only">${l === 'ko' ? '항목' : 'Criterion'}</span></th><th scope="col">${head[l][0]}</th><th scope="col">${head[l][1]}</th></tr></thead><tbody>
${rows.map(([k, v, r], i) => `<tr${i === 0 ? ' class="role"' : ''}><th scope="row">${esc(k[l])}</th><td data-l="${head[l][0]}">${esc(v[l])}</td><td data-l="${head[l][1]}">${esc(r[l])}</td></tr>`).join('')}
</tbody></table><p class="g15-cap">${esc(verdict[l])}</p>`;
}

// ---------- B. 마주 보는 막대 (정성 평가) ----------
const bars = [
  [L('Everyday words', '일상어 질문'), 3, 1],
  [L('Context cost', '컨텍스트 효율'), 3, 1],
  [L('Large statutes', '대용량 법령'), 3, 1],
  [L('Exact current text', '정확한 현행 원문'), 2, 3],
  [L('Revision history', '개정 이력·과거 원문'), 0, 3],
  [L('Metadata counts', '메타데이터 통계'), 0, 2],
  [L('Light to build', '구축 부담 적음'), 1, 3],
];
const U = 72; // 단계당 폭
const CX = 360, CW = 152; // 가운데 항목 칸
function svgB(l) {
  const H = 56 + bars.length * 40 + 24;
  let s = `<svg viewBox="0 0 720 ${H}" aria-hidden="true" focusable="false">`;
  s += `<text class="zl" x="${CX - CW / 2 - 8}" y="20" text-anchor="end">${esc(head[l][0])}</text><text class="zl" x="${CX + CW / 2 + 8}" y="20">${esc(head[l][1])}</text>`;
  s += `<line class="rule" x1="0" y1="36" x2="720" y2="36"/>`;
  const none = l === 'ko' ? '없음' : 'none';
  bars.forEach(([k, v, r], i) => {
    const y = 56 + i * 40;
    s += `<text class="ct b" x="${CX}" y="${y + 16}" text-anchor="middle">${esc(k[l])}</text>`;
    const lx = CX - CW / 2 - 8, rx = CX + CW / 2 + 8;
    if (v) s += `<rect class="bar${v > r ? ' win' : ''}" x="${lx - v * U}" y="${y + 4}" width="${v * U}" height="16" rx="2"/>`;
    else s += `<text class="tx" x="${lx}" y="${y + 16}" text-anchor="end">${none}</text>`;
    if (r) s += `<rect class="bar${r > v ? ' win' : ''}" x="${rx}" y="${y + 4}" width="${r * U}" height="16" rx="2"/>`;
    else s += `<text class="tx" x="${rx}" y="${y + 16}">${none}</text>`;
  });
  const fy = 56 + bars.length * 40 + 4;
  s += `<line class="rule" x1="0" y1="${fy}" x2="720" y2="${fy}"/>`;
  s += `<text class="tx" x="0" y="${fy + 16}">${l === 'ko' ? '막대 길이 = 상대적 강점 (정성 평가, 3단계)' : 'Bar length = relative strength (qualitative, 3 levels)'}</text>`;
  return s + `</svg>`;
}

// ---------- C. 서로의 빈 곳을 메우는 세 갈래 (위 벡터 DB, 아래 저장소) ----------
const AX = [40, 280, 520];
export const c = {
  width: 720,
  height: 344,
  zones: [
    { id: 'vz', label: L('Vector DB · Seahorse', '벡터 DB · Seahorse'), note: L('discover: find the article by meaning', '발견: 의미로 조문 위치 찾기'), x: 0, y: 0, w: 720, h: 72 },
    { id: 'rz', label: L('Repository · legalize-kr', '법령 저장소 · legalize-kr'), note: L('verify: exact text, history, stats', '검증: 정확한 현행 원문·이력·통계'), x: 0, y: 216, w: 720, h: 72 },
  ],
  nodes: [],
  edges: [
    { from: 'vz', to: 'rz', style: 'acc', pts: [[AX[0], 72], [AX[0], 216]] },
    { from: 'rz', to: 'vz', style: 'back', pts: [[AX[1], 216], [AX[1], 72]] },
    { from: 'vz', to: 'rz', style: 'back', pts: [[AX[2], 72], [AX[2], 216]] },
  ],
  raw: {
    under: (l) =>
      `<text class="ct" x="12" y="52">${esc(l === 'ko' ? '일상어로 찾기 · 관련 청크만 · 대용량 법령에 유리' : 'everyday words · matching chunks only · large statutes')}</text>` +
      `<text class="ct" x="12" y="268">${esc(l === 'ko' ? '정확한 현행 원문 · 개정 이력·과거 원문 · 메타데이터 통계' : 'exact current text · history and past text · metadata counts')}</text>`,
    over: (l) => {
      const t = [
        [L('Re-check the latest text', '찾은 조문을 최신 원문으로 재확인'), L('when the question signals recency', '질문에 최신성 신호가 있을 때'), ' acc'],
        [L('If no file, confirm the name', '파일이 없으면 법령명 확인'), L('404, likely a typo', '404 · 법령명 오타 가능성'), ''],
        [L('If no hits, keyword search', '결과가 없으면 키워드 검색'), L('empty or off-topic → search_code', '0건·어긋남 → search_code'), ''],
      ];
      return t.map(([a, b, cl], i) => `<text class="ct b${cl}" x="${AX[i] + 12}" y="140">${esc(a[l])}</text><text class="tx" x="${AX[i] + 12}" y="158">${esc(b[l])}</text>`).join('');
    },
  },
};
const lgC = [
  { kind: 'acc-line', label: L('Verify with the repository', '저장소로 검증') },
  { kind: 'back', label: L('Fallback the other way', '반대 방향 폴백') },
];

export const group = {
  compare: { no: '04', title: { en: 'Two knowledge sources', ko: '두 지식원 비교' }, fig: compareFig, vs: ['compare-a', 'compare-b', 'compare-c'] },
};
export function lintAll() {
  return lint('compare-c', c);
}
export function compareFig(v, lang, label) {
  if (v === 'compare-a') return `<div class="g15-cmp">${tableA(lang)}</div>`;
  if (v === 'compare-b') return `<figure class="dg"><div class="dg-scroll" tabindex="0" role="region" aria-label="${esc(label)}">${svgB(lang)}</div><p class="hint">${lang === 'ko' ? '그림을 옆으로 밀어 전체를 볼 수 있습니다.' : 'Scroll sideways to see the whole diagram.'}</p><p class="g15-cap">${esc(verdict[lang])}</p></figure>`;
  return figure(c, lgC, lang, label, `<p class="g15-cap">${esc(verdict[lang])}</p>`);
}
