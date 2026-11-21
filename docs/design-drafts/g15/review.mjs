// g15 시안 비교 페이지(review.html): shots/의 캡처를 다이어그램별로 나란히 보여 준다.
import { writeFileSync } from 'node:fs';
const groups = [
  ['⑦ 실서비스 화면 (제안 자리: 01 Context 목록 아래)', [
    ['shot-a', 'A. 브라우저 창 + 휴대전화', '데스크톱 답변 위에 모바일 답변을 겹침. 실제 서비스라는 인상이 가장 큼. 데스크톱 글자는 작아 읽히지 않고 분위기만 전달'],
    ['shot-b', 'B. 휴대전화 두 장', '첫 화면(예시 질문) → 답변. 이용 흐름이 보이고 가벼움. 답변 구조 설명은 없음'],
    ['shot-c', 'C. 답변 해부', '모바일 폭 답변 앞·끝 두 조각 + 번호 설명 4개(대상 법령, 조문 원문, 절차 표, 주의·면책). 출력 형식 규칙이 화면에서 어떻게 나오는지 보임. 세로로 가장 김'],
  ]],
  ['① 질문 해부 (02 Problem 목록 위)', [
    ['problem-a', 'A. 질문 → 필요한 근거 → 검색 1회의 한계', '주신 예시 질문 3개와 legalQ가 실제로 인용한 법령·조문. "답은 조문 7개, 기본 검색 결과는 3개"만 강조. 구체적이고 사실 근거가 가장 분명'],
    ['problem-b', 'B. 질의 유형 × 방식 매트릭스 (표)', '6가지 질의 유형에서 벡터 DB 1회·저장소 1회·에이전트 비교 + 이유. "왜 에이전트인가"를 논리로 보여 줌. 표라 모바일에서도 읽힘. 칸 값은 정성 평가'],
    ['problem-c', 'C. 이전 vs 이후', '벡터 DB 1회 조회 파이프라인과 고충 3개 → 두 지식원을 반복 호출하는 에이전트. 직관적이지만 ④ 서비스 흐름과 일부 겹침'],
  ]],
  ['⑥ 시스템 프롬프트 구조 (제안 자리: 새 섹션 "시스템 프롬프트", Approach 뒤)', [
    ['prompt-a', 'A. 문서 지도 (실측 길이)', '12,651자를 섹션별 글자 수로. 묶음 띠에서 "판단 규칙 49%, 지식원 설명 26%"가 보이고 저장소 구조·스키마만 강조. 유일하게 실측 데이터를 씀'],
    ['prompt-b', 'B. 처리 단계에 맞춘 섹션', '입력 → 전처리 → 별표 → 의도 분류 → 조회 → 검증 → 출력 단계마다 작동하는 섹션과 규칙 수, 위에 절대 규칙 6개, 아래 참고 지식(도구·저장소). 프롬프트가 파이프라인처럼 짜였다는 점이 가장 잘 보임'],
    ['prompt-c', 'C. 숫자로 본 프롬프트 (원장)', '규칙 6 · 의도 6 · 최신성 키워드 17 · 폴백 6 · 저장소 규약 4/8 · 예외 12와 예시. 가장 가볍고 모바일 친화. 구조(관계)는 안 보임'],
  ]],
  ['② 프롬프트 속 저장소 지도 (⑥ 아래, 같은 섹션)', [
    ['map-a', 'A. 설명을 단 파일 구조도', '저장소 트리 → 근로기준법 법률.md(실제 메타데이터) → 규약별 쓰임(메타데이터·조문 제목·부칙 표시) + 커밋 메시지 규약. 정보가 가장 풍부'],
    ['map-b', 'B. 경로 만들기 5단계', '"근로 기준법 제23조" → 정규화 → 파일 → 경로 → 조문, 아래에 법령구분→파일명 규칙과 404 폴백. 동작이 가장 잘 보임'],
    ['map-c', 'C. 프롬프트 발췌 → 도구 호출 → 찾은 조문', '실제 프롬프트 문구(코드 패널)와 get_file_contents 호출, 찾은 제23조. 진짜 프롬프트를 보여 주는 진정성. HTML이라 모바일에서 쌓임'],
  ]],
  ['⑤ 두 지식원 비교 (04 Approach 결정 표 아래)', [
    ['compare-a', 'A. 비교표 + 결론', '직접 정리하신 비교를 7행으로(역할, 검색 방식, 일상어, 컨텍스트, 이력, 최신성, 구축 비용). 정확하고 모바일에서 쌓임'],
    ['compare-b', 'B. 마주 보는 막대', '항목마다 왼쪽 벡터 DB·오른쪽 저장소 막대(정성 3단계). 서로 약한 곳을 메우는 모양이 한눈에. 정성 평가임을 아래 표기'],
    ['compare-c', 'C. 세 갈래 상호 보완', '위 벡터 DB, 아래 저장소, 사이에 재확인(포인트 색)·법령명 확인·키워드 폴백. "어떻게 같이 쓰는가"를 보여 줌'],
  ]],
  ['③ 아키텍처 (05 Architecture)', [
    ['arch-a', 'A. 4구역 회로도', '이용자 | 에이전트 서버 | MCP | 지식원, 지식원 열에 저장소 → 재적재 → 벡터 DB와 원천(국가법령정보센터). 다른 케이스와 같은 문법'],
    ['arch-b', 'B. 계층 스택', '이용자 → 서버 → MCP 도구 5개(이름까지) → 지식원. 도구 구성이 가장 자세함'],
    ['arch-c', 'C. 에이전트 허브', '에이전트를 가운데, 왼쪽 발견(벡터 DB)·오른쪽 검증(저장소), 아래 "같은 파일"로 재적재되는 고리. 메시지가 가장 분명. ⑤-C와 메시지가 겹침'],
  ]],
  ['④ 서비스 흐름 (06 Service flow)', [
    ['flow-a', 'A. 의도 6행 × 두 레인', '라우팅 테이블 그대로: 의도별 1차 호출(실선)과 조건부 호출(점선), 최신성 재확인만 포인트 색. 정보량 최대, 세로로 김'],
    ['flow-b', 'B. 결정 순서도', '판정 순서(별표 → 조문 → 이력 → 비교 → 통계 → 의미 검색)와 의미 검색 경로의 폴백·재확인. 우선순위가 잘 보임'],
    ['flow-c', 'C. 질문 1건 시퀀스', '"현행" 신호가 있는 질문이 벡터 DB → 저장소 원문 재확인 → 답변으로 가는 8단계. 가장 쉽지만 다른 의도는 안 보임'],
  ]],
];
const img = (v, l, d, t) => `<figure><img src="shots/${v}-${l}-${d}-${t}.png" alt="${v} ${l} ${d} ${t}" loading="lazy"><figcaption>${l} · ${d} · ${t}</figcaption></figure>`;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>g15 시안 비교</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f3f5f8;color:#141a22}h1{font-size:22px}h2{margin-top:48px;font-size:18px;border-top:1px solid #c5ccd6;padding-top:16px}
section{margin:24px 0 40px}h3{font-size:16px;margin:0 0 4px}p{margin:0 0 12px;color:#475260;max-width:80ch}
.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mob{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px;max-width:900px}
figure{margin:0;background:#fff;border:1px solid #dfe3ea;border-radius:6px;padding:8px}img{width:100%;display:block}figcaption{font-size:12px;color:#5f6a78;margin-top:4px}</style></head><body>
<h1>법령 검색 Agentic RAG 케이스 스터디 다이어그램 시안 (g15)</h1><p>다이어그램별로 하나씩(또는 조합) 골라 주세요. 위: 데스크톱 영문 라이트 / 국문 다크, 아래: 모바일 국문 라이트 / 영문 다크. 순서는 페이지에 놓일 순서입니다.</p>
${groups.map(([g, vs]) => `<h2>${g}</h2>${vs.map(([v, t, d]) => `<section><h3>${t}</h3><p>${d}</p><div class="row">${img(v, 'en', 'desk', 'light')}${img(v, 'ko', 'desk', 'dark')}</div><div class="mob">${img(v, 'ko', 'mob', 'light')}${img(v, 'en', 'mob', 'dark')}</div></section>`).join('')}`).join('')}
</body></html>`;
writeFileSync(new URL('./review.html', import.meta.url), html);
console.log('review.html');
