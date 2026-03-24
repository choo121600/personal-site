---
title: Airflow e2e 테스트 현대화를 하다... CI를 터트린 이야기
description: 'playwright e2e 테스트 입문을 하자마자, CI 지킴이가 된 이야기'
date: '2026-03-23'
thumbnail: /images/2026/03/16911eff5b8305cbd-1774309308434-mxz14m.gif
---
## 분명 시작은 가벼웠는데…

Airflow에 UI E2E 테스트가 도입된 지는 얼마 되지 않았습니다.
저도 처음 Rahul 님이 만든 메타 이슈를 봤을 때 솔직히 이런 생각이었습니다.
> 이게 뭐지?


![image.png](/images/2026/03/image-1774306798171-4pmj2l.png)


Playwright 자체도 써본 적은 없었고, E2E 테스트 경험도 많지 않았기 때문에
그냥 가볍게 공부할 기회다 싶어서 관련 이슈 하나를 잡아서 시작했습니다.


![image.png](/images/2026/03/image-1774306818059-12pmr2.png)



## 가볍게 시작해서, 조금 더 깊이

처음에는 단순히 이슈 하나 해결하는 수준이었는데, 보다 보니까 이 영역을 관리하는 사람이 거의 없더라고요.

특히 maintainer가 Rahul 한 분 정도라서
“아 이건 좀 도와드려야겠다” 싶어서 리뷰도 간간히 참여하게 됐습니다.
좀 재밌었던 것 같아요 ㅋㅋㅋㅋ


![image.png](/images/2026/03/image-1774306831979-sh3ksu.png)


그렇게 자연스럽게 E2E 테스트 쪽을 계속 보게 됐는데…

## 어라.. 뭔가 이상하다…


![image.png](/images/2026/03/image-1774306838754-by9rgj.png)


살펴보면서 뭔가 이상한 부분들이 눈에 들어오기 시작했습니다.

* CI에서는 통과하는데 로컬에서는 실패함
* 브라우저 여러 개 동시에 돌리면 전부 실패함
* 테스트마다 작성 방식이 제각각임
* Playwright에서 권장하지 않는 패턴이 꽤 많음

이 때부터 불안불안했습니다.

> 아… 이거 잘못됐다.

## 지금이라도 바로잡고 가자!

늦었다고 생각될 때가 가장 빠르다고 하죠.

이 상태로 계속 가면 나중에 더 큰 문제가 터질 것 같다는 느낌이 들어서
테스트 패턴을 정리하자는 Meta 이슈를 만들고, 메일링 리스트에도 기여 기회로 올렸습니다.


![image.png](/images/2026/03/image-1774306854325-zsa3zq.png)


https://github.com/apache/airflow/issues/59028

다행히도 정말 많은 분들이 도와주셨고,
새로운 기여자 분들을 많이 만나뵐 수 있었습니다.

작업은 생각보다 순조롭게 진행되었습니다.

![image.png](/images/2026/03/image-1774306862814-tne5qe.png)


어느정도 익숙해지니 집 가는 길에 휴대폰으로 PR을 슥슥 읽으면서
리뷰하는 경험이 꽤 재밌었습니다.

## CI에서 갑자기 모두 터져버리는 문제 발생!

모든 게 순조롭던 어느 날, 갑자기 CI에서 E2E 테스트가 전부 터져버렸습니다.


하나 둘이 아니라,
**테스트 여기저기서 원인 모를 실패**가 발생하기 시작했습니다.
엄청난 CI 실패 쓰나미가 몰려오고 있었습니다.

![image.png](/images/2026/03/image-1774306883712-oryepw.png)

internal-airflow-ci-cd 채널에는 실패 로그가 쏟아지고,
멘션이 끊임없이 날아오기 시작했습니다.

![image.png](/images/2026/03/image-1774306892489-81nbnp.png)

저는 그때 저녁 먹으러 나와 있었는데
슬랙 알림이 계속 울려서 “뭐지?” 하고 봤다가

![image.png](/images/2026/03/image-1774306927553-9dply5.png)


> 아…
> 이거 조졌다. 올게 왔구나.

돌이켜보면, networkidle을 걷어내면서 
그동안 숨어있던 문제가 한꺼번에 드러난 것이었습니다.

