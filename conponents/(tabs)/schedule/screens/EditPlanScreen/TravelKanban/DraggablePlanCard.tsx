import { typeToLabel } from "@/constants/screens";
import { getSecureImageUrl } from "@/libs/getSecureUrl";
import { Plan } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { useMemo, useRef, useState } from "react";
import { Animated, Image, PanResponder, PanResponderGestureState, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 🔍 성능 측정용 - 개선 후 제거
const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`🔄 [${componentName}] 렌더링 횟수: ${renderCount.current}`);
};

const DraggablePlanCard = ({
  item,
  index,
  dayId,
  isLast,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDragging,
}: {
  item: Plan;
  index: number;
  dayId: string;
  isLast: boolean;
  onDragStart: (item: Plan, dayId: string, index: number, cardLayout: { x: number; y: number; width: number; height: number }, initialPosition: { x: number; y: number }) => void;
  onDragMove: (x: number, y: number, gestureState: PanResponderGestureState, evt: any, initialPosition: { x: number; y: number }) => void;
  onDragEnd: (y: number) => void;
  isDragging: boolean;
}) => {
  // 🔍 성능 측정용
  useRenderCount(`Card-${dayId}-${index}`);

  const cardOpacity = useRef(new Animated.Value(1)).current;
  const [componentHeight, setComponentHeight] = useState(0);
  const [isPanEnabled, setIsPanEnabled] = useState(false);
  const cardRef = useRef<View>(null);
  const isDraggingRef = useRef(false);
  const cardInitialPosition = useRef({ x: 0, y: 0 });
  const secureUrl = getSecureImageUrl(item?.image);

  // ✅ 콜백과 값들을 ref로 관리하여 PanResponder 재생성 방지
  const callbacksRef = useRef({ onDragStart, onDragMove, onDragEnd });
  const propsRef = useRef({ item, dayId, index });
  const isPanEnabledRef = useRef(isPanEnabled);

  // 최신 값으로 업데이트
  callbacksRef.current = { onDragStart, onDragMove, onDragEnd };
  propsRef.current = { item, dayId, index };
  isPanEnabledRef.current = isPanEnabled;

  // ✅ useMemo로 PanResponder 한 번만 생성
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => isPanEnabledRef.current,
    onMoveShouldSetPanResponder: () => isPanEnabledRef.current,

    onPanResponderGrant: (evt, gestureState) => {
      isDraggingRef.current = true;

      // 1. 터치 시작점 저장
      cardInitialPosition.current = {
        x: evt.nativeEvent.pageX,
        y: evt.nativeEvent.pageY
      };

      // 2. 즉시 시각 피드백 시작 (UX 개선)
      Animated.timing(cardOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }).start();

      // 3. 카드 측정 (비동기이지만 필수)
      if (cardRef.current) {
        cardRef.current.measureInWindow((x, y, width, height) => {
          // 빠르게 드래그하다가 이미 끝났으면 무시
          if (!isDraggingRef.current) return;

          const cardLayout = { x, y, width, height };
          const { item, dayId, index } = propsRef.current;
          callbacksRef.current.onDragStart(
            item,
            dayId,
            index,
            cardLayout,
            cardInitialPosition.current
          );
        });
      } else {
        // fallback: 측정 실패 시에도 드래그 시작
        const defaultLayout = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
          width: 200,
          height: 100
        };
        const { item, dayId, index } = propsRef.current;
        callbacksRef.current.onDragStart(item, dayId, index, defaultLayout, cardInitialPosition.current);
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      if (!isDraggingRef.current) return;

      callbacksRef.current.onDragMove(
        evt.nativeEvent.pageX,
        evt.nativeEvent.pageY,
        gestureState,
        evt,
        cardInitialPosition.current
      );
    },

    onPanResponderRelease: (evt) => {
      isDraggingRef.current = false;
      callbacksRef.current.onDragEnd(evt.nativeEvent.pageY);

      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      isDraggingRef.current = false;

      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
  }), [cardOpacity]);  // cardOpacity는 useRef.current이므로 변경되지 않음

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setComponentHeight(height);
  };

  return (
    <Animated.View
      ref={cardRef}
      style={[
        {
          opacity: cardOpacity, // 드래그 중에는 흐리게
          zIndex: isDragging ? 0 : 1,
          elevation: isDragging ? 0 : 2,
        }
      ]}
    >
      <View style={styles.rowContainer} {...panResponder.panHandlers}>
        <View style={styles.leftContainer}>
          <View style={styles.indexCircle}>
            <Text style={styles.index}>{index + 1}</Text>
          </View>
          {!isLast && (
            <View style={[styles.line, { height: 19 + componentHeight }]} />
          )}
        </View>
        <View style={styles.rightContainer} onLayout={handleLayout}>
          <Text style={styles.type}>{typeToLabel[item?.type]}</Text>
          <View style={styles.card}>
            {item?.image ? (
              <Image style={styles.imagePlaceholder} source={{ uri: secureUrl }} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>IMG</Text>
              </View>
            )}

            <View style={styles.cardTextContainer}>
              <Text style={styles.place} numberOfLines={1}>
                {item?.place}
              </Text>
              <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
                {item?.address}
              </Text>
            </View>
            <TouchableOpacity
              onLongPress={() => setIsPanEnabled(true)}
              onPressOut={() => setIsPanEnabled(false)}
              delayLongPress={100}>
              <Entypo style={styles.menu} name="menu" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default DraggablePlanCard;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  leftContainer: {
    alignItems: 'center',
  },
  line: {
    width: 1,
    backgroundColor: '#DDE1E6',
    paddingBottom: 19,
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderWidth: 0.8,
    borderColor: '#93BEF9',
    backgroundColor: '#ECF4FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  index: {
    color: '#3A88F4',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  rightContainer: {
    flex: 1,
    gap: 12.5,
  },
  type: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1A202C',
  },
  card: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Pretendard-Medium',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  place: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1A202C',
  },
  address: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#747474',
  },
});