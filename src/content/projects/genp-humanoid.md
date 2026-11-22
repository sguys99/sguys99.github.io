---
title:
  en: GenP Physical AI Humanoid Product
  ko: Physical AI 휴머노이드 제품(GenP) 개발
summary:
  en: Lead development of GenP, a Physical AI humanoid product with a common core and domain profiles for customer-specific deployments.
  ko: 공통 코어와 도메인 프로파일로 고객별 요구에 맞춘 Physical AI 휴머노이드 제품 GenP 개발 총괄
highlights:
  - en: Own the product as PO, writing the product definition and commercialization roadmap around a common core + domain profiles structure.
    ko: 제품 총괄(PO)로서 공통 코어 + 도메인 프로파일 구조에 맞춰 제품 정의서와 상용화 로드맵 수립
  - en: Define the architecture for a single workflow combining voice conversation, VLA manipulation, SLAM navigation, and whole-body control. Design and build the control panel for robot registration, status monitoring, logs, alarms, task execution, and emergency stop.
    ko: 음성 대화, VLA 조작, SLAM 자율주행, 전신 제어를 하나의 워크플로우로 통합하는 아키텍처 설계. 로봇 등록, 상태 모니터링, 로그와 알람, 태스크 실행, 비상정지를 지원하는 관제시스템 설계와 개발.
  - en: Lead the data and model pipeline for collecting Teleop manipulation data and VLA training and evaluation, including a simulation environment for validation.
    ko: Teleop 조작 데이터 수집, VLA 학습과 평가, 시뮬레이션 검증 환경을 포함한 데이터와 모델 파이프라인 총괄
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
    - en: GenON is developing GenP, a Physical AI humanoid system that performs tasks at customer sites. Each on-premises deployment combines site-specific setup with tools for monitoring and operations.
      ko: GenON에서 고객 현장의 물리 태스크를 수행하는 Physical AI 휴머노이드 제품 GenP 개발. 현장 맞춤 구축에 모니터링과 운영 도구를 통합(E2E)해 온프레미스로 납품.
    - en: Phase 1, through December 2026, covers three domains (living support, exhibit guides, and site inspection) with one standard set of a robot and a local server.
      ko: Phase 1(~2026.12)에는 로봇 1대와 로컬 서버 1대를 표준 구성 1식으로 묶어 생활 지원, 홍보관 도슨트, 현장 감시 3개 도메인에 적용
  problem:
    - en: Voice conversation, VLA manipulation, navigation, and whole-body control had to work together in one workflow so customers could put the robot to work on delivery.
      ko: 로봇을 납품 즉시 쓸 수 있도록 음성 대화, VLA 조작, 자율주행, 전신 제어를 하나의 워크플로우로 통합할 필요
    - en: Each domain needs its own tasks and content, but deployments must reuse the same core across customers.
      ko: 고객마다 같은 코어를 재사용하되 도메인에 맞춰 태스크와 콘텐츠를 따로 구성
    - en: To pass acceptance, tasks must succeed in repeated runs under fixed conditions. Stopping the robot must not depend on the planning layers.
      ko: 검수는 고정 조건의 반복 시행에서 태스크가 성공해야 통과. 로봇 정지는 계획 계층에 의존 불가.
    - en: Sites may run closed networks, and raw video must not leave the site.
      ko: 현장에 따라 폐쇄망을 쓰며 영상 원본은 외부 반출 금지
  role:
    - en: Product Owner (PO) and development lead, writing the product definition, system specification, and commercialization roadmap, and leading the architecture and the data and model pipeline.
      ko: 제품 총괄(PO) 겸 개발 리드로 제품 정의서, 제품 사양서, 상용화 로드맵 작성. 아키텍처 설계를 이끌고 데이터와 모델 파이프라인 총괄.
  approach:
    - en: Defined the product as a domain-neutral common core plus domain profiles, so customers differ only in task packs, content, and sensor options.
      ko: 도메인 중립 공통 코어 + 도메인 프로파일로 제품을 정의하고 고객별로 태스크 팩, 콘텐츠, 센서 옵션만 변경
    - en: Split control into perception, a VLA policy, whole-body control, and motors, serving the models from a local server and running real-time control on the robot.
      ko: 인지, VLA 정책, 전신 제어, 모터로 제어 계층을 나누고 로컬 서버에서 모델을 서빙하며 로봇 온보드에서 실시간 제어 실행
    - en: Design the Phase 2 and 3 architecture with a planner that plans and combines tasks on its own and an Ops platform for managing multiple robots and sites. Build the control panel for monitoring, alarms, task execution, and emergency stop.
      ko: 태스크를 스스로 계획하고 조합하는 플래너와 여러 로봇과 현장을 관리하는 Ops 플랫폼으로 Phase 2~3 아키텍처 설계. 모니터링, 알람, 태스크 실행, 비상정지를 지원하는 관제시스템 개발.
    - en: Set up the data and model pipeline, from Teleop collection and a standard episode schema to VLA fine-tuning and staged evaluation offline, in simulation, and on the robot.
      ko: Teleop 데이터 수집과 표준 에피소드 스키마에서 시작해 VLA 파인튜닝과 단계별 평가(오프라인, 시뮬레이션, 실기)까지 이어지는 데이터와 모델 파이프라인 구축
  decisions:
    - title:
        en: A custom AI stack on a stock humanoid and open models
        ko: 상용 기체와 공개 모델 위에 쌓은 맞춤형 AI 스택
      rationale:
        en: A stock humanoid and open models (GR00T N1.7, GEAR-SONIC) carry the hardware and base skills, so the effort goes into the custom AI stack, site delivery, and operations.
        ko: 하드웨어와 기본 동작에는 상용 기체와 공개 모델(GR00T N1.7, GEAR-SONIC)을 쓰고 맞춤형 AI 스택, 현장 납품, 운영에 집중
      tradeoff:
        en: Any advantage from open models is temporary, so we need to build up site data and the task library over time.
        ko: 공개 모델로 얻는 기술 우위는 일시적이므로 현장 데이터와 태스크 라이브러리를 꾸준히 축적할 필요
    - title:
        en: Customize by swapping modules only
        ko: 모듈 교체만으로 고객별 맞춤 구성
      rationale:
        en: Only scenarios and task modules change per site while the core stays fixed, so each delivery adds reusable assets to a catalog.
        ko: 공통 코어를 유지하고 현장별 시나리오와 태스크 모듈만 바꿔 납품 때마다 재사용할 자산을 카탈로그에 추가
      tradeoff:
        en: After feature freeze, changes are limited to scenarios and content.
        ko: 기능 동결 이후 변경은 시나리오와 콘텐츠 교체로 한정
    - title:
        en: One local server per site
        ko: 현장당 로컬 서버 1대
      rationale:
        en: Running the models, control panel, and logs on site keeps raw video local, with an export gateway and remote access available as options.
        ko: 모델, 관제시스템, 로그를 현장 서버에서 운영해 영상 원본을 현장에 두고 반출 게이트웨이와 원격 접속은 옵션으로 제공
      tradeoff:
        en: Speech and LLM use commercial APIs, so a closed-network site needs extra GPUs to run these services on-premises.
        ko: 음성과 LLM은 상용 API를 쓰므로 폐쇄망 현장에서는 온프레미스 전환과 GPU 증설 필요
    - title:
        en: Emergency stops independent of planning
        ko: 계획 계층과 독립된 비상정지
      rationale:
        en: The robot can be stopped by voice (on a partial ASR transcript before recognition finishes), a physical button, or the control panel, with no option for remote release.
        ko: 음성(ASR 확정 전 부분 전사로 작동), 물리 버튼, 관제시스템 중 어느 경로로든 로봇을 멈출 수 있고 3개 경로 모두 원격 해제 불가
      tradeoff:
        en: Operation stays in supervised mode until a risk assessment sets the speed and distance limits.
        ko: 위험성 평가로 속도와 거리 기준을 정할 때까지 감독 모드로만 운영
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
        basic: { en: 'Deliver items and drinks, take out trash, move small objects', ko: '물품과 음료 전달, 쓰레기 배출, 작은 물건 이동' }
        option: { en: 'Sorting laundry, recycling, clearing tables', ko: '세탁물 정리, 분리수거, 식탁 치우기' }
        tech: { en: 'Manipulation, close-range safety around people', ko: '조작, 대인 근접 안전' }
        measure: { en: 'Households per staff member, time from anomaly detection to response, delegated tasks completed per day', ko: '운영 인력 1인당 담당 세대, 이상 감지→대응 시간, 하루 위임 태스크 처리 건수' }
      - name: { en: Docent, ko: 홍보관 도슨트 }
        focus: { en: Dialogue and guidance, ko: 대화와 안내 중심 }
        status: { kind: draft, label: { en: Draft, ko: 초안 } }
        basic: { en: 'Guide route and stops, greetings, visitor Q&A', ko: '안내 동선과 정위치, 안내 인사, 관람객 Q&A' }
        option: { en: 'Photo poses, exhibit guide, follow-me guide', ko: '포토 모션, 전시 안내, 대상 추종 안내' }
        tech: { en: 'Commentary content, crowd navigation, speaker separation', ko: '해설 콘텐츠, 밀집 주행, 화자 분리' }
        measure: { en: 'Guided sessions per day, visitor satisfaction, on-site staff replacement rate', ko: '하루 안내 세션 수, 관람객 만족도, 상주 인력 대체율' }
      - name: { en: Site inspection, ko: 현장 감시 }
        focus: { en: Movement and perception, ko: 이동과 인식 중심 }
        status: { kind: todo, label: { en: To define, ko: 정의 예정 } }
        basic: { en: 'Follow a patrol route and return, photograph and check each inspection point, detect anomalies and send alerts', ko: '순찰 동선과 복귀, 지점 촬영과 상태 판독, 이상 탐지와 알림' }
        option: { en: 'Patrol reports, night patrol, measurements with specialized sensors', ko: '순찰 리포트, 야간 순찰, 특수 센서 계측' }
        tech: { en: 'Vision AI, scheduled patrol, remote monitoring', ko: 'Vision AI, 스케줄 순찰, 원격 모니터링' }
        measure: { en: 'Patrol coverage, time from detection to alert, inspection staff hours saved', ko: '순찰 커버리지, 이상 감지→통보 시간, 점검 공수 절감' }
    note: { en: 'Status as of September 2026. "+" marks the option pack.', ko: '상태는 2026년 9월 기준. "+"는 옵션 팩.' }
  archNote:
    en: 'Target architecture for Phase 2 and 3. A planner builds tasks to fit the situation in place of predefined scenarios, and an Ops platform runs many robots and sites together.'
    ko: 'Phase 2~3 목표 구조. 사전 정의된 시나리오 대신 플래너가 상황에 맞게 태스크를 스스로 계획하고 조합하며 Ops 플랫폼에서 여러 로봇과 현장을 통합 운영.'
  hardware:
    title: { en: 'Standard set: one robot and one local server', ko: '표준 구성 1식: 로봇 1대 + 로컬 서버 1대' }
    image: ../../assets/robots/unitree-g1.jpg
    alt: { en: 'Unitree G1 humanoid robot, front view', ko: Unitree G1 휴머노이드 로봇 정면 }
    robot:
      name: { en: 'Unitree G1 (on-board)', ko: 'Unitree G1(온보드)' }
      sub: { en: 'PC1 motors, PC2 Jetson Orin NX', ko: 'PC1 모터, PC2 Jetson Orin NX' }
      items:
        - { name: { en: Whole-body control, ko: 전신 제어 }, value: { en: GEAR-SONIC, ko: GEAR-SONIC } }
        - { name: { en: Navigation, ko: 자율주행 }, value: { en: Nav2 + FAST-LIO2, ko: Nav2 + FAST-LIO2 } }
        - { name: { en: 'Voice, sensors', ko: 음성/센서 }, value: { en: ROS 2 nodes, ko: ROS 2 노드 } }
        - { name: { en: Planner, ko: 플래너 }, value: { en: 'behavior tree, in review', ko: Behavior Tree (검토 중) } }
    server:
      name: { en: 'Local server (off-board)', ko: '로컬 서버(오프보드)' }
      sub: { en: one GPU server per site, ko: 현장당 GPU 서버 1대 }
      items:
        - { name: { en: VLA policy server, ko: VLA 정책 서버 }, value: { en: GR00T N1.7, ko: GR00T N1.7 } }
        - { name: { en: VLN server, ko: VLN 서버 }, value: { en: FSR-VLN, ko: FSR-VLN } }
        - { name: { en: Control panel, ko: 관제시스템 }, value: { en: Next.js + FastAPI, ko: Next.js + FastAPI } }
        - { name: { en: 'Logs, model versions', ko: 로그/모델 버전 }, value: { en: kept on site, ko: 현장 보관 } }
    external:
      name: { en: External, ko: 외부 }
      sub: { en: 'closed network: move on-prem', ko: 폐쇄망이면 온프레미스 전환 }
      items:
        - { name: { en: STT, ko: STT }, value: { en: Whisper, ko: Whisper } }
        - { name: { en: 'LLM, TTS', ko: LLM/TTS }, value: { en: vendor TBD, ko: 선정 중 } }
    links:
      robotServer: [Wi-Fi 6, ROS 2 + ZMQ]
      serverExternal: { en: OUTBOUND, ko: 외부망 }
    specsTitle: { en: Robot specifications, ko: 로봇 사양 }
    specs:
      - { label: { en: Head sensors, ko: 머리 센서 }, value: { en: '3D LiDAR Livox Mid-360, depth camera RealSense D435i', ko: '3D LiDAR Livox Mid-360, 깊이 카메라 RealSense D435i' } }
      - { label: { en: Computers, ko: 컴퓨터 }, value: { en: 'PC1 8-core for motor control, PC2 Jetson Orin NX 16GB (100 TOPS)', ko: 'PC1 8코어 모터 제어, PC2 Jetson Orin NX 16GB (100 TOPS)' } }
      - { label: { en: Joints, ko: 관절 }, value: { en: '23 to 43 DoF by EDU build, dual encoders, knee up to 120 N·m', ko: 'EDU 구성별 23~43 DoF, 이중 엔코더, 무릎 최대 120 N·m' } }
      - { label: { en: Arms, ko: 팔 }, value: { en: 'Payload about 3 kg, gripper as an option', ko: '가반하중 약 3kg, 그리퍼 옵션' } }
      - { label: { en: 'Height, weight', ko: 크기/무게 }, value: { en: '1.32 m, 35 kg', ko: '1.32m, 35kg' } }
      - { label: { en: Battery, ko: 배터리 }, value: { en: '9,000 mAh quick-release, about 2 hours', ko: '9,000mAh 퀵릴리즈, 약 2시간' } }
      - { label: { en: Audio, ko: 오디오 }, value: { en: '4-mic array, 5 W speaker', ko: '마이크 4개 어레이, 5W 스피커' } }
      - { label: { en: Speed, ko: 속도 }, value: { en: 'Up to about 2 m/s; the service limit comes from the risk assessment', ko: '최대 약 2m/s, 운영 속도 상한은 위험성 평가로 확정' } }
      - { label: { en: Link, ko: 통신 }, value: { en: 'Wi-Fi 6, Bluetooth 5.2', ko: 'Wi-Fi 6, Bluetooth 5.2' } }
    credit: { en: 'Product image: Unitree Robotics. Specifications: published G1 EDU manufacturer data.', ko: '제품 이미지: Unitree Robotics. 사양: G1 EDU 제조사 공개 사양.' }
  loop:
    - en: We run the data and model pipeline in-house and deliver only the trained models to customers.
      ko: 사내에서 데이터와 모델 파이프라인을 운영하고 고객에게는 학습한 모델만 납품
  outcome:
    - en: In progress. Wrote the product definition, system specification, and phased commercialization roadmap (Phase 1 to 3, through 2027), with three product gates for readiness to propose, build, and open.
      ko: 진행 중. 제품 정의서, 제품 사양서, 단계별 상용화 로드맵(Phase 1~3, ~2027) 작성. 제안, 구축, 오픈 준비 여부를 판단하는 3단계 제품 게이트 정의.
    - en: Trained and demonstrated the living-support basic pack and implemented localization and path planning. Continue to develop the control panel and the Phase 2 and 3 architecture.
      ko: 생활 지원 기본 팩 학습과 시연, 위치추정과 경로계획 구현 완료. 관제시스템과 Phase 2~3 아키텍처 개발 중.
    - en: Deliver the first docent profile to a brand experience center, a project described in a separate case study.
      ko: 도슨트 프로파일은 브랜드 체험관 구축 과제로 첫 적용 진행 중 (별도 케이스 스터디)
---