단순히 테스트 몇 개가 깨진 게 아니라
**테스트 인프라 전체가 흔들리고 있는 상황**이었습니다.

## 일단 막자 긴급 패치…

![image.png](/images/2026/03/image-1774306909758-yb34uv.png)

Rahul 형님과 제가 긴급 패치들을 보내고…
심지어 Jarek 형님도 패치를 도와주셨습니다.

하지만 패치를 하나 보내면 다른 곳에서 또 뚫렸습니다.
그리고 계속 실패하는 CI가 생겨나기 시작했습니다..

![image.png](/images/2026/03/image-1774306949737-t1hp4h.png)

결국 현실적인 선택을 했습니다.

> 실패하는 테스트들 일단 disable

일단 CI를 살려야 했으니까요.
좀 임시방편이긴 한데, 당시에는 이게 최선이었습니다.


## 진짜 원인을 찾아서

주말에 시간을 내서 차분히 뜯어봤습니다.

![FJA6KrOr7fxh486vVcTUoMP0W-J1zVsrJdqAtbZvHG4wE7O7eBiM7tXpGm2C6x6_8wc9_6kmSbKinEx3cWAuyQ.gif](/images/2026/03/FJA6KrOr7fxh486vVcTUoMP0W-J1zVsrJdqAtbZvHG4wE7O7eBiM7tXpGm2C6x6_8wc9_6kmSbKinEx3cWAuyQ-1774309234501-h662wk.gif)

결론부터 말하면,
이건 하나의 문제가 아니었습니다.

networkidle에 가려져 있었을 뿐, 여러 구조적 문제가 겹쳐 있었고
그걸 걷어내자 한꺼번에 터진 것이었습니다.

![16911eff5b8305cbd.gif](/images/2026/03/16911eff5b8305cbd-1774309308434-mxz14m.gif)

크게 네 가지였습니다.

### 1. Shared State (가장 치명적이었던 문제)

여러 테스트가 같은 Dag의 상태를 공유하고 있었습니다.

병렬 실행 환경에서
서로 상태를 덮어쓰면서 충돌이 발생합니다.

실제로 테스트 데이터를 생성할 때 이런 코드가 있었습니다:

```typescript
`e2e_var_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`
`delete_test_${Date.now()}`
`test_pool_${Date.now()}`
```

Playwright worker가 여러 개 동시에 돌면 같은 밀리초에 실행되면서 ID가 충돌할 수 있습니다.
→ 운이 좋아서 테스트가 순차적으로 실행되면 통과할 수도 있고, 그것이 아니면 실패하는 구조였습니다.

### 2. UI를 통한 테스트 데이터 setup

beforeAll에서 데이터를 만들 때 UI를 통해 직접 생성하는 방식을 사용하고 있었습니다.

```typescript
await variablesPage.addButton.click();
await page.getByLabel(/key/i).fill(variable.key);
await page.getByRole("button", { name: /save/i }).click();
```

느리고, 로딩 타이밍에 민감하고, CI 환경에서 쉽게 깨집니다.

`test.setTimeout(420_000)` — 7분짜리 timeout이 걸려 있던 것도
이 불안정성을 방어하기 위한 흔적이었습니다.

테스트라기보다 "기도"에 가까운 상태였습니다 🥲

## 3. waitForResponse / networkidle 패턴

```typescript
const responsePromise = this.page.waitForResponse(
  (resp) => resp.url().includes("/api/v2/dags") && resp.status() === 200
);

await this.navigateTo(url);
await responsePromise;
```

Airflow UI는 React Query의 `refetchInterval`로 주기적 polling을 하는 SPA입니다.
이런 환경에서 "특정 API 응답 하나"를 기다린다는 건 근본적으로 불안정합니다.

- 이미 지나간 응답을 놓칠 수 있고
- 엉뚱한 polling 응답을 잡을 수도 있고
- 그냥 timeout이 날 수도 있습니다

### 4. 테스트 간 격리 부재

- 테스트가 생성한 데이터를 정리하지 않음
- 이전 실행의 잔여 데이터가 다음 테스트에 영향

결과적으로 row count assertion 같은 것들이 랜덤하게 깨졌습니다.

