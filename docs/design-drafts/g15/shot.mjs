// g15 ⑦ 실서비스 화면 시안 3종. 이미지: capture.mjs로 2026-11-21 legalQ에 예시 질문("회사에서 갑자기 해고 통보를 받았는데
// 부당해고로 구제받을 방법이 있을까요?")을 넣어 받은 답변. 헤드리스 환경에 한자 글꼴이 없어 Noto Sans KR을 보조 글꼴로만 덧붙였다.
// 사용자 승인: Seahorse 이름, 서비스 링크·캡처 게재, 소속 행 없음 (2026-11-21).
import { esc } from './lib.mjs';

const IMG = '/draft-g15/img/';
const cap = (l) =>
  l === 'ko'
    ? `legalQ 실서비스 화면, 2026-11-21 캡처 · <a href="https://legalq.dnotitia.ai/">legalq.dnotitia.ai</a>`
    : `legalQ live service, captured 2026-11-21 · <a href="https://legalq.dnotitia.ai/">legalq.dnotitia.ai</a>`;
const alt = {
  deskTop: { en: 'legalQ answering a question about an unfair dismissal: the statute header and Article 23 of the Labor Standards Act quoted verbatim', ko: '부당해고 구제 질문에 답하는 legalQ 화면. 근로기준법 대상 법령 정보와 제23조 원문 인용' },
  mobHome: { en: 'legalQ start screen on a phone with example questions', ko: '휴대전화의 legalQ 첫 화면과 예시 질문' },
  mobTop: { en: 'legalQ answer on a phone: statute header and Article 23 quoted verbatim', ko: '휴대전화의 legalQ 답변. 대상 법령 정보와 제23조 원문 인용' },
  s1: { en: 'Top of the answer: statute header and Article 23', ko: '답변 앞부분: 대상 법령 정보와 제23조' },
  s2: { en: 'End of the answer: procedure table, scope note, and disclaimer', ko: '답변 끝부분: 구제 절차 요약 표, 적용 범위 주의, 면책 문구' },
};

// ---------- A. 브라우저 창 + 휴대전화 겹침 ----------
function shotA(l) {
  return `<figure class="g15-shot a">
<div class="win"><div class="bar"><span class="url">legalq.dnotitia.ai</span></div><img src="${IMG}desk-top.webp" width="1600" height="956" alt="${esc(alt.deskTop[l])}"></div>
<div class="phone"><img src="${IMG}mob-top.webp" width="520" height="1125" alt="${esc(alt.mobTop[l])}"></div>
<figcaption>${cap(l)}</figcaption></figure>`;
}

// ---------- B. 휴대전화 두 장: 첫 화면 → 답변 ----------
function shotB(l) {
  const t = l === 'ko'
    ? [['질문', '예시를 고르거나 일상어로 입력'], ['답변', '대상 법령과 조문 원문, 출처, 면책']]
    : [['Ask', 'Pick an example or type in plain words'], ['Answer', 'Statute, verbatim articles, source, disclaimer']];
  return `<figure class="g15-shot b"><div class="pair">
<div><div class="phone"><img src="${IMG}mob-home.webp" width="520" height="1125" alt="${esc(alt.mobHome[l])}"></div><p class="st"><b>${t[0][0]}</b> ${t[0][1]}</p></div>
<div class="sep" aria-hidden="true"></div>
<div><div class="phone"><img src="${IMG}mob-top.webp" width="520" height="1125" alt="${esc(alt.mobTop[l])}"></div><p class="st"><b>${t[1][0]}</b> ${t[1][1]}</p></div>
</div><figcaption>${cap(l)}</figcaption></figure>`;
}

// ---------- C. 답변 해부: 앞부분·끝부분 두 조각 + 번호 설명 ----------
function shotC(l) {
  const K = l === 'ko';
  const notes = K
    ? [
        ['대상 법령', '법령명, 소관부처, 공포·시행일, 출처 링크. 법령 파일의 frontmatter에서 가져옴'],
        ['조문 원문 인용', '조·항 번호를 그대로 두고 요약·의역 없이 인용'],
        ['절차 요약 표', '인용한 조문의 기한을 단계별로 정리'],
        ['주의·면책', '적용 범위 주의와 면책 문구, 국가법령정보센터 링크로 마감'],
      ]
    : [
        ['Statute header', 'Name, ministry, promulgation and effective dates, source link, taken from the file frontmatter'],
        ['Verbatim articles', 'Article and paragraph numbers kept, no summary or paraphrase'],
        ['Procedure table', 'Deadlines from the quoted articles, step by step'],
        ['Scope note, disclaimer', 'Ends with the scope caveat, a disclaimer, and a law.go.kr link'],
      ];
  const gap = K ? '제26·27·28·30·31·33조 인용 생략' : 'Articles 26, 27, 28, 30, 31, 33 omitted';
  const pin = (n, top) => `<span class="pin" style="top:${top}%">${n}</span>`;
  const li = (i) => `<li><span class="nb">${i + 1}</span><div><b>${notes[i][0]}</b><span>${notes[i][1]}</span></div></li>`;
  return `<figure class="g15-shot c"><div class="anat">
<div class="row"><div class="sl">${pin(1, 32)}${pin(2, 72)}<img src="${IMG}mob-s1.webp" width="628" height="1480" alt="${esc(alt.s1[l])}"></div><ol class="notes">${li(0)}${li(1)}</ol></div>
<p class="gap">${gap}</p>
<div class="row"><div class="sl">${pin(3, 28)}${pin(4, 80)}<img src="${IMG}mob-s2.webp" width="628" height="1120" alt="${esc(alt.s2[l])}"></div><ol class="notes">${li(2)}${li(3)}</ol></div>
</div><figcaption>${cap(l)}</figcaption></figure>`;
}

export const group = {
  shot: { no: '01', title: { en: 'Live service', ko: '실서비스 화면' }, fig: shotFig, vs: ['shot-a', 'shot-b', 'shot-c'] },
};
export function shotFig(v, lang) {
  return { 'shot-a': shotA, 'shot-b': shotB, 'shot-c': shotC }[v](lang);
}
