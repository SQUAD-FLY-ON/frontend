import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/api/apiClient';

// mock 설정
jest.mock('@/api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/app/_layout', () => ({
  queryClient: {
    invalidateQueries: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Zustand store 초기 상태 복원용
const initialState = useAuthStore.getState();

beforeEach(() => {
  useAuthStore.setState(initialState, true);
  jest.clearAllMocks();
});

describe('useAuthStore', () => {
  describe('초기 상태', () => {
    it('인증되지 않은 상태로 시작한다', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.memberInfo).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('로그인 성공 시 인증 상태가 업데이트된다', async () => {
      (mockedApiClient.post as jest.Mock).mockResolvedValueOnce({
        httpStatusCode: 200,
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
        },
      });

      const result = await useAuthStore.getState().login({
        loginId: 'test',
        password: 'password',
      });

      expect(result?.success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('test-access-token');
      expect(state.refreshToken).toBe('test-refresh-token');
      expect(state.memberInfo?.nickname).toBe('tester');
      expect(state.isLoading).toBe(false);
    });

    it('로그인 실패 시 에러 메시지를 반환한다', async () => {
      (mockedApiClient.post as jest.Mock).mockRejectedValueOnce({
        response: { data: { serverErrorMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' } },
      });

      const result = await useAuthStore.getState().login({
        loginId: 'wrong',
        password: 'wrong',
      });

      expect(result?.success).toBe(false);
      expect(result?.error).toBe('아이디 또는 비밀번호가 올바르지 않습니다.');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('로그아웃 시 인증 상태가 초기화된다', async () => {
      // 로그인 상태 설정
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: 'token',
        refreshToken: 'refresh',
        memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
      });

      (mockedApiClient.delete as jest.Mock).mockResolvedValueOnce({});

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.memberInfo).toBeNull();
    });
  });

  describe('refreshAccessToken', () => {
    it('토큰 갱신 성공 시 true를 반환하고 accessToken이 업데이트된다', async () => {
      useAuthStore.setState({
        refreshToken: 'valid-refresh-token',
        memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
      });

      (mockedApiClient.post as jest.Mock).mockResolvedValueOnce({
        httpStatusCode: 201,
        data: { accessToken: 'new-access-token' },
      });

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBe(true);
      expect(useAuthStore.getState().accessToken).toBe('new-access-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('refreshToken이 없으면 false를 반환하고 상태를 초기화한다', async () => {
      useAuthStore.setState({ refreshToken: null });

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('clearAuthState', () => {
    it('인증 상태를 완전히 초기화한다', () => {
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: 'token',
        refreshToken: 'refresh',
        memberInfo: { memberId: '1', nickname: 'tester', imgUrl: null },
      });

      useAuthStore.getState().clearAuthState();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.memberInfo).toBeNull();
    });
  });
});
