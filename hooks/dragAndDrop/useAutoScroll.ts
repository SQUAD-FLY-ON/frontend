import { ScrollEvent } from '@/types';
import { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';

interface UseAutoScrollOptions {
  scrollSpeed?: number;
  threshold?: number;
}

interface ScrollViewLayout {
  y: number;
  height: number;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
  const { scrollSpeed = 15, threshold = 40 } = options;

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const isAutoScrollingRef = useRef(false);
  const autoScrollDirectionRef = useRef<'up' | 'down' | null>(null);
  const autoScrollFrameId = useRef<number | null>(null);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollFrameId.current) {
      cancelAnimationFrame(autoScrollFrameId.current);
      autoScrollFrameId.current = null;
    }
    isAutoScrollingRef.current = false;
    autoScrollDirectionRef.current = null;
  }, []);

  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (isAutoScrollingRef.current && autoScrollDirectionRef.current === direction) {
      return;
    }

    stopAutoScroll();
    isAutoScrollingRef.current = true;
    autoScrollDirectionRef.current = direction;

    const scroll = () => {
      if (!isAutoScrollingRef.current) return;

      const currentOffset = scrollOffsetRef.current;
      const newOffset = direction === 'up'
        ? Math.max(0, currentOffset - scrollSpeed)
        : currentOffset + scrollSpeed;

      if (direction === 'up' && newOffset <= 0) {
        stopAutoScroll();
        return;
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: newOffset,
          animated: false
        });
      }

      autoScrollFrameId.current = requestAnimationFrame(scroll);
    };

    autoScrollFrameId.current = requestAnimationFrame(scroll);
  }, [scrollSpeed, stopAutoScroll]);

  const handleAutoScrollForDrag = useCallback((
    cursorY: number,
    scrollViewLayout: ScrollViewLayout
  ) => {
    const scrollViewTop = scrollViewLayout.y;
    const scrollViewBottom = scrollViewLayout.y + scrollViewLayout.height;

    const isInTopScrollZone = cursorY <= scrollViewTop + threshold;
    const isInBottomScrollZone = cursorY >= scrollViewBottom - threshold;

    if (isInTopScrollZone && scrollOffsetRef.current > 0) {
      if (!isAutoScrollingRef.current || autoScrollDirectionRef.current !== 'up') {
        startAutoScroll('up');
      }
    } else if (isInBottomScrollZone) {
      if (!isAutoScrollingRef.current || autoScrollDirectionRef.current !== 'down') {
        startAutoScroll('down');
      }
    } else {
      if (isAutoScrollingRef.current) {
        stopAutoScroll();
      }
    }
  }, [threshold, startAutoScroll, stopAutoScroll]);

  const handleScroll = useCallback((event: ScrollEvent) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  return {
    scrollViewRef,
    scrollOffsetRef,
    isAutoScrollingRef,
    handleScroll,
    handleAutoScrollForDrag,
    stopAutoScroll,
  };
};