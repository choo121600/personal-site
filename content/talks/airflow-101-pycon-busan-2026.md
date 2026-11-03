---
title: '워크플로우 자동화의 세계: Apache Airflow 101'
titleEn: 'The World of Workflow Automation: Apache Airflow 101'
event: PyCon Busan 2026
eventEn: PyCon Busan 2026
date: '2026-05-09'
type: talk
slides: >-
  https://docs.google.com/presentation/d/1lLgVkr9nLnZ3UEjbif7U8ZnxuEryArEKdJWKlnWVjhc/edit
description: >-
  An introductory talk on workflow automation with Apache Airflow at PyCon
  Busan.
descriptionKo: PyCon Busan에서 Apache Airflow를 통한 워크플로우 자동화의 기초를 소개한 발표.
hideOnResume: true
eventUrl: 'https://discourse.airflow-kr.org/t/570'
contentEn: |
  This is an introductory talk on Apache Airflow presented at PyCon Busan 2026.

  ## About the Talk

  The word workflow may sound grand, but connecting multiple tasks in sequence and according to conditions is common in everyday life. This talk starts with making a hamburger and explains Tasks, DAGs, Operators, and Providers.

  The focus is helping people who are new to Airflow understand what the tool manages and consider how they might apply it to their own recurring work.

  ## Presentation Materials

  - [Slides](https://docs.google.com/presentation/d/1lLgVkr9nLnZ3UEjbif7U8ZnxuEryArEKdJWKlnWVjhc/edit)
  - [Event recap](https://discourse.airflow-kr.org/t/570)

  ## Read the Talk as an Article

  ### A Hamburger Is a Workflow, Too

  Take an order, cook the patty, add the ingredients, assemble the burger, and deliver it to the customer. Each is a task that takes input and produces a result, and the whole process is a flow made up of connected tasks.

  Software automation is similar. There are tasks for retrieving data, processing it, and delivering the result. When things are simple, the process is easy to understand all at once. But as the number of tasks grows and dependencies emerge, managing who runs what and when becomes more complex.

  ### When Automation That Started with Cron Gets Complex

  Cron is useful for running commands at a scheduled time. But when you also need to manage the order of multiple tasks, execution history, causes of errors, and reruns, additional mechanisms are needed.

  Airflow handles this entire flow. It lets you define tasks and their connections in code, check execution status, and trace failed parts.

  ### DAGs, Operators, and Providers

  In Airflow, connected tasks are represented as a DAG. An Operator provides a reusable form for a Task, and a Provider offers features for connecting to external services.

  For example, a task implemented in Python and one that accesses an external storage service require different approaches. Instead of writing every task from scratch, you can combine the features you need to build a workflow.

  The UI is where you inspect this structure and its execution results. Being able to see the status of the flow defined in code creates an experience different from simply scheduling commands.

  ### It's Not Just a Tool for Loading Data

  The slides give examples beyond data pipelines, including model training and evaluation, recurring reports and notifications, and operational tasks such as backups and settlements. What these have in common is that they connect multiple steps and need to be run repeatedly with their status monitored.

  When learning Airflow, the first thing to look for is not a large system in a particular industry, but a task you perform repeatedly. By breaking down the inputs it needs, the results it produces, and where it might fail, you can begin to see the shape of a workflow.

  ## Summary

  - A Task is a unit of work with inputs and outputs.
  - As the order and dependencies among tasks become more complex, managing their execution becomes important.
  - Airflow lets you define that flow in code and inspect its status.
---
PyCon Busan 2026에서 진행한 Apache Airflow 입문 발표입니다.

## 발표 소개

워크플로우라는 말은 거창하게 들리지만, 여러 작업을 순서와 조건에 따라 연결하는 일은 일상에도 많습니다. 이 발표는 햄버거를 만드는 과정에서 시작해 Task, Dag, Operator와 Provider를 설명합니다.

Airflow를 처음 접하는 사람이 무엇을 관리하는 도구인지 이해하고, 자신의 반복 업무에 어떻게 연결할 수 있을지 생각해보는 것이 중심입니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1lLgVkr9nLnZ3UEjbif7U8ZnxuEryArEKdJWKlnWVjhc/edit)
- [행사 후기](https://discourse.airflow-kr.org/t/570)

## 발표를 글로 읽기

### 햄버거도 워크플로우다

주문을 받고, 패티를 굽고, 재료를 올리고, 조립해 고객에게 전달합니다. 각각은 입력을 받아 결과를 만드는 작업이고, 전체는 여러 작업이 연결된 흐름입니다.

소프트웨어의 자동화도 비슷합니다. 데이터를 가져오는 작업과 처리하는 작업, 결과를 전달하는 작업이 있습니다. 단순할 때는 한 번에 이해할 수 있지만, 작업이 늘어나고 의존 관계가 생기면 누가 언제 무엇을 실행할지 관리하는 문제가 커집니다.

### Cron으로 시작한 자동화가 복잡해질 때

정해진 시간에 명령을 실행하는 데 Cron은 유용합니다. 하지만 여러 작업의 선후 관계, 과거 실행 기록, 오류 원인과 재실행까지 함께 관리해야 하면 추가적인 장치가 필요해집니다.

Airflow가 다루는 것은 이 전체 흐름입니다. 코드로 작업과 연결을 정의하고, 실행 상태를 확인하고, 실패한 부분을 추적할 수 있도록 합니다.

### Dag, Operator, Provider

Airflow에서는 연결된 작업을 Dag 표현합니다. Operator는 반복해서 사용하는 Task의 형태를 제공하고, Provider는 외부 서비스와 연결하기 위한 기능을 제공합니다.

예를 들어 Python 코드로 처리할 일과 외부 저장소에 접근할 일은 구현 방식이 다릅니다. 모든 작업을 처음부터 직접 작성하는 대신, 필요한 기능을 조합해 워크플로우를 구성합니다.

UI는 이 구조와 실행 결과를 확인하는 창구입니다. 코드에 정의한 흐름이 어떤 상태로 실행되는지 살펴볼 수 있다는 점이 단순히 명령을 예약하는 것과 다른 경험을 만듭니다.

### 데이터 적재만의 도구는 아니다

슬라이드에서는 데이터 파이프라인뿐 아니라 모델 학습·평가, 정기 보고서와 알림, 백업·정산 같은 반복 운영 작업도 예로 듭니다. 공통점은 여러 단계가 연결되어 있고, 반복 실행과 상태 확인이 필요하다는 것입니다.

Airflow를 배울 때 먼저 찾아볼 것은 특정 산업의 큰 시스템이 아니라 내가 반복해서 수행하는 작업입니다. 어떤 입력이 필요하고 어떤 결과를 만들며, 어디에서 실패할 수 있는지 나누어 보면 워크플로우의 형태가 보이기 시작합니다.

## 정리

- Task는 입력과 출력을 가진 작업 단위입니다.
- 작업들의 순서와 의존 관계가 복잡해질수록 실행 관리가 중요해집니다.
- Airflow는 그 흐름을 코드로 정의하고 상태를 살펴보는 도구입니다.
