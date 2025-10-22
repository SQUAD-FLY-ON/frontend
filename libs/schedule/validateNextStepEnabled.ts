// /utils/scheduleUtils.ts

import { Screens } from '@/constants/screens';
import { ScheduleState } from '@/store/useScheduleStore'; // 스토어의 State 타입만 참조

/**
 * 다음 단계 버튼의 활성화 여부를 계산합니다.
 * 이 함수는 외부 상태에 의존하지 않는 순수 함수입니다.
 * @param state - 검사할 스케줄의 상태 객체
 * @returns 활성화 여부 (boolean)
 */
export const validateNextStepEnabled = (state: ScheduleState): boolean => {
  const { currentStep, currentMarkedDates, selectedRegion, selectedActivities, selectedPlaces} = state;
  const currentKey = Screens[currentStep].key;

  switch (currentKey) {
    case 'SelectDate':
      return Object.keys(currentMarkedDates).length > 0;

    case 'SelectAreaRegion':
    case 'SelectSubRegion':
      return selectedRegion.key !== '';

    case 'SelectActivity':
      return selectedActivities.id !== '';

    case 'SelectPlace':
      return selectedPlaces.length>0;

    default:
      return true; // 유효성 검사가 필요 없는 단계는 통과
  }
};