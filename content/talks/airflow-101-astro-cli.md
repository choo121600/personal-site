---
title: Apache Airflow 101 with Astro CLI
event: 'Python PIP 배포 실습 및 Airflow 소개 Hands-On!, 부산'
date: '2024-10-26'
type: workshop
slides: >-
  https://docs.google.com/presentation/d/1XXIk5Gv_Tut427IKsBzjIUPpkNp64jseWK1lc3uK3Lg/edit
description: >-
  A hands-on introduction to Apache Airflow with Astro CLI, using a daily news
  summary and investment-advice messaging service as the exercise.
eventUrl: 'https://www.meetup.com/korea-apache-airflow-user-group/events/303680210/'
hideOnResume: true
descriptionKo: 'Astro CLI로 Airflow를 시작하고, 데일리 뉴스 요약과 투자 조언 메시징 서비스를 구현하는 실습.'
---
2024년 10월 26일, 부산 Elice-Lab의 [Python PIP & Airflow Hands-On](https://www.meetup.com/korea-apache-airflow-user-group/events/303680210/)에서 진행한 실습입니다.

## 발표 소개

Airflow를 배우기 위해 처음부터 운영 환경을 구축할 필요는 없습니다. 먼저 내 컴퓨터에서 실행하고, 작은 작업들을 연결하고, 실패했을 때 어디를 살펴봐야 하는지 경험하는 것이 중요합니다. 이 워크숍에서는 Astro CLI로 시작해 뉴스 수집·요약·평가·이메일 전송을 하나의 워크플로우로 묶었습니다.

## 발표 자료

- [슬라이드](https://docs.google.com/presentation/d/1XXIk5Gv_Tut427IKsBzjIUPpkNp64jseWK1lc3uK3Lg/edit)
- [행사 공지](https://discourse.airflow-kr.org/t/273)

## 발표를 글로 읽기

### 설치가 아니라 워크플로우에 집중하기

입문 실습에서 환경 설정에 시간을 모두 쓰면 정작 배우고 싶은 내용을 시작하기도 전에 지칩니다. 이 자료에서 Astro CLI를 선택한 이유는 로컬 Airflow의 실행과 중지, DAG 변경 확인을 하나의 개발 흐름으로 다루기 위해서입니다.

프로젝트를 초기화한 뒤 `astro dev start`로 실행하고, `stop`과 `restart`로 환경을 제어합니다. 중요한 것은 명령어를 외우는 일이 아니라, 코드를 바꾸고 실행 결과를 확인하는 짧은 반복을 만드는 것입니다.

### 하나의 스크립트를 여러 작업으로 나누기

뉴스를 가져와 메일을 보내는 기능은 하나의 긴 함수로 만들 수도 있습니다. 하지만 어디에서 실패했는지 알고 필요한 부분만 다시 실행하려면 작업의 경계를 드러내는 편이 좋습니다.

```text
뉴스 수집 → 요약 → 평가 → 이메일 전송
```

실습은 기본 방식과 데코레이터 방식의 DAG 작성을 살펴본 뒤, 이 단계를 각각 Task로 표현합니다. 뉴스 수집이 실패한 것과 메일 전송이 실패한 것은 서로 다른 문제입니다. 워크플로우의 구조가 코드와 화면에 드러나면 그 차이를 찾기 쉬워집니다.

### 알림도 자동화의 일부다

자동화한 작업을 매번 사람이 열어 확인해야 한다면 관리 부담이 남습니다. 그래서 본격적인 뉴스 처리에 앞서 성공·실패 시 이메일과 Slack 알림을 보내는 DAG를 다룹니다.

슬라이드에서는 메일 인증과 Slack 웹훅 설정을 안내하고, 컨테이너 환경에서 필요한 설정을 관리하는 흐름을 설명합니다. 실제 키나 인증 정보는 이 글에 포함하지 않습니다.

### 뉴스를 읽고 전달하는 파이프라인

실습 자료는 yfinance로 관련 뉴스를 가져오고, ChatGPT를 이용해 요약과 긍정·부정 평가를 만든 뒤 이메일로 전달합니다. 모델 호출 역시 독립된 작업이므로 데이터 수집과 전달 단계 사이에서 결과를 확인할 수 있습니다.

여기서 배우려는 것은 투자 판단의 정확도가 아니라 여러 도구의 실행 순서를 관리하는 방법입니다. 예제의 평가는 학습용이며 실제 매매를 위한 검증된 조언이 아닙니다.

## 정리

- 로컬 환경을 쉽게 반복 실행할 수 있어야 실습에 집중할 수 있습니다.
- 작업 경계를 드러내면 실패한 부분과 다시 실행할 부분을 이해하기 쉬워집니다.
- 데이터 처리뿐 아니라 결과 전달과 실패 알림까지 연결해야 일상에서 쓸 수 있는 자동화가 됩니다.
