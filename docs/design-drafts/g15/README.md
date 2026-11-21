# g15. 법령 검색 Agentic RAG 케이스 스터디 다이어그램 시안 (2026-11-21)

결정: DESIGN.md 11.16. 고른 조합(✓)은 `src/content/diagrams/legal-agentic-rag.yaml`(`export.mjs`로 변환)과
`src/content/projects/legal-agentic-rag.md`(`compare`, `screens`)로 옮겼다. 비교 페이지 `review.html`, 캡처 `shots/<시안>-<언어>-<기기>-<테마>.png`, 구현 확인 `shots/impl/`.

| 그림 | 자리 | A | B | C |
|---|---|---|---|---|
| ⑦ 실서비스 화면 | 01 Context 아래 | 브라우저 + 휴대전화 | 휴대전화 두 장 | 답변 해부 ✓ |
| ① 질문 해부 | 02 Problem 위 | 질문 → 근거 → 한계 | 유형 × 방식 매트릭스 | 이전 vs 이후 ✓ |
| ⑤ 지식원 비교 | 04 Approach 결정 표 아래 | 비교표 ✓ | 마주 보는 막대 | 세 갈래 상호 보완 |
| ⑥ 프롬프트 구조 | 05 System prompt (새 섹션) | 문서 지도(실측) | 처리 단계 정렬 ✓ | 숫자 원장 |
| ② 저장소 지도 | 05 System prompt, ⑥ 아래 | 파일 구조도 ✓ | 경로 만들기 5단계 | 발췌 → 호출 → 조문 |
| ③ 아키텍처 | 06 Architecture | 4구역 회로도 | 계층 스택 ✓ | 에이전트 허브 |
| ④ 서비스 흐름 | 07 Service flow | 의도 6행 × 두 레인 ✓ | 결정 순서도 | 질문 1건 시퀀스 |

자료: `docs/project-references/legal/` (systemprompt.md, legal-chat-agent-main 문서·설정), legalQ 실서비스 답변(2026-11-21, `capture.mjs`).
사용자 결정(2026-11-21): Seahorse 이름·서비스 링크·캡처 게재, 소속 행 없음, 정성 성과, Selected Work 3번째, legalize-mcp는 본문에만.

생성: `npx astro build --outDir <SITE>` → `node docs/design-drafts/g15/make.mjs <SITE>` → `<SITE>`에서 정적 서버 → `node docs/design-drafts/g15/shoot.mjs <port>` → `node docs/design-drafts/g15/review.mjs`.
구현 확인: 빌드 사본을 서버로 띄우고 `node docs/design-drafts/g15/verify.mjs <port>`.
`capture.mjs`는 실서비스에 질문을 보내므로(IP별 일일 제한) 다시 찍을 때만 쓴다. `peek.mjs`는 첫 화면 확인용.
