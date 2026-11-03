---
title: Apache Airflow i18n 한국어 번역 기여 온라인 워크샵
titleEn: Apache Airflow i18n Korean Translation Contribution Online Workshop
event: Airflow 한국 사용자 모임 온라인 워크숍
eventEn: Airflow Korean User Group Online Workshop
date: '2025-12-04'
type: workshop
description: >-
  A hands-on guide to Korean translations in Airflow, including Breeze tooling,
  translation checks, and the pull request workflow.
descriptionKo: 'Breeze를 이용한 번역 누락 검사와 UI 확인, 한국어 번역 수정, PR 작성 및 리뷰 절차를 다루는 기여 워크숍.'
contentEn: |
  This was an online workshop on contributing Korean translations to Airflow, held on December 4, 2025.

  ## About the talk

  Open-source contributions do not have to mean implementing a major feature. Making the wording on a screen you use more natural and filling in missing translations are also ways to improve the user experience.

  This workshop follows the process of turning a Korean UI translation for Airflow into an actual pull request. The goal is to go beyond editing files and experience checking, reviewing the UI, and getting feedback.

  ## Video and presentation materials

  - [Recording](https://youtu.be/-H9V7ypFw9c)
  - [Slides](https://docs.google.com/presentation/d/1kUbOIA1zkkIK9mQuH6O9qKLsluHXsIYrkUk4l7Ju_gQ/edit)
  - [Hands-on guide](https://discourse.airflow-kr.org/t/483)
  - [Example PR #58709](https://github.com/apache/airflow/pull/58709)

  ## Read the talk as an article

  ### Translation is also product work

  Internationalization is more than replacing words on a screen with words in another language. Accessibility improves when people can understand features in a language they know, and using consistent terms for the same concepts reduces confusion.

  The work continues even after Korean became officially supported in Airflow 3.1. Translations need to keep up as features and wording change.

  ### Finding the files to change and the tools to check them

  The hands-on work begins by forking the repository, cloning it locally, and creating a working branch. The English source and Korean translations are stored as language-specific JSON files under `i18n/locales` in the UI.

  It is difficult to find every omission by comparing files by eye alone. The workshop covers using Breeze's `check-translation-completeness --language ko` command to identify missing, extra, and untranslated entries, then fill in what is needed.

  ### Even when the strings look right, check the UI

  After editing the translation files, run the Airflow UI in development mode. This is the step where you check whether the wording fits the context and sounds natural on the actual screen.

  Placeholders such as `{variable}` and `%s` must remain unchanged. Choose natural wording rather than translating literally, while also checking consistency with terms already in use. The work must preserve both translation accuracy and the format expected by the program.

  ### Make a PR that's easy to review

  The slides recommend grouping related items into small PRs. Describe what changed, include the translation-check results, and, when possible, attach before-and-after UI screenshots. This helps reviewers understand the change without having to set up the same environment.

  The workshop also includes tagging the translation review team and requesting a review. Linguistic review and review of code conventions and technical details serve different purposes. Both perspectives are needed to safely incorporate translations that work well on screen into the project.

  ## Takeaways

  - Translation contributions improve how users understand the product.
  - Use automated checks together with a review of the actual UI.
  - Providing context and verification results makes even a small change easier to review.
hideOnResume: true
slides: >-
  https://docs.google.com/presentation/d/1kUbOIA1zkkIK9mQuH6O9qKLsluHXsIYrkUk4l7Ju_gQ/edit
video: 'https://youtu.be/-H9V7ypFw9c'
eventUrl: 'https://discourse.airflow-kr.org/t/483'
---
2025년 12월 4일 진행한 Airflow 한국어 번역 기여 온라인 워크숍입니다.

## 발표 소개

오픈소스 기여가 반드시 큰 기능을 구현하는 일일 필요는 없습니다. 내가 사용하는 화면의 표현을 더 자연스럽게 만들고, 비어 있는 번역을 채우는 것도 사용자 경험을 개선하는 기여입니다.

이 워크숍은 Airflow의 한국어 UI 번역을 실제 PR로 만드는 과정을 따라갑니다. 파일을 수정하는 것에서 끝나지 않고 검사, 화면 확인, 리뷰까지 경험하는 것이 목표입니다.

## 영상과 발표 자료

- [녹화 영상](https://youtu.be/-H9V7ypFw9c)
- [슬라이드](https://docs.google.com/presentation/d/1kUbOIA1zkkIK9mQuH6O9qKLsluHXsIYrkUk4l7Ju_gQ/edit)
- [실습 가이드](https://discourse.airflow-kr.org/t/483)
- [예시 PR #58709](https://github.com/apache/airflow/pull/58709)

## 발표를 글로 읽기

### 번역도 제품을 만드는 일이다

국제화는 화면의 단어를 다른 언어로 바꾸는 것 이상입니다. 익숙한 언어로 기능을 이해할 수 있어야 접근성이 좋아지고, 같은 개념을 일관된 표현으로 전달해야 혼란이 줄어듭니다.

Airflow 3.1에서 한국어가 공식 지원된 이후에도 작업은 계속됩니다. 기능과 문구가 바뀌면 번역 역시 따라가야 하기 때문입니다.

### 바꿀 파일과 검사 도구를 찾기

실습은 저장소를 포크하고 로컬에 클론한 뒤 작업 브랜치를 만드는 것으로 시작합니다. 영어 원본과 한국어 번역은 UI의 `i18n/locales` 아래에 언어별 JSON 파일로 들어 있습니다.

파일을 눈으로 비교하는 것만으로 모든 누락을 찾기는 어렵습니다. Breeze의 `check-translation-completeness --language ko` 명령으로 누락·추가·미번역 상태를 확인하고, 필요한 항목을 채우는 흐름을 다룹니다.

### 문자열이 맞아도 화면은 확인해야 한다

번역 파일을 수정한 뒤에는 개발 모드로 Airflow UI를 실행합니다. 실제 화면에서 문맥에 맞는지, 표현이 자연스러운지 확인하는 과정입니다.

`{variable}`이나 `%s`처럼 값이 들어갈 자리는 그대로 유지해야 합니다. 직역보다 자연스러운 표현을 선택하되, 이미 사용 중인 용어와의 일관성도 살펴야 합니다. 번역의 정확성과 프로그램이 기대하는 형식을 함께 지키는 작업입니다.

### 리뷰하기 좋은 PR 만들기

슬라이드에서는 관련 항목끼리 묶은 작은 PR을 권합니다. 어떤 부분을 바꿨는지 적고, 번역 상태 검사 결과와 가능하면 변경 전후 UI를 첨부합니다. 리뷰어가 같은 환경을 준비하지 않아도 변경을 이해할 수 있도록 돕는 것입니다.

번역 검토 팀을 태그하고 리뷰를 받는 과정도 실습에 포함됩니다. 언어적 검토와 코드 형식·기술적 검토는 역할이 다릅니다. 두 관점이 함께 있어야 화면에서 쓰기 좋은 번역이 프로젝트에 안전하게 반영됩니다.

## 정리

- 번역은 사용자가 제품을 이해하는 방식을 개선하는 기여입니다.
- 자동 검사와 실제 UI 확인을 함께 해야 합니다.
- 작은 변경이라도 맥락과 검증 결과를 전달하면 리뷰가 쉬워집니다.
