import { ScreenItem } from "@/types";

export const Screens: ScreenItem[] = [
  { key: 'SelectDate', label: '여행 날짜 선택하기', step: 0 },
  { key: 'SelectAreaRegion', label: '여행 지역 선택하기', step: 1 },
  { key: 'SelectSubRegion', label: '여행 지역 선택하기', step: 1 },
  { key: 'SelectActivity', label: '체험장/장소 선택하기', step: 2 },
  { key: 'SelectPlace', label: '체험장/장소 선택하기', step: 2 },
  { key: 'LoadingGenerateSchedule', label: '선택한 장소를 기반으로 여행계획을 세우는 중이예요', step: 3 },
  { key: 'AIRecommendPlan', label: 'AI 여행 계획 추천', step: 3, description: '선택하신 장소 정보를 참고해서 일정을 계획했어요' },
  { key: 'EditPlan', label: '여행 계획 편집하기', step: 4, description: '계획을 편집하거나 [일정 추가하기]버튼을 눌러 마무리해 주세요.' },
  { key: 'Complete', label: '일정 생성 완료', step: 4 },
];

export const typeToLabel: Record<string, string> = {
  ATTRACTION_SPOT: '관광지로 이동',
  PARAGLIDING_SPOT: '체험장으로 이동',
  RESTAURANT_SPOT: '음식점으로 이동',
  ACCOMMODATION_SPOT: '숙소로 이동',
  CAFE: '카페로 이동',
};