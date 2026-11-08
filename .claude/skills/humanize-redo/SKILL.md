---
name: humanize-redo
description: 가장 최근 윤문 결과를 2차로 다시 다듬는다 — 특정 카테고리·문단·강도 조정도 가능. 기존 run_id의 final.md를 입력으로 humanize-korean heavy 경로(진단→윤문→finalize)를 재실행한다. 트리거 — "/humanize-redo".
argument-hint: "[조정 지시 — 예: \"번역투만 다시\" \"이 문단만\" \"강도 낮춰\"]"
disable-model-invocation: true
---

# /humanize-redo — 2차 윤문 / 부분 재실행

cwd 기준 가장 최근 `_workspace/{run_id}/`를 찾아 그 `final.md`로 `humanize-korean` 스킬의 heavy 경로를 P1부터 재실행한다.

## 사용자 지시
$ARGUMENTS

## 동작
1. `Glob`으로 `_workspace/YYYY-MM-DD-*/final.md`(또는 `01_input.txt`)를 매칭해 최신 `run_id` 식별. 없으면 "이전 실행이 없습니다. `/humanize`로 시작하세요" 안내 후 종료.
2. 이전 `final.md`를 `final_prev.md`로 백업한 뒤, `humanize-korean` SKILL.md의 "부분 재실행 / 후속 명령" 표대로 **heavy 경로(P1 진단 → P2 윤문 → P2.4·P2.5 게이트 → P3 finalize)** 를 실행한다. 입력은 기존 run_id의 `final.md`다.
3. 사용자 지시는 P1 진단(`humanize-diagnostician`) 입력에 함께 넘겨 겨냥 범위를 정한다:
   - **카테고리 지정**("번역투만", "관용구만", "이모지만") → 지배 패턴을 해당 카테고리로 한정
   - **문단 지정**("이 문단만", "두 번째 문단만") → 해당 문단만 입력으로 새 run_id 생성
   - **강도 조정**("강도 낮춰"·"보수적으로" → 지배 패턴 수 줄임, "강도 높여" → 늘림, 3~6개 범위)
   - **롤백 요청**("이 변경 되돌려줘") → LLM 콜 없이 해당 문장을 `final_prev.md`(또는 `01_input.txt`)의 문장으로 되돌린다
   - 지시 없음·"2차 윤문해줘" → 제한 없이 heavy 재실행
4. 결과 전달은 `humanize-korean`의 "결과 전달" 형식을 따르고, `final_prev.md` 대비 변경 요지를 덧붙인다.

## 루프 한도
최대 round 3. 그 이상 미해결이면 `hold_and_report`로 사람 검토 권고.

## 참고
- 풀 파이프라인 신규 실행은 `/humanize`.
- 분류 체계: `humanize-korean/references/ai-tell-taxonomy.md`
