import { TLocationData } from ".";

// types/api.ts
export interface ApiResponse<T> {
  httpStatusCode: number;
  httpStatusMessage: string;
  data: T;
}

export interface RecommendSpotsRequest {
  criteria: "DISTANCE" | "WEATHER";
  latitude: number;
  longitude: number;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
  nickname: string;
  loginId: string;
  password: string;
  oauthProviderType?: "KAKAO" | "GOOGLE" | "NAVER"; // 소셜 로그인 타입은 선택 사항이고, 특정 값만 허용하도록 지정
}

export interface postFlightLogRequest {
  airfieldName: string;
  flightTime: number;
  flightDistance: number;
  averageSpeed: number;
  flightAltitude: number;
  videoUrl: string;
  points: TLocationData[];
}
