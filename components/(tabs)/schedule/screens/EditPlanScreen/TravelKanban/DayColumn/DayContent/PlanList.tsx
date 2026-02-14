import { CardLayout, GestureState, LayoutEvent, Plan, Position, TravelKanbanStyles } from "@/types";
import React, { Fragment, memo } from "react";
import { GestureResponderEvent, View } from "react-native";
import DraggablePlanCard from "../../DraggablePlanCard";

// 계획 리스트 컴포넌트
interface PlanListProps {
  dayId: string;
  plans: Plan[];
  // ✅ draggingItem props 제거 - DraggablePlanCard에서 직접 store 구독
  onLayoutCard: (dayId: string, index: number, event: LayoutEvent) => void;
  onDragStart: (item: Plan, dayId: string, index: number, layout: CardLayout, position: Position) => void;
  onDragMove: (x: number, y: number, gestureState: GestureState, evt: GestureResponderEvent, initialPosition: Position) => void;
  onDragEnd: (y: number) => void;
  styles: TravelKanbanStyles;
}

// ✅ React.memo로 불필요한 리렌더링 차단
const PlanList: React.FC<PlanListProps> = memo(({
  dayId,
  plans,
  onLayoutCard,
  onDragStart,
  onDragMove,
  onDragEnd,
}: PlanListProps) => {
  return (
    <>
      {plans.map((plan, planIndex) => (
        <Fragment key={plan.key}>
          <View onLayout={(event) => onLayoutCard(dayId, planIndex, event)}>
            <DraggablePlanCard
              item={plan}
              index={planIndex}
              dayId={dayId}
              isLast={planIndex === plans.length - 1}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
          </View>
        </Fragment>
      ))}
    </>
  );
});
PlanList.displayName = 'PlanList';

export default PlanList;