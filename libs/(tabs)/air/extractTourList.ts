import { TourismSchedule } from "@/types";
import { Alert } from "react-native";

export default function extractTourList(schedules: TourismSchedule[]) {
  try {
    const result = [];
    const uniqueSchedules = schedules.filter(
      (item, index, self) =>
        item.tourName &&
        item.scheduleStart &&
        item.scheduleEnd &&
        self.findIndex(
          (t) =>
            t.tourName === item.tourName &&
            t.scheduleStart === item.scheduleStart &&
            t.scheduleEnd === item.scheduleEnd
        ) === index
    );

    for (const schedule of uniqueSchedules) {
      const flatSpots = schedule.dailyTourismSpots.flat();

      for (const spot of flatSpots) {
        if (spot.name.includes("패러글라이딩")) {
          result.push({
            label: `${schedule.tourName}여행 (${schedule.scheduleStart} ~ ${schedule.scheduleEnd})`,
            value: spot.name,
          });
          break;
        }
      }
    }

    return result;
  } catch {
    Alert.alert("여행 일정을 불러오기 중 오류가 발생했습니다!");
    return [];
  }
}
