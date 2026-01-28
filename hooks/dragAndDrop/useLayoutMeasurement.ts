import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { View } from 'react-native';

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DayLayout extends Layout {
  originalY?: number;
}

interface CardLayout extends Layout {
  index: number;
}

interface DayLayouts {
  [dayId: string]: DayLayout;
}

interface CardLayouts {
  [dayId: string]: CardLayout[];
}

interface ScrollViewLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useLayoutMeasurement = (
  scrollOffsetRef: MutableRefObject<number>
) => {
  const [scrollViewLayout, setScrollViewLayout] = useState<ScrollViewLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [dayLayouts, setDayLayouts] = useState<DayLayouts>({});
  const [cardLayouts, setCardLayouts] = useState<CardLayouts>({});

  const containerRef = useRef<View>(null);
  const scrollViewLayoutRef = useRef<ScrollViewLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const dayRefs = useRef<{ [key: string]: View }>({});

  // ✅ layouts를 ref로 관리하여 getDropTarget 콜백 안정화
  const dayLayoutsRef = useRef<DayLayouts>({});
  const cardLayoutsRef = useRef<CardLayouts>({});
  dayLayoutsRef.current = dayLayouts;
  cardLayoutsRef.current = cardLayouts;

  // ScrollView 레이아웃 측정
  const measureScrollViewPosition = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        const layout = { y, height, x, width };
        setScrollViewLayout(layout);
        scrollViewLayoutRef.current = layout;
      });
    }
  }, []);

  // Day 컬럼 레이아웃 측정
  const measureDay = useCallback((dayId: string, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log(`🟣 [measureDay] ${dayId}: x=${x}, y=${y}, width=${width}, height=${height}`);
    setDayLayouts(prev => ({
      ...prev,
      [dayId]: { x, y, width, height, originalY: y }
    }));
  }, []);

  // 카드 레이아웃 측정
  const measureCard = useCallback((dayId: string, index: number, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log(`🟤 [measureCard] ${dayId}[${index}]: x=${x}, y=${y}, width=${width}, height=${height}`);
    setCardLayouts(prev => {
      const dayCards = [...(prev[dayId] || [])];
      dayCards[index] = { x, y, width, height, index };
      return { ...prev, [dayId]: dayCards };
    });
  }, []);

  // Day 레이아웃 재측정 (드래그 중 스크롤 시)
  const remeasureDayLayouts = useCallback(() => {
    console.log('🟠 [remeasureDayLayouts] 시작 ========================');
    return new Promise<void>((resolve) => {
      const dayIds = Object.keys(dayRefs.current);
      console.log('🟠 [remeasureDayLayouts] dayRefs keys:', dayIds);

      if (dayIds.length === 0) {
        console.log('⚠️ [remeasureDayLayouts] dayRefs 비어있음 - 즉시 resolve');
        resolve();
        return;
      }

      const currentScrollOffset = scrollOffsetRef.current;
      console.log('🟠 [remeasureDayLayouts] scrollOffset:', currentScrollOffset);
      let measured = 0;
      let resolved = false;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          console.log('⚠️ [remeasureDayLayouts] 타임아웃으로 종료');
          resolved = true;
          resolve();
        }
      }, 3000);

      const checkComplete = () => {
        if (measured >= dayIds.length && !resolved) {
          console.log('✅ [remeasureDayLayouts] 모든 Day 측정 완료');
          resolved = true;
          clearTimeout(timeoutId);
          resolve();
        }
      };

      dayIds.forEach((dayId) => {
        const dayRef = dayRefs.current[dayId];
        if (dayRef && dayRef.measureInWindow) {
          try {
            dayRef.measureInWindow((x, y, width, height) => {
              if (!resolved) {
                const contentY = y + currentScrollOffset;
                console.log(`🟠 [remeasureDayLayouts] ${dayId}: windowY=${y}, contentY=${contentY}, height=${height}`);
                setDayLayouts(prev => ({
                  ...prev,
                  [dayId]: { x, y: contentY, width, height }
                }));
              }
              measured++;
              checkComplete();
            });
          } catch (error) {
            console.log(`❌ [remeasureDayLayouts] ${dayId}: 측정 에러`, error);
            measured++;
            checkComplete();
          }
        } else {
          console.log(`⚠️ [remeasureDayLayouts] ${dayId}: ref 없음 또는 measureInWindow 없음`);
          measured++;
          setTimeout(checkComplete, 0);
        }
      });
    });
  }, [scrollOffsetRef]);

  // 드롭 타겟 찾기
  // ✅ ref를 통해 최신 layouts 참조 - 의존성 배열에서 제거하여 콜백 안정화
  const getDropTarget = useCallback((pageY: number): { dayId: string; insertIndex: number } | null => {
    console.log('🟡 [getDropTarget] 시작 ========================');
    const currentDayLayouts = dayLayoutsRef.current;
    const currentCardLayouts = cardLayoutsRef.current;
    const dayIds = Object.keys(currentDayLayouts);
    const currentScrollOffset = scrollOffsetRef.current;
    const contentY = pageY + currentScrollOffset;

    console.log('🟡 [getDropTarget] pageY:', pageY);
    console.log('🟡 [getDropTarget] scrollOffset:', currentScrollOffset);
    console.log('🟡 [getDropTarget] contentY (pageY + scroll):', contentY);
    console.log('🟡 [getDropTarget] dayIds:', dayIds);
    console.log('🟡 [getDropTarget] dayLayouts:', JSON.stringify(currentDayLayouts, null, 2));
    console.log('🟡 [getDropTarget] cardLayouts:', JSON.stringify(currentCardLayouts, null, 2));

    for (const dayId of dayIds) {
      const dayLayout = currentDayLayouts[dayId];
      if (!dayLayout) {
        console.log(`🟡 [getDropTarget] ${dayId}: dayLayout 없음 - 스킵`);
        continue;
      }

      const dayContentTop = dayLayout.y;
      const dayContentBottom = dayLayout.y + dayLayout.height;

      console.log(`🟡 [getDropTarget] ${dayId}: top=${dayContentTop}, bottom=${dayContentBottom}`);
      console.log(`🟡 [getDropTarget] ${dayId}: 범위 체크 - contentY(${contentY}) in [${dayContentTop - 50}, ${dayContentBottom + 50}]`);

      if (contentY >= dayContentTop - 50 && contentY <= dayContentBottom + 50) {
        console.log(`✅ [getDropTarget] ${dayId}: 범위 내 매칭!`);
        const cards = currentCardLayouts[dayId] || [];

        if (cards.length === 0) {
          console.log(`✅ [getDropTarget] ${dayId}: 카드 없음 - insertIndex: 0`);
          return { dayId, insertIndex: 0 };
        }

        console.log(`🟡 [getDropTarget] ${dayId}: ${cards.length}개 카드 확인`);
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (!card) {
            console.log(`🟡 [getDropTarget] ${dayId}: 카드[${i}] 없음 - 스킵`);
            continue;
          }

          const cardCenterContentY = dayLayout.y + card.y + card.height / 2;
          console.log(`🟡 [getDropTarget] ${dayId}: 카드[${i}] center=${cardCenterContentY}, contentY=${contentY}`);

          if (contentY < cardCenterContentY) {
            console.log(`✅ [getDropTarget] 결과: dayId=${dayId}, insertIndex=${i}`);
            return { dayId, insertIndex: i };
          }
        }

        console.log(`✅ [getDropTarget] 결과: dayId=${dayId}, insertIndex=${cards.length} (마지막)`);
        return { dayId, insertIndex: cards.length };
      }
    }

    console.log('❌ [getDropTarget] 매칭되는 Day 없음 - null 반환');
    console.log('🟡 [getDropTarget] 종료 ========================');
    return null;
  }, [scrollOffsetRef]);

  return {
    // State
    scrollViewLayout,
    dayLayouts,
    cardLayouts,
    
    // Refs
    containerRef,
    scrollViewLayoutRef,
    dayRefs,
    
    // Methods
    measureScrollViewPosition,
    measureDay,
    measureCard,
    remeasureDayLayouts,
    getDropTarget,
  };
};