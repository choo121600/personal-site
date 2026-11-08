---
title: 'PR부터 Merge까지: Apache Airflow 오픈소스에 기여해보기'
titleEn: 'From PR to Merge: Contributing to Apache Airflow'
event: 동아대학교 AI Innovation Week 개발자 특강
eventEn: Dong-A University AI Innovation Week Developer Lecture
date: '2026-11-05'
type: workshop
category: contribution
description: >-
  A two-hour hands-on workshop where participants open a real pull request to
  Apache Airflow through the Korean UI translation (i18n) project.
descriptionKo: Apache Airflow UI 한국어 번역(i18n)을 주제로 참가자가 실제 PR을 직접 올려보는 2시간 실습 워크샵.
language: ko
slides: >-
  https://docs.google.com/presentation/d/1_yfr5eRGQiua1qTTHU_ytOBSBin5ZyzxV6d11S4bhIw/edit?usp=sharing
contentEn: >-
  A two-hour hands-on workshop held as a developer lecture during AI Innovation
  Week at Dong-A University.


  ## About the workshop


  Rather than talking about open source contribution in the abstract, everyone
  opened a real pull request to Apache Airflow. The subject was the Airflow UI's
  Korean translation (i18n). Korean is one of the officially supported
  languages, translation keys are small and self-contained, and the project has
  a written contribution policy and tooling, which makes it a good first
  contribution.


  The goal for the day was to submit one verified PR, starting from a single
  translation key. Merging happens later, after the review and revision cycle,
  so the finish line in the room was sharing the URL of a PR that had passed
  local checks.


  ## What we covered


  1. **Why Airflow**: the de facto standard for workflow orchestration, with
  40M+ monthly downloads, 45K+ GitHub stars, and 3.8K+ contributors

  2. **Setup**: checking GitHub, an editor, Git, uv, and Docker

  3. **The contribution flow**: what Fork, Clone, Branch, Push, and PR each do,
  then forking and cloning `apache/airflow` and creating a working branch

  4. **Translation files**: comparing the `en` source and `ko` translation under
  `airflow-core/src/airflow/ui/public/i18n/locales`, and editing only the value
  while keeping keys, variables, and punctuation intact

  5. **Airflow Breeze**: checking translation completeness with `breeze ui
  check-translation-completeness --language ko` and seeing the change in the
  real UI with `breeze start-airflow --dev-mode`

  6. **Commit, Push, PR**: reviewing your own diff, choosing the base and head
  branches, and writing the PR title, description, and verification results

  7. **Review process**: per Airflow's i18n policy, a Translation Owner approves
  the language and a Code Owner or committer checks formatting before merging


  ## Materials


  -
  [Slides](https://docs.google.com/presentation/d/1_yfr5eRGQiua1qTTHU_ytOBSBin5ZyzxV6d11S4bhIw/edit?usp=sharing)

  - [Example PR](https://github.com/apache/airflow/pull/58709)

  - [Airflow i18n contribution
  policy](https://github.com/apache/airflow/blob/main/airflow-core/src/airflow/ui/public/i18n/README.md)
---
동아대학교 AI Innovation Week의 개발자 특강으로 진행한 2시간짜리 실습 워크샵입니다.


![image.png](/images/2026/11/image-1794063792645-8f23lg.png)


## 워크샵 소개

오픈소스 기여를 말로만 설명하지 않고, 참가자 모두가 Apache Airflow에 실제 PR을 올려보는 걸 목표로 했습니다. 주제는 Airflow UI의 한국어 번역(i18n)입니다. 한국어가 공식 지원 언어라 꾸준히 기여가 필요한 데다, 번역 항목 하나하나가 작고 독립적이고, 정해진 기여 정책과 도구도 갖춰져 있어서 첫 기여로 시작하기 좋습니다.

그날의 목표는 번역 한 항목부터 시작해 검증을 마친 PR 하나를 올리는 것이었습니다. 병합은 이후 리뷰와 수정을 거쳐 이뤄지기 때문에, 현장의 완료 기준은 로컬 검증을 통과한 PR의 URL을 공유하는 것으로 잡았습니다.

## 다룬 내용

1. **왜 Airflow인가**: 월 4천만+ 다운로드, GitHub Star 4.5만+, 기여자 3.8천+를 가진 워크플로우 오케스트레이션의 사실상 표준
2. **실습 준비**: GitHub, 코드 편집기, Git, uv, Docker 준비 상태 확인
3. **기여의 흐름**: Fork, Clone, Branch, Push, PR이 각각 무슨 역할인지 짚고, `apache/airflow`를 Fork·Clone한 뒤 작업 브랜치 만들기
4. **번역 파일 수정**: `airflow-core/src/airflow/ui/public/i18n/locales` 아래 `en` 원문과 `ko` 번역을 비교하고, 키·변수·따옴표는 그대로 둔 채 값만 고치기
5. **Airflow Breeze 활용**: `breeze ui check-translation-completeness --language ko`로 번역 완료 여부를 확인하고, `breeze start-airflow --dev-mode`로 실제 UI에서 번역 확인하기
6. **커밋, Push, PR 작성**: 내가 바꾼 내용만 들어갔는지 diff로 확인하고, base·head 브랜치를 맞춰 PR 제목과 설명, 검증 결과 작성하기
7. **리뷰 절차**: Airflow i18n 정책에 따라 Translation Owner가 번역을 승인하고, Code Owner나 커미터가 포맷을 확인한 뒤 병합

## 관련 자료

- [발표 자료](https://docs.google.com/presentation/d/1_yfr5eRGQiua1qTTHU_ytOBSBin5ZyzxV6d11S4bhIw/edit?usp=sharing)
- [Airflow i18n 기여 정책](https://github.com/apache/airflow/blob/main/airflow-core/src/airflow/ui/public/i18n/README.md)
