import * as Location from 'expo-location';
import { create } from 'zustand';

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
}

interface LocationStore {
  location: LocationData | null;
  locationPermission: boolean | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  initializeLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  location: null,
  locationPermission: null,
  isLoading: false,
  error: null,

  requestLocationPermission: async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      set({ locationPermission: granted });
      return granted;
    } catch {
      set({ error: "위치 권한을 요청할 수 없습니다." });
      return false;
    }
  },

  getCurrentLocation: async () => {
    try {
      const {
        coords: { latitude, longitude, altitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const locationData = {
        latitude,
        longitude,
        altitude,
      };
      
      set({ location: locationData, error: null });
      return locationData;
    } catch {
      set({ error: "현재 위치를 가져올 수 없습니다." });
      return null;
    }
  },

  initializeLocation: async () => {
    const { requestLocationPermission, getCurrentLocation } = get();
    
    set({ isLoading: true, error: null });

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      set({ isLoading: false });
      return;
    }

    await getCurrentLocation();
    set({ isLoading: false });
  },

  refreshLocation: async () => {
    const { locationPermission, getCurrentLocation } = get();
    
    if (!locationPermission) {
      set({ error: "위치 권한이 필요합니다." });
      return;
    }

    await getCurrentLocation();
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));