## 어떻게 해결했나

단순한 버그 수정이 아니라, 테스트 인프라를 다시 설계하는 문제였습니다.
총 41개 파일, 약 4,000줄 규모의 리팩토링을 진행했습니다.

한 가지 더 신경 쓸 부분이 있었는데, Meta 이슈에 이미 기여 중인 분들의 작업 범위를 침범하지 않는 것이었습니다.
꽤 까다로운 줄타기였습니다.

### 1. uniqueRunId() — Worker-safe ID 생성

```typescript
import { randomUUID } from "node:crypto";

export function uniqueRunId(prefix: string): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}
```

`crypto.randomUUID()`를 사용해 충돌 가능성을 제거했습니다.
기존 `Date.now()` + `Math.random()` 조합과 달리, 병렬 실행에서도 안전합니다.

### 2. API 기반 setup — UI는 검증만


```typescript
await apiCreateVariable(authenticatedRequest, {
  key: variable.key,
  value: variable.value,
});
```

데이터 생성은 API로, UI는 오직 검증만 담당하도록 분리했습니다.
→ 속도 + 안정성 모두 개선

### 3. Custom Playwright Fixture

```typescript
authenticatedRequest: [
  async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: testConfig.connection.baseUrl,
      storageState: AUTH_FILE,
    });

    await use(ctx);
    await ctx.dispose();
  },
  { scope: "worker" },
];
```

worker 단위로 인증 컨텍스트를 제공하고, 테스트 종료 시 자동으로 정리됩니다.

### 4. waitForResponse 대부분 제거 → 재시도 기반 대기

단발성 응답에 의존하던 패턴을, 성공할 때까지 재시도하는 `toPass` 패턴으로 교체했습니다.

```typescript
await expect(async () => {
  const response = await request.post(
    `${baseUrl}/api/v2/dags/${dagId}/dagRuns`,
    {
      data: {
        dag_run_id: dagRunId,
        logical_date: logicalDate,
        note: "e2e test",
      },
      headers: { "Content-Type": "application/json" },
      timeout: 30_000,
    },
  );

  if (response.status() !== 409 && !response.ok()) {
    throw new Error(`DAG run trigger failed (${response.status()})`);
  }
}).toPass({ intervals: [2000, 3000, 5000], timeout: 60_000 });
```

"응답 한 번"이 아니라 "성공할 때까지", 이 차이가 안정성을 만들었습니다.

### 5. 테스트 후 데이터 정리

```typescript
test.afterAll(async ({ authenticatedRequest }) => {
  for (const runId of createdRunIds) {
    await apiDeleteDagRun(authenticatedRequest, testDagId, runId)
      .catch(() => undefined);
  }
});
```

각 테스트가 자기 데이터를 직접 정리하도록 만들어, 테스트 간 완전한 격리를 확보했습니다.

## 결과

체감상 가장 큰 변화는 이거였습니다:

> 이제 왜 실패하는지 이유를 알 수 있다.

이전에는:
- 랜덤하게 실패
- 재현이 안 됨
- timeout 7분 같은 방어 코드

이후에는:
- 실패하면 이유가 명확함
- 병렬 실행에서도 안정적
- setup 속도 개선

![image.png](/images/2026/03/image-1774310501859-eihoy4.png)

몇 번을 돌려야 겨우 통과하던 테스트들이 이제는 한 번에 안정적으로 통과합니다.
그리고 disable 해놨던 테스트들도 하나씩 다시 살릴 수 있었습니다.

## 마무리

처음에는 그냥 “이게 뭐지?”로 시작했는데,
결과적으로는 테스트 인프라를 한 번 제대로 뜯어보는 계기가 됐습니다.

스트레스가 없진 않았지만? 재밌었네요 ㅋㅋㅋㅋ
역시 개발은 비상~~~ 을 외치면서 해결해나가는 재미인 것 같습니다.

최근에 AI가 발전하면서 언젠가 소프트웨어 개발 자체의 재미가 줄어들어서 다른 취미를 찾게 될 것 같다는 생각을 하곤 했는데, 적어도 아직은 이런 순간들에서 즐거움이 남아있는 것 같네요.
