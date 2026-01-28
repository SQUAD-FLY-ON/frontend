import { Plan } from "@/types";
import React, { memo } from "react";
import { View } from "react-native";
import EmptyDayDropZone from "./EmptyDayDropZone";
import PlanList from "./PlanList";

// Day 컨텐츠 컴포넌트
interface DayContentProps {
  dayId: string;
  plans: Plan[];
  onLayoutCard: (dayId: string, index: number, event: any) => void;
  onDragStart: (item: Plan, dayId: string, index: number, layout: any, position: any) => void;
  onDragMove: (x: number, y: number, gestureState: any, evt: any, initialPosition: any) => void;
  onDragEnd: (y: number) => void;
  styles: any;
}

// ✅ React.memo로 불필요한 리렌더링 차단
// ✅ isDragging 구독 제거 - EmptyDayDropZone에서 직접 구독
const DayContent: React.FC<DayContentProps> = memo(({
  dayId,
  plans,
  onLayoutCard,
  onDragStart,
  onDragMove,
  onDragEnd,
  styles,
}) => {
  return (
    <View style={styles.dayContent}>
      {plans.length === 0 ? (
        <EmptyDayDropZone styles={styles} />
      ) : (
        <PlanList
          dayId={dayId}
          plans={plans}
          onLayoutCard={onLayoutCard}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          styles={styles}
        />
      )}
    </View>
  );
});

export default DayContent;