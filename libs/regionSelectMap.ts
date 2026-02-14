import { GeoJSONCoordinates } from "@/types";
import { LatLng } from "react-native-maps";

function isMultiPolygon(coords: GeoJSONCoordinates): coords is number[][][][] {
  return Array.isArray(coords[0][0][0]);
}


// GeoJSON 좌표를 React Native Maps 형식으로 변환
export const convertCoordinatesToPoints = (coordinates?: GeoJSONCoordinates) => {
  if (!coordinates || !coordinates[0]) return [];

  // MultiPolygon 처리
  if (isMultiPolygon(coordinates)) {
    // MultiPolygon의 경우 첫 번째 폴리곤만 사용 (또는 모든 폴리곤을 별도로 렌더링)
    return coordinates[0][0].map(coord => ({
      latitude: coord[1],
      longitude: coord[0]
    }));
  }

  // 일반 Polygon 처리
  return coordinates[0].map(coord => ({
    latitude: coord[1],
    longitude: coord[0]
  }));
};

export const getCorners = (coords: LatLng[]) => {
  // 위도와 경도 배열 추출
  const latitudes = coords.map(coord => coord.latitude);
  const longitudes = coords.map(coord => coord.longitude);

  // 최대/최소값 계산
  const minLat = Math.min(...latitudes);
  const minLon = Math.min(...longitudes);

  return {cornerLatitude: minLat, cornerLongitude: minLon}
}


// 폴리곤 중심 계산
export const calculatePolygonCentroid = (coords: LatLng[]): LatLng | null => {
  if (coords.length < 3) return null;

  let area = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let i = 0; i < coords.length; i++) {
    const { latitude: x0, longitude: y0 } = coords[i];
    const { latitude: x1, longitude: y1 } = coords[(i + 1) % coords.length];

    const a = x0 * y1 - x1 * y0;
    area += a;
    centroidX += (x0 + x1) * a;
    centroidY += (y0 + y1) * a;
  }

  area *= 0.5;
  centroidX /= 6 * area;
  centroidY /= 6 * area;

  return { latitude: centroidX, longitude: centroidY };
};