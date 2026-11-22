---
title:
  en: Docent Humanoid Robot for a Brand Experience Center
  ko: 브랜드 체험관 도슨트 휴머노이드 로봇 구축
summary:
  en: Deliver a docent humanoid robot that guides visitors through a brand experience center using voice conversation and autonomous navigation.
  ko: 음성 대화와 자율주행으로 관람객에게 브랜드 체험관을 안내하는 도슨트 휴머노이드 로봇 구축
highlights:
  - en: Manage the project as PM, define the scope, WBS, and acceptance criteria, and lead kickoff and interim reviews.
    ko: 프로젝트 관리(PM)를 맡아 과업 범위, WBS, 검수 기준을 정하고 착수와 중간 보고 진행
  - en: Design the architecture for voice conversation (STT/TTS), tour scenarios, SLAM-based autonomous navigation, and a collision-avoidance safety system with LiDAR and depth sensors.
    ko: 음성 대화(STT/TTS), 안내 시나리오, SLAM 기반 자율주행, LiDAR와 깊이 센서를 쓰는 충돌 방지 안전 체계의 아키텍처 설계
  - en: Build a control dashboard for monitoring robot status and alarms, running scenarios, setting the language, and triggering E-Stop.
    ko: 관제 대시보드에 로봇 상태와 알람 표시, 시나리오 실행, 언어 설정, 비상정지(E-Stop) 기능 구현
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
      ko: 글로벌 식음료 기업이 AI 도슨트 도입의 첫 단계로 브랜드 체험관 로비에서 관람객을 맞이할 도슨트 휴머노이드 로봇 발주
  problem:
    - en: One robot has to talk, gesture, walk, and carry a basket through a single welcome sequence.
      ko: 하나의 환영 시나리오에서 로봇 한 대가 대화, 제스처, 보행, 바구니 운반을 연속 수행해야 한다는 요구
    - en: Foreign visitors depended on staff who spoke their language, so the welcome had to run in Korean, English, Chinese, and Japanese.
      ko: 외국인 관람객은 해당 언어를 구사하는 직원만 응대할 수 있어 한국어, 영어, 중국어, 일본어 4개국어 안내 필요
    - en: Lobby noise and echo make names hard to recognize, and the robot must never call a visitor by the wrong name.
      ko: 로비 소음과 반향으로 성함을 알아듣기 어려운 상황에서도 잘못된 이름으로 인사하는 실수 방지
    - en: It operates among visitors, including children, so collision avoidance and an emergency stop are required.
      ko: 어린이를 포함한 관람객 사이에서 동작하므로 충돌 방지와 비상정지(E-Stop)가 필수 안전 요건
  role:
    - en: Project Manager (PM) and architect, defining scope, WBS, and acceptance criteria and running kickoff and interim reviews.
      ko: 프로젝트 관리(PM)와 아키텍처 설계를 맡아 과업 범위, WBS, 검수 기준을 정하고 착수와 중간 보고 진행
  approach:
    - en: Designed a lobby welcome of four continuous scenarios (welcome, name check, souvenir handout, photo time) that a docent starts from a tablet or with a wake word.
      ko: 로비 동선을 환영 인사, 성함 확인, 기념품 전달, 포토타임의 4개 시나리오로 연결해 도슨트가 태블릿이나 호출어로 시작하도록 설계
    - en: Separated understanding and planning (System 2) from real-time control (System 1) so control holds when a decision lags, and kept scenarios running onboard so a tour continues through network outages.
      ko: 이해와 계획(System 2)을 실시간 제어(System 1)와 분리해 판단이 늦어져도 제어 유지. 네트워크 장애에도 안내를 계속하도록 로봇에서 시나리오 실행.
    - en: Designed two-stage collision avoidance with LiDAR and depth sensors and a three-path emergency stop wired straight to whole-body control.
      ko: LiDAR와 깊이 센서를 쓰는 2단계 충돌 방지와 전신 제어에 직접 연결한 3경로 비상정지 설계
    - en: Build a control dashboard that displays robot status, alarms, and visitor lists and lets operators control scenarios, set the language, and trigger E-Stop.
      ko: 관제 대시보드에 로봇 상태, 알람, 방문객 명단을 표시하고 시나리오 제어, 언어 설정, E-Stop 기능 구현
  decisions:
    - title:
        en: Names matched against the visitor list
        ko: 회차별 명단과 성함 대조
      rationale:
        en: Matching only names on the tour list improves recognition of proper nouns, and the robot greets the visitor without a name if confidence stays low after one retry.
        ko: 회차별 등록 명단에서만 성함을 대조해 고유명사 인식 정확도를 높이고 한 번 되물어도 신뢰도가 낮으면 이름 없이 인사
      tradeoff:
        en: Staff register each tour's list in advance, and the list is deleted automatically when the tour ends.
        ko: 직원이 회차별 명단을 미리 등록하고 회차 종료 시 자동 삭제
    - title:
        en: Fixed-pose basket instead of grasping
        ko: 파지 대신 고정 자세 적재
      rationale:
        en: A docent sets the basket on the robot's arms held in a fixed pose, which removes grasp failures while the robot walks.
        ko: 도슨트가 고정 자세의 로봇 팔 위에 바구니를 올려 보행 중 파지 실패 방지
      tradeoff:
        en: A docent hands over the basket in this phase, with robot grasping proposed for Step 2.
        ko: 도슨트가 바구니를 건네고 로봇의 파지는 Step 2에서 도입
    - title:
        en: Stop signals skip the LLM layers
        ko: 정지 신호의 LLM 계층 우회
      rationale:
        en: All three E-Stop paths go through a separate safety channel straight to whole-body control, so any one can stop the robot immediately even if planning or dialogue stalls.
        ko: 비상정지 3경로를 모두 별도 안전 채널로 전신 제어에 직접 연결해 계획이나 대화가 멈춰도 어느 경로에서든 즉시 정지
      tradeoff:
        en: The physical button sets torque to zero and the robot may fall, so voice and dashboard are the standard stops in service.
        ko: 물리 버튼으로 0 토크 정지 시 로봇이 쓰러질 수 있어 운영 중에는 음성과 대시보드를 표준 정지 경로로 사용
    - title:
        en: External APIs for speech only
        ko: 음성 처리에만 외부 API 사용
      rationale:
        en: Proven STT/TTS APIs support all four languages immediately, while the robot handles dialogue flow, voice preprocessing, and cached phrases onboard to limit API delays and keeps logs on site.
        ko: 검증된 STT/TTS API로 4개국어를 바로 지원하고 대화 흐름, 음성 전처리, 멘트 캐시는 온보드에서 처리해 API 지연 영향을 줄이며 로그는 현장에만 보관
      tradeoff:
        en: The APIs need outbound internet access, and a fully closed network would need a local GPU server.
        ko: API 호출에는 외부망 접속이 필요하고 완전 폐쇄망에서는 별도 로컬 GPU 서버 필요
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
          - { en: 'Built in; expressions and LED through the SDK', ko: '기본 탑재, SDK로 표정과 LED 제어' }
      - label: { en: Head and gaze, ko: 헤드와 시선 }
        values:
          - { en: 'Fixed head, no neck joint', ko: '헤드 고정, 목 자유도 없음' }
          - { en: 'Neck joint to face visitors; head touch sensor', ko: '목 관절로 시선 정렬, 헤드 터치 센서' }
      - label: { en: Interaction motions, ko: 인터랙션 모션 }
        values:
          - { en: 'Basic gestures; scenario motions built in-house', ko: '기본 제스처 위주, 시나리오 모션 직접 개발' }
          - { en: '28 presets and a tool to create and deploy custom motions', ko: '프리셋 28종, 커스텀 모션 제작과 배포' }
      - label: { en: Navigation sensors, ko: 자율주행 센서 }
        values:
          - { en: 'LiDAR −7° to 52° vertical; blind spot near the floor', ko: 'LiDAR 수직 −7°~52°, 근거리 바닥 사각' }
          - { en: 'LiDAR ±45° vertical; 156° wide-angle stereo', ko: 'LiDAR 수직 ±45°, 광각 스테레오 156°' }
      - label: { en: Charging in service, ko: 운영 중 충전 }
        values:
          - { en: 'No charging in service; swappable battery, about 2 hours of continuous use', ko: '불가 (배터리 교체식), 연속 약 2시간' }
          - { en: Returns to a charging spot to recharge during service, ko: '가능 (충전 스팟 복귀 연계)' }
      - label: { en: 'Height, weight', ko: 키/무게 }
        values:
          - { en: '1.32 m, 35 kg', ko: '1.32m, 35kg' }
          - { en: '1.31 m, 39 kg', ko: '1.31m, 39kg' }
    verdict:
      en: Chose X2 Ultra because it met every requirement without hardware changes and local stock eliminated the 7–10 week wait for an import. The hardware layer handles each robot's SDK, so the same software runs on G1.
      ko: 하드웨어 개조 없이 모든 요구 사항을 충족하고 국내 재고로 해외 조달 기간 7~10주를 아낄 수 있어 X2 Ultra 선정. 하드웨어 계층에서 기종별 SDK를 처리해 같은 소프트웨어가 G1에서도 동작.
    credit: { en: 'Product images: Unitree Robotics, AgiBot', ko: '제품 이미지: Unitree Robotics, AgiBot' }
  journey:
    note:
      en: A docent starts each tour with a tablet button or a wake word. The robot runs all four steps in one pass, says goodbye, and walks back to the waiting zone to charge.
      ko: 도슨트가 태블릿 버튼이나 호출어로 회차 시작. 로봇은 네 단계를 연달아 수행한 뒤 마무리 인사를 하고 대기 구역으로 돌아가 충전.
    steps:
      - title: { en: Welcome, ko: 환영 인사 }
        body:
          en: Walks out to the welcome spot, waves, and greets visitors in the selected language.
          ko: 환영 위치로 걸어 나와 손을 흔들고 선택한 언어로 환영 인사
        tags: { en: 'navigation, gesture, voice, face display', ko: 자율주행/제스처/음성/얼굴 화면 }
      - title: { en: Name check, ko: 성함 확인 }
        body:
          en: Asks for a name, checks it against the visitor list, and greets the visitor by name. If unsure, asks once more and skips the name if the match is still uncertain.
          ko: 성함을 묻고 사전 등록 명단과 대조해 이름으로 인사. 확신이 낮으면 한 번 되묻고 그래도 확인이 어려우면 이름 없이 인사.
        tags: { en: 'STT, list match, TTS', ko: STT/명단 대조/TTS }
      - title: { en: Souvenir handout, ko: 기념품 전달 }
        body:
          en: Carries a basket on fixed-pose arms along a set route at low speed while visitors pick up their own souvenirs.
          ko: 고정 자세로 바구니를 받치고 정해진 동선을 저속 보행, 관람객이 직접 수령
        tags: { en: 'balance control, navigation', ko: 균형 제어/자율주행 }
      - title: { en: Photo time, ko: 포토타임 }
        body:
          en: Lines up at the photo spot, offers a high five, finger heart, or signature pose, and counts down on its face display.
          ko: 포토스팟에서 하이파이브, 손가락 하트, 시그니처 포즈를 취하고 얼굴 화면으로 카운트다운
        tags: { en: 'gesture, face display', ko: 제스처/얼굴 화면 }
  safety:
    - en: Uses LiDAR and a depth camera to slow within 1 m, stop within 0.5 m, and resume automatically when the visitor steps away. The robot ignores mapped walls and exhibits when checking distance and suspends the proximity rule while standing still to interact.
      ko: LiDAR와 깊이 카메라로 1m 이내에서 감속하고 0.5m 이내에서 정지한 뒤 관람객이 물러나면 자동 재개. 지도에 있는 벽과 전시물은 예외로 두고 제자리에 서서 관람객과 소통하는 동안에는 근접 정지 규칙을 해제.
    - en: The physical button on the remote sets torque to zero as a last resort. Voice and dashboard commands stop the robot upright, and each dashboard stop goes into the audit log.
      ko: 리모컨 물리 버튼은 0 토크로 정지하는 최후 수단. 음성이나 대시보드 버튼으로 정지하면 선 자세를 유지하며 대시보드 정지는 감사 로그로 기록.
  outcome:
    - en: Kicked off in Oct 2026, with a pilot run planned for Dec 2026 and the completion report for Jan 2027.
      ko: 2026년 10월 착수, 2026년 12월 시범운영과 2027년 1월 완료 보고 예정
    - en: Proposed acceptance criteria of 90%+ success over 10 consecutive runs of all four scenarios, 90%+ name recognition against the visitor list, and language switching within 3 seconds.
      ko: '검수 기준(안) 수립: 4대 시나리오 연속 10회 성공률 90% 이상, 명단 기반 성함 인식 성공률 90% 이상, 언어 전환 3초 이내'
  roadmap:
    title: { en: Next steps, ko: 단계 확장 }
    tasks:
      - { en: Welcome, ko: 환영과 맞이 }
      - { en: "Guidance,\nsmall talk", ko: 기본 안내/대화 }
      - { en: "Key\nexhibits", ko: 주요 전시 해설 }
      - { en: Escorting, ko: 동선 인솔 }
      - { en: "In-depth\nzones", ko: "구역별\n심화 해설" }
      - { en: "Hands-on\narea", ko: "체험 공간\n안내" }
    stages:
      - { label: { en: Before, ko: 도입 전 }, robot: 0 }
      - { label: { en: 'Step 1, this project', ko: Step 1 (본 사업) }, robot: 2 }
      - { label: { en: 'Step 2, proposed', ko: Step 2 (제안) }, robot: 5 }
    note:
      en: Step 2 adds software modules to the same robot and sensors. The project team and the client will agree on timing and scope using pilot data. The docent moves from giving explanations to designing scenarios and content.
      ko: Step 2에서는 같은 로봇과 센서에 소프트웨어 모듈만 추가. 적용 시점과 범위는 시범운영 데이터를 바탕으로 고객과 협의. 도슨트는 해설 대신 시나리오와 콘텐츠 설계 담당.
---
