import { typeToLabel } from '@/constants/screens';
import { Entypo } from '@expo/vector-icons';
import { default as React, useCallback, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

type Plan = {
  type: string;
  image?: string;
  place?: string;
  address?: string;
};

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

type SimpleGestureState = {
  dx: number;
  dy: number;
};

type CreateFloatingCard = (
  item: Plan,
  dayId: string,
  index: number,
  layout: Layout,
  initialPosition: Position,
  gestureState: SimpleGestureState
) => void;


// 전역 floating layer를 위한 portal 컨텍스트
export const FloatingPortalContext = React.createContext<{
  createFloatingCard: CreateFloatingCard;
  removeFloatingElement: () => void;
  floatingPan: Animated.ValueXY;
  floatingOpacity: Animated.Value;
} | null>(null);

// 메인 앱에서 사용할 FloatingPortal Provider
export const FloatingPortalProvider = ({ children }: { children: React.ReactNode }) => {
  const [floatingElement, setFloatingElement] = useState<React.ReactElement | null>(null);
  const floatingPan = useRef(new Animated.ValueXY()).current;
  const floatingOpacity = useRef(new Animated.Value(0)).current;

  const createFloatingCard = useCallback<CreateFloatingCard>((item, dayId, index, layout, initialPosition, gestureState) => {
    const floatingCard = (
      <Animated.View
        style={[
          {
            position: "absolute",
            left: initialPosition.x - layout.width / 2,
            top: initialPosition.y - layout.height / 2,
            width: layout.width,
            height: layout.height,
            zIndex: 9999,
          },
          {
            opacity: floatingOpacity,
            transform: [
              { translateX: floatingPan.x },
              { translateY: floatingPan.y },
            ],
          },
        ]}
      >
        <View style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.indexCircle}>
              <Text style={styles.index}>{index + 1}</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.type}>{typeToLabel[item?.type]}</Text>
            <View style={styles.card}>
              {item?.image ?
                (<Image style={styles.imagePlaceholder} source={{ uri: item?.image }} />) :
                (<View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>IMG</Text>
                </View>)}
              <View style={styles.cardTextContainer}>
                <Text style={styles.place} numberOfLines={1}>
                  {item?.place}
                </Text>
                <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
                  {item?.address}
                </Text>
              </View>
              <View>
                <Entypo name="menu" size={24} color="black" />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
    setFloatingElement(floatingCard);
  }, [floatingOpacity, floatingPan]);

  const removeFloatingElement = useCallback(() => {
    setFloatingElement(null);
  }, []);

  return (
    <FloatingPortalContext.Provider value={{ createFloatingCard, removeFloatingElement, floatingPan, floatingOpacity }}>
      <View style={{ flex: 1 }}>
        {children}
        {floatingElement && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              elevation: 9999,
            }}
          >
            {floatingElement}
          </View>
        )}
      </View>
    </FloatingPortalContext.Provider>
  );
};


const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  leftContainer: {
    alignItems: 'center',
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
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  imageText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Pretendard-Medium',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
    maxWidth: '60%',
  },
  place: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1A202C',
    flexShrink: 1,
  },
  address: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#747474',
    flexShrink: 1,
  },
});