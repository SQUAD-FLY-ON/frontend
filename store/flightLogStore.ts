import { ITrackData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "FLIGHT_LOG";

// 지역 이름으로 위치 데이터 저장
export const saveFlightLog = async (
  id: string,
  data: ITrackData[]
): Promise<{ success: boolean }> => {
  try {
    // 기존 데이터 불러오기
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    let storage: Record<string, ITrackData[]> = existing
      ? JSON.parse(existing)
      : {};

    // 해당 지역 이름으로 데이터 덮어쓰기
    storage[id] = data;

    // 다시 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return { success: true };
  } catch (error) {
    console.error("Failed to save location data:", error);
    return { success: false };
  }
};

// 특정 지역의 위치 데이터 가져오기
export const getFlightLog = async (
  id: string
): Promise<ITrackData[] | null> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) return null;

    const storage: Record<string, ITrackData[]> = JSON.parse(existing);
    return storage[id] || null;
  } catch (error) {
    console.error("Failed to load location data:", error);
    return null;
  }
};

// 모든 지역의 위치 데이터 가져오기
export const getAllFlightLogs = async (): Promise<
  Record<string, ITrackData[]>
> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : {};
  } catch (error) {
    console.error("Failed to load all location data:", error);
    return {};
  }
};

// 특정 지역 데이터 삭제
export const removeFlightLog = async (id: string): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) return;

    const storage: Record<string, ITrackData[]> = JSON.parse(existing);
    delete storage[id];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error("Failed to remove location data:", error);
  }
};

// 전체 데이터 삭제
export const clearAllFlightLogs = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear location data:", error);
  }
};
