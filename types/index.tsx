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
