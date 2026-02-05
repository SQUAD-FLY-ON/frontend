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
    setDayLayouts(prev => ({
      ...prev,
      [dayId]: { x, y, width, height, originalY: y }
    }));
  }, []);

  // 카드 레이아웃 측정
  const measureCard = useCallback((dayId: string, index: number, event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setCardLayouts(prev => {
      const dayCards = [...(prev[dayId] || [])];
      dayCards[index] = { x, y, width, height, index };
      return { ...prev, [dayId]: dayCards };
    });
  }, []);

  // Day 레이아웃 재측정 (드래그 중 스크롤 시)
  const remeasureDayLayouts = useCallback(() => {
    return new Promise<void>((resolve) => {
      const dayIds = Object.keys(dayRefs.current);

      if (dayIds.length === 0) {
        resolve();
        return;
      }

      const currentScrollOffset = scrollOffsetRef.current;
      let measured = 0;
      let resolved = false;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      }, 3000);

      const checkComplete = () => {
        if (measured >= dayIds.length && !resolved) {
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
                setDayLayouts(prev => ({
                  ...prev,
                  [dayId]: { x, y: contentY, width, height }
                }));
              }
              measured++;
              checkComplete();
            });
          } catch (error) {
            measured++;
            checkComplete();
          }
        } else {
          measured++;
          setTimeout(checkComplete, 0);
        }
      });
    });
  }, [scrollOffsetRef]);

  // 드롭 타겟 찾기
  // ✅ ref를 통해 최신 layouts 참조 - 의존성 배열에서 제거하여 콜백 안정화
  const getDropTarget = useCallback((pageY: number): { dayId: string; insertIndex: number } | null => {
    const currentDayLayouts = dayLayoutsRef.current;
    const currentCardLayouts = cardLayoutsRef.current;
    const dayIds = Object.keys(currentDayLayouts);
    const currentScrollOffset = scrollOffsetRef.current;
    const contentY = pageY + currentScrollOffset;

    for (const dayId of dayIds) {
      const dayLayout = currentDayLayouts[dayId];
      if (!dayLayout) {
        continue;
      }

      const dayContentTop = dayLayout.y;
      const dayContentBottom = dayLayout.y + dayLayout.height;

      if (contentY >= dayContentTop - 50 && contentY <= dayContentBottom + 50) {
        const cards = currentCardLayouts[dayId] || [];

        if (cards.length === 0) {
          return { dayId, insertIndex: 0 };
        }

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (!card) {
            continue;
          }

          const cardCenterContentY = dayLayout.y + card.y + card.height / 2;

          if (contentY < cardCenterContentY) {
            return { dayId, insertIndex: i };
          }
        }

        return { dayId, insertIndex: cards.length };
      }
    }

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