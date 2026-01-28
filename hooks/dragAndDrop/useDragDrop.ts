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
    console.log('🟢 [handleDragStart] 시작 ========================');
    console.log('🟢 [handleDragStart] item:', item.key, item.place);
    console.log('🟢 [handleDragStart] dayId:', dayId);
    console.log('🟢 [handleDragStart] index:', index);
    console.log('🟢 [handleDragStart] cardLayout:', cardLayout);
    console.log('🟢 [handleDragStart] initialPosition:', initialPosition);

    setDraggingItem({ item, sourceDay: dayId, sourceIndex: index });
    console.log('🟢 [handleDragStart] setDraggingItem 호출됨');

    measureScrollViewPosition();
    console.log('🟢 [handleDragStart] measureScrollViewPosition 호출됨');

    await remeasureDayLayouts();
    console.log('🟢 [handleDragStart] remeasureDayLayouts 완료');

    const portal = floatingPortalRef.current;
    console.log('🟢 [handleDragStart] portal:', !!portal);

    if (!cardLayout.width || !cardLayout.height || !portal) {
      console.log('⚠️ [handleDragStart] 조기 종료 - cardLayout 또는 portal 없음');
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
    console.log('🟢 [handleDragStart] 종료 ========================');
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
    console.log('🔴 [handleDragEnd] 시작 ========================');
    console.log('🔴 [handleDragEnd] y (pageY):', y);
    console.log('🔴 [handleDragEnd] dayData keys:', Object.keys(dayData || {}));

    stopAutoScroll();

    // ✅ ref를 통해 최신 draggingItem 참조 (의존성 배열에서 제거)
    const currentDraggingItem = draggingItemRef.current;
    console.log('🔴 [handleDragEnd] currentDraggingItem:', currentDraggingItem);

    if (!currentDraggingItem) {
      console.log('❌ [handleDragEnd] draggingItem이 null - 조기 종료');
      return;
    }

    const dropTarget = getDropTarget(y);
    console.log('🔴 [handleDragEnd] dropTarget:', dropTarget);

    if (dropTarget) {
      const { dayId: targetDay, insertIndex } = dropTarget;
      const { item, sourceDay, sourceIndex } = currentDraggingItem;

      console.log('🔴 [handleDragEnd] 이동 정보:', {
        sourceDay,
        sourceIndex,
        targetDay,
        insertIndex,
        itemKey: item.key
      });

      if (targetDay === sourceDay) {
        // 같은 Day 내에서 순서 변경
        console.log('🔴 [handleDragEnd] 같은 Day 내 이동');
        console.log('🔴 [handleDragEnd] 조건 체크:', {
          'insertIndex !== sourceIndex': insertIndex !== sourceIndex,
          'insertIndex !== sourceIndex + 1': insertIndex !== sourceIndex + 1,
          '조건 통과': insertIndex !== sourceIndex && insertIndex !== sourceIndex + 1
        });

        if (insertIndex !== sourceIndex && insertIndex !== sourceIndex + 1) {
          console.log('✅ [handleDragEnd] 같은 Day - setDayData 호출');
          setDayData((prevData: any) => {
            console.log('✅ [handleDragEnd] setDayData 콜백 실행');
            const sourcePlans = prevData[sourceDay].plans;
            const movedItem = sourcePlans[sourceIndex];
            const finalInsertIndex = insertIndex > sourceIndex ? insertIndex - 1 : insertIndex;

            // ✅ 불변성 유지: filter와 slice로 새 배열 생성
            const newPlans = [
              ...sourcePlans.slice(0, sourceIndex),
              ...sourcePlans.slice(sourceIndex + 1)
            ];
            newPlans.splice(finalInsertIndex, 0, movedItem);

            console.log('✅ [handleDragEnd] 새 plans 순서:', newPlans.map((p: any) => p.key));
            return {
              ...prevData,
              [sourceDay]: {
                ...prevData[sourceDay],
                plans: newPlans
              }
            };
          });
        } else {
          console.log('⚠️ [handleDragEnd] 같은 위치로 드롭 - 스킵');
        }
      } else {
        // 다른 Day로 이동
        console.log('✅ [handleDragEnd] 다른 Day로 이동 - setDayData 호출');
        setDayData((prevData: any) => {
          console.log('✅ [handleDragEnd] setDayData 콜백 실행 (다른 Day)');
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

          console.log('✅ [handleDragEnd] sourceDay plans:', newSourcePlans.length);
          console.log('✅ [handleDragEnd] targetDay plans:', newTargetPlans.length);
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
    } else {
      console.log('❌ [handleDragEnd] dropTarget이 null - 드롭 실패');
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
    console.log('🔴 [handleDragEnd] 종료 ========================');
  }, [getDropTarget, stopAutoScroll, setDraggingItem]);

  return {
    // ✅ draggingItem은 이제 각 컴포넌트에서 직접 store 구독
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};