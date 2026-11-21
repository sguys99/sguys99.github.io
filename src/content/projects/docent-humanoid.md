---
title:
  en: Docent Humanoid Robot for a Brand Experience Center
  ko: 브랜드 체험관 도슨트 휴머노이드 로봇 구축
summary:
  en: Delivering a docent humanoid robot that guides visitors through a brand experience center with voice conversation and autonomous navigation.
  ko: 음성 대화와 자율주행으로 관람객에게 브랜드 체험관을 안내하는 도슨트 휴머노이드 로봇 구축
highlights:
  - en: Managing the project as PM, defining scope, WBS, and acceptance criteria and running kickoff and interim reviews.
    ko: 프로젝트 관리(PM), 과업 범위·WBS·검수 기준 수립, 착수 및 중간 보고
  - en: Designing the architecture for voice conversation (STT/TTS), tour scenarios, SLAM-based autonomous navigation, and a LiDAR/depth collision-avoidance safety system.
    ko: 음성 대화(STT, TTS), 안내 시나리오, SLAM 기반 자율주행, LiDAR·깊이 센서 기반 충돌 방지 안전 체계 아키텍처 설계
  - en: Building a control dashboard for robot status and alarms, scenario execution, language settings, and E-Stop.
    ko: 로봇 상태·알람 모니터링, 시나리오 실행, 언어 설정, 비상정지(E-Stop) 기능을 갖춘 관제 대시보드 개발
period: { start: 2026-10, end: 2027-01, status: planned }
org: { en: GenON, ko: GenON }
client:
  public: false
  label: { en: Global F&B company, ko: 글로벌 식음료 기업 }
