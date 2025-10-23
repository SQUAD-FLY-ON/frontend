import { FlightLevel } from "@/app/(tabs)/user";
import { ImageSourcePropType } from "react-native";
import { LatLng } from "react-native-maps";

export type pageRoutes =
  | "home"
  | "explore"
  | "user"
  | "my-schedules"
  | "schedule"
  | "air";

export type activityArea = {
  id: number;
  image: ReturnType<typeof require>; // require 함수 반환 타입
  title: string;
  score: number;
  reviews: number;
};

export type TNearLocations = {
  id: number;
  image: ImageSourcePropType;
  title: string;
};

export type RecommendSpotCreteria = "DISTANCE" | "WEATHER";

export interface RecommendSpots {
  id: number;
  spotName: string;
  imgUrl: string;
}

export interface MemberInfo {
  imgUrl: string | null;
  memberId: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  memberInfo: MemberInfo;
  refreshToken: string;
}

interface PlaceData {
  address: string;
  day: string;
  fullAddress: string;
  id: string | null;
  image: string;
  imgUrl: string;
  key: string;
  latitude: number;
  longitude: number;
  name: string;
  phoneNumber: string;
  place: string;
  tourismType: TourismType;
  type: TourismType;
}

export type Plan = {
  key: string;
  type: string;
  image: any;
  place: string;
  address: string;
};

export type GeoJSONCoordinates = number[][][] | number[][][][];

export type Region = {
  geometry: {
    coordinates: GeoJSONCoordinates;
    type: string;
  };
  properties: {
    CTPRVN_CD: string;
    CTP_KOR_NM: string;
  };
};

export type RegionCode =
  | "11"
  | "26"
  | "27"
  | "29"
  | "30"
  | "31"
  | "41"
  | "42"
  | "43"
  | "44"
  | "45"
  | "46"
  | "47"
  | "48"
  | "50";

export type RegionName =
  | "서울특별시"
  | "부산광역시"
  | "대구광역시"
  | "광주광역시"
  | "대전광역시"
  | "울산광역시"
  | "경기도"
  | "강원도"
  | "충청북도"
  | "충청남도"
  | "전라북도"
  | "전라남도"
  | "경상북도"
  | "경상남도"
  | "제주특별자치도";

export type selectedRegion = {
  key: "" | RegionCode;
  name: "" | RegionName;
  sigungu?:string;
  coordinates: LatLng[];
};
export type ScreenKey =
  | "SelectDate"
  | "SelectAreaRegion"
  | "SelectSubRegion"
  | "SelectActivity"
  | "SelectPlace"
  | "LoadingGenerateSchedule"
  | "AIRecommendPlan"
  | "EditPlan"
  | "Complete";

export type ScreenItem = {
  key: ScreenKey;
  label: string;
  step: number;
  description?: string; // description은 선택 사항이므로 ?를 붙입니다.
};

export type WeatherStatus =
  | "맑음"
  | "구름조금"
  | "구름많음"
  | "흐림"
  | "비"
  | "흐리고 비"
  | "눈"
  | "비/눈";

export interface DailyWeather {
  monthDate: string;
  maxTemp: string;
  minTemp: string;
  sky: WeatherStatus;
}

export interface WeatherInfo {
  sigungu: string;
  dailyWeathers: DailyWeather[];
}

export interface SelectedPlace {
  id: string;
  image?: string;
  title: string;
  address: string;
}

export enum TourismType {
  ATTRACTION_SPOT = "ATTRACTION_SPOT",
  PARAGLIDING_SPOT = "PARAGLIDING_SPOT",
  RESTAURANT = "RESTAURANT",
  ACCOMMODATION = "ACCOMMODATION",
  SHOPPING = "SHOPPING",
  CULTURE = "CULTURE",
  FESTIVAL = "FESTIVAL",
  LEISURE = "LEISURE",
}

// 관광 아이템 기본 인터페이스
export interface TourismItem {
  fullAddress: string;
  id: string | null;
  imgUrl: string;
  latitude: string;
  longitude: string;
  name: string;
  phoneNumber: string;
  tourismType: TourismType;
}

export interface Spot {
  id: string;
  name: string;
  fullAddress: string;
  imgUrl: string;
  latitude: number;
  longitude: number;
}

// 개별 스케줄 아이템 타입
export interface ScheduleItem {
  id: number;
  tourismType: TourismType;
}
export interface paraglidingSpot {
  id: string;
  name: string;
  fullAddress: string;
  imgUrl: string;
  phoneNumber: string;
  websiteUrl: string;
}

export interface MemberProfileInfo {
  nickname: string;
  gliderBadge: FlightLevel;
  badgeAltitude: number;
  totalJumpAltitude: number;
}

export interface TourismSpot {
  id: number;
  tourismType: string;
  name: string;
  fullAddress: string;
  longitude: number;
  latitude: number;
  phoneNumber: string;
  imgUrl: string;
}

// 하루 일정 타입 (ScheduleItem 배열)
export type DaySchedule = ScheduleItem[];

// 전체 일정 타입 (여러 날의 일정 배열)
export type Schedules = DaySchedule[];

export interface DayData {
  [dayId: string]: {
    title: string;
    plans: Plan[];
    color: string;
  };
}
export interface TourismSchedule {
  id: string;
  memberId: number;
  scheduleStart: string;
  scheduleEnd: string;
  dailyTourismSpots: TourismSpot[][];
  tourName: string;
}

export interface TourismScheduleData {
  tourismSchedules: TourismSchedule[];
}

export type TLocationData = {
  lat: number;
  lon: number;
  alt: number;
};

export type TFlightLogStorage = {
  [regionName: string]: TLocationData[];
};

export type Option = {
  label: string;
  value: string;
};

export interface ITrackData {
  latitude: number;
  longitude: number;
  altitude: number;
  time?: string;
}

export interface ITrackPoints {
  points: ITrackData[];
}
