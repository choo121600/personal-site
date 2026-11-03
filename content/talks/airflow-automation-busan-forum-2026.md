---
title: '3시간 만에 만드는 데이터 자동화 시스템, Apache Airflow 핸즈온'
event: 부산 소프트웨어 혁신 오픈 포럼
date: '2026-08-20'
type: workshop
slides: >-
  https://docs.google.com/presentation/d/1ftY0mdLc1VgQQ9Y4m1HPcJ2_Q22ODyPmnMw68nd_ebI/edit
description: >-
  A hands-on introduction to building a workflow automation system with Apache
  Airflow.
descriptionKo: Apache Airflow를 활용해 워크플로우 자동화 시스템을 만들어보는 입문 실습 특강.
hideOnResume: true
eventUrl: >-
  https://www.d-startup.kr/board.es?act=view&bid=0001&list_no=16669&mid=a10710000000
---
2026년 8월 20일 부산 소프트웨어 혁신 오픈 포럼의 핸즈온 자료입니다. 전국대학 소프트웨어 성과 공유 포럼의 부대행사로 안내되었습니다.

## 발표 소개

워크플로우 자동화를 이해하는 가장 직접적인 방법은 작은 흐름을 만들어보는 것입니다. 이 자료는 Astro CLI로 Airflow를 실행하고 Dag를 작성한 뒤, 외부 Provider와 AI 에이전트를 연결하는 순서로 구성되어 있습니다.

목표는 거대한 시스템을 완성하는 것이 아니라, 입력부터 결과 전달까지 이어지는 자동화의 구조를 경험하는 것입니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1ftY0mdLc1VgQQ9Y4m1HPcJ2_Q22ODyPmnMw68nd_ebI/edit)
- [실습 저장소](https://github.com/choo121600/Airflow-Workshop)
- [행사 안내](https://www.d-startup.kr/board.es?act=view&bid=0001&list_no=16669&mid=a10710000000)

## 발표를 글로 읽기

### 작게 실행해보고 다시 바꾸기

실습은 Astro CLI 설치와 프로젝트 생성으로 시작합니다. 환경을 시작하고 중지하고 재시작하는 과정을 익혀야 이후 코드를 바꿀 때마다 결과를 확인할 수 있습니다.

첫 Dag는 작아도 충분합니다. 실행 환경과 작업 구조를 동시에 복잡하게 만들기보다, 하나가 돌아가는 것을 확인한 다음 기능을 더하는 편이 문제를 이해하기 쉽습니다.

### 함수를 연결하는 방법과 Operator를 쓰는 방법

자료는 TaskFlow와 Classic Operator 두 방식으로 DAG를 작성합니다. 직접 만든 Python 함수를 Task로 표현할 때와 외부 Provider의 Operator를 사용할 때를 비교합니다.

이어서 조건에 따라 다음 작업을 선택하는 분기를 다룹니다. 작업을 무조건 일렬로 실행하는 것에서, 결과에 따라 다른 경로를 선택하는 흐름으로 확장하는 단계입니다.

### 외부 도구를 연결하기

모든 기능을 Dag 안에서 직접 만들 필요는 없습니다. Provider를 통해 외부 서비스와 연결하고, 각 도구가 잘하는 일을 Task로 배치할 수 있습니다.

핸즈온은 Common AI Provider를 활용해 AI 에이전트 워크플로우로 이어집니다. 에이전트 호출도 전체 흐름 안의 작업으로 두어, 앞뒤 단계와 결과 전달을 함께 관리합니다.

### 분석 결과를 메일로 받기

최종 예제는 주가를 평가해 이메일로 보내는 교육용 파이프라인입니다. 자료에는 Anthropic API 연결과 이메일 설정, 에이전트 DAG 작성 과정이 포함되어 있습니다.

이 예제에서 중요한 것은 특정 종목에 대한 판단이 아니라 데이터와 모델, 전달 채널을 연결하는 방법입니다. 슬라이드에서도 실제 매매 판단에 사용하지 않도록 안내합니다. 인증 정보와 키는 이 글에 포함하지 않습니다.

## 정리

1. 로컬에서 작은 Dag를 실행하는 것부터 시작합니다.
2. 작업 표현 방식과 조건 분기를 익힌 뒤 외부 서비스를 연결합니다.
3. 모델의 결과를 만드는 것뿐 아니라 전달하는 단계까지 워크플로우로 구성합니다.
