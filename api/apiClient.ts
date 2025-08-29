import axios from "axios";

/**
 * Axios 클라이언트 인스턴스
 *
 * - `baseURL`은 환경변수 `EXPO_PUBLIC_API_URL`에서 불러옵니다.
 * - 주소에서 `api` 뒤에 url부터 입력합니다 (ex) https://xxxx/api/users -> '/users'
 *
 * 사용 예시:
 * ```ts
 * const res = await apiClient.get('/users');
 * ```
 */
export const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  timeout: 10000,
});

