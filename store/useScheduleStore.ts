import { Screens } from '@/constants/screens';
import { DayData, Schedules, selectedRegion, Spot, TourismItem } from '@/types';
import { create } from 'zustand';

export interface ScheduleState {
  currentStep: number;
  currentMarkedDates: Record<string, any>;
  selectedRegion: selectedRegion;
  selectedPlaces: TourismItem[];
  selectedActivities: Spot;
  schedule: Schedules;
  dayData: DayData
}

/**
 * 상태를 변경하는 함수(액션)들의 타입입니다.
 */
export interface ScheduleActions {
  setCurrentStep: (step: number) => void;
  setCurrentMarkedDates: (dates: Record<string, any>) => void;
  setSelectedRegion: (region: selectedRegion) => void;
  setSelectedPlaces: (places: TourismItem) => void;
  setSelectedActivities: (activity: Spot) => void;
  settingSigungu: (sigungu: string) => void;
  setDayData: (scheduledayDataOrUpdater: DayData | ((prevData: DayData) => DayData)) => void;
  setSchedule: (schedule: Schedules) => void;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  refreshSelectedActivities: () => void;
  refreshSelectedPlaces: () => void;
  resetAllStates: () => void;
}

export const useScheduleStore = create<ScheduleState & ScheduleActions>((set, get) => ({
  currentStep: 0,
  setCurrentStep: ((step) => set({ currentStep: step })),
  currentMarkedDates: {},
  setCurrentMarkedDates: (dates) => {
    set({ currentMarkedDates: dates });
  },
  selectedRegion: { key: '', name: '', sigungu:'', coordinates: [] },
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  settingSigungu: (sigungu) => set({ selectedRegion: { ...get().selectedRegion, sigungu: sigungu } }),
  selectedActivities: {
    id: '',
    imgUrl: '',
    latitude: 0,
    longitude: 0,
    name: '',
    fullAddress: ''
  },
  setSelectedActivities: (activity) => set({ selectedActivities: activity }),
  selectedPlaces: [],
  setSelectedPlaces: (place) =>
    set((state) => {
      const isAlreadySelected = state.selectedPlaces.some(
        (activity) => activity.fullAddress === place.fullAddress && activity.name === place.name
      );

      if (isAlreadySelected) {
        return {
          selectedPlaces: state.selectedPlaces.filter(
            (activity) => activity.fullAddress !== place.fullAddress || activity.name !== place.name
          ),
        };
      } else {
        return {
          selectedPlaces: [...state.selectedPlaces, place],
        };
      }
    }),
  schedule: [],
  setSchedule: (schedule: Schedules) => set({ schedule: schedule }),

  dayData: {},
  setDayData: (dayDataOrUpdater: DayData | ((prevData: DayData) => DayData)) =>
    set((state) => ({
      dayData: typeof dayDataOrUpdater === 'function'
        ? dayDataOrUpdater(state.dayData)
        : dayDataOrUpdater
    })),
  refreshSelectedPlaces: () => {
    set({ selectedPlaces: [] });
  },

  // selectedActivities를 초기 상태로 리셋하는 함수
  refreshSelectedActivities: () => {
    set({
      selectedActivities: {
        id: '',
        imgUrl: '',
        latitude: 0,
        longitude: 0,
        name: '',
        fullAddress: ''
      }
    });
  },

  resetAllStates: () => {
    set({
      currentStep: 0,
      currentMarkedDates: {},
      selectedRegion: { key: '', name: '', coordinates: [] },
      selectedPlaces: [],
      selectedActivities: {
        id: '',
        imgUrl: '',
        latitude: 0,
        longitude: 0,
        name: '',
        fullAddress: ''
      },
      schedule: [],
      dayData: {}
    });
  },
  goToPrevStep: () => set((state) => ({
    currentStep: Screens[state.currentStep - 1].key.includes('Loading') ? state.currentStep - 2 : state.currentStep - 1,
  })),

  goToNextStep: () => {
    set((state) => ({ currentStep: state.currentStep + 1 }));
  },

}));