import { useDragStore } from '@/store/useDragStore';
import { Plan } from '@/types';
import { useCallback, useContext, useRef } from 'react';
import { Animated } from 'react-native';

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
  // ✅ Zustand store에서 드래그 상태 관리
  const draggingItem = useDragStore(state => state.draggingItem);
  const setDraggingItem = useDragStore(state => state.setDraggingItem);

  // ✅ draggingItem을 ref로 관리하여 handleDragEnd 콜백 안정화
  const draggingItemRef = useRef(draggingItem);
  draggingItemRef.current = draggingItem;

  const floatingCardDataRef = useRef<FloatingCardData | null>(null);
  const floatingPortal = useContext(FloatingPortalContext);

  // ✅ floatingPortal을 ref로 관리하여 콜백 안정화
  const floatingPortalRef = useRef(floatingPortal);
  floatingPortalRef.current = floatingPortal;

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

    const portal = floatingPortalRef.current;

    if (!cardLayout.width || !cardLayout.height || !portal) {
      return;
    }

    floatingCardDataRef.current = {
      item,
      dayId,
      index,
      layout: cardLayout,
      initialPosition,
      gestureState: { dx: 0, dy: 0 }
    };

    portal.createFloatingCard(item, dayId, index, cardLayout, initialPosition, { dx: 0, dy: 0 });
    Animated.timing(portal.floatingOpacity, {
      toValue: 0.9,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [setDraggingItem, measureScrollViewPosition, remeasureDayLayouts]);
  // 드래그 이동
  const handleDragMove = useCallback((
    _x: number,
    _y: number,
    gestureState: any,
    _evt: any,
    _initialPosition: { x: number; y: number }
  ) => {
    const portal = floatingPortalRef.current;
    if (!gestureState || !floatingCardDataRef.current || !portal) return;

    if (gestureState.dx !== undefined && gestureState.dy !== undefined) {
      portal.floatingPan.setValue({ x: gestureState.dx, y: gestureState.dy });
    }
  }, []);

  // 드래그 종료
  const handleDragEnd = useCallback((
    y: number,
    dayData: any,
    setDayData: (updater: (prev: any) => any) => void
  ) => {
    stopAutoScroll();

    // ✅ ref를 통해 최신 draggingItem 참조 (의존성 배열에서 제거)
    const currentDraggingItem = draggingItemRef.current;

    if (!currentDraggingItem) {
      return;
    }

    const dropTarget = getDropTarget(y);

    if (dropTarget) {
      const { dayId: targetDay, insertIndex } = dropTarget;
      const { item, sourceDay, sourceIndex } = currentDraggingItem;

      if (targetDay === sourceDay) {
        // 같은 Day 내에서 순서 변경
        if (insertIndex !== sourceIndex && insertIndex !== sourceIndex + 1) {
          setDayData((prevData: any) => {
            const sourcePlans = prevData[sourceDay].plans;
            const movedItem = sourcePlans[sourceIndex];
            const finalInsertIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;

            // ✅ 불변성 유지: filter와 slice로 새 배열 생성
            const newPlans = [
              ...sourcePlans.slice(0, sourceIndex),
              ...sourcePlans.slice(sourceIndex + 1)
            ];
            newPlans.splice(finalInsertIndex, 0, movedItem);

            return {
              ...prevData,
              [sourceDay]: {
                ...prevData[sourceDay],
                plans: newPlans
              }
            };
          });
        }
      } else {
        // 다른 Day로 이동
        setDayData((prevData: any) => {
          const sourcePlans = prevData[sourceDay].plans;
          const targetPlans = prevData[targetDay].plans;
          const movedItem = sourcePlans[sourceIndex];

          const newItem = {
            ...movedItem,
            day: targetDay,
            key: `${targetDay}-${Date.now()}`
          };

          // ✅ 불변성 유지: 새 배열 생성
          const newSourcePlans = [
            ...sourcePlans.slice(0, sourceIndex),
            ...sourcePlans.slice(sourceIndex + 1)
          ];
          const newTargetPlans = [
            ...targetPlans.slice(0, insertIndex),
            newItem,
            ...targetPlans.slice(insertIndex)
          ];

          return {
            ...prevData,
            [sourceDay]: {
              ...prevData[sourceDay],
              plans: newSourcePlans
            },
            [targetDay]: {
              ...prevData[targetDay],
              plans: newTargetPlans
            }
          };
        });
      }
    }

    // Floating 카드 제거
    const portal = floatingPortalRef.current;
    if (portal) {
      Animated.timing(portal.floatingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        portal.removeFloatingElement();
        floatingCardDataRef.current = null;
      });
      portal.floatingPan.setValue({ x: 0, y: 0 });
    }

    setDraggingItem(null);
  }, [getDropTarget, stopAutoScroll, setDraggingItem]);

  return {
    // ✅ draggingItem은 이제 각 컴포넌트에서 직접 store 구독
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};