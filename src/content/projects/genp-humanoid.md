---
title:
  en: GenP Physical AI Humanoid Product
  ko: Physical AI 휴머노이드 제품(GenP) 개발
summary:
  en: Leading development of GenP, an end-to-end Physical AI humanoid product built on a common core with domain profiles for customer-specific deployments.
  ko: 공통 코어 + 도메인 프로파일 구조로 고객 맞춤형 E2E 제품을 구성하는 Physical AI 휴머노이드 제품 GenP 개발 총괄
highlights:
  - en: Own the product as PO, writing the product definition and commercialization roadmap around a common core + domain profiles structure.
    ko: 제품 총괄(PO), 공통 코어 + 도메인 프로파일 구조를 기준으로 제품 정의서와 상용화 로드맵 수립
  - en: Architect a single workflow that integrates voice conversation, VLA manipulation, SLAM navigation, and whole-body control, and design and build a control panel for robot registration, monitoring, logs, alarms, task execution, and emergency stop.
    ko: 음성 대화, VLA 조작, SLAM 기반 자율주행, 전신 제어를 하나의 워크플로우로 통합하는 아키텍처 설계, 로봇 등록, 상태 모니터링, 로그·알람, 태스크 실행, 비상정지 기능을 갖춘 관제시스템 설계 및 개발
  - en: Lead the data and model pipeline, from Teleop data collection to VLA training and evaluation and a simulation environment for validation.
    ko: Teleop 조작 데이터 수집부터 VLA 학습·평가, 시뮬레이션 검증 환경까지 데이터·모델 파이프라인 총괄
