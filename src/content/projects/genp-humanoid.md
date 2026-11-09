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
stack: [Unitree G1, Unitree SDK, LeRobot (VLA), Isaac Lab, MuJoCo, FAST-LIO2, FastAPI, React, Next.js]
featured: true
order: 1
caseStudy:
  context:
    - en: GenON is building GenP, a Physical AI humanoid product delivered to customers as domain-specific, end-to-end solutions.
      ko: GenON이 고객 도메인별 E2E 솔루션으로 공급하는 Physical AI 휴머노이드 제품 GenP 개발
  problem:
    - en: Voice conversation, VLA manipulation, SLAM navigation, and whole-body control had to run together in one product through a single workflow.
      ko: 음성 대화, VLA 조작, SLAM 기반 자율주행, 전신 제어를 단일 워크플로우로 묶어 하나의 제품으로 동작하게 만드는 과제
    - en: Each customer domain needs its own configuration while the core stays shared.
      ko: 코어는 공유하면서 고객 도메인마다 별도 구성이 필요한 구조
  role:
    - en: Product Owner (PO) and development lead, owning the product definition, commercialization roadmap, architecture, and data and model pipeline.
      ko: 제품 총괄(PO) 및 개발 리드, 제품 정의, 상용화 로드맵, 아키텍처, 데이터·모델 파이프라인 담당
  approach:
    - en: Defined the product as a common core plus domain profiles, so customer-specific end-to-end products are composed from shared modules.
      ko: 공통 코어 + 도메인 프로파일 구조로 제품을 정의해 공통 모듈 조합으로 고객 맞춤형 E2E 제품 구성
    - en: Designed an architecture that integrates voice conversation, VLA manipulation, SLAM navigation, and whole-body control into a single workflow.
      ko: 음성 대화, VLA 조작, SLAM 기반 자율주행, 전신 제어를 단일 워크플로우로 통합하는 아키텍처 설계
    - en: Designed and built a control panel for robot registration, status monitoring, logs and alarms, task execution, and emergency stop.
      ko: 로봇 등록, 상태 모니터링, 로그·알람, 태스크 실행, 비상정지 기능을 갖춘 관제시스템 설계 및 개발
    - en: Set up the data and model pipeline, from Teleop data collection to VLA training and evaluation and a simulation environment for validation.
      ko: Teleop 조작 데이터 수집부터 VLA 학습·평가, 시뮬레이션 검증 환경까지 데이터·모델 파이프라인 구축
  outcome:
    - en: In progress. The product definition and the phased commercialization roadmap are written; the architecture, control panel, and pipeline are under development.
      ko: 진행 중, 제품 정의서와 단계별 상용화 로드맵 작성 완료, 아키텍처·관제시스템·파이프라인 개발 진행
  architecture:
    layers:
      - id: ops
        label: { en: Operations, ko: 운영 }
        nodes:
          - { en: Control panel, ko: 관제시스템 }
          - { en: "Monitoring, logs, and alarms", ko: "모니터링, 로그·알람" }
          - { en: Emergency stop, ko: 비상정지 }
      - id: profiles
        label: { en: Domain profiles, ko: 도메인 프로파일 }
        nodes:
          - { en: Customer-specific configuration, ko: 고객별 구성 }
      - id: workflow
        label: { en: Workflow, ko: 워크플로우 }
        nodes:
          - { en: Single integrated workflow, ko: 단일 통합 워크플로우 }
          - { en: Task execution, ko: 태스크 실행 }
      - id: skills
        label: { en: Common core, ko: 공통 코어 }
        nodes:
          - { en: Voice conversation, ko: 음성 대화 }
          - { en: VLA manipulation, ko: VLA 조작 }
          - { en: SLAM navigation, ko: SLAM 기반 자율주행 }
          - { en: Whole-body control, ko: 전신 제어 }
      - id: robot
        label: { en: Robot, ko: 로봇 }
        nodes:
          - { en: Humanoid robot and SDK, ko: 휴머노이드 로봇·SDK }
      - id: data
        label: { en: Data and model pipeline, ko: 데이터·모델 파이프라인 }
        nodes:
          - { en: Teleop data collection, ko: Teleop 조작 데이터 수집 }
          - { en: VLA training and evaluation, ko: VLA 학습·평가 }
          - { en: Simulation validation, ko: 시뮬레이션 검증 }
    flows:
      - { from: ops, to: workflow, label: { en: Tasks, ko: 태스크 } }
      - { from: profiles, to: workflow }
      - { from: workflow, to: skills }
      - { from: skills, to: robot }
      - { from: robot, to: data, label: { en: Teleop data, ko: Teleop 데이터 } }
      - { from: data, to: skills, label: { en: Trained models, ko: 학습 모델 } }
---
