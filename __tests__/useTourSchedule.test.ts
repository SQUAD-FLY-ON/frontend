import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTourSchedule } from '@/hooks/schedule/useTourSchedule';
import { fetchTourSchedule } from '@/libs/schedule/fetchTourSchedule';
import React from 'react';

jest.mock('@/libs/schedule/fetchTourSchedule');
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({ memberInfo: { memberId: 'test-member' } }),
  },
}));
jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
}));

const mockedFetchTourSchedule = fetchTourSchedule as jest.MockedFunction<typeof fetchTourSchedule>;

let queryClient: QueryClient;

const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
};

describe('useTourSchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('스케줄 데이터를 성공적으로 가져온다', async () => {
    const mockSchedules = [
      {
        id: '1',
        memberId: 1,
        scheduleStart: '2026-03-01',
        scheduleEnd: '2026-03-03',
        dailyTourismSpots: [[{ id: 1, tourismType: 'ATTRACTION_SPOT', name: '경복궁', fullAddress: '서울', longitude: 126.97, latitude: 37.58, phoneNumber: '', imgUrl: '' }]],
        tourName: '서울 여행',
      },
    ];
    mockedFetchTourSchedule.mockResolvedValueOnce(mockSchedules);

    const { result } = renderHook(() => useTourSchedule(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isScheduleLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.schedule).toEqual(mockSchedules);
    expect(result.current.isScheduleError).toBe(false);
  });

  it('데이터 페칭 실패 시 에러 상태를 반환한다', async () => {
    mockedFetchTourSchedule.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useTourSchedule(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isScheduleError).toBe(true);
    });

    expect(result.current.isSuccess).toBe(false);
  });

  it('빈 배열 응답을 정상적으로 처리한다', async () => {
    mockedFetchTourSchedule.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTourSchedule(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.schedule).toEqual([]);
  });
});
