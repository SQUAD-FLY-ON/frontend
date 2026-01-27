import { useCallback, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface Plan {
  place: string;
  address: string;
  image?: string;
  type: string;
  day: string;
  key: string;
}

interface DraggingItem {
  item: Plan;
  sourceDay: string;
  sourceIndex: number;
}

interface FloatingCardData {
  item: Plan;
  dayId: string;
  index: number;
  layout: { x: number; y: number; width: number; height: number };
  gestureState: any;
  initialPosition: { x: number; y: number };
}

interface UseDragDropOptions {
  scrollOffsetRef: React.MutableRefObject<number>;
  measureScrollViewPosition: () => void;
  remeasureDayLayouts: () => Promise<void>;
  getDropTarget: (pageY: number) => { dayId: string; insertIndex: number } | null;
  stopAutoScroll: () => void;
  FloatingPortalContext: React.Context<any>;
}

export const useDragDrop = ({
  scrollOffsetRef,
  measureScrollViewPosition,
  remeasureDayLayouts,
  getDropTarget,
  stopAutoScroll,
  FloatingPortalContext
}: UseDragDropOptions) => {
  const [draggingItem, setDraggingItem] = useState<DraggingItem | null>(null);
  const floatingCardDataRef = useRef<FloatingCardData | null>(null);

  const floatingPortal = useContext(FloatingPortalContext);

  // 드래그 시작
  const handleDragStart = useCallback(async (
    item: Plan,
    dayId: string,
    index: number,
    cardLayout: { x: number; y: number; width: number; height: number },
    initialPosition: { x: number; y: number }
  ) => {
    setDraggingItem({ item, sourceDay: dayId, sourceIndex: index });

    measureScrollViewPosition();
    await remeasureDayLayouts();

    if (!cardLayout.width || !cardLayout.height || !floatingPortal) return;

    floatingCardDataRef.current = {
      item,
      dayId,
      index,
      layout: cardLayout,
      initialPosition,
      gestureState: { dx: 0, dy: 0 }
    };

    floatingPortal.createFloatingCard(item, dayId, index, cardLayout, initialPosition, { dx: 0, dy: 0 });
    Animated.timing(floatingPortal.floatingOpacity, {
      toValue: 0.9,
      duration: 150,
      useNativeDriver: true,  // ✅ Native 스레드에서 애니메이션 실행
    }).start();
  }, [scrollOffsetRef, measureScrollViewPosition, remeasureDayLayouts, floatingPortal]);
  // 드래그 이동
  const handleDragMove = useCallback((
    _x: number,
    _y: number,
    gestureState: any,
    _evt: any,
    _initialPosition: { x: number; y: number }
  ) => {
    if (!gestureState || !floatingCardDataRef.current || !floatingPortal) return;

    if (gestureState.dx !== undefined && gestureState.dy !== undefined) {
      floatingPortal.floatingPan.setValue({ x: gestureState.dx, y: gestureState.dy });
    }
  }, [floatingPortal]);

  // 드래그 종료
  const handleDragEnd = useCallback((
    y: number,
    dayData: any,
    setDayData: (updater: (prev: any) => any) => void
  ) => {
    stopAutoScroll();

    if (!draggingItem) return;

    const dropTarget = getDropTarget(y);

    if (dropTarget) {
      const { dayId: targetDay, insertIndex } = dropTarget;
      const { item, sourceDay, sourceIndex } = draggingItem;

      if (targetDay === sourceDay) {
        // 같은 Day 내에서 순서 변경
        if (insertIndex !== sourceIndex && insertIndex !== sourceIndex + 1) {
          setDayData((prevData: any) => {
            const newDayData = { ...prevData };
            const plans = [...newDayData[sourceDay].plans];

            const [movedItem] = plans.splice(sourceIndex, 1);
            const finalInsertIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;
            plans.splice(finalInsertIndex, 0, movedItem);

            newDayData[sourceDay].plans = plans;
            return newDayData;
          });
        }
      } else {
        // 다른 Day로 이동
        setDayData((prevData: any) => {
          const newDayData = { ...prevData };

          const [movedItem] = newDayData[sourceDay].plans.splice(sourceIndex, 1);
          const newItem = {
            ...movedItem,
            day: targetDay,
            key: `${targetDay}-${Date.now()}`
          };
          newDayData[targetDay].plans.splice(insertIndex, 0, newItem);

          return newDayData;
        });
      }
    }

    // Floating 카드 제거
    if (floatingPortal) {
      Animated.timing(floatingPortal.floatingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,  // ✅ Native 스레드에서 애니메이션 실행
      }).start(() => {
        floatingPortal.removeFloatingElement();
        floatingCardDataRef.current = null;
      });
      floatingPortal.floatingPan.setValue({ x: 0, y: 0 });
    }

    setDraggingItem(null);
  }, [draggingItem, getDropTarget, stopAutoScroll, floatingPortal]);

  return {
    draggingItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};