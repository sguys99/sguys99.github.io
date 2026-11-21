// g13 시안 비교 페이지(review.html): shots/의 캡처를 다이어그램별로 나란히 보여 준다.
import { writeFileSync } from 'node:fs';
const groups = [
  ['① 관람 동선 (새 섹션 Visitor journey, Architecture 앞)', [
    ['journey-a', 'A. 로비 평면 개념도 + 단계 목록', '세미나 개념도를 정리한 평면 위에 1·2 → 3 → 4 → 복귀 동선. 공간감이 가장 잘 전달되고 아래 단계 목록이 모바일에서도 읽힘. 세로로 가장 김'],
    ['journey-b', 'B. 시나리오 레인', '4단계 × 이동·음성·제스처·관람객. 로봇이 여러 기능을 동시에 맞물려 수행한다는 점(통합의 난이도)이 드러남. 공간 정보는 없음'],
    ['journey-c', 'C. 노선도', '호출 → 4단계 → 복귀를 한 줄로. 가장 간결하고 가벼움. 정보량은 가장 적음'],
  ]],
  ['② 아키텍처 (기존 Architecture 표 자리)', [
    ['arch-a', 'A. 4구역 회로도', '현장 / 현장 서버 / 로봇 온보드 / 외부. SCM 회로도와 같은 문법이라 사이트 일관성이 높음. 비상정지가 판단 계층을 돌아 전신 제어로 가는 경로가 강조색. 노드 16개로 촘촘함'],
    ['arch-b', 'B. 계층 띠', '사람 → 서버 → System 2 → 버스 → System 1 → 하드웨어를 위에서 아래로. "판단과 제어 분리"가 가장 잘 보이고 정돈됨. 데이터 흐름(누가 누구와 통신)은 생략'],
    ['arch-c', 'C. 배치와 경계', '로비 / 현장 서버 / 외부망의 물리 배치와 네트워크 경계. 노드 8개로 가장 쉬움 + 설계 원칙 3줄. 소프트웨어 내부 구조는 없음 (C 선택 시 B와 조합 권장)'],
  ]],
  ['③ 안전 체계 (새 섹션 Safety, Architecture 뒤)', [
    ['safety-a', 'A. 접근 거리 원 + 3경로 정지 신호', '왼쪽 1m·0.5m 원, 오른쪽 세 트리거 → 안전 채널 → 전신 제어 (LLM 계층 우회). 두 가지 안전 장치를 한 장에. 가장 시각적'],
    ['safety-b', 'B. 거리 눈금 + 비상정지 표', '접근 거리를 가로 눈금으로, 3경로를 표(조작 주체·정지 동작·비고)로. 정지 동작 차이(0 토크 vs 선 채로)가 가장 정확히 읽힘. 모바일에서도 표가 쌓여 읽힘'],
    ['safety-c', 'C. 3중 방호', '관제 ⊃ 제어 ⊃ 감지 ⊃ 관람객의 겹 구조. 착수보고서의 "센서·제어·관제 3중 방호" 메시지. 구체 수치와 경로는 글자로만'],
  ]],
  ['④ 기종 비교 (Approach 섹션 안 소제목, 결정 표 아래)', [
    ['robot-a', 'A. 비교표만', '6개 항목 G1 vs X2 Ultra, 선정 열 강조 + 선정 이유 한 줄. 가장 가벼움'],
    ['robot-b', 'B. 선화 일러스트 + 비교표', '직접 그린 선화로 두 기종의 차이(얼굴 화면·목 관절·LED)를 짚음. 저작권 걱정 없고 사이트 톤과 맞음. 실물감은 약함'],
    ['robot-c', 'C. PPT 제품 사진 + 비교표', '세미나 9쪽의 제조사 이미지를 그대로 사용 + 출처 표기. 실물감이 가장 큼. 공개 저장소·사이트에 제조사 이미지를 싣는 이용 조건 확인 필요, 다크 모드에서 흰 사각형이 도드라짐'],
  ]],
  ['⑤ 단계 확장·역할 분담 (Outcome 섹션 안 소제목)', [
    ['roadmap-a', 'A. 역할 표', '6개 업무 × 도입 전·Step 1·Step 2, 로봇 칸 강조. 정확하고 모바일에서도 읽힘. 시각적 인상은 약함'],
    ['roadmap-b', 'B. 인계선 막대', '단계마다 6칸 막대, 로봇이 맡는 구간이 늘어나고 직원에게 넘기는 지점에 선. 한눈에 확장 폭이 보임'],
    ['roadmap-c', 'C. 단계 카드 2장', 'Step 1(본 사업)·Step 2(제안)의 역할·개발·하드웨어 + 6칸 점. 확장 내용까지 담김. 카드형이라 다른 섹션보다 무게가 있음'],
  ]],
];
const img = (v, l, d, t) => `<figure><img src="shots/${v}-${l}-${d}-${t}.png" alt="${v} ${l} ${d} ${t}" loading="lazy"><figcaption>${l} · ${d} · ${t}</figcaption></figure>`;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>g13 시안 비교</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f3f5f8;color:#141a22}h1{font-size:22px}h2{margin-top:48px;font-size:18px;border-top:1px solid #c5ccd6;padding-top:16px}
section{margin:24px 0 40px}h3{font-size:16px;margin:0 0 4px}p{margin:0 0 12px;color:#475260;max-width:80ch}
.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mob{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px;max-width:900px}
figure{margin:0;background:#fff;border:1px solid #dfe3ea;border-radius:6px;padding:8px}img{width:100%;display:block}figcaption{font-size:12px;color:#5f6a78;margin-top:4px}</style></head><body>
<h1>도슨트 휴머노이드 케이스 스터디 다이어그램 시안 (g13)</h1><p>다이어그램별로 하나씩(또는 조합) 골라 주세요. 위: 데스크톱 영문 라이트 / 국문 다크, 아래: 모바일 국문 라이트 / 영문 다크. 실제 페이지에서 보려면 http://localhost:4413/draft-g13/ko/&lt;시안&gt;/</p>
${groups.map(([g, vs]) => `<h2>${g}</h2>${vs.map(([v, t, d]) => `<section><h3>${t}</h3><p>${d}</p><div class="row">${img(v, 'en', 'desk', 'light')}${img(v, 'ko', 'desk', 'dark')}</div><div class="mob">${img(v, 'ko', 'mob', 'light')}${img(v, 'en', 'mob', 'dark')}</div></section>`).join('')}`).join('')}
</body></html>`;
writeFileSync(new URL('./review.html', import.meta.url), html);
console.log('review.html');
