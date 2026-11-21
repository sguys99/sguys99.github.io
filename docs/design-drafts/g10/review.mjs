// g10 시안 비교 페이지(review.html) 생성: shots/의 캡처를 다이어그램별로 나란히 보여 준다.
import { writeFileSync } from 'node:fs';
const groups = [
  ['① Architecture', [
    ['arch-a', 'A. 두 구역', '위 학습 파이프라인, 아래 현업 대시보드 4페이지. 열을 맞춘 격자라 단계와 페이지 관계가 보임. 노드 14개로 가장 촘촘함'],
    ['arch-b', 'B. 순환', '업로드 → 학습 → 평가 → 대시보드 → 신규 데이터의 재학습 순환만. 가장 간결하지만 EDA·Training 페이지는 빠짐'],
    ['arch-c', 'C. 계층 띠', '지금 표의 5계층을 그대로 그림으로. 모델별 MAPE까지 담아 정보량이 가장 많고 세로로 김'],
  ]],
  ['② Service flow', [
    ['flow-a', 'A. 기존 / 개선 두 줄', '같은 5단계를 위아래로 맞춰 바뀐 한 곳(견적 검토)이 바로 보임. 단계가 두 번 나와 중복'],
    ['flow-b', 'B. 스윔레인', '계획·구매 담당·대시보드 역할별. 대시보드에서 견적 검토로 넘어가는 지점이 초점. 기존 방식은 부제로만'],
    ['flow-c', 'C. 개요 + 확대', '구매 절차 한 줄에서 견적 검토를 펼쳐 입력 → 모델 → 예측 → 견적 조정. 모델 입력까지 보임'],
  ]],
  ['③ Experiments (Approach 아래)', [
    ['exp-a', 'A. 실험 축 원장 + 덤벨', '7개 축의 비교 대상·고른 쪽·MAPE 변화. 표라서 모바일에서도 읽힘. 축별 값은 시험 구간이 달라 더할 수 없다는 주석'],
    ['exp-b', 'B. 최종 비교 막대 + 설정 행렬', '같은 구간 최종 7개 구성의 MAPE와 어떤 설정을 썼는지. 목표 10%·벤치마크 선. 수치 근거가 가장 엄밀함'],
    ['exp-c', 'C. 노선도', '벤치마크 5.9%에서 일곱 정거장을 지나 1.3%. 이야기처럼 읽히지만 장식적, 모바일은 가로 스크롤'],
  ]],
];
const img = (v, l, d, t) => `<figure><img src="shots/${v}-${l}-${d}-${t}.png" alt="${v} ${l} ${d} ${t}" loading="lazy"><figcaption>${l} · ${d} · ${t}</figcaption></figure>`;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>g10 시안 비교</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f3f5f8;color:#141a22}h1{font-size:22px}h2{margin-top:48px;font-size:18px;border-top:1px solid #c5ccd6;padding-top:16px}
section{margin:24px 0 40px}h3{font-size:16px;margin:0 0 4px}p{margin:0 0 12px;color:#475260;max-width:70ch}
.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mob{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px}
figure{margin:0;background:#fff;border:1px solid #dfe3ea;border-radius:6px;padding:8px}img{width:100%;display:block}figcaption{font-size:12px;color:#5f6a78;margin-top:4px}</style></head><body>
<h1>원자재 가격 예측 케이스 스터디 다이어그램 시안 (g10)</h1><p>다이어그램별로 하나씩(또는 조합) 골라 주세요. 위: 데스크톱 영문 라이트 / 국문 다크, 아래: 모바일 4종.</p>
${groups.map(([g, vs]) => `<h2>${g}</h2>${vs.map(([v, t, d]) => `<section><h3>${t}</h3><p>${d}</p><div class="row">${img(v, 'en', 'desk', 'light')}${img(v, 'ko', 'desk', 'dark')}</div><div class="mob">${img(v, 'en', 'mob', 'light')}${img(v, 'en', 'mob', 'dark')}${img(v, 'ko', 'mob', 'light')}${img(v, 'ko', 'mob', 'dark')}</div></section>`).join('')}`).join('')}
</body></html>`;
writeFileSync(new URL('./review.html', import.meta.url), html);
console.log('review.html');