period: { start: 2026-07, status: present }
org: { en: GenON, ko: GenON }
lead: true
domain: Robotics
capability: [Physical AI]
stack: [Unitree G1, GR00T N1.7 (VLA), GEAR-SONIC (WBC), Nav2, FAST-LIO2, FSR-VLN, ROS 2, ZMQ, Whisper, FastAPI, Next.js]
featured: true
order: 1
caseStudy:
  context:
    - en: GenON is building GenP, a Physical AI product that delivers a working humanoid robot system to customer sites on-premises, from site setup to monitoring and operations tools.
      ko: GenON이 고객 현장에서 물리 태스크를 수행하는 휴머노이드 로봇 시스템을 현장 맞춤 구축부터 모니터링·운영 도구까지 통합(E2E)해 온프렘으로 납품하는 Physical AI 제품 GenP 개발
    - en: Phase 1, through December 2026, covers three domains (living support, docent, and site inspection) with one standard set of a robot and a local server.
      ko: Phase 1(~2026.12)은 생활 지원, 홍보관 도슨트, 현장 감시 3개 도메인을 로봇 1대 + 로컬 서버 1대의 표준 구성 1식으로 대응
  problem:
    - en: Voice conversation, VLA manipulation, navigation, and whole-body control had to run as one workflow, so the robot arrives ready to work rather than as separate demos.
      ko: 음성 대화, VLA 조작, 자율주행, 전신 제어를 하나의 실행 워크플로우로 묶어, 개별 시연이 아닌 가용 가능한 상태로 납품해야 하는 과제
    - en: Each domain needs its own tasks and content, but the core has to be reused rather than rebuilt for every customer.
      ko: 도메인마다 태스크와 콘텐츠는 다르지만, 고객마다 코어를 다시 개발하지 않고 재사용해야 하는 구조
    - en: A demo is not an acceptance test; tasks must succeed in repeated runs under fixed conditions, and stopping the robot must not depend on the planning layers.
      ko: 시연과 검수는 다른 수준으로, 고정 조건 반복 시행에서 성공해야 하고 로봇 정지는 계획 계층에 의존하지 않아야 하는 조건
    - en: Sites may run closed networks, and raw video must not leave the site.
      ko: 현장이 폐쇄망일 수 있고, 영상 원본은 현장 밖으로 반출할 수 없는 조건
  role:
    - en: Product Owner (PO) and development lead, writing the product definition, system specification, and commercialization roadmap, and leading the architecture and the data and model pipeline.
      ko: 제품 총괄(PO) 및 개발 리드, 제품 정의서·제품 사양서·상용화 로드맵 작성, 아키텍처와 데이터·모델 파이프라인 총괄
  approach:
    - en: Defined the product as a domain-neutral common core plus domain profiles, so customers differ only in task packs, content, and sensor options.
      ko: 도메인 중립 공통 코어 + 도메인 프로파일로 제품을 정의해, 고객별 차이는 태스크 팩·콘텐츠·센서 옵션에서만 발생
    - en: Split control into perception, a VLA policy, whole-body control, and motors, serving the models from a local server and running real-time control on the robot.
      ko: 인지·VLA 정책·전신 제어·모터로 계층을 나누고, 모델은 로컬 서버에서 서빙하고 실시간 제어는 로봇 온보드에서 실행
    - en: Designing the Phase 2 and 3 architecture, with a planner that composes tasks and an Ops platform for many robots and sites, and building the control panel for monitoring, alarms, task runs, and emergency stop.
      ko: 태스크를 스스로 계획·조합하는 플래너와 다수 로봇·현장을 운영하는 Ops 플랫폼으로 Phase 2·3 아키텍처 설계, 모니터링·알람·태스크 실행·비상정지 기능의 관제시스템 개발
    - en: Setting up the data and model pipeline, from Teleop collection and a standard episode schema to VLA fine-tuning and staged evaluation offline, in simulation, and on the robot.
      ko: Teleop 수집과 표준 에피소드 스키마부터 VLA 파인튜닝, 오프라인·시뮬레이션·실기 단계별 평가까지 데이터·모델 파이프라인 구축
  decisions:
    - title:
        en: Build the stack, not the robot or the foundation model
        ko: 기체와 파운데이션 모델은 만들지 않음
      rationale:
        en: A stock humanoid and open models (GR00T N1.7, GEAR-SONIC) carry the hardware and base skills, so the effort goes into the custom AI stack, site delivery, and operations.
        ko: 상용 기체와 공개 모델(GR00T N1.7, GEAR-SONIC)로 하드웨어와 기본 능력을 확보하고, 맞춤형 AI 스택·현장 딜리버리·운영에 집중
      tradeoff:
        en: An edge built on open models is short-lived, so site data and the task library have to become the lasting advantage.
        ko: 공개 모델 기반 기술 우위는 일시적이라, 현장 데이터와 태스크 라이브러리를 축적해야 함
    - title:
        en: Customize by swapping modules only
        ko: 고객 맞춤은 모듈 교체로만
      rationale:
        en: Only scenarios and task modules change per site while the core stays fixed, so each delivery adds reusable assets to a catalog.
        ko: 시나리오와 태스크 모듈만 교체하고 코어는 그대로 두어, 납품마다 재사용 자산이 자산 카탈로그에 쌓임
      tradeoff:
        en: After feature freeze, changes are limited to scenarios and content.
        ko: 기능 동결 이후 변경은 시나리오와 콘텐츠 교체로 한정
    - title:
        en: One local server completes the site
        ko: 로컬 서버 1대로 현장 완결
      rationale:
        en: Models, the control panel, and logs run on site, so raw video never leaves; an export gateway and remote access are options.
        ko: 모델·관제시스템·로그가 현장 서버에서 동작해 영상 원본이 밖으로 나가지 않고, 반출 게이트웨이와 원격 접속은 옵션
      tradeoff:
        en: Speech and LLM use commercial APIs; a closed-network site needs them moved on-prem with extra GPUs.
        ko: 음성·LLM은 상용 API를 쓰므로, 폐쇄망 현장은 온프렘 전환과 GPU 증설이 필요
    - title:
        en: Stops never wait on planning
        ko: 비상정지는 계획 계층을 기다리지 않음
      rationale:
        en: Voice, a physical button, and the control panel each stop the robot; the voice stop fires on partial transcripts before recognition finishes, and no stop can be released remotely.
        ko: 음성·물리 버튼·관제시스템 3경로가 각각 로봇을 멈추고, 음성 정지는 ASR 확정 전 부분 전사로 먼저 동작하며, 원격 해제는 불가
      tradeoff:
        en: Operation stays in supervised mode until a risk assessment sets the speed and distance limits.
        ko: 위험성 평가로 속도·거리 기준이 정해질 때까지 감독 모드로만 운영
  domains:
    title: { en: Domain profiles, ko: 도메인 프로파일 }
    heads:
      domain: { en: Domain, ko: 도메인 }
      basic: { en: Basic pack, ko: 기본 팩 }
      tech: { en: Key technology, ko: 핵심 기술 }
      measure: { en: Measured by, ko: 검증 지표 }
    items:
      - name: { en: Living support, ko: 생활 지원 }
        focus: { en: Manipulation, ko: 조작 중심 }
        status: { kind: done, label: { en: Demonstrated, ko: 시연 완료 } }
        basic: { en: 'Deliver items and drinks, take out trash, move small objects', ko: '물품·음료 전달, 쓰레기 배출, 작은 물건 이동' }
        option: { en: 'Laundry, recycling, clearing tables', ko: '세탁물 정리, 분리수거, 식탁 치우기' }
        tech: { en: 'Manipulation, close-range safety around people', ko: 'Manipulation, 대인 근접 안전' }
        measure: { en: 'Residents per staff member, anomaly-to-response time, tasks handled per day', ko: '운영 인력 1인당 담당 세대, 이상 감지→대응 시간, 위임 태스크 처리 건수' }
      - name: { en: Docent, ko: 홍보관 도슨트 }
        focus: { en: Dialogue and guidance, ko: 대화와 안내 중심 }
        status: { kind: draft, label: { en: Draft, ko: 초안 } }
        basic: { en: 'Guide route and stops, greetings, visitor Q&A', ko: '안내 동선·정위치, 안내 인사, 관람객 Q&A' }
        option: { en: 'Photo poses, exhibit guide, follow-me guide', ko: '포토 모션, 전시 안내, 대상 추종 안내' }
        tech: { en: 'Commentary content, crowd navigation, speaker separation', ko: '해설 콘텐츠, 밀집 주행, 화자 분리' }
        measure: { en: 'Guided sessions per day, visitor satisfaction, staff replacement rate', ko: '안내 세션 수, 관람객 만족도, 상주 인력 대체율' }
      - name: { en: Site inspection, ko: 현장 감시 }
        focus: { en: Movement and perception, ko: 이동과 인식 중심 }
        status: { kind: todo, label: { en: To define, ko: 정의 예정 } }
        basic: { en: 'Patrol route and return, photograph and read status, detect anomalies and alert', ko: '순찰 동선·복귀, 지점 촬영·상태 판독, 이상 탐지·알림' }
        option: { en: 'Patrol reports, night patrol, special sensors', ko: '순찰 리포트, 야간 순찰, 특수 센서 계측' }
        tech: { en: 'Vision reading, scheduled patrol, remote monitoring', ko: 'Vision 판독, 스케줄 순찰, 원격 모니터링' }
        measure: { en: 'Patrol coverage, anomaly-to-alert time, inspection hours saved', ko: '순찰 커버리지, 이상 감지→통보 시간, 점검 공수 절감' }
    note: { en: 'Status as of September 2026. “+” marks the option pack.', ko: '상태는 2026년 9월 기준. "+"는 옵션 팩.' }
  archNote:
    en: 'Target architecture for Phase 2 and 3. A planner composes tasks on its own instead of running predefined scenarios, and an Ops platform runs many robots and sites together.'
    ko: 'Phase 2·3 목표 구조. 사전 정의된 시나리오 실행을 넘어 플래너가 상황에 맞게 태스크를 스스로 계획·조합하고, Ops 플랫폼으로 여러 로봇과 현장을 통합 운영한다.'
  hardware:
    title: { en: 'Standard set: one robot and one local server', ko: '표준 구성 1식: 로봇 1대 + 로컬 서버 1대' }
    image: ../../assets/robots/unitree-g1.jpg
    alt: { en: 'Unitree G1 humanoid robot, front view', ko: Unitree G1 휴머노이드 로봇 정면 }
    robot:
      name: { en: Unitree G1 · on-board, ko: Unitree G1 · 온보드 }
      sub: { en: PC1 motors · PC2 Jetson Orin NX, ko: PC1 모터 · PC2 Jetson Orin NX }
      items:
        - { name: { en: Whole-body control, ko: 전신 제어 }, value: { en: GEAR-SONIC, ko: GEAR-SONIC } }
        - { name: { en: Navigation, ko: 자율주행 }, value: { en: Nav2 + FAST-LIO2, ko: Nav2 + FAST-LIO2 } }
        - { name: { en: 'Voice, sensors', ko: 음성·센서 }, value: { en: ROS 2 nodes, ko: ROS 2 노드 } }
        - { name: { en: Planner, ko: 플래너 }, value: { en: 'behavior tree, in review', ko: Behavior Tree (검토 중) } }
    server:
      name: { en: Local server · off-board, ko: 로컬 서버 · 오프보드 }
      sub: { en: one GPU server per site, ko: 현장당 GPU 서버 1대 }
      items:
        - { name: { en: VLA policy server, ko: VLA 정책 서버 }, value: { en: GR00T N1.7, ko: GR00T N1.7 } }
        - { name: { en: VLN server, ko: VLN 서버 }, value: { en: FSR-VLN, ko: FSR-VLN } }
        - { name: { en: Control panel, ko: 관제시스템 }, value: { en: Next.js + FastAPI, ko: Next.js + FastAPI } }
        - { name: { en: 'Logs, model versions', ko: 로그·모델 버전 }, value: { en: kept on site, ko: 현장 보관 } }
    external:
      name: { en: External, ko: 외부 }
      sub: { en: 'closed network: move on-prem', ko: 폐쇄망이면 온프렘 전환 }
      items:
        - { name: { en: STT, ko: STT }, value: { en: Whisper, ko: Whisper } }
        - { name: { en: 'LLM, TTS', ko: LLM·TTS }, value: { en: vendor TBD, ko: 선정 중 } }
    links:
      robotServer: [Wi-Fi 6, ROS 2 + ZMQ]
      serverExternal: { en: OUTBOUND, ko: 외부망 }
    specsTitle: { en: Robot specifications, ko: 로봇 사양 }
    specs:
      - { label: { en: Head sensors, ko: 머리 센서 }, value: { en: '3D LiDAR Livox Mid-360, depth camera RealSense D435i', ko: '3D LiDAR Livox Mid-360, 깊이 카메라 RealSense D435i' } }
      - { label: { en: Computers, ko: 컴퓨터 }, value: { en: 'PC1 8-core for motor control, PC2 Jetson Orin NX 16GB (100 TOPS)', ko: 'PC1 8코어 모터 제어, PC2 Jetson Orin NX 16GB (100 TOPS)' } }
      - { label: { en: Joints, ko: 관절 }, value: { en: '23 to 43 DoF by EDU build, dual encoders, knee up to 120 N·m', ko: 'EDU 구성별 23~43 DoF, 이중 엔코더, 무릎 최대 120 N·m' } }
      - { label: { en: Arms, ko: 팔 }, value: { en: 'Payload about 3 kg, gripper as an option', ko: '가반하중 약 3kg, 그리퍼 옵션' } }
      - { label: { en: 'Height, weight', ko: 크기·무게 }, value: { en: '1.32 m, 35 kg', ko: '1.32m, 35kg' } }
      - { label: { en: Battery, ko: 배터리 }, value: { en: '9,000 mAh quick-release, about 2 hours', ko: '9,000mAh 퀵릴리즈, 약 2시간' } }
      - { label: { en: Audio, ko: 오디오 }, value: { en: '4-mic array, 5 W speaker', ko: '마이크 4개 어레이, 5W 스피커' } }
      - { label: { en: Speed, ko: 속도 }, value: { en: 'Up to about 2 m/s; the service limit comes from the risk assessment', ko: '최대 약 2m/s, 운영 속도 상한은 위험성 평가로 확정' } }
      - { label: { en: Link, ko: 통신 }, value: { en: 'Wi-Fi 6, Bluetooth 5.2', ko: 'Wi-Fi 6, Bluetooth 5.2' } }
    credit: { en: 'Product image: Unitree Robotics. Specifications: manufacturer data for the G1 EDU.', ko: '제품 이미지: Unitree Robotics. 사양: G1 EDU 제조사 공개 사양.' }
  loop:
    - en: The data and model pipeline is an in-house facility; customers receive only the trained models.
      ko: 데이터·모델 파이프라인은 사내 설비로 운영하고, 고객에게는 학습된 모델만 납품
  outcome:
    - en: In progress. Wrote the product definition, system specification, and phased commercialization roadmap (Phase 1 to 3, through 2027), with three product gates for readiness to propose, build, and open.
      ko: 진행 중. 제품 정의서, 제품 사양서, 단계별 상용화 로드맵(Phase 1~3, ~2027) 작성, 제안 가능·구축 가능·오픈 가능의 3단계 제품 게이트로 준비 완료 기준 정의
    - en: Trained and demonstrated the living-support basic pack; localization and path planning are implemented, and the control panel and the Phase 2 and 3 architecture are in development.
      ko: 생활 지원 기본 팩 학습·시연 완료, 위치추정·경로계획 구현 완료, 관제시스템과 Phase 2·3 아키텍처 개발 진행 중
    - en: The docent profile is in its first delivery, a brand experience center project with its own case study.
      ko: 도슨트 프로파일은 브랜드 체험관 구축 과제로 첫 적용 진행 중 (별도 케이스 스터디)
---
