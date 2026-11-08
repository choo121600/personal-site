---
title: 'Airflow + Snowflake: 함께 만드는 완벽한 하모니'
titleEn: 'Airflow + Snowflake: Creating Perfect Harmony Together'
event: Snowflake World Tour Seoul 2025
eventEn: Snowflake World Tour Seoul 2025
date: '2025-09-09'
type: talk
category: tech
description: >-
  A demo of using Airflow with Snowflake to orchestrate a Snowpark ML pipeline,
  from CSV ingestion and preprocessing through training, model staging, and evaluation.
descriptionKo: Airflow와 Snowflake를 연결해 CSV 적재·전처리·Snowpark ML 학습·모델 스테이징·평가를 조율하는 파이프라인 데모.
slides: >-
  https://docs.google.com/presentation/d/1x_NmspwRy3WDqGb_TWLjUiw1XStMkIk0ULAL-aFVwRA/edit
eventUrl: >-
  https://kr.linkedin.com/posts/yeonguk-choo_어제-airflow-한국-사용자-모임은-snowflake-world-tour-activity-7371230974702993410-oFsD
contentEn: |
  In September 2025, I introduced ways to use Airflow and Snowflake together in a community session at Snowflake World Tour Seoul.

  ## About the Talk

  Think of a pipeline as an orchestra. Even with good instruments and musicians, it is hard to make music together if no one coordinates who plays when.

  This talk compares Airflow to a conductor and demonstrates a small model-training pipeline connecting Snowflake and Snowpark ML. It looks at who does what, and where to check execution, from data loading through model evaluation.

  ## Talk Materials

  - [Slides](https://docs.google.com/presentation/d/1x_NmspwRy3WDqGb_TWLjUiw1XStMkIk0ULAL-aFVwRA/edit)
  - [My recap](https://kr.linkedin.com/posts/yeonguk-choo_어제-airflow-한국-사용자-모임은-snowflake-world-tour-activity-7371230974702993410-oFsD)

  ## The Talk in Writing

  ### A pipeline without a conductor

  You can prepare tools for storing data, code for preprocessing it, and capabilities for training and evaluation separately. But if the next task starts before the previous one finishes, or a failure goes unnoticed, the pipeline as a whole will not behave as expected.

  Airflow's role is to express this execution order and these dependencies in code, schedule them, and let you check their status. It does not perform every part itself; it coordinates the tools so they work together.

  ### Connecting to Snowflake

  The demo starts by configuring Snowflake connection details in an Airflow Connection. Once the connection is ready, tasks related to Snowflake can be run from a DAG.

  The slides use a simple example that predicts which slushie someone who has been skiing will choose. The example is designed to focus on understanding the overall execution flow rather than the complexity of the model itself.

  ### From loading to evaluation

  ```text
  Create table → Load CSV → Preprocess → Train and stage model → Evaluate
  ```

  Each stage prepares what the next stage needs. After data is loaded into Snowflake, it is preprocessed; a model trained with Snowpark ML is then staged and evaluated. Airflow connects these steps and treats them as one run.

  After running the tasks, check successes and failures in the Airflow UI. Open the logs for a failed task to investigate the cause. In Snowflake, check the loaded data and the versioned model. No single screen replaces every capability; instead, you look at the roles of each tool and how their execution is connected.

  ### Harmony is completed together

  Airflow is not a tool that solves every problem on its own. Its value becomes apparent when it connects a good data platform with processing tools. That is why Snowflake's capabilities and Airflow's execution management have different roles.

  Finally, the talk shifts from connections between tools to connections between people. The role of a user group is for people who want to use Airflow better to share experiences and problems. Adopting a tool and building up experience in using it well are separate things.

  ## Summary

  - Airflow coordinates the execution order and dependencies in a pipeline.
  - Snowpark ML training can also be viewed as part of an end-to-end flow connected to loading, preprocessing, and evaluation.
  - Connecting people who share their experience is as important as connecting tools.
---
2025년 9월, Snowflake World Tour Seoul의 커뮤니티 세션에서 Airflow와 Snowflake를 함께 사용하는 방법을 소개했습니다.

## 발표 소개

파이프라인을 오케스트라라고 생각해봅시다. 좋은 악기와 연주자가 있어도 누가 언제 연주할지 맞추지 못하면 하나의 음악이 되기 어렵습니다.

이 발표에서는 Airflow를 지휘자에 비유하고, Snowflake와 Snowpark ML을 연결한 작은 모델 학습 파이프라인을 보여줍니다. 데이터 적재부터 모델 평가까지 어떤 일을 누가 수행하고, 그 실행을 어디에서 확인하는지 살펴봅니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1x_NmspwRy3WDqGb_TWLjUiw1XStMkIk0ULAL-aFVwRA/edit)
- [본인 후기](https://kr.linkedin.com/posts/yeonguk-choo_어제-airflow-한국-사용자-모임은-snowflake-world-tour-activity-7371230974702993410-oFsD)

## 발표를 글로 읽기

### 지휘자가 없는 파이프라인

데이터를 저장하는 도구, 전처리하는 코드, 학습과 평가를 수행하는 기능은 각각 준비할 수 있습니다. 하지만 앞 작업이 끝나기 전에 다음 작업이 시작되거나 실패를 발견하지 못하면 전체 파이프라인은 기대대로 움직이지 않습니다.

Airflow의 역할은 이 실행 순서와 의존 관계를 코드로 표현하고, 스케줄링하고, 상태를 확인하도록 만드는 것입니다. 직접 모든 연주를 하는 것이 아니라 도구들이 함께 움직이도록 조율합니다.

### Snowflake와 연결하기

데모는 Airflow Connection에 Snowflake 연결 정보를 설정하는 것에서 시작합니다. 연결을 준비한 뒤에는 DAG에서 Snowflake와 관련 작업을 실행할 수 있습니다.

슬라이드에서는 스키를 즐기고 온 사람이 어떤 슬러시를 선택할지 예측하는 간단한 예제를 사용합니다. 모델 자체의 복잡성보다 전체 실행 흐름을 이해하는 데 집중한 구성입니다.

### 적재에서 평가까지

```text
테이블 생성 → CSV 적재 → 전처리 → 학습·모델 스테이징 → 평가
```

각 단계는 다음 단계에 필요한 결과를 준비합니다. Snowflake에 데이터가 들어간 뒤 전처리를 진행하고, Snowpark ML로 학습한 모델을 스테이징한 다음 평가합니다. Airflow는 이 과정을 연결해 하나의 실행으로 다룹니다.

작업을 실행한 후에는 Airflow UI에서 성공과 실패를 살펴봅니다. 실패한 작업은 로그로 들어가 원인을 확인합니다. Snowflake 쪽에서는 적재된 데이터와 버전이 관리되는 모델을 확인합니다. 하나의 화면이 모든 기능을 대신하는 것이 아니라, 각 도구가 맡은 역할과 실행의 연결을 함께 보는 것입니다.

### 함께해야 완성되는 하모니

Airflow는 모든 문제를 혼자 해결하는 도구가 아닙니다. 좋은 데이터 플랫폼과 처리 도구를 연결할 때 그 가치가 드러납니다. Snowflake가 제공하는 기능과 Airflow의 실행 관리가 서로 다른 역할을 맡는 이유입니다.

마지막에는 도구 사이의 연결에서 사람 사이의 연결로 이야기를 옮깁니다. Airflow를 더 잘 사용하려는 사람들이 경험과 문제를 나누는 것이 사용자 모임의 역할입니다. 도구를 도입하는 것과 그 도구를 잘 사용하는 경험이 쌓이는 것은 별개의 일이기 때문입니다.

## 정리

- Airflow는 파이프라인의 실행 순서와 의존 관계를 조율합니다.
- Snowpark ML 학습도 적재·전처리·평가와 연결된 전체 흐름으로 볼 수 있습니다.
- 도구의 연결과 함께 경험을 공유하는 사람들의 연결도 중요합니다.