lead: true
domain: Robotics
capability: [Physical AI]
stack: [AgiBot X2 Ultra, AgiBot SDK, SLAM, FastAPI, React, Next.js, External STT/TTS APIs]
featured: true
order: 2
caseStudy:
  context:
    - en: A global F&B company commissioned a docent humanoid robot to welcome visitors in the lobby of its brand experience center, as the first step toward an AI docent.
      ko: 글로벌 식음료 기업이 브랜드 체험관 로비에서 관람객을 맞이할 도슨트 휴머노이드 로봇을 AI 도슨트의 첫 단계로 도입하는 과제
  problem:
    - en: One robot has to talk, gesture, walk, and carry a basket through one continuous welcome sequence.
      ko: 로봇 한 대가 대화, 제스처, 보행, 바구니 운반을 하나의 연속된 환영 시나리오로 수행해야 하는 과제
    - en: Foreign visitors depended on staff who spoke their language, so the welcome had to run in Korean, English, Chinese, and Japanese.
      ko: 외국인 응대가 언어 가능 인력에 의존해 한국어, 영어, 중국어, 일본어 4개국어 응대가 필요
    - en: Lobby noise and echo make names hard to recognize, and the robot must never call a visitor by the wrong name.
      ko: 로비 소음과 반향으로 성함 인식이 어렵고, 잘못된 이름으로 부르는 일은 막아야 하는 조건
    - en: It operates among visitors, including children, so collision avoidance and an emergency stop are required.
      ko: 어린이를 포함한 관람객 사이에서 동작하므로 충돌 방지와 비상정지(E-Stop)가 필수 안전 요건
  role:
    - en: Project Manager (PM) and architect, defining scope, WBS, and acceptance criteria and running kickoff and interim reviews.
      ko: 프로젝트 관리(PM) 및 아키텍처 설계 담당, 과업 범위·WBS·검수 기준 수립, 착수 및 중간 보고
  approach:
    - en: Designed a lobby welcome of four continuous scenarios (welcome, name check, souvenir handout, photo time) that a docent starts from a tablet or with a wake word.
      ko: 환영 인사, 성함 확인, 기념품 전달, 포토타임의 4대 시나리오를 연속 동선으로 설계, 도슨트가 태블릿이나 호출어로 시작
    - en: Separated understanding and planning (System 2) from real-time control (System 1) so control holds when a decision lags, and kept scenarios running onboard so a tour continues through network outages.
      ko: 이해·계획(System 2)과 실시간 제어(System 1)를 분리해 판단이 지연돼도 제어를 유지하고, 시나리오를 로봇 온보드에서 실행해 네트워크 장애에도 회차가 멈추지 않는 구조 설계
    - en: Designed two-stage collision avoidance with LiDAR and depth sensors and a three-path emergency stop wired straight to whole-body control.
      ko: LiDAR·깊이 센서 기반 2단계 충돌 방지와 전신 제어에 직결되는 3경로 비상정지 설계
    - en: Building a control dashboard for robot status and alarms, scenario control, language settings, visitor lists, and E-Stop.
      ko: 로봇 상태·알람 모니터링, 시나리오 제어, 언어 설정, 방문객 명단, E-Stop 기능을 갖춘 관제 대시보드 개발
  decisions:
    - title:
        en: Names matched against the visitor list
        ko: 성함은 사전 명단 안에서 대조
      rationale:
        en: Speech recognition only has to pick from the visitors registered for the tour, which lifts accuracy on proper nouns; if confidence stays low after one retry, the robot greets without a name.
        ko: 음성 인식 결과를 회차별 등록 명단 후보 안에서만 대조해 고유명사 인식 정확도를 높이고, 한 번 되물어도 신뢰도가 낮으면 이름 없이 인사해 오호칭을 막음
      tradeoff:
        en: Staff register each tour's list beforehand; the list is deleted when the tour ends.
        ko: 회차마다 명단 사전 등록 필요 (회차 종료 시 자동 삭제)
    - title:
        en: Fixed-pose basket instead of grasping
        ko: 파지 대신 고정 자세 적재
      rationale:
        en: A docent sets the basket on the robot's arms held in a fixed pose, which removes grasp failures while the robot walks.
        ko: 도슨트가 고정 자세의 로봇 팔 위에 바구니를 올려 보행 중 파지 실패 요인을 없앰
      tradeoff:
        en: A docent hands over the basket; grasping is left for Step 2.
        ko: 바구니 전달에 도슨트 손이 필요, 파지는 Step 2로 미룸
    - title:
        en: Stop signals skip the LLM layers
        ko: 정지 신호는 LLM 계층을 거치지 않음
      rationale:
        en: All three E-Stop paths go through a separate safety channel straight to whole-body control, so any one of them stops the robot even if planning or dialogue stalls.
        ko: 3경로 비상정지가 모두 별도 안전 채널로 전신 제어에 직결되어, 계획·대화 계층이 멈춰도 어느 한 경로로 즉시 정지
      tradeoff:
        en: The physical button cuts torque and the robot may fall, so voice and dashboard are the standard stops in service.
        ko: 물리 버튼은 0 토크 정지라 쓰러질 수 있어, 운영 중 표준 경로는 음성과 대시보드
    - title:
        en: External speech APIs, everything else on site
        ko: 음성은 외부 API, 나머지는 현장 완결
      rationale:
        en: Proven STT/TTS APIs gave four languages at once; dialogue flow, voice preprocessing, and cached phrases stay onboard to limit API latency, and logs never leave the site.
        ko: 검증된 STT/TTS API로 4개국어를 바로 확보하고, 대화 흐름·음성 전처리·멘트 캐시는 온보드에서 처리해 API 지연 영향을 줄이며 로그는 현장 밖으로 나가지 않음
      tradeoff:
        en: Needs outbound internet for the APIs; a fully closed network would need a local GPU server.
        ko: API용 외부망 허용 필요, 완전 폐쇄망이면 로컬 GPU 서버 별도 필요
  compare:
    title: { en: Robot selection, ko: 기종 선정 }
    options:
      - name: Unitree G1 (EDU)
        image: ../../assets/robots/unitree-g1.jpg
        alt: { en: 'Unitree G1 humanoid robot, front view', ko: Unitree G1 휴머노이드 로봇 정면 }
      - name: AgiBot X2 Ultra
        image: ../../assets/robots/agibot-x2-ultra.jpg
        alt: { en: 'AgiBot X2 Ultra humanoid robot with a face display, front view', ko: 얼굴 화면이 있는 AgiBot X2 Ultra 휴머노이드 로봇 정면 }
    pick: 1
    rows:
      - label: { en: Face display, ko: 얼굴 디스플레이 }
        values:
          - { en: 'None; needs a custom front panel and expression control', ko: '미탑재, 전면부 개조와 표정 제어 개발 필요' }
          - { en: 'Built in; expressions and LED through the SDK', ko: '기본 탑재, SDK 표정 제어·LED' }
      - label: { en: Head and gaze, ko: 헤드와 시선 }
        values:
          - { en: 'Fixed head, no neck joint', ko: '헤드 고정, 목 자유도 없음' }
          - { en: 'Neck joint to face visitors; head touch sensor', ko: '목 관절로 시선 정렬, 헤드 터치 센서' }
      - label: { en: Interaction motions, ko: 인터랙션 모션 }
        values:
          - { en: 'Basic gestures; scenario motions built in-house', ko: '기본 제스처 위주, 시나리오 모션 직접 개발' }
          - { en: '28 presets plus a custom motion tool', ko: '프리셋 28종, 커스텀 모션 제작·배포' }
      - label: { en: Navigation sensors, ko: 자율주행 센서 }
        values:
          - { en: 'LiDAR −7° to 52° vertical; blind spot near the floor', ko: 'LiDAR 수직 −7°~52°, 근거리 바닥 사각' }
          - { en: 'LiDAR ±45° vertical; 156° wide-angle stereo', ko: 'LiDAR 수직 ±45°, 광각 스테레오 156°' }
      - label: { en: Charging in service, ko: 운영 중 충전 }
        values:
          - { en: 'Battery swap; about 2 hours continuous', ko: '불가 (배터리 교체식), 연속 약 2시간' }
          - { en: Walks back to a charging spot, ko: '가능 (충전 스팟 복귀 연계)' }
      - label: { en: 'Height, weight', ko: 크기·무게 }
        values:
          - { en: '1.32 m, 35 kg', ko: '1.32m, 35kg' }
          - { en: '1.31 m, 39 kg', ko: '1.31m, 39kg' }
    verdict:
      en: Chose X2 Ultra because it meets every requirement with stock hardware, so no modification was needed, and a unit in local stock removed the 7–10 week import lead time. The software absorbs each robot's SDK in its hardware layer, so the same stack runs on G1.
      ko: X2 Ultra 선정. 모든 요구 사항을 기본 사양으로 충족해 하드웨어 개조가 필요 없고, 국내 재고로 7~10주 해외 조달 기간을 없앴다. 소프트웨어는 기종별 SDK를 하드웨어 계층에서 흡수해 같은 스택이 G1에서도 동작한다.
    credit: { en: 'Product images: Unitree Robotics, AgiBot', ko: '제품 이미지: Unitree Robotics, AgiBot' }
  journey:
    note:
      en: A docent starts each tour with a tablet button or a wake word. The robot runs all four steps in one pass, says goodbye, and walks back to the waiting zone to charge.
      ko: 도슨트가 태블릿 버튼이나 호출어로 회차를 시작한다. 로봇은 네 단계를 이어서 수행하고, 마무리 인사 후 대기 구역으로 돌아가 충전한다.
    steps:
      - title: { en: Welcome, ko: 환영 인사 }
        body:
          en: Walks out to the welcome spot, waves, and greets visitors in the selected language.
          ko: 환영 위치로 걸어 나와 손을 흔들고 선택한 언어로 환영 인사
        tags: { en: navigation · gesture · voice · face display, ko: 자율주행·제스처·음성·얼굴 화면 }
      - title: { en: Name check, ko: 성함 확인 }
        body:
          en: Asks for a name, matches it against the visitor list, and greets the visitor by name; if unsure, asks once more, then greets without a name.
          ko: 성함을 묻고 사전 등록 명단과 대조해 이름으로 인사. 확신이 낮으면 한 번 되묻고, 그래도 실패하면 이름 없이 인사
        tags: { en: STT · list match · TTS, ko: STT·명단 대조·TTS }
      - title: { en: Souvenir handout, ko: 기념품 전달 }
        body:
          en: Carries a basket on fixed-pose arms along a set route at low speed while visitors take one.
          ko: 고정 자세로 바구니를 받치고 정해진 동선을 저속 보행, 관람객이 직접 수령
        tags: { en: balance control · navigation, ko: 균형 제어·자율주행 }
      - title: { en: Photo time, ko: 포토타임 }
        body:
          en: Lines up at the photo spot, offers a high five, finger heart, or signature pose, and counts down on its face display.
          ko: 포토스팟에서 하이파이브, 손가락 하트, 시그니처 포즈를 취하고 얼굴 화면으로 카운트다운
        tags: { en: gesture · face display, ko: 제스처·얼굴 화면 }
  safety:
    - en: Slows within 1 m and stops within 0.5 m using LiDAR and a depth camera, and resumes when the visitor steps away; walls and exhibits on the map are exempt, and the rule is lifted while the robot stands still to interact.
      ko: LiDAR·깊이 카메라로 1m 이내 감속, 0.5m 이내 정지, 관람객이 물러나면 자동 재개. 지도에 있는 벽·전시물은 예외이며, 멈춰서 인터랙션하는 동안에는 근접 정지 규칙을 해제
    - en: The remote button cuts torque as a last resort; the voice command and dashboard button stop the robot standing, and dashboard stops are logged.
      ko: 리모컨 물리 버튼은 0 토크 정지로 최후 수단, 음성과 대시보드 버튼은 선 상태로 멈추며 대시보드 정지는 감사 로그로 기록
  outcome:
    - en: Kicked off in Oct 2026, with a pilot run planned for Dec 2026 and the completion report for Jan 2027.
      ko: 2026년 10월 착수, 2026년 12월 시범운영과 2027년 1월 완료 보고 예정
    - en: Proposed acceptance criteria of 90%+ success over 10 consecutive runs of all four scenarios, 90%+ name recognition against the visitor list, and language switching within 3 seconds.
      ko: '검수 기준(안) 수립: 4대 시나리오 연속 10회 성공률 90% 이상, 명단 기반 성함 인식 성공률 90% 이상, 언어 전환 3초 이내'
  roadmap:
    title: { en: Next steps, ko: 단계 확장 }
    tasks:
      - { en: Welcome, ko: 환영과 맞이 }
      - { en: "Guidance,\nsmall talk", ko: 기본 안내·대화 }
      - { en: "Key\nexhibits", ko: 주요 전시 해설 }
      - { en: Escorting, ko: 동선 인솔 }
      - { en: "In-depth\nzones", ko: "구역별\n심화 해설" }
      - { en: "Hands-on\narea", ko: "체험 공간\n안내" }
    stages:
      - { label: { en: Before, ko: 도입 전 }, robot: 0 }
      - { label: { en: 'Step 1, this project', ko: Step 1 (본 사업) }, robot: 2 }
      - { label: { en: 'Step 2, proposed', ko: Step 2 (제안) }, robot: 5 }
    note:
      en: Step 2 adds software modules on the same robot and sensors; its timing and scope will be set from pilot data. The docent's role moves from explaining to designing scenarios and content.
      ko: Step 2는 같은 로봇과 센서에 소프트웨어 모듈만 추가하며, 시점과 범위는 시범운영 데이터로 협의한다. 도슨트의 역할은 설명자에서 시나리오·콘텐츠 설계자로 바뀐다.
---
