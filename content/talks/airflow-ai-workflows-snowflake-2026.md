---
title: 'ETL을 넘어 AI 워크플로우로: Airflow의 새로운 진화'
event: Snowflake World Tour Seoul 2026
date: '2026-08-27'
type: talk
description: >-
  A session on AI agent workflows using Airflow's common-ai-provider and
  Snowflake Cortex.
descriptionKo: >-
  Airflow의 common-ai-provider와 Snowflake Cortex를 활용해 AI 에이전트 워크플로우를 구성하는 방법을 소개한
  발표.
hideOnResume: true
slides: >-
  https://docs.google.com/presentation/d/1voZwqpGhHL2GRaPJfllyHsAJp0ScZIbwr_btIaRst_A/edit
eventUrl: >-
  https://kr.linkedin.com/posts/yeonguk-choo_지난-8월-27일-snowflake-world-tour-seoul-2026에서-activity-7499765058139353088-YjYp
---
2026년 8월 27일, Snowflake World Tour Seoul에서 진행한 커뮤니티 세션입니다.

## 발표 소개

AI가 문서를 읽고 보고서를 쓰게 만드는 것만으로 실제 업무의 문제가 해결되지는 않습니다. 어떤 데이터가 외부로 나가도 되는지, 어느 지점에서 승인을 받아야 하는지, 결과를 나중에 설명할 수 있는지도 중요합니다.

이 발표에서는 Airflow의 Common AI Provider와 Snowflake Cortex를 연결합니다. 모델의 성능만이 아니라 데이터의 경계와 도메인의 요구에 따라 워크플로우를 나누는 접근입니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1voZwqpGhHL2GRaPJfllyHsAJp0ScZIbwr_btIaRst_A/edit)
- [본인 후기](https://kr.linkedin.com/posts/yeonguk-choo_지난-8월-27일-snowflake-world-tour-seoul-2026에서-activity-7499765058139353088-YjYp)

## 발표를 글로 읽기

### ETL 다음의 일

데이터를 웨어하우스에 적재하는 것은 많은 파이프라인의 중요한 목표입니다. 하지만 에이전트를 활용하는 업무에서는 그 데이터를 읽고 판단한 뒤 행동하는 단계까지 이어집니다.

Airflow의 Task와 Provider는 이 과정에서도 연결의 단위가 됩니다. 다만 이제는 정해진 변환뿐 아니라 모델의 분기, 도구 호출, 사람의 승인도 실행 흐름에 포함됩니다.

### 어떤 데이터가 밖으로 나갈 수 있는가

슬라이드의 예제는 공시와 주가, 리서치 자료를 읽어 종목 브리핑을 만드는 작업입니다. 이 자료들을 모두 같은 방식으로 모델에 보내면 될까요? 구독 계약이나 사용 조건 때문에 외부로 전달할 수 없는 자료도 있습니다.

그래서 데모는 처리 경로를 나눕니다. 외부 반출에 제약이 있는 문서는 Snowflake Cortex를 이용해 웨어하우스 안에서 탐색하고 구조화합니다. 공개 가능한 데이터는 외부 모델과 도구를 활용하는 경로로 보냅니다.

여기서 경로를 나누는 질문은 “어떤 모델이 더 좋은가?”가 아닙니다. **이 데이터와 이 업무에서 허용되는 처리는 무엇인가?**입니다.

### 승인도 하나의 작업으로 표현하기

```text
자료 준비 → 내부 처리·구조화 → 공개 범위 검증 → 사람 승인 → 분석·보고서
```

현재 자료에는 기준일 이후 데이터를 차단하고, 전달할 정보의 경계를 검증한 뒤, HITL을 통해 사람의 승인을 받는 흐름이 있습니다. 승인 절차를 실행 바깥의 메신저 대화로 남겨두는 대신 워크플로우 안에 명시하는 방식입니다.

Common AI Provider는 모델의 분기와 에이전트 도구 호출에 사용되고, Cortex는 웨어하우스 안의 문서 처리에 사용됩니다. 각각을 별도의 작업으로 표현하면 어느 지점에서 입력과 출력이 바뀌었는지 살펴볼 수 있습니다.

### 중요한 차이는 끝난 뒤에 남는다

비슷한 보고서는 다른 에이전트 구성으로도 만들 수 있습니다. 이 자료가 강조하는 것은 결과물만이 아니라 실행 뒤에 남는 기록입니다.

이름 있는 Task, 모델 호출 로그, 재시도 이력, 결과와 실행 정보를 담은 테이블이 있으면 문제가 생겼을 때 따라갈 경로가 생깁니다. 좋은 답변 하나를 얻는 것에서 반복해서 운영하고 설명할 수 있는 작업으로 넘어가는 차이입니다.

## 정리

1. 모델 선택 이전에 데이터의 경계와 업무 제약을 정해야 합니다.
2. 내부 처리, 외부 도구 사용, 사람의 승인을 명시적으로 연결합니다.
3. 결과뿐 아니라 실행 과정을 남겨야 이후에 감사하고 개선할 수 있습니다.
