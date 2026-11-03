---
title: Airflow Contributions Using Breeze & Astronomer Agents
titleEn: Contributing to Apache Airflow with Breeze & Astronomer Agents
event: Apache Airflow 한국사용자모임 제5회 밋업
eventEn: Apache Airflow Korean User Group 5th Meetup
date: '2026-02-26'
type: talk
description: >-
  An introduction to contributing to Airflow with Breeze and Prek, and using
  Astronomer Agents for DAG development, debugging, and migration.
descriptionKo: >-
  Breeze와 Prek으로 Airflow 기여를 시작하고 Astronomer Agents로 DAG 개발·디버깅과 Airflow 2에서 3으로의
  마이그레이션을 다룬 발표.
eventUrl: 'https://discourse.airflow-kr.org/t/539'
slides: 'https://docs.google.com/presentation/d/1Dt-XPXJtfCMevp1Wvzr2aONg_zsWescWRX46SJBrGxM/edit'
contentEn: |
  I spoke at the [Apache Airflow Korean User Group 5th Meetup](https://discourse.airflow-kr.org/t/539) on February 26, 2026.

  ## About the Talk

  Even when you want to contribute to open source, there are many hurdles before writing your first line of code. You may worry about which environment to install, whether the tests will run on your computer, and what to do if a PR's CI fails.

  The first part of this talk covers getting started with contributions using Breeze and Prek. The second part discusses how Astronomer Agents, which can access actual Airflow execution information, can help with DAG development and debugging.

  ## Talk Materials

  - [Slides](https://docs.google.com/presentation/d/1Dt-XPXJtfCMevp1Wvzr2aONg_zsWescWRX46SJBrGxM/edit)
  - [Meetup recap](https://discourse.airflow-kr.org/t/539)
  - [Introduction to Astronomer Agents](https://discourse.airflow-kr.org/t/astronomer-agents-airflow/521)

  ## The Talk in Writing

  ### The first hurdle is setting up the environment

  The more mature a project is, the larger its codebase and test suite tend to be, and the more checks it has. Even when you want to make a small contribution, it can be easy to get stuck setting up the development environment.

  Breeze is a tool for running the components needed to develop and test Airflow in a consistent way. In development mode, you can see logs while your changes are applied. The talk introduced hot reloading and using mprocs to inspect logs as a starting point for contributing.

  ### A PR is not finished just by changing the code

  The contribution process proceeds through finding an area to work on, preparing the development environment, making changes, running static checks, opening a PR, review, and merge. Prek appears in this process as a tool for running style and check hooks.

  Reviewers need more than the code diff. You should explain in what situation the problem occurs, why it happens, and how the change fixes it. For UI changes, screenshots checked locally help reviewers understand the change.

  A merge is not the final step, either. If a change is included in a release candidate, it still needs to be checked in the actual RC version. Following your change through the release process is part of the contribution cycle.

  ### From a tool that guesses to a tool that checks

  Now the focus shifts from contributing to using Airflow. When a DAG fails, if you copy the logs and ask a model about them, the model has to infer the cause from only the information it was given.

  The distinction emphasized in the introduction to Astronomer Agents is that they query actual Airflow APIs, DagRuns, and logs. The talk explains connected authoring, testing, and debugging features, and distinguishes simple question answering over documentation from tasks that check execution state. This does not mean you no longer need to review the tool's answers. It means you can get the information behind your judgment more directly.

  ### Break migration into small checks, too

  Moving from Airflow 2 to 3 involves several changes, including imports, context, and how metadata is accessed. The slides give examples such as changes detectable with Ruff's AIR rules, the transition from Dataset to Asset, and replacing direct database access with API calls.

  Agents are tools that can reduce the effort involved in this work. But you still need to test whether the changes work in the actual environment. As with the contribution cycle in the first part, quick changes should be followed by verification.

  ## Summary

  1. A consistent contribution environment can reduce the effort required before writing code.
  2. Reviews are easier when you share reproduction steps and verification results.
  3. The value of agents lies not only in plausible answers, but also in checking actual state.

  *This article is a draft reconstructed from the slides and the event recap. Command and tool names follow those materials; it is not a video transcript or a report of a reproduced migration.*
---
2026년 2월 26일, [Apache Airflow 한국사용자모임 제5회 밋업](https://discourse.airflow-kr.org/t/539)에서 발표했습니다.

## 발표 소개

오픈소스에 기여하고 싶어도 첫 코드를 쓰기까지 넘어야 할 것이 많습니다. 어떤 환경을 설치해야 하는지, 테스트가 내 컴퓨터에서 돌아갈지, PR의 CI가 실패하면 어떻게 할지부터 걱정하게 됩니다.

이 발표의 앞부분은 Breeze와 Prek으로 기여를 시작하는 과정입니다. 뒷부분은 실제 Airflow 실행 정보에 접근하는 Astronomer Agents가 DAG 개발과 디버깅을 어떻게 도울 수 있는지 다룹니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1Dt-XPXJtfCMevp1Wvzr2aONg_zsWescWRX46SJBrGxM/edit)
- [밋업 후기](https://discourse.airflow-kr.org/t/539)
- [Astronomer Agents 소개](https://discourse.airflow-kr.org/t/astronomer-agents-airflow/521)

## 발표를 글로 읽기

### 첫 번째 장벽은 환경 구성이다

성숙한 프로젝트일수록 코드베이스와 테스트가 크고 검사 규칙도 많습니다. 기여하고 싶은 작은 수정이 있어도 실행 환경을 만드는 과정에서 막히기 쉽습니다.

Breeze는 Airflow 개발과 테스트에 필요한 구성요소를 일관된 방식으로 실행하기 위한 도구입니다. 개발 모드에서는 변경을 반영하며 로그를 확인할 수 있습니다. 발표에서는 핫리로드와 mprocs를 이용한 로그 확인을 기여의 출발점으로 소개했습니다.

### 코드를 고치는 것만으로 PR이 끝나지는 않는다

기여 과정은 작업할 곳 찾기, 개발 환경 준비, 수정, 정적 검사, PR, 리뷰와 병합으로 이어집니다. Prek은 이 과정에서 스타일과 검사 훅을 실행하는 도구로 등장합니다.

리뷰어에게 필요한 것은 코드 차이뿐만이 아닙니다. 어떤 상황에서 문제가 생기는지, 왜 생기는지, 수정이 어떻게 해결하는지를 설명해야 합니다. UI 변경이라면 로컬에서 확인한 스크린샷이 리뷰어의 이해를 돕습니다.

병합도 마지막 단계는 아닙니다. 변경이 릴리스 후보에 포함되면 실제 RC 버전에서 확인하는 과정이 남습니다. 내가 바꾼 부분이 배포되는 과정까지 따라가는 것이 기여 사이클의 일부입니다.

### 추측하는 도구에서 확인하는 도구로

이제 관점을 기여에서 사용으로 바꿉니다. DAG가 실패했을 때 로그를 복사해 모델에 질문하면, 모델은 전달받은 정보만으로 원인을 추정해야 합니다.

Astronomer Agents를 소개하면서 강조한 차이는 실제 Airflow API, DagRun, 로그를 조회한다는 점입니다. 작성·테스트·디버깅 기능을 연결해 설명하고, 단순한 문서 질의응답과 실행 상태를 확인하는 작업을 구분합니다. 그렇다고 도구의 답을 검토하지 않아도 된다는 뜻은 아닙니다. 판단의 근거가 되는 정보를 더 직접적으로 얻는다는 의미입니다.

### 마이그레이션도 작은 확인으로 나누기

Airflow 2에서 3으로 이동하는 작업에는 import, context, 메타데이터 접근 방식 등 여러 변경이 얽혀 있습니다. 슬라이드는 Ruff의 AIR 규칙으로 감지할 수 있는 수정, Dataset에서 Asset으로의 변화, DB 직접 접근을 API 호출로 바꾸는 작업 등을 예로 듭니다.

에이전트는 이 작업의 부담을 줄이는 도구입니다. 하지만 수정 결과가 실제 환경에서 동작하는지는 테스트해야 합니다. 앞부분의 기여 사이클과 마찬가지로, 빠른 수정 뒤에는 확인 과정이 있어야 합니다.

## 정리

1. 기여 환경을 일관되게 만들면 코드 작성 이전의 부담을 줄일 수 있습니다.
2. 재현 방법과 검증 결과를 함께 전달하면 리뷰가 쉬워집니다.
3. 에이전트의 가치는 그럴듯한 답뿐 아니라 실제 상태를 확인하는 과정에도 있습니다.

*슬라이드와 행사 후기를 바탕으로 재구성한 초안입니다. 명령과 도구 이름은 자료 기준이며, 영상 전사나 마이그레이션 재현 결과는 아닙니다.*
