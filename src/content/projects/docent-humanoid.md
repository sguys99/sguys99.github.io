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
    - en: A global F&B company commissioned a docent humanoid robot to guide visitors through its brand experience center.
      ko: 글로벌 식음료 기업의 브랜드 체험관에서 관람객을 안내할 도슨트 휴머노이드 로봇 구축 과제
  problem:
    - en: The robot must hold spoken conversations, run tour scenarios, and move autonomously through the center.
      ko: 음성 대화, 안내 시나리오 실행, 체험관 내 자율주행을 하나의 로봇에서 수행해야 하는 과제
    - en: It operates among visitors, so collision avoidance and an emergency stop are required safety features.
      ko: 관람객 사이에서 동작하므로 충돌 방지와 비상정지(E-Stop)가 필수 안전 요건
  role:
    - en: Project Manager (PM) and architect, defining scope, WBS, and acceptance criteria and running kickoff and interim reviews.
      ko: 프로젝트 관리(PM) 및 아키텍처 설계 담당, 과업 범위·WBS·검수 기준 수립, 착수 및 중간 보고
  approach:
    - en: Designing the architecture for voice conversation (STT/TTS), tour scenarios, and SLAM-based autonomous navigation.
      ko: 음성 대화(STT, TTS), 안내 시나리오, SLAM 기반 자율주행 아키텍처 설계
    - en: Designing a collision-avoidance safety system using LiDAR and depth sensors.
      ko: LiDAR·깊이 센서 기반 충돌 방지 안전 체계 설계
    - en: Building a control dashboard for robot status and alarms, scenario execution, language settings, and E-Stop.
      ko: 로봇 상태·알람 모니터링, 시나리오 실행, 언어 설정, E-Stop 기능을 갖춘 관제 대시보드 개발
  outcome:
    - en: In progress, with delivery planned for Jan 2027.
      ko: 진행 중, 2027년 1월 완료 예정
  architecture:
    layers:
      - id: ops
        label: { en: Operations, ko: 운영 }
        nodes:
          - { en: Control dashboard, ko: 관제 대시보드 }
          - { en: Status and alarms, ko: 상태·알람 }
          - { en: Language settings, ko: 언어 설정 }
          - { en: E-Stop, ko: E-Stop }
      - id: interaction
        label: { en: Interaction, ko: 상호작용 }
        nodes:
          - { en: Speech recognition (STT), ko: 음성 인식(STT) }
          - { en: Tour scenarios, ko: 안내 시나리오 }
          - { en: Speech synthesis (TTS), ko: 음성 합성(TTS) }
      - id: mobility
        label: { en: Navigation and safety, ko: 자율주행·안전 }
        nodes:
          - { en: SLAM navigation, ko: SLAM 기반 자율주행 }
          - { en: LiDAR and depth collision avoidance, ko: LiDAR·깊이 센서 충돌 방지 }
      - id: robot
        label: { en: Robot, ko: 로봇 }
        nodes:
          - { en: Humanoid robot and SDK, ko: 휴머노이드 로봇·SDK }
    flows:
      - { from: ops, to: interaction, label: { en: Run scenario, ko: 시나리오 실행 } }
      - { from: interaction, to: mobility }
      - { from: mobility, to: robot }
      - { from: robot, to: ops, label: { en: Status, ko: 상태 } }
---
