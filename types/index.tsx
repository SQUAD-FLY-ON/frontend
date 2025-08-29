import { ImageSourcePropType } from "react-native";

export type pageRoutes =
  | "home"
  | "explore"
  | "user"
  | "community"
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

export type TLocationData = {
  lat: number;
  lon: number;
  alt: number;
};
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
