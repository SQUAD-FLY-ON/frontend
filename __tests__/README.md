# Flyon Frontend 테스트 코드 설명서

## 목차

1. [useAuthStore.test.ts — 인증 스토어 테스트](#1-useauthstoretestts--인증-스토어-테스트)
2. [useTourSchedule.test.ts — 스케줄 페칭 훅 테스트](#2-usetourscheduletestts--스케줄-페칭-훅-테스트)
3. [transformSchedules.test.ts — 데이터 변환 유틸리티 테스트](#3-transformschedulestestts--데이터-변환-유틸리티-테스트)
4. [validateNextStepEnabled.test.ts — 단계별 유효성 검증 테스트](#4-validatenextstepenabledtestts--단계별-유효성-검증-테스트)

---

## 자주 사용되는 Jest 핵심 개념

| 함수 | 역할 |
|------|------|
| `describe(name, fn)` | 테스트 그룹을 묶어주는 블록. 중첩 가능 |
| `it(name, fn)` / `test(name, fn)` | 하나의 테스트 케이스 |
| `expect(value)` | 값을 검증하는 assertion의 시작점 |
| `jest.mock(module)` | 외부 모듈을 가짜(mock)로 대체 |
| `jest.fn()` | 호출 여부/인자를 추적할 수 있는 가짜 함수 생성 |
| `beforeEach(fn)` | 각 `it` 실행 전에 매번 호출되는 설정 함수 |
| `afterEach(fn)` | 각 `it` 실행 후에 매번 호출되는 정리 함수 |
| `.toBe(value)` | `===` 동치 비교 |
| `.toEqual(value)` | 깊은(deep) 동치 비교 (객체/배열 내부까지) |
| `.toBeNull()` | `null`인지 확인 |

---

## 1. useAuthStore.test.ts — 인증 스토어 테스트

> 대상: `store/useAuthStore.ts` (Zustand store)

### Mock 설정 (상단)

```ts
jest.mock('@/api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));
```

- **왜 필요한가:** `useAuthStore`는 내부적으로 `apiClient.post('/auth', ...)` 등을 호출해서 실제 백엔드 API에 요청을 보냄. 테스트에서는 실제 서버 없이 실행해야 하므로, API 클라이언트를 **가짜(mock)** 로 교체함.
- `jest.fn()`은 "호출은 되지만 아무것도 안 하는 빈 함수"를 만듦. 나중에 `.mockResolvedValueOnce()`로 원하는 응답을 주입할 수 있음.

```ts
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
```

- `expo-secure-store`는 React Native 디바이스의 보안 저장소. 테스트 환경(Node.js)에는 존재하지 않으므로 mock 처리.

```ts
jest.mock('@/app/_layout', () => ({
  queryClient: { invalidateQueries: jest.fn() },
}));
```

- `logout()`이 내부에서 `queryClient.invalidateQueries()`를 호출하기 때문에, 이것도 mock 처리해야 에러가 나지 않음.

### beforeEach — 각 테스트 전 상태 초기화

```ts
const initialState = useAuthStore.getState();

beforeEach(() => {
  useAuthStore.setState(initialState, true);  // store를 초기 상태로 복원
  jest.clearAllMocks();                        // 모든 mock의 호출 기록 초기화
});
```

- Zustand store는 **싱글턴**(앱 전체에 하나만 존재)이라서, 한 테스트에서 `login()`을 호출하면 다음 테스트에도 로그인 상태가 남아있게 됨. 이를 방지하기 위해 매 테스트 전에 초기화.

### 테스트 케이스 설명

#### 초기 상태 검증

```ts
it('인증되지 않은 상태로 시작한다', () => {
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(false);
  expect(state.accessToken).toBeNull();
  // ...
});
```

- store가 처음 생성됐을 때 기본값이 올바른지 확인.

#### 로그인 성공

```ts
(mockedApiClient.post as jest.Mock).mockResolvedValueOnce({
  httpStatusCode: 200,
  data: {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
  },
});
```

- `mockResolvedValueOnce()`는 "다음 한 번 호출될 때 이 값을 Promise.resolve()로 반환해라"라는 의미.
- 즉, `apiClient.post('/auth', credentials)`가 호출되면 위의 가짜 응답이 반환됨.
- 이후 store의 상태가 정상적으로 업데이트됐는지 `expect()`로 검증.

#### 로그인 실패

```ts
(mockedApiClient.post as jest.Mock).mockRejectedValueOnce({
  response: { data: { serverErrorMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' } },
});
```

- `mockRejectedValueOnce()`는 Promise.reject()를 시뮬레이션. 즉, API 호출이 실패하는 상황.
- 에러 메시지가 올바르게 반환되고, 인증 상태가 `false`로 유지되는지 확인.

#### 로그아웃

```ts
useAuthStore.setState({
  isAuthenticated: true,
  accessToken: 'token',
  refreshToken: 'refresh',
  memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
});
```

- 테스트 전에 `setState()`로 **로그인된 상태를 직접 주입**.
- `logout()` 호출 후 모든 인증 정보가 `null`/`false`로 초기화되는지 확인.

#### 토큰 갱신

- refreshToken이 있을 때: API 호출 성공 → 새 accessToken 저장 확인
- refreshToken이 없을 때: API 호출 없이 바로 `false` 반환 + 상태 초기화 확인

---

## 2. useTourSchedule.test.ts — 스케줄 페칭 훅 테스트

> 대상: `hooks/schedule/useTourSchedule.ts` (React Query + Custom Hook)

### Mock 설정

```ts
jest.mock('@/libs/schedule/fetchTourSchedule');
```

- 한 줄로 모듈 전체를 mock. 내부의 `fetchTourSchedule` 함수가 `jest.fn()`으로 자동 교체됨.

### createWrapper — React Query Provider 래핑

```ts
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};
```

- **왜 필요한가:** `useTourSchedule`은 내부적으로 `useQuery()`를 사용. `useQuery()`는 반드시 `QueryClientProvider` 안에서 실행되어야 함.
- `retry: false`로 설정하여 실패 시 재시도 없이 바로 에러 상태로 전환되게 함 (테스트 속도 향상).

### renderHook — 훅 단독 테스트

```ts
const { result } = renderHook(() => useTourSchedule(), {
  wrapper: createWrapper(),
});
```

- `@testing-library/react-native`의 `renderHook()`은 **컴포넌트 없이 훅만 독립적으로 실행**할 수 있게 해줌.
- `result.current`로 훅의 현재 반환값에 접근.

### waitFor — 비동기 상태 변화 대기

```ts
await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

- React Query는 비동기로 동작하므로, 데이터가 로딩 → 성공으로 바뀔 때까지 기다려야 함.
- `waitFor()`는 내부 assertion이 통과할 때까지 반복 체크함.

### afterEach — 정리

```ts
afterEach(() => {
  queryClient?.clear();
});
```

- 테스트 간 캐시 데이터가 남아있지 않도록 React Query 클라이언트를 초기화.

---

## 3. transformSchedules.test.ts — 데이터 변환 유틸리티 테스트

> 대상: `libs/schedule/transformSchedulesToDayData.ts`, `libs/schedule/transformDayDataToSchedules.ts`

### 특징

- **mock이 없음!** 순수 함수(입력 → 출력)를 테스트하므로 외부 의존성이 없어 가장 단순한 형태.

### transformSchedulesToDayData 테스트

```ts
it('빈 스케줄 배열을 빈 DayData로 변환한다', () => {
  const schedules: Schedules = [];
  const result = transformSchedulesToDayData(schedules);
  expect(result).toEqual({});
});
```

- **경계 조건(edge case) 테스트**: 빈 배열이 들어오면 빈 객체 `{}`가 나와야 함.

```ts
expect(result).toHaveProperty('day1');        // 'day1' 키가 존재하는지
expect(result.day1.title).toBe('Day 1');      // title이 올바른지
expect(result.day1.plans).toHaveLength(1);    // plans 배열 길이
expect(result.day1.plans[0].place).toBe('경복궁');  // 변환된 필드값
```

- `Schedules` (2차원 배열) → `DayData` (객체) 변환이 올바른지 다양한 각도에서 검증.

### transformDayDataToSchedules 테스트

```ts
it('day 키가 숫자 순서대로 정렬된다', () => {
  const dayData = { day3: ..., day1: ..., day2: ... };
  const result = transformDayDataToSchedules(dayData);
  expect((result[0][0] as any).name).toBe('A');  // day1이 첫 번째
  expect((result[1][0] as any).name).toBe('B');  // day2가 두 번째
  expect((result[2][0] as any).name).toBe('C');  // day3이 세 번째
});
```

- 객체의 key 순서는 보장되지 않으므로 (`day3, day1, day2`), 함수가 내부적으로 `day1 → day2 → day3` 순으로 정렬하는지 확인.

---

## 4. validateNextStepEnabled.test.ts — 단계별 유효성 검증 테스트

> 대상: `libs/schedule/validateNextStepEnabled.ts`

### 팩토리 함수 패턴

```ts
const createDefaultState = (overrides?: Partial<ScheduleState>): ScheduleState => ({
  currentStep: 0,
  currentMarkedDates: {},
  selectedRegion: { key: '', name: '', coordinates: [] },
  selectedActivities: { id: '', imgUrl: '', latitude: 0, longitude: 0, name: '', fullAddress: '' },
  selectedPlaces: [],
  schedule: [],
  dayData: {},
  ...overrides,
});
```

- **왜 이렇게 하는가:** `ScheduleState`에는 필드가 많음. 매 테스트마다 전부 작성하면 코드가 장황해짐.
- `createDefaultState()`에 기본값을 넣어두고, 각 테스트에서 **변경하고 싶은 필드만 `overrides`로 전달**하면 됨.
- 예: `createDefaultState({ currentStep: 3 })` → step만 3으로 바뀌고 나머지는 기본값 유지.

### 단계별 검증 로직

앱의 스케줄 생성 플로우는 여러 단계(step)로 구성되어 있고, 각 단계마다 "다음" 버튼 활성화 조건이 다름:

| Step | 화면 | 활성화 조건 |
|------|------|-------------|
| 0 | SelectDate | 날짜 1개 이상 선택 |
| 1 | SelectAreaRegion | 광역 지역 선택 |
| 2 | SelectSubRegion | 시군구 지역 선택 |
| 3 | SelectActivity | 액티비티 선택 |
| 4 | SelectPlace | 장소 1개 이상 선택 |
| 5+ | Loading/AI추천 등 | 항상 활성화 |

각 단계마다 **선택하지 않았을 때 `false`**, **선택했을 때 `true`** 를 반환하는지 쌍으로 검증.

```ts
// 선택 안 함 → false
it('날짜가 선택되지 않으면 false를 반환한다', () => {
  const state = createDefaultState({ currentStep: 0, currentMarkedDates: {} });
  expect(validateNextStepEnabled(state)).toBe(false);
});

// 선택함 → true
it('날짜가 선택되면 true를 반환한다', () => {
  const state = createDefaultState({
    currentStep: 0,
    currentMarkedDates: { '2026-03-01': { selected: true } },
  });
  expect(validateNextStepEnabled(state)).toBe(true);
});
```

---

## 테스트 실행 방법

```bash
# 전체 테스트 실행
npm test

# 특정 파일만 실행
npx jest __tests__/useAuthStore.test.ts

# watch 모드 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```
