import { DayData, Schedules } from "@/types";

// [추가] 데이터 변환 함수
export const transformSchedulesToDayData = (schedules: Schedules): DayData => {
  const dayData: DayData = {};
  const colors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  schedules.forEach((daySchedule, index) => {
    const dayId = `day${index + 1}`;
    dayData[dayId] = {
      title: `Day ${index + 1}`,
      color: colors[index % colors.length],
      plans: daySchedule.map((item, planIndex) => ({
        ...item,
        place: item.name,
        address: item.fullAddress,
        type: item.tourismType,
        image: item.imgUrl,
        key: `${dayId}-${planIndex}`,
        day: dayId,
      })),
    };
  });

  return dayData;
};