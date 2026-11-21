// g14 시안 비교 페이지(review.html): shots/의 캡처를 다이어그램별로 나란히 보여 준다.
import { writeFileSync } from 'node:fs';
const groups = [
  ['① 공통 코어 + 도메인 프로파일 (Approach 안, 목록 아래)', [
    ['core-a', 'A. 교체 경계선', '위는 도메인별 태스크 팩, 아래는 공통 코어, 그 사이 포인트 색 점선 = "맞춤은 선 위에서만". 제품 명제가 한 장에 가장 직관적. 도슨트 칸에 "사례 02" 표시(실제 구현 시 링크). 도메인 3개 × 태스크 3개라 정보가 많음'],
    ['core-b', 'B. 기능 행렬', '요구 사항 15개 × 도메인 3개. 공통 7개는 모두 채움, 도메인 특화 8개만 포인트 색 점. "대부분이 공유되고 바뀌는 건 일부"가 수치처럼 보임. 정의서 FR 근거가 가장 정확. 세로로 김'],
    ['core-c', 'C. 슬롯', '코어 6모듈 상자에 프로파일 3개가 꽂히고, 점선 "다음 도메인"이 포인트 색 화살표로 붙음. 확장성(재사용) 메시지가 가장 강하고 가벼움. 도메인별 태스크는 부제로만'],
  ]],
  ['⑥ 도메인 비교표 (Approach 안, ① 아래)', [
    ['table-a', 'A. 항목 × 도메인', '행 = 태스크 성격·기본 팩·옵션 팩·핵심 기술·검증 지표·상태, 열 = 3개 도메인. 기종 비교표(도슨트)와 같은 모양'],
    ['table-b', 'B. 도메인 × 항목', '행 = 도메인(성격 + 상태 배지), 열 = 기본 팩(+옵션)·핵심 기술·검증 지표. 더 압축적이고 상태가 배지로 보임. 모바일에서 도메인 단위로 읽힘'],
  ]],
  ['② 아키텍처 (Phase 2/3 Agentic 버전, 기존 표 자리)', [
    ['arch-a', 'A. 4구역 회로도', 'Ops | 로컬 서버 | 로봇 온보드 (+외부 API). Phase 2/3 추가분(플래너·메모리·어댑터·Ops)을 포인트 색 윤곽으로, P1 유지분은 기본 윤곽. 원본 슬라이드의 구분을 그대로 옮김. 노드 16개로 촘촘'],
    ['arch-b', 'B. 계층 띠', 'Ops → 로컬 서버 → 판단 → 어댑터 → 제어 → 하드웨어. 플래너 1곳만 포인트 색, Phase 2/3 계층은 이름 옆 태그. HAL로 기체를 바꾸는 구조가 잘 보임. 연결선 없음'],
    ['arch-c', 'C. 배치와 경계', '고객 현장(로봇 + 로컬 서버) | Ops | 외부 API. 데이터가 현장을 나가는 유일한 길(반출 게이트웨이)이 포인트 색. 온프렘·보안 설계가 드러남. 모델명(GR00T, FSR-VLN, Nav2, SONIC) 표기'],
  ]],
  ['③ 명령에서 토크까지 (새 섹션)', [
    ['stack-a', 'A. 계단 + 표본', '계층 상자가 한 칸씩 내려가고, 오른쪽에 각 계층이 내놓는 데이터의 모양(좌표, 16×29 액션 청크 격자, 관절 목표각 29개, 토크 식). 가장 시각적이고 이 페이지의 대표 그림이 될 수 있음'],
    ['stack-b', 'B. 깔때기', '아래로 좁아지는 띠 = 정보는 줄고 구체성은 늘어남. 왼쪽 입력, 오른쪽 출력. 회사소개서 설명에 가장 가까움. 글자 위주'],
    ['stack-c', 'C. 가로 릴레이', '명령 → 4계층을 한 줄로, 아래에 출력 표본, 그 아래 실행 위치(로컬 서버 / 온보드 PC2 / PC1). 어디서 도는지까지 보여 줌. 가장 낮고 넓음'],
  ]],
  ['④ 학습 루프 (새 섹션)', [
    ['loop-a', 'A. 고리', '수집 → 기록 → 정제 → 파인튜닝 → 평가 → 현장 적용이 타원으로 돌고, 가운데 에피소드 데이터셋에 쌓임(점선 쓰기·읽기). "돌수록 데이터가 쌓인다"는 플라이휠 메시지'],
    ['loop-b', 'B. 파이프라인 + 납품 경계', '사내 설비(납품 안 함) 안에서 정의 → 시연 → 기록 → 정제 → 파인튜닝 → 단계별 평가, "학습 모델만" 고객 현장으로. 목표 미달·현장 실패 구간이 포인트 색 길로 원인 분류 → 추가 수집. 가장 정확'],
    ['loop-c', 'C. 에피소드 해부 + 작은 고리', '시연 한 번(캔 분리수거)이 언어·영상·상태·행동·결과 5줄 기록이 되는 모습 + 아래 4단계 루프. 데이터가 무엇인지 가장 잘 보임'],
  ]],
  ['⑤ 하드웨어 (Architecture 안 소제목)', [
    ['hw-a', 'A. 사진 + 지시선', 'G1 제품 사진에 머리 센서·컴퓨터 2대·팔·관절 지시선, 아래 크기·배터리·오디오·통신. 실물감이 가장 큼'],
    ['hw-b', 'B. 사양 카드', '작은 사진 + 감지·컴퓨팅·몸·전원 4칸. 위치 지시 없이 사양만 정리. 모바일에서 가장 읽기 쉬움'],
    ['hw-c', 'C. 표준 구성 1식', '로봇 1대 + 로컬 서버 1대 + 외부 API를 나란히, 각 장비에서 도는 소프트웨어 목록. 납품 단위가 보이고 ② 아키텍처와 연결됨'],
  ]],
];
const img = (v, l, d, t) => `<figure><img src="shots/${v}-${l}-${d}-${t}.png" alt="${v} ${l} ${d} ${t}" loading="lazy"><figcaption>${l} · ${d} · ${t}</figcaption></figure>`;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>g14 시안 비교</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f3f5f8;color:#141a22}h1{font-size:22px}h2{margin-top:48px;font-size:18px;border-top:1px solid #c5ccd6;padding-top:16px}
section{margin:24px 0 40px}h3{font-size:16px;margin:0 0 4px}p{margin:0 0 12px;color:#475260;max-width:80ch}
.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mob{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px;max-width:900px}
figure{margin:0;background:#fff;border:1px solid #dfe3ea;border-radius:6px;padding:8px}img{width:100%;display:block}figcaption{font-size:12px;color:#5f6a78;margin-top:4px}</style></head><body>
<h1>GenP 휴머노이드 제품 케이스 스터디 다이어그램 시안 (g14)</h1><p>다이어그램별로 하나씩(또는 조합) 골라 주세요. 위: 데스크톱 영문 라이트 / 국문 다크, 아래: 모바일 국문 라이트 / 영문 다크.</p>
${groups.map(([g, vs]) => `<h2>${g}</h2>${vs.map(([v, t, d]) => `<section><h3>${t}</h3><p>${d}</p><div class="row">${img(v, 'en', 'desk', 'light')}${img(v, 'ko', 'desk', 'dark')}</div><div class="mob">${img(v, 'ko', 'mob', 'light')}${img(v, 'en', 'mob', 'dark')}</div></section>`).join('')}`).join('')}
</body></html>`;
writeFileSync(new URL('./review.html', import.meta.url), html);
console.log('review.html');
