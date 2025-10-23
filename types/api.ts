import {
  RecommendSpotCreteria,
  RecommendSpots,
  RegionName,
  Schedules,
  TLocationData,
  TourismItem,
  WeatherInfo,
} from ".";
// types/api.ts
export interface ApiResponse<T> {
  httpStatusCode: number;
  httpStatusMessage: string;
  data: T;
}

export interface RecommendSpotsRequest {
  criteria: RecommendSpotCreteria;
  latitude: number;
  longitude: number;
}

export interface RecommendSpotsResponse {
  recommendSpotList: RecommendSpots[];
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

export interface EditProfileRequest {
  nickname: string;
  loginId: string;
  password: string;
}

export interface WeatherRequest {
  sido: RegionName;
  tripStart: string;
  tripEnd: string;
}

export interface WeatherResponse {
  weatherInfos: WeatherInfo[];
}

export interface TourismResponse {
  schedules: any[];
}
export interface TourismRequest {
  lat: number;
  lon: number;
  page: number;
  size: number;
}

export interface SpotRequest {
  sido: "" | RegionName;
  sigungu?: string;
}

export interface GptScheduleRequest {
  tourismSpotList: TourismItem[];
  paraglidingSpotId: number;
  scheduleStart: string;
  scheduleEnd: string;
}

export interface AddScheduleRequest {
  schedules: Schedules;
  scheduleStart: string;
  scheduleEnd: string;
}
export interface RecommendSpotsResponse {
  recommendSpotList: TourismItem[];
}

export interface ScheduleResponse {
  schedules: Schedules;
}

export interface flightLogRequest {
  airfieldName: string;
  points: TLocationData[];
}

export interface postFlightLogRequest {
  airfieldName: string;
  flightTime: number;
  flightDistance: number;
  averageSpeed: number;
  flightAltitude: number;
}

interface ISort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}
interface IPageable {
  unpaged: boolean;
  pageNumber: number;
  paged: boolean;
  pageSize: number;
  offset: number;
  sort: ISort;
}

export interface myFlightLogsContents {
  id: string;
  airfieldName: string;
  airfieldImageUrl: string;
  flightTime: number;
  flightDistance: number;
  averageSpeed: number;
  flightAltitude: number;
  createdAt: string;
  track: any; // 삭제 예정
}
export interface myFlightLogs {
  pageable: IPageable;
  numberOfElements: number;
  size: number;
  content: myFlightLogsContents[];
  number: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface myFlightLogsRequest {
  memberId: string;
  page: number;
  size: number;
}
